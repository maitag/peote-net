package peote.net;

import haxe.io.Bytes;

/**
 * by Sylvio Sell - rostock 2015
 */

typedef PeoteServerEvents = {
	onCreate: PeoteServer -> Void,
	onError:PeoteServer -> Int -> Reason -> Void,
	onUserConnect:PeoteServer -> Int -> Void,
	onUserDisconnect:PeoteServer -> Int -> Reason -> Void,
	?onData:PeoteServer -> Int -> Bytes -> Void,
	?onDataChunk:PeoteServer -> Int -> Bytes -> Void,
	?onRemote:PeoteServer -> Int -> Int -> Void,
	?maxBytesPerChunkSize:Int,
	?maxChunkSize:Int,
	?offline:Bool,
	?netLag:Int,
	?netSpeed:Int,
}
