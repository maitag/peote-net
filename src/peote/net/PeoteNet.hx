package peote.net;

import haxe.Timer;

/**
 * ...
 * @author Sylvio Sell
 */

/* ADT:
   sockets = { 
            "192.168.1.81:7680":
                {  "peoteJointSocket": PeoteJointSocketObject,
                   "isConnected": true,
                   "server":
                    {
                        PeoteServer: 'joint_id_8',
                        PeoteServer: 'joint_id_5'
                    }
                   -------------------------------------------
                   "clients":
                    {
                        PeoteClient: 'joint_id_2',
                        PeoteClient: 'joint_id_3'
                    }
                 }
            ------------------------------------------------------
            "192.168.1.50:7680":
                {  "peoteJointSocket": PeoteJointSocketObject,
                   "isConnected": true,
                   ...
*/
				   
class PeoteNetSocket
{
	public var peoteJointSocket:PeoteJointSocket;
	public var isConnected:Bool;
	public var server:Map<PeoteServer, String>;
	public var clients:Map<PeoteClient, String>;
	
	public function new() {
		isConnected = false;
		server = new Map();
		clients = new Map();
	}
	
	public function addServerJoint(peoteServer:PeoteServer, jointId:String):Bool {
		if ( ! server.exists(peoteServer)) {
			if ( ! Lambda.has(server, jointId) ) {
				if ( ! Lambda.has(clients, jointId)) {
					server.set(peoteServer, jointId );
					return true;
				}
			}
		}		
		return false;
	}
	
	public function addClientJoint(peoteClient:PeoteClient, jointId:String):Bool {
		if ( ! clients.exists(peoteClient)) {
			if ( ! Lambda.has(clients, jointId) ) {
				if ( ! Lambda.has(server, jointId)) {
					clients.set(peoteClient, jointId );
					return true;
				}
			}
		}
		return false;
	}	
}

class PeoteNet
{
	public static inline var MAX_USER:Int = 256;
	public static inline var MAX_JOINTS:Int = 128;
	
	
	private static var sockets:Map<String, PeoteNetSocket> = new Map<String, PeoteNetSocket>();
	private static var offlineServer:Map<String, PeoteServer> = new Map<String, PeoteServer>();
	
	public static function createJoint(peoteServer:PeoteServer, server:String, port:Int, jointId:String):Void 
	{
		if (offlineServer.exists(server + ":" + port + ":" + jointId))
		{
			peoteServer._onCreateJointError(Reason.ID);
			return;
		}
		
		var p:PeoteNetSocket;
		var key:String = server + ":" + port;
		if (sockets.exists(key))
		{
			p = sockets.get(key);
			#if debugPeoteNet trace(key + " socket exists"); #end
			if (p.isConnected)
			{
				#if debugPeoteNet trace(key + " socket is already connected"); #end
				if (p.addServerJoint(peoteServer, jointId))
				{
					#if debugPeoteNet trace(key + " createOwnJoint"); #end
					p.peoteJointSocket.createOwnJoint(jointId,
						function (jointNr:Int):Void { peoteServer._onCreateJoint(p.peoteJointSocket, jointNr); },
						peoteServer._onData,
						peoteServer._onUserConnect,
						peoteServer._onUserDisconnect,
						function (errorNr:Int):Void { PeoteNet.onCreateJointError(key, peoteServer, errorNr); }
					);
				}
				else peoteServer._onCreateJointError(Reason.ID);
			}
			else
			{
				#if debugPeoteNet trace(key + " socket is not connected yet"); #end
				if (! p.addServerJoint(peoteServer, jointId)) peoteServer._onCreateJointError(Reason.ID);
			}
		}
		else
		{
			#if debugPeoteNet trace(key + " socket did not exists"); #end
			p = new PeoteNetSocket();
			sockets.set(key, p);
			
			p.peoteJointSocket = new PeoteJointSocket(
				server, port,
				function (isConnected:Bool, msg:String):Void { PeoteNet.onConnect(key, isConnected, msg); },
				function (msg:String):Void { PeoteNet.onClose(key, msg); },
				function (msg:String):Void { PeoteNet.onError(key, msg); }
			);
			
			if (p.addServerJoint(peoteServer, jointId))
			{
				#if debugPeoteNet trace("Peote-Server: trying Connect "+server+":"+port+"..."); #end
				p.peoteJointSocket.connect(server, port);
			}
			else peoteServer._onCreateJointError(Reason.ID);
		}
	}
	
