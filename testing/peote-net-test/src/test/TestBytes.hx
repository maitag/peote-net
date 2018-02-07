package test;

import haxe.io.Bytes;
/**
 * ...
 * @author 
 */
class TestBytes extends Bytes 
{
	public static function ofRandom(len:Int):Bytes
	{
		var bytes:Bytes = Bytes.alloc(len);
		
		for (i in 0...len) {
			var r:Int = Math.floor(Math.random() * 256);
			bytes.set(i, r);
		}
		
		return (bytes);
	}
	
}