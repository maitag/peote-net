package;

import haxe.io.Bytes;

import openfl.display.Sprite;

import ui.OutputText;

class TestVariableChunksize extends Sprite
{
	var out:OutputText;
	
	// variable chunksize:
	// max values for 1 byte -> 256
	//            for 2 byte -> 32768 (32 KB),
	//            for 3 byte -> 4194304 (4 MB)
	//            for 4 byte -> 536870912 (512 MB)
	var maxBytesPerChunkSize = 3;
	
	public function new ()
	{
		super();
		out = new OutputText(3, 3, 560, 550);
		addChild(out);

		var chunksize = 127; // 4194304;
		out.log("chunksize wrote:" + chunksize);
		var bytes = writeChunkSize(chunksize); //for (i in 0...bytes.length) trace(bytes.get(i));
		out.log("chunksize readed:" + readChunkSize(bytes) + " (used " + bytes.length + " byte)");
		
		var isBuggy = false;
		for (i in 1...32769) {
			if ( readChunkSize( writeChunkSize(i) ) != i) {
				isBuggy = true;
				out.log("BUGGY at "+i);
				break;
			}
		}
		if (!isBuggy) out.log("Test OK");
	}	
		
	public function writeChunkSize(chunk_size:Int):Bytes
	{
		if (chunk_size <= 0) out.log("Error(sendChunk): can't send zero length chunk");
		
		var input = Bytes.alloc(maxBytesPerChunkSize);
		
		var chunkBytecount:Int = 0;
		var byte:Int;
		
		chunk_size--;
		do
		{
			chunkBytecount++;
			if (chunkBytecount < maxBytesPerChunkSize) {
				 byte = chunk_size & 127; // get 7 bits
				chunk_size = chunk_size >> 7;
			}
			else {
				byte = chunk_size & 255; // last get 8 bits
				chunk_size = chunk_size >> 8;
			}
			
			if (chunk_size > 0) byte += 128;
			
			input.set(chunkBytecount-1,  byte);
			//input.set(maxBytesPerChunkSize - chunkBytecount,  byte);
		}
		while (chunk_size > 0 && chunkBytecount < maxBytesPerChunkSize);

		if (chunk_size > 0) out.log('chunksize to great for maxBytesPerChunkSize=$maxBytesPerChunkSize');
		
		return(input.sub(0, chunkBytecount));
		//return(input.sub(maxBytesPerChunkSize - chunkBytecount, chunkBytecount));
	}
	
	
	public function readChunkSize(input:Bytes):Int
	{
		var chunkBytecount = 0;
		var chunk_size = 0;
		var chunkReady = false;
		
		var byte:Int;
		var input_pos = 0;
		
		while (!chunkReady)
		{
			byte = input.get(input_pos++);
			
			if (chunkBytecount == maxBytesPerChunkSize-1 || byte < 128)
			{
				if (byte == 0 && chunkBytecount != 0) out.log("MALECIOUS ?");
				chunk_size = chunk_size | (byte << chunkBytecount*7);
				//trace("bytes used:" + (chunkBytecount+1));
				chunkReady = true; chunkBytecount = 0; chunk_size++; 
			}
			else // uppest bit is set and more bytes avail
			{
				chunk_size = chunk_size | ( (byte-128) << chunkBytecount*7);
				chunkBytecount++;
			}
		}
		
		return(chunk_size);
	}



}

