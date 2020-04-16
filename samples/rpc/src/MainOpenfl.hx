package;

import haxe.ds.IntMap;
import haxe.ds.StringMap;
import haxe.ds.Vector;
import haxe.io.Bytes;
import openfl.display.Sprite;

import peote.bridge.PeoteSocketBridge;
import peote.net.PeoteServer;
import peote.net.PeoteClient;
import peote.net.Remote;

import peote.io.Byte;
import peote.io.UInt16;
import peote.io.Int16;
import peote.io.Int32;
import peote.io.Double;

import remoteParams.User;
import remoteParams.Message;

import ui.OutputText;

class MainOpenfl extends Sprite
{

	var host:String = "localhost";
	var port:Int = 7680;

	var channelName:String = "testserver";

	var out:OutputText;

	public function new ()
	{	
		super();
		out = new OutputText(3, 3, 560, 550);
		addChild(out);
		
		#if ((!server) && (!client))
		// local testing without socket-connections
		onLoadSocketBridge();
		#else
		// connecting to the dedicated perl-server
		PeoteSocketBridge.load( {
			onload: onLoadSocketBridge,
			preferWebsockets: true,
			onfail: function() { out.log("Browser doesn't support flash- or websockets" ); }
		});
		#end
	}

	public function onLoadSocketBridge():Void
	{
		// ---------------------- SERVER -------------------------

		#if (server || (!client))
		var peoteServer = new PeoteServer(
		{
			// bandwith simmulation if there is local testing
			#if ((!server) && (!client))
			offline:true,
			netLag:10, // results in 20 ms per chunk
			netSpeed:1024 * 1024 * 512, //[512KB] per second
			#end
			
			onCreate: function(server:PeoteServer)
			{
				trace('onCreateJoint: Channel ${server.jointNr} created.');
			},
			onUserConnect: function(server:PeoteServer, userNr:Int)
			{
				trace('onUserConnect: jointNr:${server.jointNr}, userNr:$userNr');
				
				// server object where methods can be called by remote
				var serverFunctions = new ServerFunctions();
				serverFunctions.test = function() {
					out.log('serverobject -> test()');
				};
				serverFunctions.message = function(s:String, b:Bool) {
					out.log('serverobject -> message("$s", $b)');
				};
				serverFunctions.numbers = function(a:Byte, b:UInt16, c:Int16, d:Int32, e:Int, f:Float, g:Double) {
					out.log('serverobject -> numbers($a, $b, $c, $d, $e, $f, $g)');
				};				
				serverFunctions.complex = function(b:Bytes, a:Vector<Array<Int>>) {
					out.log('serverobject -> complex($b, $a)');
				};				
				serverFunctions.lists = function(list:List<Int>) {
					out.log('serverobject -> lists($list)');
				};				
				//serverFunctions.maps = function(m:IntMap< StringMap<Array<Int>> >) {
				serverFunctions.maps = function(m:Map< Int, Map<String, Array<Int>> >) {
					out.log('serverobject -> maps(');
					for (k in m.keys()) out.log(""+m.get(k));
				};
				serverFunctions.hxbit = function(u:User) {
					out.log('serverobject -> hxbit(${u.name}, ${u.age})');
				};
				serverFunctions.msgpack = function(o:Dynamic) {
					out.log('serverobject -> msgpack($o)');
				};
				serverFunctions.msgpackTyped = function(m:Message) {
					out.log('serverobject -> msgpackTyped($m)');
				};
				
				server.setRemote(userNr, serverFunctions); // --> Client's onRemote on will be called with 0
				
			},
			onRemote: function(server:PeoteServer, userNr:Int, remoteId:Int)
			{
				trace('onRemote: jointNr:${server.jointNr}, userNr:$userNr, remoteId:$remoteId');
				switch (remoteId) {
					case FirstClientFunctions.remoteId: 
						var clientFunctions = FirstClientFunctions.getRemoteServer(server, userNr, remoteId);
						clientFunctions.message("hello from server"); // call client-function of first object
					case SecondClientFunctions.remoteId:
						var secondClientFunctions = SecondClientFunctions.getRemoteServer(server, userNr, remoteId);
						secondClientFunctions.test(); // call client-function of second object
					default: trace("unknown remoteId");
				}
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int)
			{
				trace('onUserDisconnect: jointNr:${server.jointNr}, userNr:$userNr');
			},
			onError: function(server:PeoteServer, userNr:Int, reason:Int)
			{
				trace('onCreateJointError:$reason, userNr:$userNr');
			}
		});

		trace("trying to create...");
		peoteServer.create(host, port, channelName);
		#end
		
		// ---------------------- CLIENT -------------------------
		
		#if (client || (!server))
		var peoteClient = new PeoteClient(
		{
			onEnter: function(client:PeoteClient)
			{
				trace('onEnterJoint: Joint number ${client.jointNr} entered');
				
				// first client object where methods can be called by remote
				var clientFunctions = new FirstClientFunctions();
				clientFunctions.message = function(s:String) {
					out.log('first clientobject -> message("$s")');
				};				
				client.setRemote(clientFunctions, FirstClientFunctions.remoteId);       // --> Server's onRemote on will be called with 0
				
				// second client object where methods can be called by remote
				var secondClientFunctions = new SecondClientFunctions();
				secondClientFunctions.test = function() {
					out.log('second clientobject -> test()');
				};				
				client.setRemote(secondClientFunctions, SecondClientFunctions.remoteId);  // --> Server's onRemote on will be called with 1
				
			},
			onRemote: function(client:PeoteClient, remoteId:Int)
			{
				trace('onRemote: jointNr:${client.jointNr}, remoteId:$remoteId');
				var serverFunctions = ServerFunctions.getRemoteClient(client, remoteId);
				
				// call ServerFunctions
				serverFunctions.message("hello from client", true);
				haxe.Timer.delay( function() {
					serverFunctions.test();
				}, 3000);
				serverFunctions.numbers(255, 0xFFFF, 0x7FFF, 0x7FFFFFFF, 0x7FFFFFFF, 1.2345678901234, 1.2345678901234 );
				
				var v = new Vector<Array<Int>>(3);
				v[0] = [1, 2];
				v[1] = [3, 4, 5];
				v[2] = null; // null will result on remote in an empty Array
				serverFunctions.complex(Bytes.ofString("dada"), v); 
				
				var list = new List<Int>(); for (i in 0...5) list.add(i);
				serverFunctions.lists(list); // null will result on remote in an empty List 
				
				//var m:IntMap< haxe.ds.StringMap< Array<Int>> > = [
				var m = [
					1 => ["a1" => [10,11], "b1" => [12,13]],
					2 => ["a2" => [20, 21], "b2" => [22, 23]],
					7 => null // null will result on remote in an empty Map
				];
				serverFunctions.maps(m);
				
				var u = new User("Alice", 42, "test");
				serverFunctions.hxbit(u);
				
				var m:Message = {name:"Klaus", age:23};
				serverFunctions.msgpackTyped(m);
				
				serverFunctions.msgpack({name:"Bob", age:48, friends:["Mary","Johan"]});
			},
			onDisconnect: function(client:PeoteClient, reason:Int)
			{
				trace('onDisconnect: jointNr=${client.jointNr}');
			},
			onError: function(client:PeoteClient, reason:Int)
			{
				trace('onEnterJointError:$reason');
			}
		});
		
		trace("trying to enter...");
		peoteClient.enter(host, port, channelName);
		#end
	}
}


