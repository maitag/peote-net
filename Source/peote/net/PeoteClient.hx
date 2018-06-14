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

	public var localPeoteServer:PeoteServer = null;
	public var localUserNr:Int;
	
	var peoteJointSocket:PeoteJointSocket;
	
	var input:Bytes;
	var input_pos:Int = 0;
	var input_end:Int = 0;
	var chunk_size:Int = 0;
	
	public function new(events:PeoteClientEvents) 
	{
		this.events = events;
		if (events.onDataChunk != null) input = Bytes.alloc((65536+2)*2); // TODO
	
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
			throw("Error: PeoteClient already connected");
			events.onError(this, 255); // TODO
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
		if (localPeoteServer == null) this.peoteJointSocket.sendDataToJointIn(this.jointNr, bytes );
		else {
			var delay = Std.int(Math.max(0, last_delay - (Timer.stamp() - last_time) * 1000))
			          + Std.int(localPeoteServer.netLag + 1000 * bytes.length / localPeoteServer.netSpeed);
			last_delay = delay; // TODO: for local testing put a LIMIT here for OVERFLOW!!!!!
			last_time = Timer.stamp();
			Timer.delay(function() {
				localPeoteServer._onData(localPeoteServer.jointNr, localUserNr , bytes);
			}, delay);
		}
	}

	public function sendChunk(bytes:Bytes):Void
	{
		if (bytes.length <= 0) throw("Error(sendChunk): can't send zero length chunk");
		else if (bytes.length > 65536)  throw("Error(sendChunk): max chunksize is 65536 Bytes");
		else {
			var chunksize:Bytes = Bytes.alloc(2);
			chunksize.setUInt16(0, bytes.length-1);
			send( chunksize );
			send( bytes );			
		}
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
		//trace("onData: " + bytes.length);
		if (events.onDataChunk != null) {
		
			if (input_pos == input_end) { input_pos = input_end = 0; }
			
			//var debugOut = "";for (i in 0...bytes.length) debugOut += bytes.get(i) + " ";trace("data:" + debugOut);
			if (input_end + bytes.length > input.length) trace("ERROR Client: out of BOUNDS");
			input.blit(input_end, bytes, 0, bytes.length );
			
			input_end += bytes.length;
			
			if (chunk_size == 0 && input_end-input_pos >=2 ) {
				chunk_size = input.getUInt16(input_pos) + 1; // read chunk size
				//trace("chunksize readed:" + chunk_size, input.get(input_pos),input.get(input_pos+1));
				input_pos += 2;
			}
			
			if ( chunk_size != 0 && input_end-input_pos >= chunk_size )
			{
				var b:Bytes = Bytes.alloc(chunk_size);
				//trace(" ---> onDataChunk: " + b.length + "Bytes ( start:"+input_pos+" end:"+input_end+ ")",b.get(0), b.get(1), b.get(2));
				b.blit(0, input, input_pos, chunk_size);
				input_pos += chunk_size;
				chunk_size = 0;
				events.onDataChunk(this, b );
			}
		}
		else events.onData(this, bytes);
	
	}
	
	// -----------------------------------------------------------------------------------
	// RPC -------------------------------------------------------------------------
	var remotes:Vector<Vector<PeoteBytesInput->Void>>; // stores all remote functions for incomming data
	
	public function setRemote(f:Dynamic, remoteId:Int = 0):Void
	{
		remotes[remoteId] = f.getRemotes();
		
		var bytes = Bytes.alloc(1); // TODO: max-amount-of-remote-objects
		bytes.set(0, remoteId);
		sendChunk(bytes);
	}
	
	public function remote(bytes:Bytes)
	{
		var input = new PeoteBytesInput(bytes);
		
		var remoteId = input.readByte(); trace("remoteId:"+remoteId);
		
		if (input.bytesLeft() == 0)
		{
			events.onRemote(this, remoteId);
		}
		else
		{
			// TODO: if there no more Bytes to read
			// trigger onDelRemote(this, objectId);
			
			var procedureNr = input.readByte(); //trace("procedureNr:"+procedureNr);
			// TODO for SECURITY: check max remotes and disconnect client if malicous
			remotes[remoteId][procedureNr](input);
		}
		
	}


}