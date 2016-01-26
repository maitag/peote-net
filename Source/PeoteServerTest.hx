package;

import lime.app.Application;
import haxe.Timer;

import haxe.io.Bytes;
import haxe.io.BytesData;


import de.peote.net.PeoteServer;

class PeoteServerTest extends Application {
	
	public var peoteServer:PeoteServer;
	
	public function new () {
		
		super();
		
		peoteServer = new PeoteServer({
				onCreateJoint: function(jointNr:Int) {
					trace("onCreateJoint:"+jointNr);
				},
				onCreateJointError: function(errorNr:Int) {
					trace("onCreateJointError:"+errorNr);
				},
				onUserConnect: function(jointNr:Int, userNr:Int) {
					trace("onUserConnect: jointNr="+jointNr+", userNr="+userNr);
					#if js
					peoteServer.send(userNr, [3,2,1] );
					#else
					peoteServer.send(userNr, Bytes.ofString("3 2 1") );
					#end
				},
				onUserDisconnect: function(jointNr:Int, userNr:Int, reason:Int) {
					trace("onUserDisconnect: jointNr="+jointNr+", userNr="+userNr+", reason="+reason);
				},
				onData: onData
			});
			
		peoteServer.createJoint("localhost", 7680, "testserver");
		
	}
	
	#if js
	public inline function onData(jointNr:Int, userNr:Int, data:Array<Int>):Void {
		trace("onData: jointNr="+jointNr+", userNr="+userNr);
		var bytes:Bytes = Bytes.ofData(new BytesData(data.length));
		for (i in 0...data.length) bytes.set(i, data[i]);
		debug_output( bytes );
	}
	#else

	public inline function onData(jointNr:Int, userNr:Int, bytes:Bytes):Void	{
		trace("onData: jointNr="+jointNr+", userNr="+userNr);
		debug_output(bytes);
	}
	#end
	
	public inline function debug_output(bytes:Bytes):Void 
	{
		var s:String = "";
		for (i in 0 ...bytes.length) s += bytes.get(i)+" ";
		trace("onData:" + s);
	}

}
