package;


import haxe.Timer;
import haxe.io.Bytes;
import openfl.display.Sprite;

import peote.net.PeoteServer;
import peote.net.PeoteClient;
import peote.net.PeoteServerEvents;
import peote.net.PeoteClientEvents;

import ui.OutputText;

import peote.bridge.PeoteSocketBridge;

class StressTest extends Sprite {
	
	var host:String = "localhost";
	var port:Int = 7680;
	
	var logServer:OutputText;
	var logClient:OutputText;
	
	var serverEvents:PeoteServerEvents;
	var clientEvents:PeoteClientEvents;
	
	var maxChannel:Int = 10;
	
	var maxServers:Int = 1;
	var maxClients:Int = 2;
	
	var activeServers:Int = 0;
	var activeClients:Int = 0;
	
	var lastSendedBytes:Map<PeoteClient, Bytes>;
	
	public function new () {
		
		super ();
		
		logServer = new OutputText(3, 3, 280, 550);
		addChild(logServer);
		
		logClient = new OutputText(290, 5, 280, 550);
		addChild(logClient);
		
		PeoteSocketBridge.load( {
			onload: onLoadSocketBridge,
			preferWebsockets: true,
			onfail: function() { logServer.log("Browser doesn't support flash- or websockets"); }
		});
	}
	
	public function onLoadSocketBridge():Void
	{
		lastSendedBytes = new Map<PeoteClient, Bytes>();
		
		serverEvents = {
			onCreateJoint: function(server:PeoteServer) {
				logServer.log('Channel ${server.jointNr} created. ("testserver${server.jointId}")');
				Timer.delay(createNext, 100);
			},
			onCreateJointError: function(server:PeoteServer, error:Int) {
				switch(error) {
					case -2: logServer.log("Can't connect to peote-server.");
					case -1: logServer.log("Disconnected from peote-server. "+error);
					case  2: //logServer.log("Another joint with same id exists.");
					default: logServer.log('Error: $error');
				}
				activeServers--;
				Timer.delay(createNext, 100);
			},
			onUserConnect: function(server:PeoteServer, userNr:Int) {
				logServer.log('New user connects: jointNr:${server.jointNr}, userNr=$userNr');
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
				logServer.log('User disconnects: jointNr=${server.jointNr}, userNr=$userNr');
				switch (reason) {
					case 0: logServer.log("User leaves channel.");
					case 1: logServer.log("User was disconnected.");
					default: logServer.log('Reason: $reason');
				}
			},
			onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes) {
				// echo: send data back
				logServer.log('Send ${bytes.length} Bytes back');
				server.sendChunk(userNr, bytes);
			}
		};
		// --------------------------------------------------------------------------
		clientEvents = {
			onEnterJoint: function(client:PeoteClient) {
				logClient.log('Connect: Channel ${client.jointNr} entered ("testserver${client.jointId}")');
				Timer.delay(enterNext, 100);
				sendRandomBytes(client);
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
				Timer.delay(enterNext, 100);
			},
			onDisconnect: function(client:PeoteClient, reason:Int) {
				logClient.log('Disconnect: jointNr:${client.jointNr}');
				switch (reason) {
					case 0: logClient.log("Channel closed by owner");
					case 1: logClient.log("Channel-owner disconnected");
					default: logClient.log('Reason:$reason');
				}
				activeClients--;
				Timer.delay(enterNext, 100);
			},
			onDataChunk: function(client:PeoteClient, bytes:Bytes) {
				// check if data is same as send before
				var diff:Int = bytes.compare( lastSendedBytes.get(client));
				if ( diff == 0 ) {
					logClient.log('Successfully recieve ${bytes.length} Bytes');
					Timer.delay(function() {sendRandomBytes(client); }, 100);
					//sendRandomBytes(client);
				}
				else logClient.log('ERROR: recieve data (${bytes.length} Bytes) not consistent ($diff) :');
			}
		};

		createNext();
		enterNext();
	}
	
	var created:Int = -1;
	public function createNext():Void {
		if (activeServers < maxServers) {
			new PeoteServer(serverEvents).createJoint(host, port, "testserver" + (++created % maxChannel));
			activeServers++;
		}
	}
	
	var entered:Int = -1;
	public function enterNext():Void {
		if (activeClients < maxClients) {
			new PeoteClient(clientEvents).enterJoint(host, port, "testserver" + (++entered % maxChannel));
			activeClients++;
		}
	}
	
	public function sendRandomBytes(client:PeoteClient):Void {
		var bytes:Bytes = TestBytes.ofRandom(Std.int(1+Math.random()*3000)); // todo: 30 000 get out of bonds in buffers
		logClient.log('Send ${bytes.length} Bytes');
		lastSendedBytes.set(client, bytes);
		client.sendChunk( bytes );
	}
	

}
