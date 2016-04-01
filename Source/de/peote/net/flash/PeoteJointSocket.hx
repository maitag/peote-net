package de.peote.net.flash;
/**
 * ...
 * @author Sylvio Sell
 */

import flash.utils.ByteArray;
import haxe.io.Bytes;

import de.peote.socket.flash.PeoteSocket;


class PeoteJointSocket extends PeoteSocket
{
	
	var connected:Bool = false;
	
	var onConnectCallback:Bool -> String -> Void;
	var onCloseCallback:String -> Void;
	var onErrorCallback:String -> Void;
	
	
	var ownJointDataCallback:Map<Int,Int -> Int -> Bytes -> Void>;
	var inJointDataCallback :Map<Int,Int -> Bytes -> Void> ;
	
	var ownUserConnectCallback   :Map<Int,ByteArray -> Void> ;
	var ownUserDisconnectCallback:Map<Int,ByteArray -> Void> ;
	var inDisconnectCallback     :Map<Int,ByteArray -> Void>;
	
	var waitingCommandCallbacks:Map<Int,ByteArray -> Void> ;
	

	var input:ByteArray;
	var bytes_left:UInt = 0;
	var command_mode:Bool = false;
	var joint_nr:Int = -1;
	var user_nr:Int = -1;
	
	
	public function new(server:String, port: Int,
						onConnectCallback:Bool -> String -> Void = null,
						onCloseCallback:String -> Void = null,
						onErrorCallback:String -> Void = null
						) 
	{
		this.onConnectCallback = onConnectCallback;
		this.onCloseCallback = onCloseCallback;
		this.onErrorCallback = onErrorCallback;
		
		input = new ByteArray();
		
		ownJointDataCallback = new Map<Int,Int -> Int -> Bytes -> Void>();
		inJointDataCallback  = new Map<Int,Int -> Bytes -> Void>();
		
		ownUserConnectCallback    = new Map<Int,ByteArray -> Void>() ;
		ownUserDisconnectCallback = new Map<Int,ByteArray -> Void>() ;
		inDisconnectCallback      = new Map<Int,ByteArray -> Void>() ;
		
		waitingCommandCallbacks = new Map<Int,ByteArray -> Void>();
		
		super({onConnect:this.onConnect, onData:this.onData, onClose:this.onClose, onError:this.onError});
		
	}
	
	override public function connect(server:String, port:Int):Void
	{
		if ( connected )
		{	trace("MaiSocket Error: socket is already connected and has to close before new connect()");
		}
		else
		{
			connected = true;
			super.connect(server, port);	
		}
	}
	override public function close():Void 
	{
		if ( !connected )
		{	trace("MaiSocket Error: socket is not connected and nothing to close()");
		}
		else
		{
			super.close();
		}
	}
	private function onConnect(isConnected:Bool, msg:String):Void
	{	//trace("onConnect");
		if (!isConnected)
		{	//cant connect
			connected = false;
			if (onConnectCallback != null) onConnectCallback(isConnected, msg);
		}
		else
		{	// is connected
			if (onConnectCallback != null) onConnectCallback(isConnected, msg);
		}
	}
	private function onClose(msg:String):Void
	{	//trace("onClose");
		connected = false;
		if (onCloseCallback != null) onCloseCallback(msg);
	}
	private function onError(msg:String):Void
	{	//trace("onError");
		connected = false;
		if (onErrorCallback != null) onErrorCallback(msg);
	}
	private function addCommandCallback(max:Int, commandCallback:ByteArray -> Void):Int
	{
		var nr:Int = 1; // nr. 0 ist KEINE Antwort sondern command vom server
		while (waitingCommandCallbacks.exists(nr) && nr <= max)  // TODO: achtung, wenn viele schnell hintereinander dan: RACE CONDITION
		{
			nr++;
		}
		if (nr > max)
		{
			nr = -1; // ERROR
		}
		else
		{    // TODO: achtung, wenn viele schnell hintereinander dan: RACE CONDITION
			if (!waitingCommandCallbacks.exists(nr)) waitingCommandCallbacks.set(nr, commandCallback);
			else nr = -1; // ERROR
		}
		return(nr);
	}

