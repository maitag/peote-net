package;

import openfl.display.Sprite;

import de.peote.net.PeoteClient;
import de.peote.io.PeoteBytes;
import de.peote.io.PeoteBytesOutput;
import de.peote.io.PeoteBytesInput;

/**
 * ...
 * @author Sylvio Sell
 */

class ClientChannel extends Sprite implements I_Channel
{

	var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	var chunk_size:Int = 0;
	
	var output:OutputText;
	
	var peoteClient:PeoteClient;
	
	var username:String;
	
	public var channelName:String;

	
	public function new( server:String, port:Int, channelName:String, username:String ) 
	{
		super();
		
		this.channelName = channelName;
		this.username = username;
		
		output = new OutputText(160, 45, 582, 510);
		addChild(output);
		outputAppend("connecting..");
		
		
		inputBuffer = new PeoteBytesInput();
		
		peoteClient = new PeoteClient( {
			
			onEnterJoint: function(jointNr:Int) {
				outputAppend('enter channel ($jointNr) "$channelName"');
				send(username); // send username first
			},
			
			onEnterJointError: function(errorNr:Int) {
				outputAppend('can\'t enter channel "$channelName" - error-code:'+errorNr);
			},
			
			onDisconnect: function(jointNr:Int, reason:Int) {
				outputAppend('disconnect channel ($jointNr) "$channelName", reason: $reason');
			},
			
			onData: onData
			
		});
		
		peoteClient.enterJoint(server, port, channelName );
	}

	// -------------------- append to Text to Output --------------------------------
	
	public function outputAppend(s:String):Void
	{
		output.output.appendText(s+"\n"); 
		output.output.scrollV = output.output.maxScrollV;
	}

	// ------------------------------------------------------------------------------
	// ------------------ Interface -------------------------------------------------
	// ------------------------------------------------------------------------------

	public function send(message:String):Void
	{
		var bytes:PeoteBytesOutput = new PeoteBytesOutput();
		bytes.writeString(message);
		sendChunk(bytes);
	}

	public function close():Void
	{
		// close Connection
		peoteClient.leaveJoint();
	}
	
	// ------------------------------------------------------------------------------
	
	public function sendChunk(output:PeoteBytesOutput):Void
	{	
		var chunksize:PeoteBytesOutput = new PeoteBytesOutput();
		chunksize.writeUInt16(output.length);
		peoteClient.send( chunksize.getBytes() );
		peoteClient.send( output.getBytes() );
	}

	
	// ------------------------------------------------------------------------------
	// ------------------ Data Input ------------------------------------------------
	// ------------------------------------------------------------------------------
	
	public function onData( jointNr:Int, peoteBytes:PeoteBytes ):Void 
	{
		inputBuffer.append( peoteBytes );
		
		if (chunk_size == 0 && inputBuffer.bytesLeft() >=2 ) {
			chunk_size = inputBuffer.readUInt16(); // read chunk size
		}
		
		if ( chunk_size != 0 && inputBuffer.bytesLeft() >= chunk_size )
		{
			onDataChunk( inputBuffer, chunk_size );
			chunk_size = 0;
		}
	}

	// this will called if full chunk arrives
	public function onDataChunk( input:PeoteBytesInput, chunk_size:Int ):Void 
	{
		outputAppend( input.readString() );
	}
	

}