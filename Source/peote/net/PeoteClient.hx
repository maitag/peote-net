package peote.net;

import haxe.io.Bytes;

/**
 * by Sylvio Sell - rostock 2015
 */

class PeoteClient
{
	public var events:PeoteClientEvents;
	
	public var jointNr(default, null):Int;
	public var jointId(default, null):String;
	public var server(default, null):String = "";
	public var port(default, null):Int;

	var peoteJointSocket:PeoteJointSocket;
	
	var input:Bytes;
	var input_pos:Int = 0;
	var input_end:Int = 0;
	var chunk_size:Int = 0;
	
	public function new(events:PeoteClientEvents) 
	{
		this.events = events;
		if (events.onDataChunk != null) input = Bytes.alloc(32767*2); // TODO
	}

	// -----------------------------------------------------------------------------------
	// ENTER JOINT -----------------------------------------------------------------------
	
	public function enterJoint(server:String, port:Int, jointId:String):Void 
	{
		if (this.server == "")
		{
			this.server = server;
			this.port = port;
			this.jointId = jointId;
			PeoteNet.enterJoint(this, server, port, jointId);
		}
		else
		{
			throw("Error: PeoteClient already connected");
			events.onEnterJointError(this, 255); // TODO
		}
	}

	// -----------------------------------------------------------------------------------
	// LEAVE JOINT -----------------------------------------------------------------------
	
	public function leaveJoint():Void 
	{
		PeoteNet.leaveJoint(this, this.server, this.port, this.jointNr);
		this.server = "";
	}

	// -----------------------------------------------------------------------------------
	// SEND DATA -------------------------------------------------------------------------

	public function send(bytes:Bytes):Void
	{	
		this.peoteJointSocket.sendDataToJointIn(this.jointNr, bytes );
	}

	public function sendChunk(bytes:Bytes):Void
	{
		// TODO: greater chunks ?
		var chunksize:Bytes = Bytes.alloc(2);
		chunksize.setUInt16(0, bytes.length);
		send( chunksize );
		send( bytes );
	}
	
	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------
	
	public function _onEnterJoint(peoteJointSocket:PeoteJointSocket, jointNr:Int):Void
	{
		this.peoteJointSocket = peoteJointSocket;
		this.jointNr = jointNr;
		events.onEnterJoint(this);
 	}
	
	public function _onEnterJointError(errorNr:Int):Void // bei FEHLER
	{
		this.server = "";
		events.onEnterJointError(this, errorNr );
 	}
	
	public function _onDisconnect(jointNr:Int, reason:Int):Void 
	{
		events.onDisconnect(this, reason);	
 	}
	
	
	public function _onData(jointNr:Int, bytes:Bytes):Void
	{
		//trace("onData: " + bytes.length);
		if (events.onDataChunk != null) {
			if (input_pos == input_end) { input_pos = input_end = 0; }

			//var debugOut = "";for (i in 0...bytes.length) debugOut += bytes.get(i) + " ";trace("data:" + debugOut);
			if (input_end + bytes.length > input.length) trace("ERROR Client: out of BOUNDS");
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
				events.onDataChunk(this, b );
			}
		}
		else events.onData(this, bytes);
	
	}


}