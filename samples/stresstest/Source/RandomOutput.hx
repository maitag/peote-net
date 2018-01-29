package;

import haxe.io.Bytes;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;

/**
 * ...
 * @author 
 */
class RandomOutput extends PeoteBytesOutput 
{
	public var output:PeoteBytesOutput;
	
	public function new(len:Int)
	{
		super();
		
		output = new PeoteBytesOutput();
		
		for (i in 0...len) {
			var r:Int = Math.floor(Math.random() * 256);
			r = 33;
			writeByte(r);
			output.writeByte(r);
		}
		output.close();
	}
	
	public function match(input:PeoteBytesInput, chunk_size:Int):Bool
	{
		if (length != chunk_size) return false;
		
		var bytes:Bytes = b.getBytes();
		
		for (i in 0...chunk_size) {
			var b:Int = input.readByte();
			if (bytes.get(i) != b) {
				//for (j in i...chunk_size) trace(">>" + j, bytes.get(j), b);
				trace(">>>"+i);
				return false; 
			}
		}
		return true; 
	}
	
}