// REMOTE-OBJECTS --------------------------------------


// functions that run on Server
class ServerFunctions implements Remote {
	@:remote public var test:Void->Void;
	@:remote public var message:String->Bool->Void;
	@:remote public var numbers:Byte->UInt16->Int16->Int32->Int->Float->Double->Void;
	@:remote public var complex:Bytes -> Vector<Array<Int>> -> Void;
	@:remote public var lists:List<Int> -> Void;
	//@:remote public var maps:IntMap< haxe.ds.StringMap< Array<Int>> > -> Void;
	@:remote public var maps:Map<Int, Map< String, Array<Int>> > -> Void;
	
	// enable hxbit lib in project.xml to use it's serialization here ( https://lib.haxe.org/p/hxbit/ )
	@:remote public var hxbit: User -> Void;
	
	// enable msgpack lib in project.xml to use it's serialization here( https://lib.haxe.org/p/msgpack-haxe/ )
	@:remote public var msgpackTyped: Message -> Void;
	@:remote public var msgpack: Dynamic -> Void; 
}

// functions that run on Client
class FirstClientFunctions implements Remote {
	public inline static var remoteId = 0;
	@:remote public var message:String->Void;
}
class SecondClientFunctions implements Remote {
	public inline static var remoteId = 1;
	@:remote public var test:Void->Void;
}
