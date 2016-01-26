package;

import lime.app.Application;
import haxe.Timer;

import haxe.io.Bytes;
import haxe.io.BytesData;


import de.peote.net.PeoteClient;

class PeoteClientTest extends Application {
	
	public var peoteClient:PeoteClient;
	
	public function new () {
		
		super();
		
		peoteClient = new PeoteClient({
				onEnterJoint: function(jointNr:Int) {
					trace("onCreateJoint: jointNr=" + jointNr);
					#if js
					peoteClient.send( [1,2,3] );
					#else
					peoteClient.send(Bytes.ofString("1 2 3") );
					#end
				},
				onEnterJointError: function(errorNr:Int) {
					trace("onCreateJointError:"+errorNr);
				},
				onDisconnect: function(jointNr:Int, reason:Int) {
					trace("onUserDisconnect: jointNr="+jointNr+", reason="+reason);
				},
				onData: onData
			});
			
		peoteClient.enterJoint("localhost", 7680, "testserver");
		
	}
	
	#if js
	public inline function onData(jointNr:Int, data:Array<Int>):Void {
		trace("onData: jointNr="+jointNr);
		var bytes:Bytes = Bytes.ofData(new BytesData(data.length));
		for (i in 0...data.length) bytes.set(i, data[i]);
		debug_output( bytes );
	}
	#else

	public inline function onData(jointNr:Int, bytes:Bytes):Void	{
		trace("onData: jointNr="+jointNr);
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
