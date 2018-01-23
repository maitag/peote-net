package peote.net;

import haxe.io.Bytes;
import peote.io.PeoteBytesInput;
import peote.io.PeoteBytesOutput;

/**
 * ...
 * @author Sylvio Sell
 */

class PeoteClient
{
	var jointNr:Int;
	var peoteJointSocket:PeoteJointSocket;
	var server:String = "";
	var port:Int;
	
	public var onEnterJoint:Int -> Void;
	public var onEnterJointError:Int -> Void;
	public var onDisconnect:Int -> Int -> Void;
	public var onData:Int -> Bytes -> Void;
	public var onDataChunk:Int -> PeoteBytesInput -> Int -> Void;
	
	var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	var chunk_size:Int = 0;

	public function new(param:Dynamic) 
	{
		onEnterJoint = param.onEnterJoint;
		onEnterJointError = param.onEnterJointError;
		onDisconnect = param.onDisconnect;
		onData = param.onData;
		onDataChunk = param.onDataChunk;
		
		if (onDataChunk != null) inputBuffer = new PeoteBytesInput();
	}

	// -----------------------------------------------------------------------------------
	// ENTER JOINT -----------------------------------------------------------------------
	
	public function enterJoint(server:String, port:Int, jointId:String):Void 
	{
		if (this.server == "")
		{
			this.server = server;
			this.port = port;
			PeoteNet.enterJoint(this, server, port, jointId);
		}
		else
		{
			trace("Error: PeoteClient already connected");
			onEnterJointError(255);
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
		onEnterJoint(jointNr);
 	}
	/*
	public function onEnterJointError(errorNr:Int):Void // bei FEHLER
	{
		trace("enterJoint() fails: errorNr = " + errorNr);
 	}
	
	public function onDisconnect(jointNr:Int, reason:Int):Void 
	{
		trace(" disconnected from joint: " + jointNr + ", ");
		if (reason == 0) trace(" joint-owner closed joint!");
		else if (reason == 1) trace(" joint-owner was disconnected!");
		else if (reason == 2) trace(" you was kicked by joint-owner!");
 	}
	*/
	
	public function _onData(jointNr:Int, bytes:Bytes):Void
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
				onDataChunk(jointNr, inputBuffer, chunk_size );
				chunk_size = 0;
			}
		}
		else onData(jointNr, bytes);
	}

	
	public function getEventHandler():Dynamic
	{
		return {
				"onEnterJoint": onEnterJoint,
				"onEnterJointError": onEnterJointError,
				"onDisconnect": onDisconnect,
				"onData": onData
		};	
	}


}