package peote.net;

import haxe.io.Bytes;
import peote.io.PeoteBytesInput;

/**
 * 
 * by Sylvio Sell - rostock 2015
 */

class PeoteServerFarm
{
	public var onCreateJoint:Int -> PeoteServer -> Void;
	public var onCreateJointError:Int -> PeoteServer -> Void;
	public var onUserConnect:Int -> Int -> PeoteServer -> Void;
	public var onUserDisconnect:Int -> Int -> Int -> PeoteServer -> Void;
	public var onData:Int -> Int -> Bytes -> PeoteServer -> Void;
	public var onDataChunk:Int -> Int -> PeoteBytesInput -> Int -> PeoteServer -> Void;
	
	public function new(param:Dynamic) 
	{
		onCreateJoint = param.onCreateJoint;
		onCreateJointError = param.onCreateJointError;
		onUserConnect = param.onUserConnect;
		onUserDisconnect = param.onUserDisconnect;
		onData = param.onData;
		onDataChunk = param.onDataChunk;
	}
	
	// -----------------------------------------------------------------------------------
	// CREATE NEW JOINT ------------------------------------------------------------------
	
	public function createJoint(server:String, port:Int, jointId:String):PeoteServer 
	{
		var peoteServer:PeoteServer = new PeoteServer({
				"onCreateJoint": onCreateJoint,
				"onCreateJointError": onCreateJointError,
				"onUserConnect": onUserConnect,
				"onUserDisconnect": onUserDisconnect,
				"onData": onData,
				"onDataChunk": onDataChunk
		});
		peoteServer.createJoint(server, port, jointId);
		return peoteServer;
	}

	// TODO:
	// -store into map if onCreateJoint() success
	// -delete if onCreateJointError

	
}