	public function createOwnJoint(joint_id:String, commandCallback:Int -> Void,
												dataCallback:Int -> Int -> Bytes -> Void,
												userConnectCallback:Int -> Int-> Void,
												userDisconnectCallback:Int -> Int -> Int -> Void,
												errorCallback:Int -> Void = null):Void 
	{
		// TODO: if ( connected ) ...
		
		var nr:Int = addCommandCallback(255, function(command_chunk:ByteArray):Void 
						{ onCreateOwnJoint(command_chunk, commandCallback, dataCallback,
														userConnectCallback, userDisconnectCallback,
														errorCallback);
						}
						);
		
		if (nr != -1)
		{
			writeByte(0); // 0 leitet command ein (das waere sonst die chunk-size, die kann aber niemals 1 sein)
			
			writeByte(0); // create command
			writeByte(nr); // command nummer fuer die spaetere antwort
			
			// ab hier alles fuer die ID in einen kleinen-CHUNK pressen
			var ba:Bytes = Bytes.ofString(joint_id);
			writeByte(ba.length); // TODO: SICHERSTELLEN das <= 255
			writeBytes(ba);
			
			flush();
		}
		
	}
	
	private function onCreateOwnJoint(command_chunk:ByteArray, commandCallback:Int -> Void,
															dataCallback:Int -> Int -> Bytes -> Void,
															userConnectCallback:Int -> Int-> Void,
															userDisconnectCallback:Int -> Int -> Int -> Void,
															errorCallback:Int -> Void = null):Void 
	{
		//trace("onCreateOwnJoint: ANTWORT ...");
		// chunk auswerten:
		if (command_chunk.readUnsignedByte() == 0) // -> OK 
		{	//trace("OK ----");
			var joint_nr = command_chunk.readUnsignedByte(); // -> joint_nr lesen
			ownJointDataCallback.set(joint_nr, dataCallback);
			ownUserConnectCallback.set(joint_nr, function(command_chunk:ByteArray)
												{ onUserConnect(userConnectCallback, joint_nr, command_chunk); }
										);
			ownUserDisconnectCallback.set(joint_nr, function(command_chunk:ByteArray)
												{ onUserDisconnect(userDisconnectCallback, joint_nr, command_chunk); }
										);
			
			commandCallback(joint_nr);
		}
		else
		{	// Fehler
			if (errorCallback != null) errorCallback(command_chunk.readUnsignedByte());
		}
	}
	
	private function onUserConnect(userConnectCallback:Int -> Int -> Void, joint_nr:Int, command_chunk:ByteArray):Void
	{
		userConnectCallback(joint_nr, command_chunk.readUnsignedByte());
	}
	
	private function onUserDisconnect(userDisconnectCallback:Int -> Int -> Int -> Void, joint_nr:Int, command_chunk:ByteArray):Void
	{
		userDisconnectCallback(joint_nr, command_chunk.readUnsignedByte(), command_chunk.readUnsignedByte());
	}
	
	public function leaveInJoint(joint_nr:Int):Void
	{
		writeByte(0); // 0 leitet command ein (das waere sonst die chunk-size, die kann aber niemals 1 sein)
		writeByte(2); // leave command
		writeByte(0); // (normalerweise die command_nr) 0 -> erwartet keine antwort
		
		writeByte(1); // chunksize ist 1 da nurnoch joint_nr kommt
		writeByte(joint_nr); // der eigentliche chunk
		
		flush();
		
	}
	
	public function deleteOwnJoint(joint_nr:Int):Void
	{
		writeByte(0); // 0 leitet command ein (das waere sonst die chunk-size, die kann aber niemals 1 sein)
		writeByte(3); // leave command
		writeByte(0); // (normalerweise die command_nr) 0 -> erwartet keine antwort
		
		writeByte(1); // chunksize ist 1 da nurnoch joint_nr kommt
		writeByte(joint_nr); // der eigentliche chunk
		
		flush();
		
	}
	
	public function enterInJoint(joint_id:String, commandCallback:Int -> Void,
												dataCallback:Int -> Bytes -> Void,
												disconnectCallback:Int -> Int -> Void,
												errorCallback:Int -> Void = null):Void 
	{
		// TODO: if ( connected ) ...
		
		//var nr:Int = addCommandCallback(255, commandCallback);
		var nr:Int = addCommandCallback(255, function(command_chunk:ByteArray):Void 
						{ onEnterInJoint(command_chunk, commandCallback, dataCallback, disconnectCallback, errorCallback);
						}
						);
		
		if (nr != -1)
		{
			writeByte(0); // 0 leitet command ein (das waere sonst die chunk-size, die kann aber niemals 1 sein)
			
			writeByte(1); // enter_in command
			writeByte(nr); // command nummer fuer die spaetere antwort
			
			// ab hier alles fuer die ID in einen kleinen-CHUNK pressen
			var ba:Bytes = Bytes.ofString(joint_id);
			writeByte(ba.length); // TODO: SICHERSTELLEN das <= 255
			writeBytes(ba);
			
			flush();
		}
	}
	
