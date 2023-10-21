package peote.net;

import haxe.ds.Vector;
import haxe.io.Bytes;
import haxe.Timer;
import peote.io.PeoteBytesInput;

/**
 * by Sylvio Sell - rostock 2015
 */

class PeoteServer
{
	public var events:PeoteServerEvents;
	
	public var jointNr(default, null):Int;
	public var jointId(default, null):String;
	public var server(default, null):String = "";
	public var port(default, null):Int;

	public var offline(default, null):Bool=false;
	public var isRemote(default, null):Bool=false;
	public var isChunks(default, null):Bool=false;

	public var localPeoteClient:Array<PeoteClient> = [];
	public var netLag:Int = 20; // simmulates net-lag in milliseconds
	public var netSpeed:Int = 1024 * 1024; // simmulates net-behavior (1024 * 1024 bytes [1KB] per second)
	
	// variable chunksize:
	// max values for 1 byte -> max 256
	//            for 2 byte -> max 32768 (32 KB),
	//            for 3 byte -> max 4194304 (4 MB)
	//            for 4 byte -> max 536870912 (512 MB)
	//            for 5 byte -> max 2147483647 (2 GB less one Byte)
	var maxBytesPerChunkSize:Int = 2;
	var maxChunkSize:Int = 32768;
	
	var peoteJointSocket:PeoteJointSocket;
	
	var inputBuffers:Vector<InputBuffer>;
	
	public function new(events:PeoteServerEvents)
	{
		this.events = events;
		
		if (events.offline != null) offline = events.offline;
		if (events.netLag != null) netLag = events.netLag;
		if (events.netSpeed != null) netSpeed = events.netSpeed;
		
		if (events.onDataChunk == null && events.onData == null) {
			isRemote = true; 
			isChunks = true;
		} else if (events.onDataChunk != null) {
			if (events.onData != null) throw("Error: Use either 'onDataChunk' or 'onData' callback but not both.");
			isChunks = true;
		}
		
		if (isChunks) {
			if (events.maxBytesPerChunkSize != null) {
				if (events.maxChunkSize != null) throw("Error: Use either 'maxBytesPerChunkSize' or 'maxChunkSize' to define the maximum of variable datachunk size.");
				if (maxBytesPerChunkSize < 1) throw("Error: 'maxBytesPerChunkSize' have to be equal or greater than one.");
				if (maxBytesPerChunkSize > 5) throw("Error: 'maxBytesPerChunkSize' have to be not greater than 5.");
				if (maxBytesPerChunkSize == 5) maxChunkSize = 0x7FFFFFFF;
				else maxChunkSize = 1 << (8 + (maxBytesPerChunkSize-1) * 7);
			}
			else if (events.maxChunkSize != null) {
				maxChunkSize = events.maxChunkSize;
				maxBytesPerChunkSize = 1;
				if (maxChunkSize > 256) maxBytesPerChunkSize++;
				if (maxChunkSize > 32768) maxBytesPerChunkSize++;
				if (maxChunkSize > 4194304) maxBytesPerChunkSize++;
			}
			inputBuffers = new Vector<InputBuffer>(PeoteNet.MAX_USER * 2); // todo (max local users)
		}

		
		// TODO: only for remote-usage
		remotes = new Vector<Vector<Vector<PeoteBytesInput->Void>>>(PeoteNet.MAX_USER * 2);//todo (max local users)		
	}
	
	// -----------------------------------------------------------------------------------
	// CREATE NEW JOINT ------------------------------------------------------------------
	
	public function create(server:String, port:Int, jointId:String):Void
	{
		
		if (this.server == "")
		{
			this.server = server;
			this.port = port;
			this.jointId = jointId;
			if (offline) PeoteNet.createOfflineJoint(this, server, port, jointId);
			else PeoteNet.createJoint(this, server, port, jointId);
		}
		else
		{
			throw("Error: This instance of PeoteServer already opened a Joint (delete before create again)");
		}	
	}

	// -----------------------------------------------------------------------------------
	// DELETE JOINT -----------------------------------------------------------------------
	
