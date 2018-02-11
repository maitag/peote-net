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
	
	var minBytes:Int;
	var maxBytes:Int;
	
	var delayTime:Int;
	
	var verbose:Bool;
	var stopOnError:Bool;

	var lastSendedBytes:Map<PeoteClient, Bytes>;
	
	var log:String->Int->Int->Void;
	
	public function new(host:String, port:Int, log:String->Int->Int->Void,
						maxServers:Int, maxClients:Int, channelName:String,
						maxChannelToTryOut:Int, minBytes:Int, maxBytes:Int,
						delayTime:Int=0, verbose:Bool = true, stopOnError:Bool = false ) 
	{
		this.host = host;
		this.port = port;
		this.log = log;
		this.maxServers = maxServers;
		this.maxClients = maxClients;
		this.channelName = channelName;
		this.minBytes = minBytes;
		this.maxBytes = maxBytes;
		this.delayTime = delayTime;
		this.verbose = verbose;
		this.stopOnError = stopOnError;
		
		maxChannel = maxChannelToTryOut;
		
		lastSendedBytes = new Map<PeoteClient, Bytes>();
		
		serverEvents = {
			onCreateJoint: function(server:PeoteServer) {
				log('Channel ${server.jointNr} created. ("${server.jointId}")', 0, server.jointNr);
				Timer.delay(createNext, 100);
			},
			onCreateJointError: function(server:PeoteServer, error:Int) {
				var isOk:Bool = false;
				switch(error) {
					case -2: log("Can't connect to peote-server.", 0, server.jointNr);
					case -1: log("Disconnected from peote-server. ", 0, server.jointNr);
					case  2: isOk = true;//log("Another joint with same id exists.");
					default: log('Error: $error', 0, server.jointNr);
				}
				activeServers--;
				if (!stopOnError || isOk) Timer.delay(createNext, 100);
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
				if (verbose) log('Send ${bytes.length} Bytes back', 0, server.jointNr);
				if (delayTime > 0) Timer.delay(function() {server.sendChunk(userNr, bytes); }, delayTime);
				else server.sendChunk(userNr, bytes);
			}
		};
		// --------------------------------------------------------------------------
		clientEvents = {
			onEnterJoint: function(client:PeoteClient) {
				log('Connect: Channel ${client.jointNr} entered ("${client.jointId}")',1, client.jointNr);
				Timer.delay(enterNext, 100);
				sendRandomBytes(client);
			},
			onEnterJointError: function(client:PeoteClient, error:Int) {
				var isOk:Bool = false;
				switch(error) {
					case 1:  isOk = true;//log("can't enter channel (channel not exists)",1);
					case 2:  isOk = true;//log("can't enter channel that is created byself",1);
					case -2: log("can't connect to peote-server",1, client.jointNr);
					case -1: log("disconnected from peote-server",1, client.jointNr);
					default: log('Error:$error',1, client.jointNr);
				}
				activeClients--;
				if (!stopOnError || isOk) Timer.delay(enterNext, 100);
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
					if (verbose) log('Successfully recieve ${bytes.length} Bytes',1, client.jointNr);
					if (delayTime>0) Timer.delay(function() {sendRandomBytes(client); }, delayTime);
					else sendRandomBytes(client);
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
		var bytes:Bytes = TestBytes.ofRandom(Std.int(minBytes+Math.random()*(1+maxBytes-minBytes)));
		//var bytes:Bytes = TestBytes.ofRandom(1); // todo: 30 000 get out of bonds in buffers
		if (verbose) log('Send ${bytes.length} Bytes',1, client.jointNr);
		lastSendedBytes.set(client, bytes);
		client.sendChunk( bytes );
	}

}