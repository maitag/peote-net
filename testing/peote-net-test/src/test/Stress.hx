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
import peote.net.Reason;

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
			maxChunkSize: maxBytes,
			onCreate: function(server:PeoteServer) {
				log('Channel ${server.jointNr} created. ("${server.jointId}")', 0, server.jointNr);
				Timer.delay(createNext, 100);
			},
			onError: function(server:PeoteServer, userNr:Int, reason:Reason) {
				var isOk:Bool = false;
				switch(reason) {
					case DISCONNECT:log("Can't connect to peote-server.", 0, server.jointNr);
					                       //stopOnError = true;
					case CLOSE:     log("Connection to peote-server is closed.", 0, server.jointNr);
					case ID:        log("There is another channel with same ID. (or wrong ID)", 0, server.jointNr);
					                       isOk = true;
					case MAX:       log("Created to much channels on this server (max is 128).", 0, server.jointNr);
					case MALICIOUS: if (userNr > 0) log('User $userNr sending malicious data.', 0, server.jointNr); // TODO: kick/bann user

					default: trace(reason);
				}
				activeServers--;
				if (!stopOnError || isOk) Timer.delay(createNext, 100);
			},
			onUserConnect: function(server:PeoteServer, userNr:Int) {
				log('New user connects: jointNr:${server.jointNr}, userNr=$userNr', 0, server.jointNr);
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Reason) {
				log('User disconnects: jointNr=${server.jointNr}, userNr=$userNr', 0, server.jointNr);
				switch (reason) {
					case CLOSE:      log("User leaves channel.", 0, server.jointNr);
					case DISCONNECT: log("User disconnected from peote-server.", 0, server.jointNr);
					default: trace(reason);
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
			maxChunkSize: maxBytes,
			onEnter: function(client:PeoteClient) {
				log('Connect: Channel ${client.jointNr} entered ("${client.jointId}")', 1, client.jointNr);
				//stopOnError = true;
				Timer.delay(enterNext, 100);
				sendRandomBytes(client);
			},
			onError: function(client:PeoteClient, reason:Reason) {
				var isOk:Bool = false;
				switch(reason) {
					case DISCONNECT:log("Can't connect to peote-server.", 1, client.jointNr);
					                       //stopOnError = true;
					case CLOSE:     log("Connection to peote-server is closed.",1, client.jointNr);
				    case ID:        log("No channel with this ID to enter.",1, client.jointNr);
					                       isOk = true;
					case MAX:       log("Entered to much channels on this server (max is 128)",1, client.jointNr);
					case FULL:      log("Channel is full (max of 256 users already connected to this channel).",1, client.jointNr);
					case MALICIOUS: log("Channel-owner sending malicious data.",1, client.jointNr);

					default: trace(reason);
				}
				activeClients--;
				if (!stopOnError || isOk) Timer.delay(enterNext, 100);
			},
			onDisconnect: function(client:PeoteClient, reason:Reason) {
				log('Disconnect: jointNr:${client.jointNr}',1, client.jointNr);
				switch (reason) {
					case CLOSE:     log("Channel closed by owner.",1, client.jointNr);
					case DISCONNECT:log("Channel-owner disconnected.",1, client.jointNr);
					//case KICK: log("Kicked by channel-owner.",1, client.jointNr); // TODO
					default: trace(reason);
				}
				activeClients--;
				Timer.delay(enterNext, 100);
			},
			onDataChunk: function(client:PeoteClient, bytes:Bytes) {
				// check if data is same as send before
				var diff:Int = bytes.compare( lastSendedBytes.get(client));
				if ( diff == 0 ) {
					if (verbose) log('Successfully recieve ${bytes.length} Bytes',1, client.jointNr);
					if (delayTime>0) Timer.delay(function() {sendRandomBytes(client); }, delayTime); else sendRandomBytes(client);
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
			new PeoteServer(serverEvents).create(host, port, channelName + (++created % maxChannel));
			activeServers++;
		}
	}
	
	var entered:Int = -1;
	public function enterNext():Void {
		if (activeClients < maxClients) {
			new PeoteClient(clientEvents).enter(host, port, channelName + (++entered % maxChannel));
			activeClients++;
		}
	}
	
	public function sendRandomBytes(client:PeoteClient):Void {
		var bytes:Bytes = TestBytes.ofRandom(Std.int(minBytes+Math.random()*(1+maxBytes-minBytes)));
		if (verbose) log('Send ${bytes.length} Bytes',1, client.jointNr);
		lastSendedBytes.set(client, bytes);
		client.sendChunk( bytes );
	}

}