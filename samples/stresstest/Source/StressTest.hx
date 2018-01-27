package;


import haxe.Timer;
import openfl.display.Sprite;

import peote.io.PeoteBytesInput;
import peote.io.PeoteBytesOutput;
import peote.net.PeoteServer;
import peote.net.PeoteClient;
import peote.net.PeoteServerEvents;
import peote.net.PeoteClientEvents;

import ui.OutputText;

import peote.bridge.PeoteSocketBridge;

class StressTest extends Sprite {
	
	var logServer:OutputText;
	var logClient:OutputText;
	
	var serverEvents:PeoteServerEvents;
	var clientEvents:PeoteClientEvents;
	
	var maxChannel:Int = 10;
	
	var maxServers:Int = 2;
	var maxClients:Int = 2;
	
	var activeServers:Int = 0;
	var activeClients:Int = 0;
	
	public function new () {
		
		super ();
		
		logServer = new OutputText(5, 5, 350, 600);
		addChild(logServer);
		
		logClient = new OutputText(360, 5, 350, 600);
		addChild(logClient);		
		
		PeoteSocketBridge.load( {
			onload: onLoadSocketBridge,
			preferWebsockets: true,
			onfail: function() { logServer.log("Browser doesn't support flash- or websockets"); }
		});
	}
	
	public function onLoadSocketBridge():Void
	{
		serverEvents = {
			onCreateJoint: function(server:PeoteServer) {
				logServer.log('Channel ${server.jointNr} created. ("testserver${server.jointId}")');
				Timer.delay(createNext, 500);
			},
			onCreateJointError: function(server:PeoteServer, error:Int) {
				switch(error) {
					case -2: logServer.log("Can't connect to peote-server.");
					case -1: logServer.log("Disconnected from peote-server.");
					case  2: //logServer.log("Another joint with same id exists.");
					default: logServer.log('Error: $error');
				}
				activeServers--;
				Timer.delay(createNext, 500);
			},
			onUserConnect: function(server:PeoteServer, userNr:Int) {
				logServer.log('New user connects: jointNr:${server.jointNr}, userNr=$userNr');
				// send something to client
				var output:PeoteBytesOutput = new PeoteBytesOutput();
				output.writeString('Hello Client $userNr');
				server.sendChunk( userNr, output );
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
				logServer.log('User disconnects: jointNr=${server.jointNr}, userNr=$userNr');
				switch (reason) {
					case 0: logServer.log("User leaves channel.");
					case 1: logServer.log("User was disconnected.");
					default: logServer.log('Reason: $reason');
				}
			},
			onDataChunk: function(server:PeoteServer, userNr:Int, input:PeoteBytesInput, chunkSize:Int) {
				trace( input.readString() );
			}
		};
		// --------------------------------------------------------------------------
		clientEvents = {
			onEnterJoint: function(client:PeoteClient) {
				logClient.log('Connect: Channel ${client.jointNr} entered ("testserver${client.jointId}")');
				Timer.delay(enterNext, 500);
				
				// send something to server
				var output:PeoteBytesOutput = new PeoteBytesOutput();
				output.writeString("Hello Server");
				client.sendChunk( output );
			},
			onEnterJointError: function(client:PeoteClient, error:Int) {
				switch(error) {
					case 1:  //logClient.log("can't enter channel (channel not exists)");
					case 2:  //logClient.log("can't enter channel that is created byself");
					case -2: logClient.log("can't connect to peote-server");
					case -1: logClient.log("disconnected from peote-server");
					default: logClient.log('Error:$error');
				}
				activeClients--;
				Timer.delay(enterNext, 500);
			},
			onDisconnect: function(client:PeoteClient, reason:Int) {
				logClient.log('Disconnect: jointNr:${client.jointNr}');
				switch (reason) {
					case 0: logClient.log("Channel closed by owner");
					case 1: logClient.log("Channel-owner disconnected");
					default: logClient.log('Reason:$reason');
				}
				activeClients--;
				Timer.delay(enterNext, 500);
			},
			onDataChunk: function(client:PeoteClient, input:PeoteBytesInput, chunk_size:Int) {
				trace( input.readString() );
			}
		};

		createNext();
		enterNext();
	}
	
	var created:Int = -1;
	public function createNext():Void {
		if (activeServers < maxServers) {
			new PeoteServer(serverEvents).createJoint("localhost", 7680, "testserver" + (++created % maxChannel));
			activeServers++;
		}
	}
	
	var entered:Int = -1;
	public function enterNext():Void {
		if (activeClients < maxClients) {
			new PeoteClient(clientEvents).enterJoint("localhost", 7680, "testserver" + (++entered % maxChannel));
			activeClients++;
		}
	}
	

}