	static inline function freeServerJointNr(m:Map<String, PeoteServer>):Int {
		var n:Int = MAX_JOINTS;
		var usedJointNr:Array<Int> = [for (s in m.iterator()) s.jointNr];
		haxe.ds.ArraySort.sort(usedJointNr, function(a, b):Int {
			if (a < b) return -1;
			else if (a > b) return 1;
			return 0;
		});
		for (nr in usedJointNr) {
			if (nr != n) break;
			else n++;
		}
		return n;
	}
	
	public static function createOfflineJoint(peoteServer:PeoteServer, server:String, port:Int, jointId:String):Void 
	{
		var key:String = server + ":" + port + ":" + jointId;
		if (offlineServer.exists(key))
		{
			peoteServer._onCreateJointError(Reason.ID);
		}
		else
		{
			var jointNr:Int = freeServerJointNr(offlineServer);
			offlineServer.set(key, peoteServer);
			Timer.delay(function() {
				peoteServer._onCreateJoint(null, jointNr);  // TODO: TESTING!!!
			}, peoteServer.netLag);
		}
	}
	
	static inline function freeClientJointNr(a:Array<PeoteClient>):Int {
		var n:Int = MAX_JOINTS;
		var usedJointNr:Array<Int> = [for (s in a) s.jointNr];
		haxe.ds.ArraySort.sort(usedJointNr, function(a, b):Int {
			if (a < b) return -1;
			else if (a > b) return 1;
			return 0;
		});
		for (nr in usedJointNr) {
			if (nr != n) break;
			else n++;
		}
		return n;
	}
	
	public static function enterJoint(peoteClient:PeoteClient, server:String, port:Int, jointId:String):Void 
	{
		var p:PeoteNetSocket;
		var key:String = server + ":" + port;
	
		// check for local offline PeoteServer for direct connection
		if (offlineServer.exists(key + ":" + jointId))
		{
			peoteClient.localPeoteServer = offlineServer.get(key + ":" + jointId);
			var jointNr:Int = freeClientJointNr(peoteClient.localPeoteServer.localPeoteClient);
			peoteClient.localUserNr = PeoteNet.MAX_USER + peoteClient.localPeoteServer.localPeoteClient.push(peoteClient) - 1;
			Timer.delay(function() {
				peoteClient.localPeoteServer._onUserConnect(peoteClient.localPeoteServer.jointNr, peoteClient.localUserNr);
				peoteClient._onEnterJoint(null, jointNr); // TODO: TESTING !
			}, peoteClient.localPeoteServer.netLag);
			return;
		}
		
		if (sockets.exists(key))
		{
			p = sockets.get(key);
			
			// check for local PeoteServer for direct connection
			for (k in p.server.keys()) {
				if (p.server.get(k) == jointId) {
					if (p.isConnected) {
						peoteClient.localPeoteServer = k;
						var jointNr:Int = freeClientJointNr(peoteClient.localPeoteServer.localPeoteClient);
						peoteClient.localUserNr = PeoteNet.MAX_USER + peoteClient.localPeoteServer.localPeoteClient.push(peoteClient) - 1;
						peoteClient.localPeoteServer._onUserConnect(peoteClient.localPeoteServer.jointNr, peoteClient.localUserNr);
						peoteClient._onEnterJoint(null, jointNr);
					}
					else {
						#if debugPeoteNet trace(key + " local server is not connected yet via socket"); #end
						peoteClient._onEnterJointError(Reason.ID); // TODO: Reason: can't connect to local PeoteServer
					}
					return;
				}
			}
			
			#if debugPeoteNet trace(key + " socket exists"); #end
			if (p.isConnected)
			{
				#if debugPeoteNet trace(key + " socket is already connected"); #end
				if (p.addClientJoint(peoteClient, jointId))
				{
					p.peoteJointSocket.enterInJoint(jointId,
						function (jointNr:Int):Void { peoteClient._onEnterJoint(p.peoteJointSocket, jointNr); },
						peoteClient._onData,
						//peoteClient.onDisconnect,
						function (jointNr:Int, reason:Int):Void { PeoteNet.onDisconnect(key, peoteClient, jointNr, reason); },
						function (errorNr:Int):Void { PeoteNet.onEnterJointError(key, peoteClient, errorNr); }
					);
				} else peoteClient._onEnterJointError(Reason.ID);
			}
			else
			{
				#if debugPeoteNet trace(key + " socket is not connected yet"); #end
				if (! p.addClientJoint(peoteClient, jointId) ) peoteClient._onEnterJointError(Reason.ID);
			}
		}
		else
		{
			#if debugPeoteNet trace(key + " socket did not exists"); #end
			p = new PeoteNetSocket();
			sockets.set(key, p);
			
			p.peoteJointSocket = new PeoteJointSocket(
				server, port,
				function (isConnected:Bool, msg:String):Void { PeoteNet.onConnect(key, isConnected, msg); },
				function (msg:String):Void { PeoteNet.onClose(key, msg); },
				function (msg:String):Void { PeoteNet.onError(key, msg); }
			);
			
			if (p.addClientJoint(peoteClient, jointId))
			{
				#if debugPeoteNet trace("Peote-Server: trying Connect "+server+":"+port+"..."); #end
				p.peoteJointSocket.connect(server, port);
			}
			else peoteClient._onEnterJointError(Reason.ID);
		}
	}
	
