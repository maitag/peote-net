package peote.net;

import haxe.ds.Vector;
import haxe.io.Bytes;
import haxe.Timer;

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

	public var offline(default, null):Bool=false;

	public var localPeoteClient:Array<PeoteClient> = [];
	public var netLag:Int = 400; // simmulates net-behavior
	public var netSpeed:Int = 1024; // simmulates net-behavior (1024 bytes per second)
	
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
		if (events.offline != null) offline = events.offline;
		if (events.netLag != null) netLag = events.netLag;
		if (events.netSpeed != null) netSpeed = events.netSpeed;
		if (events.onDataChunk != null) {
			//input = Bytes.alloc(32767*2); // TODO
			inputBuffers = new Vector<InputBuffer>(PeoteNet.MAX_USER*2);
		}
	}
	
	// -----------------------------------------------------------------------------------
	// CREATE NEW JOINT ------------------------------------------------------------------
	
	public function create(server:String, port:Int, jointId:String):Void
	{
		
		if (this.server == "")
		{
			this.server = server;
			this.port = port;
			this.jointId = jointId;
			if (offline) PeoteNet.createOfflineJoint(this, server, port, jointId);
			else PeoteNet.createJoint(this, server, port, jointId);
		}
		else
		{
			throw("Error: PeoteServer already connected");
			events.onError(this, 255); // TODO
		}	
	}

	// -----------------------------------------------------------------------------------
	// DELETE JOINT -----------------------------------------------------------------------
	
	public function delete():Void 
	{
		if (offline) PeoteNet.deleteOfflineJoint(this, this.server, this.port, this.jointId);
		else PeoteNet.deleteJoint(this, this.server, this.port, this.jointNr);
		this.server = "";
	}
	
	// -----------------------------------------------------------------------------------
	// SEND DATA TO USER -----------------------------------------------------------------

	public inline function send(userNr:Int, bytes:Bytes):Void
	{
		if (userNr < PeoteNet.MAX_USER)
			this.peoteJointSocket.sendDataToJointOwn(this.jointNr, userNr, bytes);
		else Timer.delay(function() {
				localPeoteClient[PeoteNet.MAX_USER-userNr]._onData(localPeoteClient[PeoteNet.MAX_USER-userNr].jointNr, bytes); // TODO _onLocalData optimizing
			}, Std.int(netLag + 1000 * bytes.length/netSpeed));
	}

	public function sendChunk(userNr:Int, bytes:Bytes):Void
	{
		if (bytes.length <= 0) throw("Error(sendChunk): can't send zero length chunk");
		else if (bytes.length > 65536)  throw("Error(sendChunk): max chunksize is 65536 Bytes");
		else {
			var chunksize:Bytes = Bytes.alloc(2);
			chunksize.setUInt16(0, bytes.length-1);
			send( userNr, chunksize );
			send( userNr, bytes );
		}
	}
	
	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------

	public inline function _onCreateJoint(peoteJointSocket:PeoteJointSocket, jointNr:Int):Void
	{
		this.peoteJointSocket = peoteJointSocket;
		this.jointNr = jointNr;
		events.onCreate(this);
	}
	
	public inline function _onCreateJointError(errorNr:Int):Void
	{
		this.server = "";
		events.onError(this, errorNr );
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
			chunk_size = input.getUInt16(input_pos) + 1; // read chunk size
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
