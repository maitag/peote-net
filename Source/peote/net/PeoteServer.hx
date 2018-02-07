package peote.net;

import haxe.ds.Vector;
import haxe.io.Bytes;

/**
 * by Sylvio Sell - rostock 2015
 */

class PeoteServer
{
	public var events:PeoteServerEvents;
	
	public var jointNr(default, null):Int;
	public var jointId(default, null):String;
	public var server(default, null):String = "";
	public var port(default, null):Int;

	var peoteJointSocket:PeoteJointSocket;
	/*
	var input:Bytes;
	var input_pos:Int = 0;
	var input_end:Int = 0;
	var chunk_size:Int = 0;
	*/
	var inputBuffers:Vector<InputBuffer>;
	
	public function new(events:PeoteServerEvents) 
	{
		this.events = events;
		if (events.onDataChunk != null) {
			//input = Bytes.alloc(32767*2); // TODO
			inputBuffers = new Vector<InputBuffer>(256);
		}
	}
	
	// -----------------------------------------------------------------------------------
	// CREATE NEW JOINT ------------------------------------------------------------------
	
	public function createJoint(server:String, port:Int, jointId:String):Void
	{
		if (this.server == "")
		{
			this.server = server;
			this.port = port;
			this.jointId = jointId;
			PeoteNet.createJoint(this, server, port, jointId);
		}
		else
		{
			throw("Error: PeoteServer already connected");
			events.onCreateJointError(this, 255); // TODO
		}	
	}

	// -----------------------------------------------------------------------------------
	// DELETE JOINT -----------------------------------------------------------------------
	
	public function deleteJoint():Void 
	{
		PeoteNet.deleteJoint(this, this.server, this.port, this.jointNr);
		this.server = "";
	}
	
	// -----------------------------------------------------------------------------------
	// SEND DATA TO USER -----------------------------------------------------------------

	public inline function send(userNr:Int, bytes:Bytes):Void
	{
		this.peoteJointSocket.sendDataToJointOwn(this.jointNr, userNr, bytes);
	}

	public function sendChunk(userNr:Int, bytes:Bytes):Void
	{
		// TODO: greater chunks ?
		var chunksize:Bytes = Bytes.alloc(2);
		chunksize.setUInt16(0, bytes.length);
		send( userNr, chunksize );
		send( userNr, bytes );
	}
	
	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------

	public inline function _onCreateJoint(peoteJointSocket:PeoteJointSocket, jointNr:Int):Void
	{
		this.peoteJointSocket = peoteJointSocket;
		this.jointNr = jointNr;
		events.onCreateJoint(this);
	}
	
	public inline function _onCreateJointError(errorNr:Int):Void
	{
		this.server = "";
		events.onCreateJointError(this, errorNr );
	}
	
	public inline function _onUserConnect(jointNr:Int, userNr:Int):Void 
	{
		inputBuffers.set(userNr, new InputBuffer(this, userNr, events.onDataChunk));
		events.onUserConnect(this, userNr);
	}
	
	public inline function _onUserDisconnect(jointNr:Int, userNr:Int, reason:Int):Void 
	{
		inputBuffers.set(userNr, null);
		events.onUserDisconnect(this, userNr, reason);
	}
	
	public function _onData(jointNr:Int, userNr:Int, bytes:Bytes):Void
	{
		//trace("onData: " + bytes.length);
		if (events.onDataChunk != null) {
			inputBuffers.get(userNr).onData(bytes);
			/*			
			if (input_pos == input_end) { input_pos = input_end = 0; }
			
			//var debugOut = "";for (i in 0...bytes.length) debugOut += bytes.get(i) + " ";trace("data:" + debugOut);		
			if (input_end + bytes.length > input.length) trace("ERROR Server: out of BOUNDS");
			input.blit(input_end, bytes, 0, bytes.length );
			
			input_end += bytes.length;
			
			if (chunk_size == 0 && input_end-input_pos >=2 ) {
				chunk_size = input.getUInt16(input_pos); // read chunk size
				//trace("chunksize readed:" + chunk_size, input.get(input_pos),input.get(input_pos+1));
				input_pos += 2;
			}
			
			if ( chunk_size != 0 && input_end-input_pos >= chunk_size )
			{
				var b:Bytes = Bytes.alloc(chunk_size);
				//trace(" ---> onDataChunk: " + b.length + "Bytes ( start:"+input_pos+" end:"+input_end+ ")",b.get(0), b.get(1), b.get(2));
				b.blit(0, input, input_pos, chunk_size);
				input_pos += chunk_size;
				chunk_size = 0;
				events.onDataChunk(this, userNr, b );
			}
			*/
		}
		else events.onData(this, userNr, bytes);
	}


}

class InputBuffer {
	var input_pos:Int = 0;
	var input_end:Int = 0;
	var chunk_size:Int= 0;
	var input:Bytes;
	
	var onDataChunk:PeoteServer -> Int -> Bytes -> Void;
	var peoteServer:PeoteServer;
	var userNr:Int;
	
	public function new(peoteServer:PeoteServer, userNr:Int, onDataChunk:PeoteServer -> Int -> Bytes -> Void) {
		this.peoteServer = peoteServer;
		this.userNr = userNr;
		this.onDataChunk = onDataChunk;
		input = Bytes.alloc((65536+2)*2);
	}
	
	public function onData(bytes:Bytes):Void // TODO: split into great and small chunks like with peoteJoint-protocol
	{
		//trace("onData: " + bytes.length);
			
		if (input_pos == input_end) { input_pos = input_end = 0; }
		
		//var debugOut = "";for (i in 0...bytes.length) debugOut += bytes.get(i) + " ";trace("data:" + debugOut);		
		if (input_end + bytes.length > input.length) trace("ERROR Server: out of BOUNDS");
		input.blit(input_end, bytes, 0, bytes.length );
		
		input_end += bytes.length;
		
		if (chunk_size == 0 && input_end-input_pos >=2 ) {
			chunk_size = input.getUInt16(input_pos); // read chunk size
			//trace("chunksize readed:" + chunk_size, input.get(input_pos),input.get(input_pos+1));
			input_pos += 2;
		}
		
		if ( chunk_size != 0 && input_end-input_pos >= chunk_size )
		{
			var b:Bytes = Bytes.alloc(chunk_size);
			//trace(" ---> onDataChunk: " + b.length + "Bytes ( start:"+input_pos+" end:"+input_end+ ")",b.get(0), b.get(1), b.get(2));
			b.blit(0, input, input_pos, chunk_size);
			input_pos += chunk_size;
			chunk_size = 0;
			onDataChunk(peoteServer, userNr, b );
		}
	}

}