	public static function deleteJoint(peoteServer:PeoteServer, server:String, port:Int, jointNr:Int):Void 
	{
		var key:String = server + ":" + port;
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.peoteJointSocket.deleteOwnJoint(jointNr);
			p.server.remove(peoteServer);
			for (i in 0...peoteServer.localPeoteClient.length) {
				var localClient = peoteServer.localPeoteClient.pop();
				localClient.localPeoteServer = null;
				localClient._onDisconnect(localClient.jointNr, Reason.DISCONNECT);
				p.clients.remove(localClient);
			}
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " delete last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
	}
	
	public static function deleteOfflineJoint(peoteServer:PeoteServer, server:String, port:Int, jointId:String):Void 
	{
		var key:String = server + ":" + port + ":" + jointId;
		if (offlineServer.exists(key))
		{
			offlineServer.remove(key);
			for (i in 0...peoteServer.localPeoteClient.length) {
				var localClient = peoteServer.localPeoteClient.pop();
				localClient.localPeoteServer = null;
				localClient._onEnterJointError(Reason.DISCONNECT);
			}
		}
	}
	
	public static function leaveJoint(peoteClient:PeoteClient, server:String, port:Int, jointNr:Int):Void
	{
		if (peoteClient.localPeoteServer != null) {
			//Timer.delay(function() {
				peoteClient.localPeoteServer._onUserDisconnect(peoteClient.localPeoteServer.jointNr, peoteClient.localUserNr, 0);
				peoteClient.localPeoteServer.localPeoteClient.remove(peoteClient);
				peoteClient.localPeoteServer = null;
			//}, peoteClient.localPeoteServer.netLag);
			return;
		}
		
		var key:String = server + ":" + port;
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.peoteJointSocket.leaveInJoint(jointNr);
			p.clients.remove(peoteClient);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " leave last -> closed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		// TODO else throw -> leaveJoint: socket to $server:$port was not connected
	}
	
	// ------------------------ joint create enter error events --------------------------

	public static function onCreateJointError(key:String, peoteServer:PeoteServer, errorNr:Int):Void
	{
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.server.remove(peoteServer);
			// TODO: can it have local clients ?
			for (i in 0...peoteServer.localPeoteClient.length) {
				var localClient = peoteServer.localPeoteClient.pop();
				localClient.localPeoteServer = null;
				localClient._onEnterJointError(Reason.DISCONNECT);
				p.clients.remove(localClient);
			}
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " delete last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		peoteServer._onCreateJointError(errorNr);
	}
	
	public static function onEnterJointError(key:String, peoteClient:PeoteClient, errorNr:Int):Void
	{
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.clients.remove(peoteClient);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " leave last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		peoteClient._onEnterJointError(errorNr);
	}
	
	public static function onDisconnect(key:String, peoteClient:PeoteClient, jointNr:Int, reason:Int):Void
	{
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.clients.remove(peoteClient);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " leave last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		peoteClient._onDisconnect(jointNr, reason);
	}
	
