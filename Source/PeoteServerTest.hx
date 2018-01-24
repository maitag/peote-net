package;

import lime.app.Application;

import peote.net.PeoteServer;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;
import peote.bridge.PeoteSocketBridge;

class PeoteServerTest extends Application {
	
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
		var peoteServer = new PeoteServer({
				onCreateJoint: function(server:PeoteServer) {
					trace('onCreateJoint: Channel ${server.jointNr} created.');
				},
				onCreateJointError: function(server:PeoteServer, error:Int) {
					trace("onCreateJointError:");
					switch(error) {
						case -2: trace("Can't connect to peote-server.");
						case -1: trace("Disconnected from peote-server.");
						case  2: trace("Another joint with same id exists.");
						default: trace(error);
					}
				},
				onUserConnect: function(server:PeoteServer, userNr:Int) {
					trace('onUserConnect: jointNr:${server.jointNr}, userNr:$userNr');
					sendTestData(server, userNr);
				},
				onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
					trace('onUserDisconnect: jointNr:${server.jointNr}, userNr:$userNr');
					switch (reason) {
						case 0: trace("User leaves channel.");
						case 1: trace("User was disconnected.");
						default: trace('Reason: $reason');
					}
				},
				//onData: onData
				onDataChunk: onDataChunk
			});
			
		trace("trying to connect to peote-server...");
		peoteServer.createJoint("localhost", 7680, "testserver");
		
		
	}

	// ---------------------------------------------------------
	// -------------------- SEND DATA --------------------------
	// ---------------------------------------------------------

	public function sendTestData(server:PeoteServer, userNr:Int):Void
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
		
		server.sendChunk(userNr, output);
	}
		
	// ---------------------------------------------------------
	// -------------------- RECIEVE DATA -----------------------
	// ---------------------------------------------------------
		
	public function onDataChunk(server:PeoteServer, userNr:Int, input:PeoteBytesInput, chunkSize:Int ):Void 
	{
		var chunkEnd:Int = input.bytesLeft() - chunkSize;
		trace('Chunk arrives from joint ${server.jointNr} - chunk size is $chunkSize'); // never read less or more that chunksize!

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
				while (input.bytesLeft() > chunkEnd)
				{
					trace(input.readInt32());
				}
				
			default: trace("unknown command chunk");
		}
		
	}
	
	
}