	public function delete():Void 
	{
		if (offline) PeoteNet.deleteOfflineJoint(this, this.server, this.port, this.jointId);
		else PeoteNet.deleteJoint(this, this.server, this.port, this.jointNr);
		this.server = "";
	}
	
	// -----------------------------------------------------------------------------------
	// SEND DATA TO USER -----------------------------------------------------------------

	public var last_delay:Int = 0;
	public var last_time:Float = 0;
	public inline function send(userNr:Int, bytes:Bytes):Void
	{
		if (userNr < PeoteNet.MAX_USER)
			this.peoteJointSocket.sendDataToJointOwn(this.jointNr, userNr, bytes);
		else {
			var delay = Std.int(Math.max(0, last_delay - (Timer.stamp() - last_time) * 1000))
			          + Std.int(netLag + 1000 * bytes.length / netSpeed);
			last_delay = delay; // TODO: for local testing put a LIMIT here for OVERFLOW!!!!!
			last_time = Timer.stamp();
			Timer.delay(function() {
				if (localPeoteClient.length > userNr-PeoteNet.MAX_USER)
					localPeoteClient[userNr-PeoteNet.MAX_USER]._onData(localPeoteClient[userNr-PeoteNet.MAX_USER].jointNr, bytes); // TODO _onLocalData optimizing
			}, delay);
		}
	}

	public function sendChunk(userNr:Int, bytes:Bytes):Void
	{
		if (bytes.length <= 0) throw("Error(sendChunk): can't send zero length chunk");
		else if (bytes.length > maxChunkSize)  throw('Error(sendChunk): max chunksize is $maxChunkSize Bytes');
		else {
			send( userNr, writeChunkSize(bytes.length) );
			send( userNr, bytes );
		}
	}
	
	function writeChunkSize(size:Int):Bytes
	{
		//if (size <= 0) throw("Error(sendChunk): can't send zero length chunk");
		var bytes = Bytes.alloc(maxBytesPerChunkSize);
		var bytecount:Int = 0;
		var b:Int;
		size--;
		do
		{
			bytecount++;
			if (bytecount < maxBytesPerChunkSize) {
				b = size & 127; // get 7 bits
				size = size >> 7;
			}
			else {
				b = size & 255; // last get 8 bits
				size = size >> 8;
			}
			if (size > 0) b += 128;
			bytes.set(bytecount-1,  b);
		}
		while (size > 0 && bytecount < maxBytesPerChunkSize);
		
		//if (size > 0) throw('chunksize to great for maxBytesPerChunkSize=$maxBytesPerChunkSize');
		return(bytes.sub(0, bytecount));
	}
	
	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------

	public inline function _onCreateJoint(peoteJointSocket:PeoteJointSocket, jointNr:Int):Void
	{
		this.peoteJointSocket = peoteJointSocket;
		this.jointNr = jointNr;
		events.onCreate(this);
	}
	
	public inline function _onCreateJointError(errorNr:Int):Void
	{
		this.server = "";
		events.onError(this, -1, errorNr);
	}
	
	public inline function _onUserConnect(jointNr:Int, userNr:Int):Void 
	{
		remotes[userNr] = new Vector<Vector<PeoteBytesInput->Void>>(256);
		
		if (isRemote)      inputBuffers.set(userNr, new InputBuffer(this, userNr, remote,             maxChunkSize, maxBytesPerChunkSize));
		else if (isChunks) inputBuffers.set(userNr, new InputBuffer(this, userNr, events.onDataChunk, maxChunkSize, maxBytesPerChunkSize));
		
		events.onUserConnect(this, userNr);
	}
	
	public inline function _onUserDisconnect(jointNr:Int, userNr:Int, reason:Int):Void 
	{
		remotes[userNr] = null;
		
		if (isChunks) inputBuffers.set(userNr, null);
		events.onUserDisconnect(this, userNr, reason);
	}
	
	public function _onData(jointNr:Int, userNr:Int, bytes:Bytes):Void
	{	
		if (isChunks) {
			inputBuffers.get(userNr).onData(bytes);
		}
		else events.onData(this, userNr, bytes);
	}

	// -----------------------------------------------------------------------------------
	// RPC -------------------------------------------------------------------------
	var remotes:Vector<Vector<Vector<PeoteBytesInput->Void>>>; // stores all remote functions for incomming data
	
