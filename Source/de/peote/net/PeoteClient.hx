package de.peote.net;

import haxe.io.Bytes;

/**
 * ...
 * @author Sylvio Sell
 */

class PeoteClient
{
	private var jointNr:Int;
	private var peoteJointSocket:PeoteJointSocket;
	private var server:String;
	private var port:Int;
	
	public var _onEnterJoint:Int -> Void;
	public var onEnterJointError:Int -> Void;
	public var onDisconnect:Int -> Int -> Void;
	public var onData:Int -> Bytes -> Void;

	public function new(param:Dynamic) 
	{
		_onEnterJoint = param.onEnterJoint;
		onEnterJointError = param.onEnterJointError;
		onDisconnect = param.onDisconnect;
		onData = param.onData;
	}

	// -----------------------------------------------------------------------------------
	// ENTER JOINT -----------------------------------------------------------------------
	
	public function enterJoint(server:String, port:Int, jointId:String):Void 
	{
		this.server = server;
		this.port = port;
		PeoteNet.enterJoint(this, server, port, jointId);
	}

	// -----------------------------------------------------------------------------------
	// LEAVE JOINT -----------------------------------------------------------------------
	
	public function leaveJoint():Void 
	{
		PeoteNet.leaveJoint(this, this.server, this.port, this.jointNr);
	}

	// -----------------------------------------------------------------------------------
	// SEND DATA -------------------------------------------------------------------------

	public function send(bytes:Bytes):Void
	{	
		this.peoteJointSocket.sendDataToJointIn(this.jointNr, bytes );
	}

	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------
	
	public function onEnterJoint(peoteJointSocket:PeoteJointSocket, jointNr:Int):Void
	{
		this.peoteJointSocket = peoteJointSocket;
		this.jointNr = jointNr;
		trace("enterJoint() CONNECTED");
		_onEnterJoint(jointNr);
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
	
	public function onData(jointNr:Int, myBA:ByteArray):Void
	{
		//trace("DATA(" + myBA.readUTFBytes(myBA.length) + ")");
		trace("DATA " + myBA.length + " bytes");
	}
	*/
	


}