	private function onEnterInJoint(command_chunk:ByteArray, commandCallback:Int -> Void,
															dataCallback:Int -> Bytes -> Void,
															disconnectCallback:Int -> Int -> Void,
															errorCallback:Int -> Void = null):Void 
	{
		
		//trace("enterInJoint(): ANTWORT ...");
		// chunk auswerten:
		if (command_chunk.readUnsignedByte() == 0) // -> OK 
		{	//trace("OK ----");
			var joint_nr:Int = command_chunk.readUnsignedByte(); // -> joint_nr lesen
			inJointDataCallback.set(joint_nr, dataCallback);
			inDisconnectCallback.set(joint_nr, function(command_chunk:ByteArray)
												{ onInDisconnect(disconnectCallback, joint_nr, command_chunk); }
									);
											
			commandCallback(joint_nr);
		}
		else
		{	// FEHLER
			if (errorCallback != null) errorCallback(command_chunk.readUnsignedByte());
		}
	}
	
	private function onInDisconnect(disconnectCallback:Int -> Int -> Void, joint_nr:Int, command_chunk:ByteArray):Void
	{
		inJointDataCallback.remove(joint_nr);
		disconnectCallback(joint_nr, command_chunk.readUnsignedByte());
	}

	private function onData(bytes:Bytes):Void
	{	
		var myBa:ByteArray = bytes.getData();
		
		if (input.bytesAvailable == 0) { input.clear();}
		var oldpos:Int = input.position;
		try { input.writeBytes(myBa); } catch (unknown : Dynamic) { trace("ERROR: input.writeBytes(myBa) :"+ unknown); }
		input.position = oldpos;
		
		var command_nr:Int=0;
		var server_command:Int=0;
		var j_nr:Int=0;
		
		var weitermachen:Bool = true;
		
		while (input.bytesAvailable > 0 && weitermachen)
		{
			
			if (command_mode)
			{
				if (input.bytesAvailable >= bytes_left) // wenn chunk vollstaendig gelesen wurde
				{	
					// zuerst die nr fuer entsprechenden callback
					try { command_nr = input.readUnsignedByte(); } catch (unknown : Dynamic) { trace("ERROR: var command_nr:Int = input.readUnsignedByte() :"+ unknown); }
					
					//trace("CONTROL COMMAND " + command_nr + " input.bytesAvailable="+input.bytesAvailable+" bytes_left="+bytes_left);
					var command_chunk:ByteArray = new ByteArray();
						
					if (command_nr > 0) // dann eine ANTWORT auf ein gesendetes Command
					{	
						// -1 weil ja schon command_nr gelesen wurde
						try { input.readBytes(command_chunk, 0, bytes_left-1); } catch (unknown : Dynamic) { trace("ERROR: input.readBytes(command_chunk, 0, bytes_left-1) :"+ unknown); }
						
						//command_chunk.position=0; // muss eigentlich nicht sein (habs getestet)
						waitingCommandCallbacks.get(command_nr)(command_chunk); // TODO: optimierung-> warum nicht gleich das input uebergeben und in der funktion auslesen?
						waitingCommandCallbacks.remove(command_nr);
					}
					else // ein Command vom Server (keine Antwort)
					{
						// command auswerten
						try { server_command = input.readUnsignedByte(); } catch (unknown : Dynamic) { trace("ERROR:  var server_command:Int = input.readUnsignedByte() :"+ unknown); }
						
						// joint_nr auf den sich das command bezieht
						try { j_nr = input.readUnsignedByte(); } catch (unknown : Dynamic) { trace("ERROR:  var j_nr:Int = input.readUnsignedByte() :"+ unknown); }
						
						// -3 weil ja schon command_nr,server_command und j_nr gelesen wurde
						try { input.readBytes(command_chunk, 0, bytes_left-3); } catch (unknown : Dynamic) { trace("ERROR:  input.readBytes(command_chunk, 0, bytes_left-3) :"+ unknown); }
						
						if (server_command == 0) 
						{
							ownUserConnectCallback.get(j_nr)(command_chunk); // TODO: optimierung-> warum nicht gleich das input uebergeben und in der funktion auslesen? 
						}
						else if (server_command == 1)
						{
							ownUserDisconnectCallback.get(j_nr)(command_chunk);
						}
						else if (server_command == 2)
						{
							inDisconnectCallback.get(j_nr)(command_chunk);
						}
						//else if (server_command == 255)// keepalive
						//else trace("ERROR:kein gueltiges Servercommand"); // TODO
					}
					
					command_mode = false;
					bytes_left = 0;
				}
				else
				{
					weitermachen = false;
				}
			}
			else if (bytes_left == 0) // --- neue Chunk-Size noch NICHT uebermittelt  ------
			{
				//trace("INPUT: bytes_left=" + bytes_left);
				
				joint_nr = -1; // neuer chunk, also erstmal joint_nr auf -1 setzen
				user_nr = -1; // neuer chunk, also erstmal user_nr auf -1 setzen
				
				//trace("INPUT: input.bytesAvailable=" + input.bytesAvailable);
				if (input.bytesAvailable >= 2 )
				{
					// chunk size erstes byte laden
					var size_1:Int=0; 
					var size_2:Int=0;
					
					try { size_1 = input.readUnsignedByte();} catch (unknown : Dynamic) { trace("ERROR: size_1 = input.readUnsignedByte() :"+ unknown); }
					
					//trace("INPUT: size_1=" + size_1);
					
					if (size_1 < 128) // kleiner chunk
					{
						// TODO: wenn die size == 1 ist, kann dies VORKOMMEN?
						// evtl. nun special-case, also dann ist es ein
						// COMMAND vom SERVER, z.b. wenn neuer joint eroeffnet wurde!!!
						
						if (size_1 == 0) // oder CONTROL COMMAND ANTWORT ------------------
						{	
							// commands immer nur mit kleinem chunk
							try { bytes_left = input.readUnsignedByte(); } catch (unknown : Dynamic) { trace("ERROR: bytes_left = input.readUnsignedByte() :"+ unknown); }
							command_mode = true;
						}
						else // kleiner chunk
						{
							bytes_left = size_1;
						}
						
					}
					else // grosser Chunk!
					{
						try { size_2 = input.readUnsignedByte();} catch (unknown : Dynamic) { trace("ERROR: size_2 = input.readUnsignedByte() :"+ unknown); }
						bytes_left = (size_1 - 128) * 256 + size_2;
						//trace("GROSSER CHUNK: bytes_left=" + bytes_left);
					}
					
					//trace("ChunkSize:"+bytes_left);
					
				}
				else
				{	// es fehlt noch mehr um ueberhaupt erst loszulegen, also 
					weitermachen = false;
				}
				
				
			}
			else // -------------- Chunk-Size ist uebermittelt  -------------------
			{	
				//trace("bytes_left=" + bytes_left);
				if (joint_nr == -1) // joint_nr wurde noch nicht uebermittelt
				{
					if (input.bytesAvailable >= 1) // grab joint_nr ----------
					{
						try { joint_nr = input.readUnsignedByte(); } catch (unknown : Dynamic) { trace("ERROR: joint_nr = input.readUnsignedByte() :"+ unknown); }
						bytes_left--;
						//trace("joint_nr ist ermittelt :"+joint_nr);
					} else trace("joint_nr KANN NOCH NICHT ERMITTELT WERDEN DA  input.bytesAvailable:"+input.bytesAvailable);
					
				}
				else // chunk-size UND joint_nr wurden uebermittelt
				{
					
					if (joint_nr >= 128) // Daten an OWN JOINT --------------
					{
						if (user_nr == -1) // user_nr noch nicht uebermittelt
						{
							if (input.bytesAvailable >= 1)
							{
								try { user_nr = input.readUnsignedByte();} catch (unknown : Dynamic) { trace("ERROR: user_nr = input.readUnsignedByte() :"+ unknown); }
								bytes_left--;
								//trace("user_nr ist ermittelt :"+user_nr);
							}
						}
						else // user_nr ist uebermittelt
						{
							
							var data_chunk:ByteArray = new ByteArray(); // TODO: PERFORMANCE!! (auslagern damit nicht immer neu erstellt wird)
							var avail:UInt = input.bytesAvailable;
							if (avail >= bytes_left) // wenn chunk schon vollstaendig da ist
							{								
								try { input.readBytes(data_chunk, 0, bytes_left);} catch (unknown : Dynamic) { trace("ERROR: input.readBytes(data_chunk, 0, bytes_left) :"+ unknown); }
								ownJointDataCallback.get(joint_nr - 128)(joint_nr-128, user_nr, Bytes.ofData(data_chunk));
								bytes_left = 0;
							}
							else // chunk abziehen und ausgeben was bereits vorhanden ist
							{
								try { input.readBytes(data_chunk, 0, avail);} catch (unknown : Dynamic) { trace("ERROR: input.readBytes(data_chunk, 0, avail) :"+ unknown); }
								ownJointDataCallback.get(joint_nr - 128)(joint_nr-128, user_nr, Bytes.ofData(data_chunk));
								bytes_left -= avail;
							}
							//trace("Data OWN: left="+bytes_left);
							
						}
						
						
					}
					else  // Daten an IN JOINT -----------------------------
					{
						var data_chunk:ByteArray = new ByteArray(); // TODO: PERFORMANCE!! (auslagern damit nicht immer neu erstellt wird)
						var avail:UInt = input.bytesAvailable;
						if (avail >= bytes_left) // wenn chunk schon vollstaendig da ist
						{	//trace("Daten an IN JOINT : chunk vollstaendig geladen");							
							try { input.readBytes(data_chunk, 0, bytes_left);} catch (unknown : Dynamic) { trace("ERROR: input.readBytes(data_chunk, 0, bytes_left) :"+ unknown); }
							inJointDataCallback.get(joint_nr)(joint_nr, Bytes.ofData(data_chunk));  // TODO: hier kommt ERROR-> beim debug war joint_nr TOTAL falsch!!!
							bytes_left = 0;
						}
						else // chunk abziehen und ausgeben was bereits vorhanden ist
						{	//trace("Daten an IN JOINT : chunk "+avail+" bytes geladen");
							try { input.readBytes(data_chunk, 0, avail);} catch (unknown : Dynamic) { trace("ERROR: input.readBytes(data_chunk, 0, avail) :"+ unknown); }
							inJointDataCallback.get(joint_nr)(joint_nr, Bytes.ofData(data_chunk));
							//bytes_left -= input.bytesAvailable;
							bytes_left -= avail;
						}
						//trace("Data IN: left="+bytes_left);
						
					}
					
					
				}
				
			}
			
			
		} // end while
	
	}
	

