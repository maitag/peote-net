package;

import haxe.io.Bytes;
import openfl.display.Sprite;

import peote.net.PeoteServer;
import peote.net.PeoteClient;

import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;
import peote.bridge.PeoteSocketBridge;

import ui.OutputText;

class PeoteTest extends Sprite {
	
	var logServer:OutputText;
	var logClient:OutputText;
	
	public function new ()
	{
		super();
		logServer = new OutputText(3, 3, 380, 550);
		addChild(logServer);
		
		logClient = new OutputText(390, 5, 380, 550);
		addChild(logClient);
		
		#if ((!server) && (!client))
		openSocket();
		#else
		// Fallback for swf-bridge or websockets
		// only relevant for js or flash targets
		// (cpp will ignore this and opens directly tcp socket immediatly)
		PeoteSocketBridge.load( {
			onload: openSocket,
			preferWebsockets: true,
			onfail: function() { logServer.log("Browser doesn't support flash- or websockets" ); }
		});
		#end
	}
	
	public function openSocket():Void
	{
		#if (server || (!client))
		var peoteServer = new PeoteServer({
			
			#if (!server)
			offline:true, // do not open a socket (for direct client-connection in same app)
			netLag:10,    // simmulates net response time (in milliseconds)
			netSpeed:1024 * 1024 * 512, //[512KB] per second - simmulates net speed (in Bytes per second)
			#end
			
			onCreate: function(server:PeoteServer) {
				logServer.log('onCreateJoint: Channel ${server.jointNr} created.');
			},
			onError: function(server:PeoteServer, error:Int) {
				switch(error) {
					case -2: logServer.log("Can't connect to peote-server.");
					case -1: logServer.log("Disconnected from peote-server.");
					case  2: logServer.log("Another joint with same id exists.");
					default: logServer.log('onCreateJointError:$error');
				}
			},
			onUserConnect: function(server:PeoteServer, userNr:Int) {
				logServer.log('onUserConnect: jointNr:${server.jointNr}, userNr:$userNr');
				server.sendChunk(userNr, prepareTestChunk('Hello Client $userNr'));
				//server.sendChunk(userNr, prepareFibonacciChunk());
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
				logServer.log('onUserDisconnect: jointNr:${server.jointNr}, userNr:$userNr');
				switch (reason) {
					case 0: logServer.log("User leaves channel.");
					case 1: logServer.log("User was disconnected.");
					default: logServer.log('Reason: $reason');
				}
			},
			//onData: onData
			onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes) {
				logServer.log('Chunk arrives from joint ${server.jointNr} - chunk size is ${bytes.length}');
				ouputChunk( bytes, logServer );
			}
		});
			
		if (!peoteServer.offline) logServer.log("trying to connect to peote-server...");
		peoteServer.create("localhost", 7680, "testserver");
		#end
		
		#if (client || (!server))
		var peoteClient = new PeoteClient({
			
			onEnter: function(client:PeoteClient) {
				logClient.log('onEnterJoint: Joint number ${client.jointNr} entered');
				client.sendChunk( prepareTestChunk('Hello Server'));
			},
			onError: function(client:PeoteClient, error:Int) {
				switch(error) {
					case 1:  logClient.log("can't enter channel");
					case -2: logClient.log("can't connect to peote-server");
					case -1: logClient.log("disconnected from peote-server");
					default: logClient.log('onEnterJointError:$error');
				}
			},
			onDisconnect: function(client:PeoteClient, reason:Int) {
				logClient.log('onDisconnect: jointNr=${client.jointNr}');
				switch (reason) {
					case 0: logClient.log("channel closed by owner");
					case 1: logClient.log("channel-owner disconnected!");
					case 2: logClient.log("kicked by channel-owner!"); // TODO ?
					default: logClient.log('reason:$reason');
				}
			},
			//onData: onData
			onDataChunk: function(client:PeoteClient, bytes:Bytes) {
				logClient.log('Chunk arrives from joint ${client.jointNr} - chunk size is ${bytes.length}');
				ouputChunk( bytes, logClient );
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
	
	public function ouputChunk( bytes:Bytes, log:OutputText ):Void
	{
		var input:PeoteBytesInput = new PeoteBytesInput(bytes);
		var chunkEnd:Int = input.bytesLeft() - bytes.length;

		var command:String = input.readString();
		log.log('-- Command chunk: "$command" ------');
		switch (command)
		{
			// do not read less or more than chunksize!
			case "DATATYPES":
				log.log('string     : '+input.readString());
				log.log('max Byte   : '+input.readByte());
				log.log('max UInt16 : '+input.readUInt16());
				log.log('max Int16  : '+input.readInt16());
				log.log('min Int16  : '+input.readInt16());
				log.log('max Int32  : '+input.readInt32());
				log.log('min Int32  : '+input.readInt32());
				log.log('float      : '+input.readFloat());
				log.log('double     : '+input.readDouble());
				
			case "FIBONACCI":
				while (input.bytesLeft() > chunkEnd)
				{
					log.log(""+input.readInt32());
				}
				
			default: log.log("unknown command chunk");
		}
		
	}
	
	
}
