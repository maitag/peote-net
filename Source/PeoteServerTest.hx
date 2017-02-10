package;

import haxe.io.StringInput;
import lime.app.Application;
import haxe.Timer;

import haxe.io.Bytes;

import peote.net.PeoteServer;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;
import bridge.PeoteSocketBridge;

class PeoteServerTest extends Application {
	
	public var peoteServer:PeoteServer;
	
	public var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	public var chunk_size:Int = 0;
	
	public function new ()
	{
		super();
		// Fallback for swf-bridge or websockets
		// only relevant for js or flash targets
		// (cpp will ignore this and opens directly tcp socket immediatly)
		PeoteSocketBridge.load( {
			onload: openSocket,
			//prefareWebsockets: true,
			onfail: function() { trace("Browser doesn't support flash- or websockets"); }
		});
	}
	
	public function openSocket():Void
	{

		inputBuffer = new PeoteBytesInput();
		
		peoteServer = new PeoteServer({
				onCreateJoint: function(jointNr:Int) {
					trace("onCreateJoint:"+jointNr);
				},
				onCreateJointError: function(errorNr:Int) {
					trace("onCreateJointError:"+errorNr);
				},
				onUserConnect: function(jointNr:Int, userNr:Int) {
					trace("onUserConnect: jointNr=" + jointNr + ", userNr=" + userNr);
					sendTestData(userNr);
				},
				onUserDisconnect: function(jointNr:Int, userNr:Int, reason:Int) {
					trace("onUserDisconnect: jointNr="+jointNr+", userNr="+userNr+", reason="+reason);
				},
				onData: onData
			});
			
		peoteServer.createJoint("localhost", 7680, "testserver");
		
	}

	// ---------------------------------------------------------
	// -------------------- SEND DATA --------------------------
	// ---------------------------------------------------------

	public function sendTestData(userNr:Int):Void
	{	
		var output:PeoteBytesOutput = new PeoteBytesOutput();
		output.writeString("Hello Client " + userNr);
		output.writeByte(255);
		output.writeUInt16(65535);
		output.writeInt16(32767);
		output.writeInt16(-32768);
		output.writeInt32(2147483647);
		output.writeInt32(-2147483648);
		output.writeFloat(1.2345678);
		output.writeDouble(1.2345678901234567890123456789);
		
		sendChunk(userNr, output);
	}
	
	public function sendChunk(userNr:Int, output:PeoteBytesOutput):Void
	{	
		var chunksize:PeoteBytesOutput = new PeoteBytesOutput();
		chunksize.writeUInt16(output.length);
		peoteServer.send(userNr, chunksize.getBytes() );
		peoteServer.send(userNr, output.getBytes() );
	}
	
	
	// ---------------------------------------------------------
	// -------------------- RECIEVE DATA -----------------------
	// ---------------------------------------------------------
	
	
	// read full chunk
	public function onData(jointNr:Int, userNr:Int, bytes:Bytes ):Void 
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
			onDataChunk(jointNr, userNr, inputBuffer, chunk_size );
			chunk_size = 0;
		}
	}
	
	// this will called if full chunk arrives
	public function onDataChunk(jointNr:Int, userNr:Int, input:PeoteBytesInput, chunk_size:Int ):Void 
	{
		var chunk_end:Int = input.bytesLeft() - chunk_size;
		trace('Chunk arrives from joint $jointNr - chunk size is $chunk_size'); // never read less or more that chunksize!

		var command:String = input.readString();
		trace('-- Command chunk: "$command" ------');
		switch (command)
		{
			
			case "DATATYPES":
				trace('string     : '+input.readString());
				trace('max Byte   : '+input.readByte());
				trace('max UInt16 : '+input.readUInt16());
				trace('max Int16  : '+input.readInt16());
				trace('min Int16  : '+input.readInt16());
				trace('max Int32  : '+input.readInt32());
				trace('min Int32  : '+input.readInt32());
				trace('float      : '+input.readFloat());
				trace('double     : '+input.readDouble());
				
			case "FIBONACCI":
				while (input.bytesLeft() > chunk_end)
				{
					trace(input.readInt32());
				}
				
			default: trace("unknown command chunk");
		}
		
	}
	
	
}