	public function sendStringToJointIn(joint_nr:Int, msg:String):Void
	{
		sendDataToJointIn(joint_nr, Bytes.ofString(msg));
	}
	
	public function sendDataToJointIn(joint_nr:Int, ba:Bytes):Void
	{	
		if (ba.length <= 32767 - 2)
		{
			writeChunkSize(ba.length+1);
			writeByte(joint_nr);
			writeBytes(ba);
			flush();
		}
		else
		{
			var pos:Int = 0;
			var len:Int;
			while (pos < ba.length)
			{	
				len =  (ba.length - pos < 32767 - 2) ? ba.length - pos : 32767 - 2;
				
				writeChunkSize(len+1);
				writeByte(joint_nr);
				writeFullBytes(ba, pos, len);
				flush();
				
				pos += len;
			}
		}
	}
	
	public function sendStringToJointOwn(joint_nr:Int, user_nr:Int, msg:String):Void
	{
		sendDataToJointOwn(joint_nr, user_nr, Bytes.ofString(msg));
	}
	
	public function sendDataToJointOwn(joint_nr:Int, user_nr:Int, ba:Bytes):Void
	{
		if (ba.length <= 32767 - 2)
		{
			writeChunkSize(ba.length+2);
			writeByte(joint_nr+128);
			writeByte(user_nr);
			writeBytes(ba);
			flush();
		}
		else
		{
			var pos:Int = 0;
			var len:Int;
			while (pos < ba.length)
			{	
				len =  (ba.length - pos < 32767 - 2) ? ba.length - pos : 32767 - 2;
				
				writeChunkSize(len+2);
				writeByte(joint_nr + 128);
				writeByte(user_nr);
				writeFullBytes(ba, pos, len);
				flush();
				
				pos += len;
			}
			
		}
	}
	
	public function sendChunk(bytes:Bytes):Void 
	{
		writeChunkSize(bytes.length);
		writeBytes(bytes);
		flush();
	}
	
	public function writeChunkSize(chunk_size:Int):Void
	{
		// TODO: chunk_size darf max 32767 sein 
		// grosser oder kleiner chunk
		if (chunk_size < 128)
		{
			writeByte(chunk_size);
		}
		else
		{
			writeByte( (chunk_size>>8)+128 );
			writeByte(  chunk_size & 255 );
		}		
	}
	
}

