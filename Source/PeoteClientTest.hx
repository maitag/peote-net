package;

import lime.app.Application;
import haxe.Timer;

import haxe.io.Bytes;

import de.peote.net.PeoteClient;
import de.peote.io.PeoteBytes;
import de.peote.io.PeoteBytesOutput;
import de.peote.io.PeoteBytesInput;


class PeoteClientTest extends Application {
	
	public var peoteClient:PeoteClient;
	
	public function new () {
		
		super();
		
		peoteClient = new PeoteClient({
				onEnterJoint: function(jointNr:Int) {
					trace("onEnterJoint: jointNr=" + jointNr);
					sendTestData();
				},
				onEnterJointError: function(errorNr:Int) {
					trace("onEnterJointError:"+errorNr);
				},
				onDisconnect: function(jointNr:Int, reason:Int) {
					trace("onDisconnect: jointNr="+jointNr+", reason="+reason);
				},
				onData: onData
			});
			
		peoteClient.enterJoint("localhost", 7680, "testserver");
		
	}
	
	public inline function sendTestData():Void
	{
		// TODO: max value for PeoteBytesOutput length 
		var output:PeoteBytesOutput = new PeoteBytesOutput();
		output.writeByte(255);
		output.writeInt16(12345);
		output.writeInt32(123456789);
		output.writeFloat(1.2345678);
		output.writeDouble(1.2345678901234567890123456789);
		output.writeString("Hello Server");
		
		peoteClient.send( output.getBytes() ); // send chunk
	}

	public inline function onData(jointNr:Int, peoteBytes:PeoteBytes):Void 
	{
		trace("onData: jointNr=" + jointNr);
		
		// TODO: check PeoteBytesInput length
		var input:PeoteBytesInput = new PeoteBytesInput(peoteBytes);
		
		trace(input.readByte());
		trace(input.readInt16());
		trace(input.readInt32());
		trace(input.readFloat());
		trace(input.readDouble());
		trace(input.readString());
	}

	
}
