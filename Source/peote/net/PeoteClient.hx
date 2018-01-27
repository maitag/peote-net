package peote.net;

import haxe.io.Bytes;
import peote.io.PeoteBytesInput;
import peote.io.PeoteBytesOutput;

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
	
	var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	var chunk_size:Int = 0;

	public function new(events:PeoteClientEvents) 
	{
		this.events = events;
		if (events.onDataChunk != null) inputBuffer = new PeoteBytesInput();
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

	public function sendChunk(output:PeoteBytesOutput):Void
	{	
		var chunksize:PeoteBytesOutput = new PeoteBytesOutput(); // TODO: optimize
		chunksize.writeUInt16(output.length);
		send( chunksize.getBytes() );
		send( output.getBytes() );
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
		if (events.onDataChunk != null) {
			inputBuffer.append( bytes );
			
			if (chunk_size == 0 && inputBuffer.bytesLeft() >=2 ) {
				chunk_size = inputBuffer.readUInt16(); // read chunk size
			}
			
			if ( chunk_size != 0 && inputBuffer.bytesLeft() >= chunk_size )
			{
				events.onDataChunk(this, inputBuffer, chunk_size );
				chunk_size = 0;
			}
		}
		else events.onData(this, bytes);
	}



}