	// -----------------------------------------------------------------------------------
	//  Server NETWORK CONNECTION --------------------------------------------------------
	// -----------------------------------------------------------------------------------
	
	public static function onConnect(key:String, isConnected:Bool, msg:String):Void
	{
		var p:PeoteNetSocket = sockets.get(key);
		if (!isConnected) {
			#if debugPeoteNet trace("Peote-Server: " + key + " cant connect: " + msg); #end
			for (peoteServer in p.server.keys() )
			{	
				if (!peoteServer.offline) { // TODO: can it be offline ?
					peoteServer._onCreateJointError(Reason.DISCONNECT);
					p.server.remove(peoteServer);
					// TODO: can it have local clients ?
					for (i in 0...peoteServer.localPeoteClient.length) { // TODO: refactor!
						var localClient = peoteServer.localPeoteClient.pop();
						localClient.localPeoteServer = null;
						localClient._onEnterJointError(Reason.DISCONNECT);
						p.clients.remove(localClient);
					}
				}
			}
			for (peoteClient in p.clients.keys() )
			{
				if (peoteClient.localPeoteServer == null) {
					peoteClient._onEnterJointError(Reason.DISCONNECT);
					p.clients.remove(peoteClient);
				}
			}
			sockets.remove(key);
		}
		else {
			p.isConnected = true;
			#if debugPeoteNet trace("Peote-Server: " + key + " onConnect: " + msg); #end
			for (peoteServer in p.server.keys() )
			{
				if (!peoteServer.offline) p.peoteJointSocket.createOwnJoint(p.server.get(peoteServer),
				    function (jointNr:Int):Void { peoteServer._onCreateJoint(p.peoteJointSocket, jointNr); },
				    peoteServer._onData,
					peoteServer._onUserConnect,
					peoteServer._onUserDisconnect,
					function (errorNr:Int):Void { PeoteNet.onCreateJointError(key, peoteServer, errorNr); }
				);
			}
			for (peoteClient in p.clients.keys() )
			{
				if (peoteClient.localPeoteServer == null) p.peoteJointSocket.enterInJoint(p.clients.get(peoteClient),
				    function (jointNr:Int):Void { peoteClient._onEnterJoint(p.peoteJointSocket, jointNr); },
				    peoteClient._onData,
					//peoteClient.onDisconnect,
					function (jointNr:Int, reason:Int):Void { PeoteNet.onDisconnect(key, peoteClient, jointNr, reason); },
					function (errorNr:Int):Void { PeoteNet.onEnterJointError(key, peoteClient, errorNr); }
				);
			}
		}
	}

	public static function onClose(key:String, msg:String):Void
	{
		#if debugPeoteNet trace("Peote-Server: " + key + " onClose: " + msg); #end
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			for (peoteServer in p.server.keys() )
			{
				peoteServer._onCreateJointError(Reason.CLOSE);
				p.server.remove(peoteServer);
				// TODO: can it have local clients ?
				for (i in 0...peoteServer.localPeoteClient.length) {  // TODO refactor!
					var localClient = peoteServer.localPeoteClient.pop();
					localClient.localPeoteServer = null;
					localClient._onEnterJointError(Reason.CLOSE);
					p.clients.remove(localClient);
				}
			}
			for (peoteClient in p.clients.keys() )
			{
				peoteClient._onEnterJointError(Reason.CLOSE);
				p.clients.remove(peoteClient);
			}
			sockets.remove(key);
		}
	}
	
	public static function onError(key:String, msg:String):Void
	{
		#if debugPeoteNet trace("Peote-Server: " + key + " onError: " + msg); #end
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			for (peoteServer in p.server.keys() )
			{
				peoteServer._onCreateJointError(Reason.CLOSE);
				p.server.remove(peoteServer);
				// TODO: can it have local clients ?
				for (i in 0...peoteServer.localPeoteClient.length) { // TODO refactor!
					var localClient = peoteServer.localPeoteClient.pop();
					localClient.localPeoteServer = null;
					localClient._onEnterJointError(Reason.CLOSE);
					p.clients.remove(localClient);
				}
			}
			for (peoteClient in p.clients.keys() )
			{
				peoteClient._onEnterJointError(Reason.CLOSE);
				p.clients.remove(peoteClient);
			}
			sockets.remove(key);
		}
	}	


}