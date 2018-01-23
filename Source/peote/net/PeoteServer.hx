package peote.net;

import haxe.io.Bytes;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;

/**
 *  /\/\/\                     ~^
 * by Sylvio Sell - rostock 2015
 */

class PeoteServer
{
	var jointNr:Int;
	var peoteJointSocket:PeoteJointSocket;
	var server:String = "";
	var port:Int;

	public var onCreateJoint:Int -> PeoteServer -> Void;
	public var onCreateJointError:Int -> PeoteServer -> Void;
	public var onUserConnect:Int -> Int -> PeoteServer -> Void;
	public var onUserDisconnect:Int -> Int -> Int -> PeoteServer -> Void;
	public var onData:Int -> Int -> Bytes -> PeoteServer -> Void;
	public var onDataChunk:Int -> Int -> PeoteBytesInput -> Int -> PeoteServer -> Void;
	
	var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	var chunk_size:Int = 0;

	public function new(param:Dynamic) 
	{
		onCreateJoint = param.onCreateJoint;
		onCreateJointError = param.onCreateJointError;
		onUserConnect = param.onUserConnect;
		onUserDisconnect = param.onUserDisconnect;
		onData = param.onData;
		onDataChunk = param.onDataChunk;
			
		if (onDataChunk != null) inputBuffer = new PeoteBytesInput();
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
			trace("Error: PeoteServer already connected");
			onCreateJointError(255, this);
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
		this.onCreateJoint(this.jointNr, this);
	}
	
	// to wrap more around
	
	public inline function _onCreateJointError(errorNr:Int):Void
	{
		this.onCreateJointError(errorNr, this);
		this.server = "";
	}
	
	public inline function _onUserConnect(jointNr:Int, userNr:Int):Void 
	{
		this.onUserConnect(jointNr, userNr, this);
	}
	
	public inline function _onUserDisconnect(jointNr:Int, userNr:Int, reason:Int):Void 
	{
		this.onUserDisconnect(jointNr, userNr, reason, this);	
	}
	
	public inline function _onData(jointNr:Int, userNr:Int, bytes:Bytes):Void
	{
		if (onDataChunk != null) {
			inputBuffer.append( bytes );
			//trace('inputBuffer size: ${inputBuffer.length}');
			
			if (chunk_size == 0 && inputBuffer.bytesLeft() >=2 ) {
				chunk_size = inputBuffer.readUInt16(); // read chunk size
				//trace('read chunk size: $chunk_size');
			}
			
			//trace('bytesLeft: ${inputBuffer.bytesLeft()}');
			if ( chunk_size != 0 && inputBuffer.bytesLeft() >= chunk_size )
			{
				this.onDataChunk(jointNr, userNr, inputBuffer, chunk_size, this );
				chunk_size = 0;
			}
		}
		else this.onData(jointNr, userNr, bytes, this);
	}

	
}