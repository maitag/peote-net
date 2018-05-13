package;

import haxe.io.Bytes;
import lime.app.Application;

#if server
import peote.net.PeoteServer;
#end

#if client
import peote.net.PeoteClient;
#end

import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;
import peote.bridge.PeoteSocketBridge;

class PeoteTest extends Application {
	
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
		#if !(server || client) trace("Use with -Dserver or -Dclient (use both to test direct connection)"); #end

		#if server
		var peoteServer = new PeoteServer({
			
				//offline: true, // do not open a socket (for direct client-connection in same app)
				//netLag: 400, // simmulates net response time (in milliseconds)
				//netSpeed: 1024, // simmulates net speed (in Bytes per second)
				
				onCreate: function(server:PeoteServer) {
					trace('onCreateJoint: Channel ${server.jointNr} created.');
				},
				onError: function(server:PeoteServer, error:Int) {
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
					server.sendChunk(userNr, prepareTestChunk('Hello Client $userNr'));
					//server.sendChunk(userNr, prepareFibonacciChunk());
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
				onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes) {
					trace('Chunk arrives from joint ${server.jointNr} - chunk size is ${bytes.length}');
					ouputChunk( bytes );
				}
			});
			
		if (!peoteServer.offline) trace("trying to connect to peote-server...");
		peoteServer.create("localhost", 7680, "testserver");
		#end
		
		#if client
		var peoteClient = new PeoteClient({
				onEnter: function(client:PeoteClient) {
					trace('onEnterJoint: Joint number ${client.jointNr} entered');
					client.sendChunk( prepareTestChunk('Hello Server'));
				},
				onError: function(client:PeoteClient, error:Int) {
					switch(error) {
						case 1:  trace("can't enter channel");
						case -2: trace("can't connect to peote-server");
						case -1: trace("disconnected from peote-server");
						default: trace('onEnterJointError:$error');
					}
				},
				onDisconnect: function(client:PeoteClient, reason:Int) {
					trace('onDisconnect: jointNr=${client.jointNr}');
					switch (reason) {
						case 0: trace("channel closed by owner");
						case 1: trace("channel-owner disconnected!");
						case 2: trace("kicked by channel-owner!"); // TODO ?
						default: trace('reason:$reason');
					}
				},
				//onData: onData
				onDataChunk: function(client:PeoteClient, bytes:Bytes) {
					trace('Chunk arrives from joint ${client.jointNr} - chunk size is ${bytes.length}');
					ouputChunk( bytes );
					//client.sendChunk( prepareFibonacciChunk());
				}
			});
			
		#if !server trace("trying to connect to peote-server..."); #end
		// if server is in same app all messages will go directly (not throught socket and proxyserver)
		peoteClient.enter("localhost", 7680, "testserver");
		#end
	}

	// ---------------------------------------------------------

	public function prepareTestChunk(message:String):Bytes
	{	
		var output:PeoteBytesOutput = new PeoteBytesOutput();
		output.writeString("DATATYPES");
		
		output.writeString(message);
		output.writeByte(255);
		output.writeUInt16(65535);
		output.writeInt16(32767);
		output.writeInt16(-32768);
		output.writeInt32(2147483647);
		output.writeInt32(-2147483648);
		output.writeFloat(1.2345678);
		output.writeDouble(1.2345678901234567890123456789);
		
		return output.getBytes();
	}
		
	public function prepareFibonacciChunk():Bytes
	{	
		var output:PeoteBytesOutput = new PeoteBytesOutput();
		output.writeString("FIBONACCI");
		
		var fib_pre:Int = 1; output.writeInt32(fib_pre);
		var fib:Int = 2; output.writeInt32(fib);
		
		while ( fib < 2147483648 - fib_pre )
		{
			fib = fib + fib_pre;
			fib_pre = fib - fib_pre;
			output.writeInt32(fib);
		}
		
		return output.getBytes();
	}
		
	// ---------------------------------------------------------
	
	public function ouputChunk( bytes:Bytes ):Void
	{
		var input:PeoteBytesInput = new PeoteBytesInput(bytes);
		var chunkEnd:Int = input.bytesLeft() - bytes.length;

		var command:String = input.readString();
		trace('-- Command chunk: "$command" ------');
		switch (command)
		{
			// do not read less or more than chunksize!
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
