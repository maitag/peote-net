package de.peote.net.flash.bridge;

import haxe.io.Bytes;
import openfl.external.ExternalInterface;

/**
 * ...
 * @author semmi
 */

class PeoteServer extends de.peote.net.PeoteServer
{
	var id:String;

	public function new(id:String) 
	{
		// js bridge
		this.id = id;
		super({
			onCreateJoint:		__onCreateJoint,
			onCreateJointError:	_onCreateJointError,
			onUserConnect:		_onUserConnect,
			onUserDisconnect:	_onUserDisconnect,
			onData: _onData
		});
	}
	
	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------

	public inline function __onCreateJoint(jointNr:Int):Void
	{
		//trace("createJoint() CONNECTED");
        ExternalInterface.call("(function(id,jointNr){ var inst = window.PeoteServer._instances[id]; if (inst.onCreateJoint) inst.onCreateJoint(jointNr);})", id, jointNr);
	}
	
	public inline function _onCreateJointError(errorNr:Int):Void
	{
		//trace("createJoint() fails: errorNr = " + errorNr);
        ExternalInterface.call( "(function(id, errorNr){ var inst = window.PeoteServer._instances[id]; if (inst.onCreateJointError) inst.onCreateJointError(errorNr);})", id, errorNr);
	}
	
	public inline function _onUserConnect(jointNr:Int, userNr:Int):Void 
	{
		//trace("connected new user: " + userNr);ExternalInterface.call("console.log('connected new user: '+ userNr)");
        ExternalInterface.call( "(function(id, jointNr, userNr){ var inst = window.PeoteServer._instances[id]; if (inst.onUserConnect) inst.onUserConnect(jointNr, userNr);})", id, jointNr, userNr);
	}
	
	public inline function _onUserDisconnect(jointNr:Int, userNr:Int, reason:Int):Void 
	{
		//trace("user: " + userNr + " disconnected, ");
		//if (reason == 0) trace(" user leaves joint!");
		//else if (reason == 1) trace(" user lost connection!");
		
        ExternalInterface.call( "(function(id, jointNr, userNr, reason){ var inst = window.PeoteServer._instances[id]; if (inst.onUserDisconnect) inst.onUserDisconnect(jointNr, userNr, reason);})", id, jointNr, userNr, reason);
	}
	
	public inline function _onData(jointNr:Int, userNr:Int, bytes:Bytes):Void
	{
		ExternalInterface.call( "(function(id, jointNr, userNr, data){ var inst = window.PeoteServer._instances[id]; if (inst.onData) inst.onData(jointNr, userNr, data);})", id, jointNr, userNr,
			[ for( i in 0...bytes.length ) bytes.get(i) ]
		);
	}

}