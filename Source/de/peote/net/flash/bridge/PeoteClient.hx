package de.peote.net.flash.bridge;

import haxe.io.Bytes;
import openfl.external.ExternalInterface;

/**
 * ...
 * @author semmi
 */

class PeoteClient extends de.peote.net.PeoteClient
{
	var id:String;
	
	public function new(id:String)
	{
		// js bridge
		this.id = id;
		super({
			onEnterJoint:		__onEnterJoint,
			onEnterJointError:	_onEnterJointError,
			onDisconnect:		_onDisconnect,
			onData:				_onData
		});
		
	}
	
	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------
	
	public inline function __onEnterJoint(jointNr:Int):Void
	{
		//trace("enterJoint() CONNECTED");
        ExternalInterface.call( "(function(id, jointNr){ var inst = window.PeoteClient._instances[id]; if (inst.onEnterJoint) inst.onEnterJoint(jointNr);})", id, jointNr);
	}

	public inline function _onEnterJointError(errorNr:Int):Void
	{
		//trace("enterJoint() fails: errorNr = " + errorNr);
        ExternalInterface.call( "(function(id, errorNr){ var inst = window.PeoteClient._instances[id]; if (inst.onEnterJointError) inst.onEnterJointError(errorNr);})", id, errorNr);
	}
	
	public inline function _onDisconnect(jointNr:Int, reason:Int):Void 
	{
		//trace(" disconnected from joint: " + jointNr + ", ");
		//if (reason == 0) trace(" joint-owner closed joint!");
		//else if (reason == 1) trace(" joint-owner was disconnected!");
		//else if (reason == 2) trace(" you was kicked by joint-owner!");
        ExternalInterface.call( "(function(id, jointNr, reason){ var inst = window.PeoteClient._instances[id]; if (inst.onDisconnect) inst.onDisconnect(jointNr, reason);})", id, jointNr, reason);
	}
	
	public inline function _onData(jointNr:Int, bytes:Bytes):Void
	{
		ExternalInterface.call( "(function(id, jointNr, data){ var inst = window.PeoteClient._instances[id]; if (inst.onData) inst.onData(jointNr, data);})", id, jointNr,
			[ for( i in 0...bytes.length ) bytes.get(i) ]
		);
	}
	
	


}