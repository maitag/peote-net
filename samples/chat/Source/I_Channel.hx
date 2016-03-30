package;
import flash.display.Sprite;
import haxe.io.StringInput;

/**
 * @author Sylvio Sell
 */

interface I_Channel
{
	public var channelName:String;
	
	public function send(message:String):Void;
	public function close():Void;
}