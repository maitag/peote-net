package de.peote.net;

#if cpp
import de.peote.net.cpp.PeoteJointSocket;
#end

#if flash
import de.peote.net.flash.PeoteJointSocket;
#end

/**
 * ...
 * @author semmi
 */

/* datenstruktur:
   sockets = { 
            "192.168.1.81:7680":
                {  "peoteJointSocket": PeoteJointSocketObject,
                   "isConnected": true,
                   "server":
                    {
                        NetPortalServer: 'joint_id_8',
                        NetPortalServer: 'joint_id_5'
                    }
                   -------------------------------------------
                   "clients":
                    {
                        NetPortalClient: 'joint_id_2',
                        NetPortalClient: 'joint_id_3'
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
			if ( ! (Lambda.has(server,jointId)   )) {//TODO || Lambda.has(clients,jointId))) {
				server.set(obj, jointId );
				return true;
			}
		}
		return false;
	}
	
	public function addClientJoint(obj:PeoteClient, jointId:String):Bool {
		if ( ! clients.exists(obj)) {
			if ( ! (Lambda.has(clients,jointId)   )) {//TODO || Lambda.has(server,jointId)))	{
				clients.set(obj, jointId );
				return true;
			}
		}
		return false;
	}
	
}

class PeoteNet
{
	private static var sockets:Map<String, PeoteNetSocket> = new Map<String, PeoteNetSocket>();
	
	public static function createJoint(obj:PeoteServer, server:String, port:Int, jointId:String):Void 
	{
		var p:PeoteNetSocket;
		var key:String = server + ":" + port;
		if (sockets.exists(key))
		{
			p = sockets.get(key);
			trace(key + " socket vorhanden");
			if (p.isConnected)
			{
				trace(key + " socket schon verbunden");
				p.peoteJointSocket.createOwnJoint(jointId,
				    function (jointNr:Int):Void { obj.onCreateJoint(p.peoteJointSocket, jointNr); },
				                                  obj.onData, obj.onUserConnect,
				                                  obj.onUserDisconnect,
					function (errorNr:Int):Void { PeoteNet.onCreateJointError(key, obj, errorNr); }
				);
			}
			else
			{
				trace(key + " socket noch nicht verbunden");
				if (! p.addServerJoint(obj, jointId)) obj.onCreateJointError(-1);
			}
		}
		else
		{
			trace(key + " socket existiert noch nicht");
			p = new PeoteNetSocket();
			sockets.set(key, p);
			
			p.peoteJointSocket = new PeoteJointSocket(
				server, port,
				function (isConnected:Bool, msg:String):Void
				                           { PeoteNet.onConnect(key, isConnected, msg); },
				function (msg:String):Void { PeoteNet.onClose(key, msg); },
				function (msg:String):Void { PeoteNet.onError(key, msg); }
			);
			
			if (p.addServerJoint(obj, jointId))
			{
				trace("Peote-Server: trying Connect "+server+":"+port+"...");
				p.peoteJointSocket.connect(server, port);
			}
			else obj.onCreateJointError(-1);
		}
	}
	
	public static function enterJoint(obj:PeoteClient, server:String, port:Int, jointId:String):Void 
	{
		var p:PeoteNetSocket;
		var key:String = server + ":" + port;
		if (sockets.exists(key))
		{
			p = sockets.get(key);
			trace(key + " socket vorhanden");
			if (p.isConnected)
			{
				trace(key + " socket schon verbunden");
				p.peoteJointSocket.enterInJoint(jointId,
				    function (jointNr:Int):Void { obj.onEnterJoint(p.peoteJointSocket, jointNr); },
				                                  obj.onData, obj.onDisconnect,
					function (errorNr:Int):Void { PeoteNet.onEnterJointError(key, obj, errorNr); }
				);
			}
			else
			{
				trace(key + " socket noch nicht verbunden");
				if ( ! p.addClientJoint(obj, jointId) ) obj.onEnterJointError(-1);
			}
		}
		else
		{
			trace(key + " socket existiert noch nicht");
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
				trace("Peote-Server: trying Connect "+server+":"+port+"...");
				p.peoteJointSocket.connect(server, port);
			}
			else obj.onEnterJointError(-1);
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
				trace("Peote-Server: " + key + " delete last -> Close:    -----------");
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
	}
	
	public static function leaveJoint(obj:PeoteClient, server:String, port:Int, jointNr:Int):Void
	{
		var key:String = server + ":" + port;
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.peoteJointSocket.leaveInJoint(jointNr);
			p.clients.remove(obj);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				trace("Peote-Server: " + key + " leave last -> Close:    -----------");
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
				trace("Peote-Server: " + key + " delete last -> Close:    -----------");
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		obj.onCreateJointError(errorNr);
	}
	
	public static function onEnterJointError(key:String, obj:PeoteClient, errorNr:Int):Void
	{
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			p.clients.remove(obj);
			if (Lambda.count(p.server) == 0 && Lambda.count(p.clients) == 0 )
			{
				trace("Peote-Server: " + key + " leave last -> Close:    -----------");
				p.peoteJointSocket.close();
				sockets.remove(key);
			}
		}
		obj.onEnterJointError(errorNr);
	}
	
	// -----------------------------------------------------------------------------------
	//  Server NETWORK CONNECTION --------------------------------------------------------
	// -----------------------------------------------------------------------------------
	
	public static function onConnect(key:String, isConnected:Bool, msg:String):Void
	{
		var p:PeoteNetSocket = sockets.get(key);
		if (!isConnected) {
			trace("Peote-Server: " + key + " cant connect: " + msg + "   -----------");
			for (obj in p.server.keys() )
			{
				obj.onCreateJointError(-2);
				p.server.remove(obj); 
			}
			for (obj in p.clients.keys() )
			{
				obj.onEnterJointError(-2);
				p.clients.remove(obj);
			}
			sockets.remove(key);
		}
		else {
			p.isConnected = true;
			trace("Peote-Server: " + key + " onConnect: " + msg + "   -----------");
			for (obj in p.server.keys() )
			{
				p.peoteJointSocket.createOwnJoint(p.server.get(obj),
				    function (jointNr:Int):Void { obj.onCreateJoint(p.peoteJointSocket, jointNr); },
				                                  obj.onData, obj.onUserConnect, obj.onUserDisconnect,
					function (errorNr:Int):Void { PeoteNet.onCreateJointError(key, obj, errorNr); }
				);
			}
			for (obj in p.clients.keys() )
			{
				p.peoteJointSocket.enterInJoint(p.clients.get(obj),
				    function (jointNr:Int):Void { obj.onEnterJoint(p.peoteJointSocket, jointNr); },
				                                  obj.onData, obj.onDisconnect,
					function (errorNr:Int):Void { PeoteNet.onEnterJointError(key, obj, errorNr); }
				);
			}
		}
	}

	public static function onClose(key:String, msg:String):Void
	{
		trace("Peote-Server: " + key + " onClose: " + msg + "   -----------");
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			for (obj in p.server.keys() )
			{
				obj.onCreateJointError(-1);
				p.server.remove(obj); 
			}
			for (obj in p.clients.keys() )
			{
				obj.onEnterJointError(-1);
				p.clients.remove(obj);
			}
			sockets.remove(key);
		}
	}
	
	public static function onError(key:String, msg:String):Void
	{
		trace("Peote-Server: " + key + " onError: " + msg + "   -----------");
		if (sockets.exists(key))
		{
			var p:PeoteNetSocket = sockets.get(key);
			for (obj in p.server.keys() )
			{
				obj.onCreateJointError(-1);
				p.server.remove(obj); 
			}
			for (obj in p.clients.keys() )
			{
				obj.onEnterJointError(-1);
				p.clients.remove(obj);
			}
			sockets.remove(key);
		}
	}	

	

	


}






