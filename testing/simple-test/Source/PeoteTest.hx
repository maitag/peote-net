package;

import haxe.io.Bytes;
import openfl.display.Sprite;

import peote.net.PeoteServer;
import peote.net.PeoteClient;
import peote.net.Reason;

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
				logServer.log('onCreateJoint: Channel ${server.jointNr} created.\n');
			},
			onError: function(server:PeoteServer, userNr:Int, reason:Int) {
				logServer.log('onError: jointNr:${server.jointNr}, userNr:$userNr.\n');
				switch(reason) {
					case Reason.DISCONNECT:logServer.log("Can't connect to peote-server.");
					case Reason.CLOSE:     logServer.log("Connection to peote-server is closed.");
					case Reason.ID:        logServer.log("There is another channel with same ID. (or wrong ID)");
					case Reason.MAX:       logServer.log("Created to much channels on this server (max is 128).");
					case Reason.MALICIOUS: if (userNr > 0) logServer.log('User $userNr sending malicious data.'); // TODO: kick/bann user
				}
			},
			onUserConnect: function(server:PeoteServer, userNr:Int) {
				logServer.log('onUserConnect: jointNr:${server.jointNr}, userNr:$userNr.\n');
				server.sendChunk(userNr, prepareTestChunk('Hello Client $userNr'));
				//server.sendChunk(userNr, prepareFibonacciChunk());
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
				logServer.log('onUserDisconnect: jointNr:${server.jointNr}, userNr:$userNr');
				switch (reason) {
					case Reason.CLOSE:      logServer.log("User leaves channel.");
					case Reason.DISCONNECT: logServer.log("User disconnected from peote-server.");
				}
			},
			onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes) {
				logServer.log('Chunk arrives from joint ${server.jointNr}, user $userNr - chunk size is ${bytes.length}');
				ouputChunk( bytes, logServer );
			}
		});
			
		if (!peoteServer.offline) logServer.log("trying to connect to peote-server...");
		peoteServer.create("localhost", 7680, "testserver");
		#end
		
		#if (client || (!server))
		var peoteClient = new PeoteClient({
			
			onEnter: function(client:PeoteClient) {
				logClient.log('onEnterJoint: Joint number ${client.jointNr} entered.\n');
				client.sendChunk( prepareTestChunk('Hello Server'));
				//client.sendChunk( prepareFibonacciChunk());
			},
			onError: function(client:PeoteClient, reason:Int) {
				switch(reason) {
					case Reason.DISCONNECT:logClient.log("Can't connect to peote-server.");
					case Reason.CLOSE:     logClient.log("Connection to peote-server is closed.");
					case Reason.ID:        logClient.log("No channel with this ID to enter.");
					case Reason.MAX:       logClient.log("Entered to much channels on this server (max is 128)");
					case Reason.FULL:      logClient.log("Channel is full (max of 256 users already connected).");
					case Reason.MALICIOUS: logClient.log("Malicious data.");
				}
			},
			onDisconnect: function(client:PeoteClient, reason:Int) {
				logClient.log('onDisconnect from jointNr=${client.jointNr}');
				switch (reason) {
					case Reason.CLOSE:     logClient.log("Channel closed by creator.");
					case Reason.DISCONNECT:logClient.log("Channel-creator disconnected.");
					//case Reason.KICK: logClient.log("Kicked by channel-owner."); // TODO
				}
			},
			onDataChunk: function(client:PeoteClient, bytes:Bytes) {
				logClient.log('Chunk arrives from joint ${client.jointNr} - chunk size is ${bytes.length}');
				ouputChunk( bytes, logClient );
			}
		});
			
		#if client logClient.log("trying to connect to peote-server..."); #end
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
		output.writeFloat(1.2345678901234);
		output.writeDouble(1.2345678901234);
		
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
