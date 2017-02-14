package;

import lime.app.Application;
import haxe.Timer;

import haxe.io.Bytes;

import peote.net.PeoteClient;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;
import bridge.PeoteSocketBridge;


class PeoteClientTest extends Application {
	
	public var peoteClient:PeoteClient;
	
	var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	public var chunk_size:Int = 0;
	
	public function new ()
	{
		super();
		// Fallback for swf-bridge or websockets
		// only relevant for js or flash targets
		// (cpp will ignore this and opens directly tcp socket immediatly)
		PeoteSocketBridge.load( {
			onload: openSocket,
			//prefereWebsockets: true,
			onfail: function() { trace("Browser doesn't support flash- or websockets"); }
		});
	}
	
	public function openSocket():Void
	{
		
		inputBuffer = new PeoteBytesInput();
		
		peoteClient = new PeoteClient({
				onEnterJoint: function(jointNr:Int) {
					trace("onEnterJoint: jointNr=" + jointNr);
					sendTestData();
				},
				onEnterJointError: function(errorNr:Int) {
					trace("onEnterJointError:"+errorNr);
				},
				onDisconnect: function(jointNr:Int, reason:Int) {
					trace("onDisconnect: jointNr="+jointNr+", reason="+reason);
				},
				onData: onData
			});
			
		peoteClient.enterJoint("localhost", 7680, "testserver");
		
	}
	
	// ---------------------------------------------------------
	// -------------------- SEND DATA --------------------------
	// ---------------------------------------------------------

	public inline function sendTestData():Void
	{
		var output:PeoteBytesOutput = new PeoteBytesOutput();
		output.writeString("DATATYPES");

		output.writeString("Hello Server");
		output.writeByte(255);
		output.writeUInt16(65535);
		output.writeInt16(32767);
		output.writeInt16(-32768);
		output.writeInt32(2147483647);
		output.writeInt32(-2147483648);
		output.writeFloat(1.2345678);
		output.writeDouble(1.2345678901234567890123456789);
		
		sendChunk(output);
		
		// -------- send another chunk -----------
		
		output = new PeoteBytesOutput();
		output.writeString("FIBONACCI");
		
		var fib_pre:Int = 1; output.writeInt32(fib_pre);
		var fib:Int = 2; output.writeInt32(fib);
		
		while ( fib < 2147483648 - fib_pre )
		{
			fib = fib + fib_pre;
			fib_pre = fib - fib_pre;
			output.writeInt32(fib);
		}
		sendChunk(output);
	}

	public inline function sendChunk(output:PeoteBytesOutput):Void
	{	
		var chunksize:PeoteBytesOutput = new PeoteBytesOutput(); // TODO: optimize
		chunksize.writeUInt16(output.length);
		peoteClient.send( chunksize.getBytes() );
		peoteClient.send( output.getBytes() );
	}

	// ---------------------------------------------------------
	// -------------------- RECIEVE DATA -----------------------
	// ---------------------------------------------------------
	
	
	// read full chunk
	public function onData(jointNr:Int, bytes:Bytes ):Void 
	{	
		inputBuffer.append( bytes );
		trace('inputBuffer size: ${inputBuffer.length}');
		
		if (chunk_size == 0 && inputBuffer.bytesLeft() >=2 ) {
			chunk_size = inputBuffer.readUInt16(); // read chunk size
			trace('read chunk size: $chunk_size');
		}
		
		trace('bytesLeft: ${inputBuffer.bytesLeft()}');
		if ( chunk_size != 0 && inputBuffer.bytesLeft() >= chunk_size )
		{
			onDataChunk(jointNr, inputBuffer, chunk_size );
			chunk_size = 0;
		}
	}
	
	// this will called if full chunk arrives
	public inline function onDataChunk(jointNr:Int, input:PeoteBytesInput, chunk_size:Int):Void 
	{
		trace("onData: jointNr=" + jointNr);
		
		trace('string     : '+input.readString());
		trace('max Byte   : '+input.readByte());
		trace('max UInt16 : '+input.readUInt16());
		trace('max Int16  : '+input.readInt16());
		trace('min Int16  : '+input.readInt16());
		trace('max Int32  : '+input.readInt32());
		trace('min Int32  : '+input.readInt32());
		trace('float      : '+input.readFloat());
		trace('double     : '+input.readDouble());
	}

	
}