	public function setRemote(userNr:Int, f:Remote, remoteId:Int = 0 ):Void
	{
		if (!isRemote) throw("Error: Do not use 'onDataChunk' or 'onData' while using Remote-Objects in PeoteServer!");	
		remotes[userNr][remoteId] = (f:Dynamic).getRemotes();

		var bytes = Bytes.alloc(1); // TODO: max-amount-of-remote-objects
		bytes.set(0, remoteId);
		sendChunk(userNr, bytes);
	}
	
	private function remote(server:PeoteServer, userNr:Int, bytes:Bytes)
	{
		var input = new PeoteBytesInput(bytes);
		
		var remoteId = input.readByte(); //trace("remoteId:"+remoteId);
		
		if (input.bytesLeft() == 0) events.onRemote(this, userNr, remoteId);
		else
		{			
			// check that remoteID exists 
			var remoteObject = remotes.get(userNr).get(remoteId); //trace("remoteObject:"+remoteObject);
			if (remoteObject != null)
			{
				var procedureNr = input.readByte(); //trace("procedureNr:" + procedureNr);
				// check max remotes
				if (procedureNr < remoteObject.length)
					try remoteObject[procedureNr](input) catch (m:Dynamic) {trace(m); events.onError(this, userNr, Reason.MALICIOUS);}
				else events.onError(this, userNr, Reason.MALICIOUS);
			} else events.onError(this, userNr, Reason.MALICIOUS);  // TODO: disconnect user if malicous input
		}
	}

}


class InputBuffer {
	var input_pos:Int = 0;
	var input_end:Int = 0;
	var chunk_size:Int= 0;
	var chunkReady:Bool = false;
	var chunkBytecount:Int = 0;
	var byte:Int;
	var input:Bytes;
	var maxBytesPerChunkSize:Int;
	
	var onDataChunk:PeoteServer -> Int -> Bytes -> Void;
	var peoteServer:PeoteServer;
	var userNr:Int;
	
	public function new(peoteServer:PeoteServer, userNr:Int, onDataChunk:PeoteServer -> Int -> Bytes -> Void, maxChunkSize:Int, maxBytesPerChunkSize:Int) {
		this.peoteServer = peoteServer;
		this.userNr = userNr;
		this.onDataChunk = onDataChunk;
		this.maxBytesPerChunkSize = maxBytesPerChunkSize;
		input = Bytes.alloc((maxChunkSize+maxBytesPerChunkSize)*2);
	}
	
	public function onData(bytes:Bytes):Void
	{
		if (input_pos == input_end) { input_pos = input_end = 0; }
		
		//var debugOut = "";for (i in 0...bytes.length) debugOut += bytes.get(i) + " ";trace("data:" + debugOut);		
		if (input_end + bytes.length > input.length) trace("ERROR Server: out of BOUNDS");
		input.blit(input_end, bytes, 0, bytes.length );
		
		input_end += bytes.length;
				
		while (!chunkReady && input_end-input_pos >=1) {
			
			byte = input.get(input_pos++);
			if (chunkBytecount == maxBytesPerChunkSize-1 || byte < 128)
			{
				if (byte == 0 && chunkBytecount != 0) trace("MALECIOUS ?");
				chunk_size = chunk_size | (byte << chunkBytecount*7);
				chunkReady = true; chunkBytecount = 0; chunk_size++; 
			}
			else // uppest bit is set and more bytes avail
			{
				chunk_size = chunk_size | ( (byte-128) << chunkBytecount*7);
				chunkBytecount++;
			}
		}
				
		if ( chunkReady && input_end-input_pos >= chunk_size )
		{
			var b:Bytes = Bytes.alloc(chunk_size);
			//trace(" ---> onDataChunk: " + b.length + "Bytes ( start:"+input_pos+" end:"+input_end+ ")",b.get(0), b.get(1), b.get(2));
			b.blit(0, input, input_pos, chunk_size);
			input_pos += chunk_size;
			chunk_size = 0; chunkReady = false;
			onDataChunk(peoteServer, userNr, b );
		}
	}

}
