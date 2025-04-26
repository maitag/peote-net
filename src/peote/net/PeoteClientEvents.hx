package peote.net;

import haxe.io.Bytes;

/**
 * by Sylvio Sell - rostock 2015
 */

typedef PeoteClientEvents = {
	onEnter:PeoteClient -> Void,
	onError:PeoteClient -> Reason -> Void,
	onDisconnect:PeoteClient -> Reason -> Void,
	?onData:PeoteClient -> Bytes -> Void,
	?onDataChunk:PeoteClient -> Bytes -> Void,
	?onRemote:PeoteClient -> Int -> Void,
	?maxBytesPerChunkSize:Int,
	?maxChunkSize:Int
}
