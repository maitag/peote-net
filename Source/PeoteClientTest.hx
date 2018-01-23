package;

import lime.app.Application;

import peote.net.PeoteClient;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;
import peote.bridge.PeoteSocketBridge;


class PeoteClientTest extends Application {
	
	public var peoteClient:PeoteClient;
	
	var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	//public var chunk_size:Int = 0;
	
	public function new ()
	{
		super();
		// Fallback for swf-bridge or websockets
		// only relevant for js or flash targets
		// (cpp will ignore this and opens directly tcp socket immediatly)
		PeoteSocketBridge.load( {
			onload: openSocket,
			preferWebsockets: true,
			onfail: function() { trace("Browser doesn't support flash- or websockets"); }
		});
	}
	
	public function openSocket():Void
	{
		
		inputBuffer = new PeoteBytesInput();

		peoteClient = new PeoteClient({
				onEnterJoint: function(jointNr:Int) {
					trace('onEnterJoint: Joint number $jointNr entered');
					sendTestData();
				},
				onEnterJointError: function(errorNr:Int) {
					switch(errorNr) {
						case 1:  trace("can't enter joint");
						case -2: trace("can't connect to peote-server");
						case -1: trace("disconnected from peote-server");
						default: trace("onEnterJointError:"+errorNr);
					}					
				},
				onDisconnect: function(jointNr:Int, reason:Int) {
					trace("onDisconnect: jointNr="+jointNr);
					switch (reason) {
						case 0: trace(" joint-owner closed joint!");
						case 1: trace(" joint-owner was disconnected!");
						case 2: trace(" you was kicked by joint-owner!"); // TODO ?
						default: trace("reason="+reason);
					}
				},
				onDataChunk: onDataChunk
				//onData: onData
			});
			
		trace("trying to connect to peote-server...");
		peoteClient.enterJoint("localhost", 7680, "testserver");
		
		// TODO: multiple joints without new instance
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
		
		peoteClient.sendChunk(output);
		
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
		peoteClient.sendChunk(output);
	}


	// ---------------------------------------------------------
	// -------------------- RECIEVE DATA -----------------------
	// ---------------------------------------------------------
	
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
