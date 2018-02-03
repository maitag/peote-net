package test;

import haxe.io.Bytes;
import haxe.Timer;

/**
 * by Sylvio Sell - Rostock 2018
 */

import peote.net.PeoteServer;
import peote.net.PeoteClient;
import peote.net.PeoteServerEvents;
import peote.net.PeoteClientEvents;

class Stress
{

	var host:String;
	var port:Int;
	
	var serverEvents:PeoteServerEvents;
	var clientEvents:PeoteClientEvents;
	
	var maxServers:Int;
	var maxClients:Int;

	var maxChannel:Int = 10;
	var channelName:String;
	
	var activeServers:Int = 0;
	var activeClients:Int = 0;
	
	var lastSendedBytes:Map<PeoteClient, Bytes>;
	
	var log:String->Int->Int->Void;
	
	public function new(host:String, port:Int, log:String->Int->Int->Void, maxServers:Int, maxClients:Int, channelName:String, maxChannelToTryOut:Int) 
	{
		this.host = host;
		this.port = port;
		this.log = log;
		this.maxServers = maxServers;
		this.maxClients = maxClients;
		this.channelName = channelName;
		maxChannel = maxChannelToTryOut;
		
		lastSendedBytes = new Map<PeoteClient, Bytes>();
		
		serverEvents = {
			onCreateJoint: function(server:PeoteServer) {
				log('Channel ${server.jointNr} created. ("$channelName${server.jointId}")', 0, server.jointNr);
				Timer.delay(createNext, 100);
			},
			onCreateJointError: function(server:PeoteServer, error:Int) {
				switch(error) {
					case -2: log("Can't connect to peote-server.", 0, server.jointNr);
					case -1: log("Disconnected from peote-server. ", 0, server.jointNr);
					case  2: //log("Another joint with same id exists.");
					default: log('Error: $error', 0, server.jointNr);
				}
				activeServers--;
				Timer.delay(createNext, 100);
			},
			onUserConnect: function(server:PeoteServer, userNr:Int) {
				log('New user connects: jointNr:${server.jointNr}, userNr=$userNr', 0, server.jointNr);
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
				log('User disconnects: jointNr=${server.jointNr}, userNr=$userNr', 0, server.jointNr);
				switch (reason) {
					case 0: log("User leaves channel.", 0, server.jointNr);
					case 1: log("User was disconnected.", 0, server.jointNr);
					default: log('Reason: $reason', 0, server.jointNr);
				}
			},
			onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes) {
				// echo: send data back
				log('Send ${bytes.length} Bytes back', 0, server.jointNr);
				server.sendChunk(userNr, bytes);
			}
		};
		// --------------------------------------------------------------------------
		clientEvents = {
			onEnterJoint: function(client:PeoteClient) {
				log('Connect: Channel ${client.jointNr} entered ("$channelName${client.jointId}")',1, client.jointNr);
				Timer.delay(enterNext, 100);
				sendRandomBytes(client);
			},
			onEnterJointError: function(client:PeoteClient, error:Int) {
				switch(error) {
					case 1:  //log("can't enter channel (channel not exists)",1);
					case 2:  //log("can't enter channel that is created byself",1);
					case -2: log("can't connect to peote-server",1, client.jointNr);
					case -1: log("disconnected from peote-server",1, client.jointNr);
					default: log('Error:$error',1, client.jointNr);
				}
				activeClients--;
				Timer.delay(enterNext, 100);
			},
			onDisconnect: function(client:PeoteClient, reason:Int) {
				log('Disconnect: jointNr:${client.jointNr}',1, client.jointNr);
				switch (reason) {
					case 0: log("Channel closed by owner",1, client.jointNr);
					case 1: log("Channel-owner disconnected",1, client.jointNr);
					default: log('Reason:$reason',1, client.jointNr);
				}
				activeClients--;
				Timer.delay(enterNext, 100);
			},
			onDataChunk: function(client:PeoteClient, bytes:Bytes) {
				// check if data is same as send before
				var diff:Int = bytes.compare( lastSendedBytes.get(client));
				if ( diff == 0 ) {
					log('Successfully recieve ${bytes.length} Bytes',1, client.jointNr);
					Timer.delay(function() {sendRandomBytes(client); }, 100);
					//sendRandomBytes(client);
				}
				else log('ERROR: recieve data (${bytes.length} Bytes) not consistent ($diff) :',1, client.jointNr);
			}
		};

		createNext();
		enterNext();
		
	}

	var created:Int = -1;
	public function createNext():Void {
		if (activeServers < maxServers) {
			new PeoteServer(serverEvents).createJoint(host, port, channelName + (++created % maxChannel));
			activeServers++;
		}
	}
	
	var entered:Int = -1;
	public function enterNext():Void {
		if (activeClients < maxClients) {
			new PeoteClient(clientEvents).enterJoint(host, port, channelName + (++entered % maxChannel));
			activeClients++;
		}
	}
	
	public function sendRandomBytes(client:PeoteClient):Void {
		var bytes:Bytes = TestBytes.ofRandom(Std.int(1+Math.random()*5000)); // todo: 30 000 get out of bonds in buffers
		//var bytes:Bytes = TestBytes.ofRandom(1); // todo: 30 000 get out of bonds in buffers
		log('Send ${bytes.length} Bytes',1, client.jointNr);
		lastSendedBytes.set(client, bytes);
		client.sendChunk( bytes );
	}

}