package peote.net;

import haxe.io.Bytes;

/**
 * by Sylvio Sell - rostock 2015
 */

typedef PeoteServerEvents = {
	onCreateJoint: PeoteServer -> Void,
	onCreateJointError:PeoteServer -> Int -> Void,
	onUserConnect:PeoteServer -> Int -> Void,
	onUserDisconnect:PeoteServer -> Int -> Int -> Void,
	?onData:PeoteServer -> Int -> Bytes -> Void,
	?onDataChunk:PeoteServer -> Int -> Bytes -> Void
}
