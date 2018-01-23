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

	public var onCreateJoint:Int -> Void;
	public var onCreateJointError:Int -> Void;
	public var onUserConnect:Int -> Int -> Void;
	public var onUserDisconnect:Int -> Int -> Int -> Void;
	public var onData:Int -> Int -> Bytes -> Void;
	public var onDataChunk:Int -> Int -> PeoteBytesInput -> Int -> Void;
	
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
			onCreateJointError(255);
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

	public function send(userNr:Int, bytes:Bytes):Void
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

	public function _onCreateJoint(peoteJointSocket:PeoteJointSocket, jointNr:Int):Void
	{
		this.peoteJointSocket = peoteJointSocket;
		this.jointNr = jointNr;
		onCreateJoint(this.jointNr);
	}
	
	// to wrap more around
	/*
	public function onCreateJointError(errorNr:Int):Void
	{
		trace("createJoint() fails: errorNr = " + errorNr);
	}
	
	public function onUserConnect(jointNr:Int, userNr:Int):Void 
	{
		trace("connected new user: " + userNr);
	}
	
	public function onUserDisconnect(jointNr:Int, userNr:Int, reason:Int):Void 
	{
		trace("user: " + userNr + " disconnected, ");
		if (reason == 0) trace(" user leaves joint!");
		else if (reason == 1) trace(" user lost connection!");
		
	}
	
	*/
	public function _onData(jointNr:Int, userNr:Int, bytes:Bytes):Void
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
				onDataChunk(jointNr, userNr, inputBuffer, chunk_size );
				chunk_size = 0;
			}
		}
		else onData(jointNr, userNr, bytes);
	}
	
	public function getEventHandler():Dynamic
	{
		return {
				"onCreateJoint": onCreateJoint,
				"onCreateJointError": onCreateJointError,
				"onUserConnect": onUserConnect,
				"onUserDisconnect": onUserDisconnect,
				"onData": onData
		};	
	}
	
	
}