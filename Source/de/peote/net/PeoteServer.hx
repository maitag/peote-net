package de.peote.net;

import haxe.io.Bytes;

/**
 *  /\/\/\                     ~^
 * @author Sylvio Sell - maitag
 */

class PeoteServer
{
	var jointNr:Int;
	var peoteJointSocket:PeoteJointSocket;
	var server:String = "";
	var port:Int;

	public var _onCreateJoint:Int -> Void;
	public var onCreateJointError:Int -> Void;
	public var onUserConnect:Int -> Int -> Void;
	public var onUserDisconnect:Int -> Int -> Int -> Void;
	public var onData:Int -> Int -> Bytes -> Void;

	public function new(param:Dynamic) 
	{
		_onCreateJoint = param.onCreateJoint;
		onCreateJointError = param.onCreateJointError;
		onUserConnect = param.onUserConnect;
		onUserDisconnect = param.onUserDisconnect;
		onData = param.onData;
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

	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------

	public function onCreateJoint(peoteJointSocket:PeoteJointSocket, jointNr:Int):Void
	{
		this.peoteJointSocket = peoteJointSocket;
		this.jointNr = jointNr;
		trace("createJoint() CONNECTED");
		_onCreateJoint(this.jointNr);
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
	
	public function onData(jointNr:Int, userNr:Int, myBA:ByteArray):Void
	{
		//trace("user " + userNr + ": DATA(" + myBA.readUTFBytes(myBA.length) + ")");
		trace("user " + userNr + ": DATA " + myBA.length + " bytes");
	}
	*/
}