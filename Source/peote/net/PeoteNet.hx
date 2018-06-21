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
	
	public function addServerJoint(obj:PeoteServer, jointId:String):Bool {
		if ( ! server.exists(obj)) {
			if ( ! Lambda.has(server, jointId) ) {
				if ( ! Lambda.has(clients, jointId)) {
					server.set(obj, jointId );
					return true;
				}
			}
		}		
		return false;
	}
	
	public function addClientJoint(obj:PeoteClient, jointId:String):Bool {
		if ( ! clients.exists(obj)) {
			if ( ! Lambda.has(clients, jointId) ) {
				if ( ! Lambda.has(server, jointId)) {
					clients.set(obj, jointId );
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
	
	public static function createJoint(obj:PeoteServer, server:String, port:Int, jointId:String):Void 
	{
		if (offlineServer.exists(server + ":" + port + ":" + jointId))
		{
			obj._onCreateJointError(Reason.ID);
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
				if (p.addServerJoint(obj, jointId))
				{
					#if debugPeoteNet trace(key + " createOwnJoint"); #end
					p.peoteJointSocket.createOwnJoint(jointId,
						function (jointNr:Int):Void { obj._onCreateJoint(p.peoteJointSocket, jointNr); },
						obj._onData,
						obj._onUserConnect,
						obj._onUserDisconnect,
						function (errorNr:Int):Void { PeoteNet.onCreateJointError(key, obj, errorNr); }
					);
				}
				else obj._onCreateJointError(Reason.ID);
			}
			else
			{
				#if debugPeoteNet trace(key + " socket is not connected yet"); #end
				if (! p.addServerJoint(obj, jointId)) obj._onCreateJointError(Reason.ID);
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
			
			if (p.addServerJoint(obj, jointId))
			{
				#if debugPeoteNet trace("Peote-Server: trying Connect "+server+":"+port+"..."); #end
				p.peoteJointSocket.connect(server, port);
			}
			else obj._onCreateJointError(Reason.ID);
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
	
	public static function createOfflineJoint(obj:PeoteServer, server:String, port:Int, jointId:String):Void 
	{
		var key:String = server + ":" + port + ":" + jointId;
		if (offlineServer.exists(key))
		{
			obj._onCreateJointError(Reason.ID);
		}
		else
		{
			var jointNr:Int = freeServerJointNr(offlineServer);
			offlineServer.set(key, obj);
			Timer.delay(function() {
				obj._onCreateJoint(null, jointNr);  // TODO: TESTING!!!
			}, obj.netLag);
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
	
	public static function enterJoint(obj:PeoteClient, server:String, port:Int, jointId:String):Void 
	{
		var p:PeoteNetSocket;
		var key:String = server + ":" + port;
	
		// check for local offline PeoteServer for direct connection
		if (offlineServer.exists(key + ":" + jointId))
		{
			obj.localPeoteServer = offlineServer.get(key + ":" + jointId);
			var jointNr:Int = freeClientJointNr(obj.localPeoteServer.localPeoteClient);
			obj.localUserNr = PeoteNet.MAX_USER + obj.localPeoteServer.localPeoteClient.push(obj) - 1;
			Timer.delay(function() {
				obj.localPeoteServer._onUserConnect(obj.localPeoteServer.jointNr, obj.localUserNr);
				obj._onEnterJoint(null, jointNr); // TODO: TESTING !
			}, obj.localPeoteServer.netLag);
			return;
		}

		if (sockets.exists(key))
		{
			p = sockets.get(key);
			
			// check for local PeoteServer for direct connection
			for (k in p.server.keys()) {
				if (p.server.get(k) == jointId) {
					obj.localPeoteServer = k;
					var jointNr:Int = freeClientJointNr(obj.localPeoteServer.localPeoteClient);
					obj.localUserNr = PeoteNet.MAX_USER + obj.localPeoteServer.localPeoteClient.push(obj) - 1;
					Timer.delay(function() {
						obj.localPeoteServer._onUserConnect(obj.localPeoteServer.jointNr, obj.localUserNr);
						obj._onEnterJoint(null, jointNr); // TODO: TESTING !
					}, obj.localPeoteServer.netLag);
					return;
				}
			}
			
			#if debugPeoteNet trace(key + " socket exists"); #end
			if (p.isConnected)
			{
				#if debugPeoteNet trace(key + " socket is already connected"); #end
				if (p.addClientJoint(obj, jointId))
				{
					p.peoteJointSocket.enterInJoint(jointId,
						function (jointNr:Int):Void { obj._onEnterJoint(p.peoteJointSocket, jointNr); },
						obj._onData,
						//obj.onDisconnect,
						function (jointNr:Int, reason:Int):Void { PeoteNet.onDisconnect(key, obj, jointNr, reason); },
						function (errorNr:Int):Void { PeoteNet.onEnterJointError(key, obj, errorNr); }
					);
				} else obj._onEnterJointError(Reason.ID);
			}
			else
			{
				#if debugPeoteNet trace(key + " socket is not connected yet"); #end
				if ( ! p.addClientJoint(obj, jointId) ) obj._onEnterJointError(Reason.ID);
			}
		}
		else
		{
			#if debugPeoteNet trace(key + " socket did not exists"); #end
			p = new PeoteNetSocket();
			sockets.set(key, p);
			
			p.peoteJointSocket = new PeoteJointSocket(
				server, port,
				function (isConnected:Bool, msg:String):Void
				                           { PeoteNet.onConnect(key, isConnected, msg); },
				function (msg:String):Void { PeoteNet.onClose(key, msg); },
				function (msg:String):Void { PeoteNet.onError(key, msg); }
			);
			
			if (p.addClientJoint(obj, jointId))
			{
				#if debugPeoteNet trace("Peote-Server: trying Connect "+server+":"+port+"..."); #end
				p.peoteJointSocket.connect(server, port);
			}
			else obj._onEnterJointError(Reason.ID);
		}
	}
	
	public static function deleteJoint(obj:PeoteServer, server:String, port:Int, jointNr:Int):Void 
	{
		var key:String = server + ":" + port;
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.peoteJointSocket.deleteOwnJoint(jointNr);
			p.server.remove(obj);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " delete last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
	}
	
	public static function deleteOfflineJoint(obj:PeoteServer, server:String, port:Int, jointId:String):Void 
	{
		var key:String = server + ":" + port + ":" + jointId;
		if (offlineServer.exists(key))
		{
			offlineServer.remove(key);
		}
	}
	
	public static function leaveJoint(obj:PeoteClient, server:String, port:Int, jointNr:Int):Void
	{
		if (obj.localPeoteServer != null) {
			Timer.delay(function() {
				obj.localPeoteServer._onUserDisconnect(obj.localPeoteServer.jointNr, obj.localUserNr, 0);
			}, obj.localPeoteServer.netLag);
			return;
		}
		
		var key:String = server + ":" + port;
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.peoteJointSocket.leaveInJoint(jointNr);
			p.clients.remove(obj);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " leave last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
	}
	
	// ------------------------ joint create enter error events --------------------------

	public static function onCreateJointError(key:String, obj:PeoteServer, errorNr:Int):Void
	{
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.server.remove(obj);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " delete last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		obj._onCreateJointError(errorNr);
	}
	
	public static function onEnterJointError(key:String, obj:PeoteClient, errorNr:Int):Void
	{
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.clients.remove(obj);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " leave last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		obj._onEnterJointError(errorNr);
	}
	
	public static function onDisconnect(key:String, obj:PeoteClient, jointNr:Int, reason:Int):Void
	{
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.clients.remove(obj);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				#if debugPeoteNet trace("Peote-Server: " + key + " leave last -> closeed"); #end
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		obj._onDisconnect(jointNr, reason);
	}
	
	// -----------------------------------------------------------------------------------
	//  Server NETWORK CONNECTION --------------------------------------------------------
	// -----------------------------------------------------------------------------------
	
	public static function onConnect(key:String, isConnected:Bool, msg:String):Void
	{
		var p:PeoteNetSocket = sockets.get(key);
		if (!isConnected) {
			#if debugPeoteNet trace("Peote-Server: " + key + " cant connect: " + msg); #end
			for (obj in p.server.keys() )
			{	
				if (!obj.offline) {
					obj._onCreateJointError(Reason.DISCONNECT);
					p.server.remove(obj); 
				}
			}
			for (obj in p.clients.keys() )
			{
				if (obj.localPeoteServer == null) {
					obj._onEnterJointError(Reason.DISCONNECT);
					p.clients.remove(obj);
				}
			}
			sockets.remove(key);
		}
		else {
			p.isConnected = true;
			#if debugPeoteNet trace("Peote-Server: " + key + " onConnect: " + msg); #end
			for (obj in p.server.keys() )
			{
				if (!obj.offline) p.peoteJointSocket.createOwnJoint(p.server.get(obj),
				    function (jointNr:Int):Void { obj._onCreateJoint(p.peoteJointSocket, jointNr); },
				    obj._onData,
					obj._onUserConnect,
					obj._onUserDisconnect,
					function (errorNr:Int):Void { PeoteNet.onCreateJointError(key, obj, errorNr); }
				);
			}
			for (obj in p.clients.keys() )
			{
				if (obj.localPeoteServer == null) p.peoteJointSocket.enterInJoint(p.clients.get(obj),
				    function (jointNr:Int):Void { obj._onEnterJoint(p.peoteJointSocket, jointNr); },
				    obj._onData,
					//obj.onDisconnect,
					function (jointNr:Int, reason:Int):Void { PeoteNet.onDisconnect(key, obj, jointNr, reason); },
					function (errorNr:Int):Void { PeoteNet.onEnterJointError(key, obj, errorNr); }
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
			for (obj in p.server.keys() )
			{
				obj._onCreateJointError(Reason.CLOSE);
				p.server.remove(obj); 
			}
			for (obj in p.clients.keys() )
			{
				obj._onEnterJointError(Reason.CLOSE);
				p.clients.remove(obj);
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
			for (obj in p.server.keys() )
			{
				obj._onCreateJointError(Reason.CLOSE);
				p.server.remove(obj); 
			}
			for (obj in p.clients.keys() )
			{
				obj._onEnterJointError(Reason.CLOSE);
				p.clients.remove(obj);
			}
			sockets.remove(key);
		}
	}	


}