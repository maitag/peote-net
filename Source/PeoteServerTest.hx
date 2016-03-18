package;

import haxe.io.StringInput;
import lime.app.Application;
import haxe.Timer;

import haxe.io.Bytes;

import de.peote.net.PeoteServer;
import de.peote.io.PeoteBytes;
import de.peote.io.PeoteBytesOutput;
import de.peote.io.PeoteBytesInput;


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
					trace("onUserConnect: jointNr=" + jointNr + ", userNr=" + userNr);
					sendTestData(userNr);
				},
				onUserDisconnect: function(jointNr:Int, userNr:Int, reason:Int) {
					trace("onUserDisconnect: jointNr="+jointNr+", userNr="+userNr+", reason="+reason);
				},
				onData: onData
			});
			
		peoteServer.createJoint("localhost", 7680, "testserver");
		
	}

	public inline function sendTestData(userNr:Int):Void
	{	
		// TODO: max value for PeoteBytesOutput length 
		var output:PeoteBytesOutput = new PeoteBytesOutput();
		
		output.writeByte(255);
		output.writeUInt16(65535);
		output.writeInt16(32767);
		output.writeInt16(-32768);
		output.writeInt32(2147483647);
		output.writeInt32(-2147483648);
		output.writeFloat(1.2345678);
		output.writeDouble(1.2345678901234567890123456789);
		output.writeString("Hello Client " + userNr);
		
		peoteServer.send(userNr, output.getBytes() ); // send chunk
	}
	
	public inline function onData(jointNr:Int, userNr:Int, peoteBytes:PeoteBytes ):Void 
	{
		trace("onData: jointNr="+jointNr+", userNr="+userNr);

		// TODO: check PeoteBytesInput length 
		var input:PeoteBytesInput = new PeoteBytesInput(peoteBytes);
		
		trace(input.readByte());
		trace(input.readUInt16());
		trace(input.readInt16());
		trace(input.readInt16());
		trace(input.readInt32());
		trace(input.readInt32());
		trace(input.readFloat());
		trace(input.readDouble());
		trace(input.readString());
	}
}
