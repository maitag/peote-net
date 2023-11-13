package peote.net;

import haxe.ds.Vector;
import haxe.io.Bytes;
import haxe.Timer;
import peote.io.PeoteBytesInput;

/**
 * by Sylvio Sell - rostock 2015
 */

class PeoteClient
{
	public var events:PeoteClientEvents;
	
	public var jointNr(default, null):Int;
	public var jointId(default, null):String;
	public var server(default, null):String = "";
	public var port(default, null):Int;

	public var isRemote(default, null):Bool=false;
	public var isChunks(default, null):Bool=false;

	public var localPeoteServer:PeoteServer = null;
	public var localUserNr:Int;

	// variable chunksize:
	// max values for 1 byte -> max 256
	//            for 2 byte -> max 32768 (32 KB),
	//            for 3 byte -> max 4194304 (4 MB)
	//            for 4 byte -> max 536870912 (512 MB)
	//            for 5 byte -> max 2147483647 (2 GB less one Byte)
	var maxBytesPerChunkSize:Int = 2;
	var maxChunkSize:Int = 32768;

	var peoteJointSocket:PeoteJointSocket;
	
	var input:Bytes;
	var input_pos:Int = 0;
	var input_end:Int = 0;
	var chunk_size:Int = 0;
	var chunkReady:Bool = false;
	var chunkBytecount:Int = 0;
	var byte:Int;
	
	public function new(events:PeoteClientEvents)
	{
		this.events = events;
		
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
				if (maxChunkSize > 536870912) maxBytesPerChunkSize++;
			}
			input = Bytes.alloc((maxChunkSize+maxBytesPerChunkSize)*2);
		}
	
		// TODO: only for remote-usage
		remotes = new Vector<Vector<PeoteBytesInput->Void>>(256);
	}

	// -----------------------------------------------------------------------------------
	// ENTER JOINT -----------------------------------------------------------------------
	
	public function enter(server:String, port:Int, jointId:String):Void 
	{
		if (this.server == "")
		{
			this.server = server;
			this.port = port;
			this.jointId = jointId;
			PeoteNet.enterJoint(this, server, port, jointId);
		}
		else
		{
			throw("Error: This instance of PeoteClient already connected to a Joint (leave before enter again)");
		}
	}

	// -----------------------------------------------------------------------------------
	// LEAVE JOINT -----------------------------------------------------------------------
	
	public function leave():Void 
	{
		PeoteNet.leaveJoint(this, this.server, this.port, this.jointNr);
		this.server = "";
	}

	// -----------------------------------------------------------------------------------
	// SEND DATA -------------------------------------------------------------------------
	public var last_delay:Int = 0;
	public var last_time:Float = 0;
	public function send(bytes:Bytes):Void
	{
		//trace("send:", bytes.toHex());
		if (localPeoteServer == null ) {
			if (this.peoteJointSocket != null) this.peoteJointSocket.sendDataToJointIn(this.jointNr, bytes );
		}
		else {
			var delay = Std.int(Math.max(0, last_delay - (Timer.stamp() - last_time) * 1000))
			          + Std.int(localPeoteServer.netLag + 1000 * bytes.length / localPeoteServer.netSpeed);
			last_delay = delay; // TODO: for local testing put a LIMIT here for OVERFLOW!!!!!
			last_time = Timer.stamp();
			Timer.delay(function() {
				if (localPeoteServer != null ) localPeoteServer._onData(localPeoteServer.jointNr, localUserNr, bytes);
			}, delay);
		}
	}

	public function sendChunk(bytes:Bytes):Void
	{
		if (bytes.length <= 0) throw("Error(sendChunk): can't send zero length chunk");
		else if (bytes.length > maxChunkSize)  throw("Error(sendChunk): max chunksize is 65536 Bytes"); // TODO: dynamic chunksize
		else {
			//trace("sendChunkSize:", writeChunkSize(bytes.length).toHex());
			send( writeChunkSize(bytes.length) );
			//trace("sendChunk:", bytes.toHex());
			send( bytes );			
		}
	}
	
	function writeChunkSize(size:Int):Bytes
	{
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
			bytes.set(bytecount - 1,  b);
		}
		while (size > 0 && bytecount < maxBytesPerChunkSize);

		//if (size > 0) throw('chunksize to great for maxBytesPerChunkSize=$maxBytesPerChunkSize');
		return(bytes.sub(0, bytecount));
	}

	// -----------------------------------------------------------------------------------
	// CALLBACKS -------------------------------------------------------------------------
	
	public function _onEnterJoint(peoteJointSocket:PeoteJointSocket, jointNr:Int):Void
	{
		this.peoteJointSocket = peoteJointSocket;
		this.jointNr = jointNr;
		events.onEnter(this);
 	}
	
	public function _onEnterJointError(errorNr:Int):Void // bei FEHLER
	{
		this.server = "";
		events.onError(this, errorNr );
 	}
	
	public function _onDisconnect(jointNr:Int, reason:Int):Void 
	{
		events.onDisconnect(this, reason);	
 	}
	
	
	public function _onData(jointNr:Int, bytes:Bytes):Void
	{
		//trace("onData: ", bytes.toHex());
		if (isChunks) {
		
			if (input_pos == input_end) { input_pos = input_end = 0; }
			
			//var debugOut = "";for (i in 0...bytes.length) debugOut += bytes.get(i) + " ";trace("data:" + debugOut);
			if (input_end + bytes.length > input.length) trace("ERROR Client: out of BOUNDS");
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
			{	//trace("chunk_size:"+chunk_size);
				var b:Bytes = Bytes.alloc(chunk_size);
				//trace(" ---> onDataChunk: " + b.length + "Bytes ( start:"+input_pos+" end:"+input_end+ ")",b.get(0), b.get(1), b.get(2));
				b.blit(0, input, input_pos, chunk_size);
				input_pos += chunk_size;
				chunk_size = 0; chunkReady = false;
				if (isRemote) remote(b);
				else events.onDataChunk(this, b );
			}
		}
		else events.onData(this, bytes);
	
	}
	
	// -----------------------------------------------------------------------------------
	// RPC -------------------------------------------------------------------------
	var remotes:Vector<Vector<PeoteBytesInput->Void>>; // stores all remote functions for incomming data
	
	public function setRemote(f:Remote, remoteId:Int = 0):Void
	{
		if (!isRemote) throw("Error: Do not use 'onDataChunk' or 'onData' while using Remote-Objects in PeoteServer!");
		remotes[remoteId] = (f:Dynamic).getRemotes();
		
		var bytes = Bytes.alloc(1); // TODO: max-amount-of-remote-objects
		bytes.set(0, remoteId);
		sendChunk(bytes);
	}
	
	public function remote(bytes:Bytes)
	{
		var input = new PeoteBytesInput(bytes);		
		var remoteId = input.readByte(); //trace("remoteId:"+remoteId);
		
		if (input.bytesLeft() == 0)	events.onRemote(this, remoteId);
		else
		{
			// check that remoteID exists 
			var remoteObject = remotes.get(remoteId); //trace("remoteObject:"+remoteObject);
			if (remoteObject != null)
			{
				var procedureNr = input.readByte(); //trace("procedureNr:" + procedureNr);
				// check max remotes
				if (procedureNr < remoteObject.length)
					try remoteObject[procedureNr](input) catch (m:Dynamic) events.onError(this, Reason.MALICIOUS);
				else events.onError(this, Reason.MALICIOUS); 
			} else events.onError(this, Reason.MALICIOUS); //  TODO: disconnect joint if malicous input from owner
		}
		
	}


}