package peote.net;

import haxe.io.Bytes;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;

/**
 * by Sylvio Sell - rostock 2015
 */


class PeoteServer
{
	public var events:PeoteServerEvents;
	
	public var jointNr(default, null):Int;
	public var server(default, null):String = "";
	public var port(default, null):Int;

	var peoteJointSocket:PeoteJointSocket;
	
	var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	var chunk_size:Int = 0;

	public function new(events:PeoteServerEvents) 
	{
		this.events = events;
		if (events.onDataChunk != null) inputBuffer = new PeoteBytesInput();
	}
	
	// -----------------------------------------------------------------------------------
	// CREATE NEW JOINT ------------------------------------------------------------------
	
	public function createJoint(server:String, port:Int, jointId:String):Void
	{
		if (this.server == "")
		{
			this.server = server;
			this.port = port;
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

	public function sendChunk(userNr:Int, output:PeoteBytesOutput):Void
	{	
		var chunksize:PeoteBytesOutput = new PeoteBytesOutput(); // TODO: optimize
		chunksize.writeUInt16(output.length);
		send( userNr, chunksize.getBytes() );
		send( userNr, output.getBytes() );
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
		events.onUserConnect(this, userNr);
	}
	
	public inline function _onUserDisconnect(jointNr:Int, userNr:Int, reason:Int):Void 
	{
		events.onUserDisconnect(this, userNr, reason);
	}
	
	public inline function _onData(jointNr:Int, userNr:Int, bytes:Bytes):Void
	{
		if (events.onDataChunk != null) {
			inputBuffer.append( bytes );
			
			if (chunk_size == 0 && inputBuffer.bytesLeft() >=2 ) {
				chunk_size = inputBuffer.readUInt16(); // read chunk size
			}
			
			if ( chunk_size != 0 && inputBuffer.bytesLeft() >= chunk_size )
			{
				events.onDataChunk(this, userNr, inputBuffer, chunk_size );
				chunk_size = 0;
			}
		}
		else events.onData(this, userNr, bytes);
	}

	
}