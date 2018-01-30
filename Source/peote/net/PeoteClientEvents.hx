package peote.net;

import haxe.io.Bytes;

/**
 * by Sylvio Sell - rostock 2015
 */

typedef PeoteClientEvents = {
	onEnterJoint:PeoteClient -> Void,
	onEnterJointError:PeoteClient -> Int -> Void,
	onDisconnect:PeoteClient -> Int -> Void,
	?onData:PeoteClient -> Bytes -> Void,
	?onDataChunk:PeoteClient -> Bytes -> Void
}
