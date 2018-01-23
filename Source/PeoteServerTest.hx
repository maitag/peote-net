package;

import lime.app.Application;

import peote.net.PeoteServer;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;
import peote.bridge.PeoteSocketBridge;

class PeoteServerTest extends Application {
	
	public var peoteServer:PeoteServer;
		
	public function new ()
	{
		super();
		// Fallback for swf-bridge or websockets
		// only relevant for js or flash targets
		// (cpp will ignore this and opens directly tcp socket immediatly)
		PeoteSocketBridge.load( {
			onload: openSocket,
			//preferWebsockets: true,
			onfail: function() { trace("Browser doesn't support flash- or websockets"); }
		});
	}
	
	public function openSocket():Void
	{		
		peoteServer = new PeoteServer({
				onCreateJoint: function(jointNr:Int) {
					trace('onCreateJoint: Joint number $jointNr created.');
				},
				onCreateJointError: function(errorNr:Int) {
					trace("onCreateJointError:");
					switch(errorNr) {
						case -2: trace("can't connect to peote-server");
						case -1: trace("disconnected from peote-server");
						case  2: trace("another joint with same id");
						default: trace(errorNr);
					}					
				},
				onUserConnect: function(jointNr:Int, userNr:Int) {
					trace("onUserConnect: jointNr=" + jointNr + ", userNr=" + userNr);
					sendTestData(userNr);
				},
				onUserDisconnect: function(jointNr:Int, userNr:Int, reason:Int) {
					trace("onUserDisconnect: jointNr="+jointNr+", userNr="+userNr);
					switch (reason) {
						case 0: trace(" joint-user closed joint!");
						case 1: trace(" joint-user was disconnected!");
						default: trace("reason="+reason);
					}
				},
				//onData: onData
				onDataChunk: onDataChunk
			});
			
		trace("trying to connect to peote-server...");
		peoteServer.createJoint("localhost", 7680, "testserver");
		
		// TODO: multiple joints without new instance
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
		
		peoteServer.sendChunk(userNr, output);
	}
		
	// ---------------------------------------------------------
	// -------------------- RECIEVE DATA -----------------------
	// ---------------------------------------------------------
		
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
