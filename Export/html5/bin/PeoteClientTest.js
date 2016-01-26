(function (console, $hx_exports, $global) { "use strict";
$hx_exports.lime = $hx_exports.lime || {};
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var ApplicationMain = function() { };
$hxClasses["ApplicationMain"] = ApplicationMain;
ApplicationMain.__name__ = true;
ApplicationMain.create = function() {
	ApplicationMain.preloader = new lime_app_Preloader();
	ApplicationMain.app = new PeoteClientTest();
	ApplicationMain.app.setPreloader(ApplicationMain.preloader);
	ApplicationMain.app.create(ApplicationMain.config);
	ApplicationMain.preloader.onComplete.add(ApplicationMain.start);
	ApplicationMain.preloader.create(ApplicationMain.config);
	var urls = [];
	var types = [];
	urls.push("assets/openfl.svg");
	types.push("TEXT");
	if(ApplicationMain.config.assetsPrefix != null) {
		var _g1 = 0;
		var _g = urls.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(types[i] != "FONT") urls[i] = ApplicationMain.config.assetsPrefix + urls[i];
		}
	}
	ApplicationMain.preloader.load(urls,types);
};
ApplicationMain.main = function() {
	ApplicationMain.config = { build : "95", company : "Sylvio Sell - maitag", file : "PeoteClientTest", fps : 60, name : "PeoteNetTest", orientation : "", packageName : "de.peote.net", version : "0.1.0", windows : [{ antialiasing : 0, background : 16777215, borderless : false, depthBuffer : false, display : 0, fullscreen : false, hardware : true, height : 0, parameters : "{}", resizable : true, stencilBuffer : false, title : "PeoteNetTest", vsync : false, width : 0, x : null, y : null}]};
};
ApplicationMain.start = function() {
	var result = ApplicationMain.app.exec();
};
var lime_AssetLibrary = function() {
	this.onChange = new lime_app_Event_$Void_$Void();
};
$hxClasses["lime.AssetLibrary"] = lime_AssetLibrary;
lime_AssetLibrary.__name__ = true;
lime_AssetLibrary.prototype = {
	exists: function(id,type) {
		return false;
	}
	,getAudioBuffer: function(id) {
		return null;
	}
	,getBytes: function(id) {
		return null;
	}
	,getFont: function(id) {
		return null;
	}
	,getImage: function(id) {
		return null;
	}
	,getPath: function(id) {
		return null;
	}
	,getText: function(id) {
		var bytes = this.getBytes(id);
		if(bytes == null) return null; else return bytes.getString(0,bytes.length);
	}
	,isLocal: function(id,type) {
		return true;
	}
	,list: function(type) {
		return null;
	}
	,load: function() {
		var _g = this;
		return new lime_app_Future(function() {
			return _g;
		});
	}
	,loadAudioBuffer: function(id) {
		var _g = this;
		return new lime_app_Future(function() {
			return _g.getAudioBuffer(id);
		});
	}
	,loadBytes: function(id) {
		var _g = this;
		return new lime_app_Future(function() {
			return _g.getBytes(id);
		});
	}
	,loadFont: function(id) {
		var _g = this;
		return new lime_app_Future(function() {
			return _g.getFont(id);
		});
	}
	,loadImage: function(id) {
		var _g = this;
		return new lime_app_Future(function() {
			return _g.getImage(id);
		});
	}
	,loadText: function(id) {
		return this.loadBytes(id).then(function(bytes) {
			return new lime_app_Future(function() {
				if(bytes == null) return null; else return bytes.getString(0,bytes.length);
			});
		});
	}
	,unload: function() {
	}
	,__class__: lime_AssetLibrary
};
var DefaultAssetLibrary = function() {
	this.type = new haxe_ds_StringMap();
	this.path = new haxe_ds_StringMap();
	this.className = new haxe_ds_StringMap();
	lime_AssetLibrary.call(this);
	var id;
	id = "assets/openfl.svg";
	this.path.set(id,id);
	this.type.set(id,"TEXT");
	var assetsPrefix = null;
	if(ApplicationMain.config != null && Object.prototype.hasOwnProperty.call(ApplicationMain.config,"assetsPrefix")) assetsPrefix = ApplicationMain.config.assetsPrefix;
	if(assetsPrefix != null) {
		var $it0 = this.path.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			var value = assetsPrefix + this.path.get(k);
			this.path.set(k,value);
		}
	}
};
$hxClasses["DefaultAssetLibrary"] = DefaultAssetLibrary;
DefaultAssetLibrary.__name__ = true;
DefaultAssetLibrary.__super__ = lime_AssetLibrary;
DefaultAssetLibrary.prototype = $extend(lime_AssetLibrary.prototype,{
	exists: function(id,type) {
		var requestedType;
		if(type != null) requestedType = js_Boot.__cast(type , String); else requestedType = null;
		var assetType = this.type.get(id);
		if(assetType != null) {
			if(assetType == requestedType || (requestedType == "SOUND" || requestedType == "MUSIC") && (assetType == "MUSIC" || assetType == "SOUND")) return true;
			if(requestedType == "BINARY" || requestedType == null || assetType == "BINARY" && requestedType == "TEXT") return true;
		}
		return false;
	}
	,getAudioBuffer: function(id) {
		return null;
	}
	,getBytes: function(id) {
		var loader;
		var key = this.path.get(id);
		loader = lime_app_Preloader.loaders.get(key);
		if(loader == null) return null;
		var bytes = loader.bytes;
		if(bytes != null) return bytes; else return null;
	}
	,getFont: function(id) {
		return js_Boot.__cast(Type.createInstance(this.className.get(id),[]) , lime_text_Font);
	}
	,getImage: function(id) {
		return lime_graphics_Image.fromImageElement((function($this) {
			var $r;
			var key = $this.path.get(id);
			$r = lime_app_Preloader.images.get(key);
			return $r;
		}(this)));
	}
	,getPath: function(id) {
		return this.path.get(id);
	}
	,getText: function(id) {
		var loader;
		var key = this.path.get(id);
		loader = lime_app_Preloader.loaders.get(key);
		if(loader == null) return null;
		var bytes = loader.bytes;
		if(bytes != null) return bytes.getString(0,bytes.length); else return null;
	}
	,isLocal: function(id,type) {
		var requestedType;
		if(type != null) requestedType = js_Boot.__cast(type , String); else requestedType = null;
		return true;
	}
	,list: function(type) {
		var requestedType;
		if(type != null) requestedType = js_Boot.__cast(type , String); else requestedType = null;
		var items = [];
		var $it0 = this.type.keys();
		while( $it0.hasNext() ) {
			var id = $it0.next();
			if(requestedType == null || this.exists(id,type)) items.push(id);
		}
		return items;
	}
	,loadAudioBuffer: function(id) {
		var _g = this;
		var promise = new lime_app_Promise();
		promise.completeWith(new lime_app_Future(function() {
			return _g.getAudioBuffer(id);
		}));
		return promise.future;
	}
	,loadBytes: function(id) {
		var promise = new lime_app_Promise();
		if(this.path.exists(id)) {
			var request = new lime_net_HTTPRequest();
			promise.completeWith(request.load(this.path.get(id) + "?" + lime_Assets.cache.version));
		} else promise.complete(this.getBytes(id));
		return promise.future;
	}
	,loadImage: function(id) {
		var promise = new lime_app_Promise();
		if(this.path.exists(id)) {
			var image = new Image();
			image.onload = function(_) {
				promise.complete(lime_graphics_Image.fromImageElement(image));
			};
			image.onerror = $bind(promise,promise.error);
			image.src = this.path.get(id) + "?" + lime_Assets.cache.version;
		} else promise.complete(this.getImage(id));
		return promise.future;
	}
	,loadText: function(id) {
		var promise = new lime_app_Promise();
		if(this.path.exists(id)) {
			var request = new lime_net_HTTPRequest();
			var future = request.load(this.path.get(id) + "?" + lime_Assets.cache.version);
			future.onProgress(function(progress) {
				promise.progress(progress);
			});
			future.onError(function(msg) {
				promise.error(msg);
			});
			future.onComplete(function(bytes) {
				promise.complete(bytes.getString(0,bytes.length));
			});
		} else promise.complete(this.getText(id));
		return promise.future;
	}
	,__class__: DefaultAssetLibrary
});
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,__class__: List
};
Math.__name__ = true;
var lime_app_IModule = function() { };
$hxClasses["lime.app.IModule"] = lime_app_IModule;
lime_app_IModule.__name__ = true;
lime_app_IModule.prototype = {
	__class__: lime_app_IModule
};
var lime_app_Module = function() {
	this.onExit = new lime_app_Event_$Int_$Void();
};
$hxClasses["lime.app.Module"] = lime_app_Module;
lime_app_Module.__name__ = true;
lime_app_Module.__interfaces__ = [lime_app_IModule];
lime_app_Module.prototype = {
	onGamepadAxisMove: function(gamepad,axis,value) {
	}
	,onGamepadButtonDown: function(gamepad,button) {
	}
	,onGamepadButtonUp: function(gamepad,button) {
	}
	,onGamepadConnect: function(gamepad) {
		haxe_Log.trace("onGamepadConnect (module)",{ fileName : "Module.hx", lineNumber : 64, className : "lime.app.Module", methodName : "onGamepadConnect"});
	}
	,onGamepadDisconnect: function(gamepad) {
	}
	,onJoystickAxisMove: function(joystick,axis,value) {
	}
	,onJoystickButtonDown: function(joystick,button) {
	}
	,onJoystickButtonUp: function(joystick,button) {
	}
	,onJoystickConnect: function(joystick) {
	}
	,onJoystickDisconnect: function(joystick) {
	}
	,onJoystickHatMove: function(joystick,hat,position) {
	}
	,onJoystickTrackballMove: function(joystick,trackball,value) {
	}
	,onKeyDown: function(window,keyCode,modifier) {
	}
	,onKeyUp: function(window,keyCode,modifier) {
	}
	,onModuleExit: function(code) {
	}
	,onMouseDown: function(window,x,y,button) {
	}
	,onMouseMove: function(window,x,y) {
	}
	,onMouseMoveRelative: function(window,x,y) {
	}
	,onMouseUp: function(window,x,y,button) {
	}
	,onMouseWheel: function(window,deltaX,deltaY) {
	}
	,onPreloadComplete: function() {
	}
	,onPreloadProgress: function(loaded,total) {
	}
	,onRenderContextLost: function(renderer) {
	}
	,onRenderContextRestored: function(renderer,context) {
	}
	,onTextEdit: function(window,text,start,length) {
	}
	,onTextInput: function(window,text) {
	}
	,onTouchEnd: function(touch) {
	}
	,onTouchMove: function(touch) {
	}
	,onTouchStart: function(touch) {
	}
	,onWindowActivate: function(window) {
	}
	,onWindowClose: function(window) {
	}
	,onWindowCreate: function(window) {
	}
	,onWindowDeactivate: function(window) {
	}
	,onWindowEnter: function(window) {
	}
	,onWindowFocusIn: function(window) {
	}
	,onWindowFocusOut: function(window) {
	}
	,onWindowFullscreen: function(window) {
	}
	,onWindowLeave: function(window) {
	}
	,onWindowMove: function(window,x,y) {
	}
	,onWindowMinimize: function(window) {
	}
	,onWindowResize: function(window,width,height) {
	}
	,onWindowRestore: function(window) {
	}
	,render: function(renderer) {
	}
	,update: function(deltaTime) {
	}
	,__class__: lime_app_Module
};
var lime_app_Application = function() {
	this.onUpdate = new lime_app_Event_$Int_$Void();
	lime_app_Module.call(this);
	if(lime_app_Application.current == null) lime_app_Application.current = this;
	this.modules = [];
	this.renderers = [];
	this.windows = [];
	this.windowByID = new haxe_ds_IntMap();
	this.backend = new lime__$backend_html5_HTML5Application(this);
	this.onExit.add($bind(this,this.onModuleExit));
	this.onUpdate.add($bind(this,this.update));
	lime_ui_Gamepad.onConnect.add($bind(this,this.__onGamepadConnect));
	lime_ui_Joystick.onConnect.add($bind(this,this.__onJoystickConnect));
	lime_ui_Touch.onStart.add($bind(this,this.onTouchStart));
	lime_ui_Touch.onMove.add($bind(this,this.onTouchMove));
	lime_ui_Touch.onEnd.add($bind(this,this.onTouchEnd));
};
$hxClasses["lime.app.Application"] = lime_app_Application;
lime_app_Application.__name__ = true;
lime_app_Application.__super__ = lime_app_Module;
lime_app_Application.prototype = $extend(lime_app_Module.prototype,{
	addModule: function(module) {
		this.modules.push(module);
		if(this.windows.length > 0) {
			var _g = 0;
			var _g1 = this.windows;
			while(_g < _g1.length) {
				var $window = _g1[_g];
				++_g;
				module.onWindowCreate($window);
			}
			if(this.preloader == null || this.preloader.complete) module.onPreloadComplete();
		}
	}
	,addRenderer: function(renderer) {
		renderer.onRender.add((function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.render),renderer));
		renderer.onContextLost.add((function(f1,a11) {
			return function() {
				f1(a11);
			};
		})($bind(this,this.onRenderContextLost),renderer));
		renderer.onContextRestored.add((function(f2,a12) {
			return function(a2) {
				f2(a12,a2);
			};
		})($bind(this,this.onRenderContextRestored),renderer));
		this.renderers.push(renderer);
	}
	,create: function(config) {
		this.config = config;
		this.backend.create(config);
		if(config != null) {
			if(Object.prototype.hasOwnProperty.call(config,"fps")) this.backend.setFrameRate(config.fps);
			if(Object.prototype.hasOwnProperty.call(config,"windows")) {
				var _g = 0;
				var _g1 = config.windows;
				while(_g < _g1.length) {
					var windowConfig = _g1[_g];
					++_g;
					var $window = new lime_ui_Window(windowConfig);
					this.createWindow($window);
					break;
				}
			}
			if(this.preloader == null || this.preloader.complete) this.onPreloadComplete();
		}
	}
	,createWindow: function(window) {
		window.onActivate.add((function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.onWindowActivate),window));
		window.onClose.add((function(f1,a11) {
			return function() {
				f1(a11);
			};
		})($bind(this,this.onWindowClose),window));
		window.onCreate.add((function(f2,a12) {
			return function() {
				f2(a12);
			};
		})($bind(this,this.onWindowCreate),window));
		window.onDeactivate.add((function(f3,a13) {
			return function() {
				f3(a13);
			};
		})($bind(this,this.onWindowDeactivate),window));
		window.onEnter.add((function(f4,a14) {
			return function() {
				f4(a14);
			};
		})($bind(this,this.onWindowEnter),window));
		window.onFocusIn.add((function(f5,a15) {
			return function() {
				f5(a15);
			};
		})($bind(this,this.onWindowFocusIn),window));
		window.onFocusOut.add((function(f6,a16) {
			return function() {
				f6(a16);
			};
		})($bind(this,this.onWindowFocusOut),window));
		window.onFullscreen.add((function(f7,a17) {
			return function() {
				f7(a17);
			};
		})($bind(this,this.onWindowFullscreen),window));
		window.onKeyDown.add((function(f8,a18) {
			return function(a2,a3) {
				f8(a18,a2,a3);
			};
		})($bind(this,this.onKeyDown),window));
		window.onKeyUp.add((function(f9,a19) {
			return function(a21,a31) {
				f9(a19,a21,a31);
			};
		})($bind(this,this.onKeyUp),window));
		window.onLeave.add((function(f10,a110) {
			return function() {
				f10(a110);
			};
		})($bind(this,this.onWindowLeave),window));
		window.onMinimize.add((function(f11,a111) {
			return function() {
				f11(a111);
			};
		})($bind(this,this.onWindowMinimize),window));
		window.onMouseDown.add((function(f12,a112) {
			return function(x,y,a22) {
				f12(a112,x,y,a22);
			};
		})($bind(this,this.onMouseDown),window));
		window.onMouseMove.add((function(f13,a113) {
			return function(x1,y1) {
				f13(a113,x1,y1);
			};
		})($bind(this,this.onMouseMove),window));
		window.onMouseMoveRelative.add((function(f14,a114) {
			return function(x2,y2) {
				f14(a114,x2,y2);
			};
		})($bind(this,this.onMouseMoveRelative),window));
		window.onMouseUp.add((function(f15,a115) {
			return function(x3,y3,a23) {
				f15(a115,x3,y3,a23);
			};
		})($bind(this,this.onMouseUp),window));
		window.onMouseWheel.add((function(f16,a116) {
			return function(a24,a32) {
				f16(a116,a24,a32);
			};
		})($bind(this,this.onMouseWheel),window));
		window.onMove.add((function(f17,a117) {
			return function(x4,y4) {
				f17(a117,x4,y4);
			};
		})($bind(this,this.onWindowMove),window));
		window.onResize.add((function(f18,a118) {
			return function(a25,a33) {
				f18(a118,a25,a33);
			};
		})($bind(this,this.onWindowResize),window));
		window.onRestore.add((function(f19,a119) {
			return function() {
				f19(a119);
			};
		})($bind(this,this.onWindowRestore),window));
		window.onTextEdit.add((function(f20,a120) {
			return function(a26,a34,a4) {
				f20(a120,a26,a34,a4);
			};
		})($bind(this,this.onTextEdit),window));
		window.onTextInput.add((function(f21,a121) {
			return function(a27) {
				f21(a121,a27);
			};
		})($bind(this,this.onTextInput),window));
		if(window.renderer == null) {
			var renderer = new lime_graphics_Renderer(window);
			this.addRenderer(renderer);
		}
		window.create(this);
		this.windows.push(window);
		this.windowByID.h[window.id] = window;
		window.onCreate.dispatch();
	}
	,exec: function() {
		lime_app_Application.current = this;
		return this.backend.exec();
	}
	,onGamepadAxisMove: function(gamepad,axis,value) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onGamepadAxisMove(gamepad,axis,value);
		}
	}
	,onGamepadButtonDown: function(gamepad,button) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onGamepadButtonDown(gamepad,button);
		}
	}
	,onGamepadButtonUp: function(gamepad,button) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onGamepadButtonUp(gamepad,button);
		}
	}
	,onGamepadConnect: function(gamepad) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onGamepadConnect(gamepad);
		}
	}
	,onGamepadDisconnect: function(gamepad) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onGamepadDisconnect(gamepad);
		}
	}
	,onJoystickAxisMove: function(joystick,axis,value) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onJoystickAxisMove(joystick,axis,value);
		}
	}
	,onJoystickButtonDown: function(joystick,button) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onJoystickButtonDown(joystick,button);
		}
	}
	,onJoystickButtonUp: function(joystick,button) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onJoystickButtonUp(joystick,button);
		}
	}
	,onJoystickConnect: function(joystick) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onJoystickConnect(joystick);
		}
	}
	,onJoystickDisconnect: function(joystick) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onJoystickDisconnect(joystick);
		}
	}
	,onJoystickHatMove: function(joystick,hat,position) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onJoystickHatMove(joystick,hat,position);
		}
	}
	,onJoystickTrackballMove: function(joystick,trackball,value) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onJoystickTrackballMove(joystick,trackball,value);
		}
	}
	,onKeyDown: function(window,keyCode,modifier) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onKeyDown(window,keyCode,modifier);
		}
	}
	,onKeyUp: function(window,keyCode,modifier) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onKeyUp(window,keyCode,modifier);
		}
	}
	,onModuleExit: function(code) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onModuleExit(code);
		}
		this.backend.exit();
	}
	,onMouseDown: function(window,x,y,button) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onMouseDown(window,x,y,button);
		}
	}
	,onMouseMove: function(window,x,y) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onMouseMove(window,x,y);
		}
	}
	,onMouseMoveRelative: function(window,x,y) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onMouseMoveRelative(window,x,y);
		}
	}
	,onMouseUp: function(window,x,y,button) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onMouseUp(window,x,y,button);
		}
	}
	,onMouseWheel: function(window,deltaX,deltaY) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onMouseWheel(window,deltaX,deltaY);
		}
	}
	,onPreloadComplete: function() {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onPreloadComplete();
		}
	}
	,onPreloadProgress: function(loaded,total) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onPreloadProgress(loaded,total);
		}
	}
	,onRenderContextLost: function(renderer) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onRenderContextLost(renderer);
		}
	}
	,onRenderContextRestored: function(renderer,context) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onRenderContextRestored(renderer,context);
		}
	}
	,onTextEdit: function(window,text,start,length) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onTextEdit(window,text,start,length);
		}
	}
	,onTextInput: function(window,text) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onTextInput(window,text);
		}
	}
	,onTouchEnd: function(touch) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onTouchEnd(touch);
		}
	}
	,onTouchMove: function(touch) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onTouchMove(touch);
		}
	}
	,onTouchStart: function(touch) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onTouchStart(touch);
		}
	}
	,onWindowActivate: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowActivate(window);
		}
	}
	,onWindowClose: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowClose(window);
		}
		this.removeWindow(window);
	}
	,onWindowCreate: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowCreate(window);
		}
	}
	,onWindowDeactivate: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowDeactivate(window);
		}
	}
	,onWindowEnter: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowEnter(window);
		}
	}
	,onWindowFocusIn: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowFocusIn(window);
		}
	}
	,onWindowFocusOut: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowFocusOut(window);
		}
	}
	,onWindowFullscreen: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowFullscreen(window);
		}
	}
	,onWindowLeave: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowLeave(window);
		}
	}
	,onWindowMinimize: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowMinimize(window);
		}
	}
	,onWindowMove: function(window,x,y) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowMove(window,x,y);
		}
	}
	,onWindowResize: function(window,width,height) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowResize(window,width,height);
		}
	}
	,onWindowRestore: function(window) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.onWindowRestore(window);
		}
	}
	,removeModule: function(module) {
		if(module != null) {
			module.onModuleExit(0);
			HxOverrides.remove(this.modules,module);
		}
	}
	,removeRenderer: function(renderer) {
		if(renderer != null && HxOverrides.indexOf(this.renderers,renderer,0) > -1) HxOverrides.remove(this.renderers,renderer);
	}
	,removeWindow: function(window) {
		if(window != null && this.windowByID.h.hasOwnProperty(window.id)) {
			HxOverrides.remove(this.windows,window);
			this.windowByID.remove(window.id);
			window.close();
			if(this.windows[0] == window) this.window = null;
		}
	}
	,render: function(renderer) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.render(renderer);
		}
	}
	,setPreloader: function(preloader) {
		if(this.preloader != null) {
			this.preloader.onProgress.remove($bind(this,this.onPreloadProgress));
			this.preloader.onComplete.remove($bind(this,this.onPreloadComplete));
		}
		this.preloader = preloader;
		if(preloader.complete) this.onPreloadComplete(); else {
			preloader.onProgress.add($bind(this,this.onPreloadProgress));
			preloader.onComplete.add($bind(this,this.onPreloadComplete));
		}
	}
	,update: function(deltaTime) {
		var _g = 0;
		var _g1 = this.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.update(deltaTime);
		}
	}
	,__onGamepadConnect: function(gamepad) {
		this.onGamepadConnect(gamepad);
		gamepad.onAxisMove.add((function(f,a1) {
			return function(a2,a3) {
				f(a1,a2,a3);
			};
		})($bind(this,this.onGamepadAxisMove),gamepad));
		gamepad.onButtonDown.add((function(f1,a11) {
			return function(a21) {
				f1(a11,a21);
			};
		})($bind(this,this.onGamepadButtonDown),gamepad));
		gamepad.onButtonUp.add((function(f2,a12) {
			return function(a22) {
				f2(a12,a22);
			};
		})($bind(this,this.onGamepadButtonUp),gamepad));
		gamepad.onDisconnect.add((function(f3,a13) {
			return function() {
				f3(a13);
			};
		})($bind(this,this.onGamepadDisconnect),gamepad));
	}
	,__onJoystickConnect: function(joystick) {
		this.onJoystickConnect(joystick);
		joystick.onAxisMove.add((function(f,a1) {
			return function(a2,a3) {
				f(a1,a2,a3);
			};
		})($bind(this,this.onJoystickAxisMove),joystick));
		joystick.onButtonDown.add((function(f1,a11) {
			return function(a21) {
				f1(a11,a21);
			};
		})($bind(this,this.onJoystickButtonDown),joystick));
		joystick.onButtonUp.add((function(f2,a12) {
			return function(a22) {
				f2(a12,a22);
			};
		})($bind(this,this.onJoystickButtonUp),joystick));
		joystick.onDisconnect.add((function(f3,a13) {
			return function() {
				f3(a13);
			};
		})($bind(this,this.onJoystickDisconnect),joystick));
		joystick.onHatMove.add((function(f4,a14) {
			return function(a23,a31) {
				f4(a14,a23,a31);
			};
		})($bind(this,this.onJoystickHatMove),joystick));
		joystick.onTrackballMove.add((function(f5,a15) {
			return function(a24,a32) {
				f5(a15,a24,a32);
			};
		})($bind(this,this.onJoystickTrackballMove),joystick));
	}
	,get_frameRate: function() {
		return this.backend.getFrameRate();
	}
	,set_frameRate: function(value) {
		return this.backend.setFrameRate(value);
	}
	,get_renderer: function() {
		return this.renderers[0];
	}
	,get_window: function() {
		return this.windows[0];
	}
	,__class__: lime_app_Application
});
var PeoteClientTest = function() {
	var _g = this;
	lime_app_Application.call(this);
	this.peoteClient = new PeoteClient({ onEnterJoint : function(jointNr) {
		haxe_Log.trace("onCreateJoint: jointNr=" + jointNr,{ fileName : "PeoteClientTest.hx", lineNumber : 22, className : "PeoteClientTest", methodName : "new"});
		_g.peoteClient.send([1,2,3]);
	}, onEnterJointError : function(errorNr) {
		haxe_Log.trace("onCreateJointError:" + errorNr,{ fileName : "PeoteClientTest.hx", lineNumber : 30, className : "PeoteClientTest", methodName : "new"});
	}, onDisconnect : function(jointNr1,reason) {
		haxe_Log.trace("onUserDisconnect: jointNr=" + jointNr1 + ", reason=" + reason,{ fileName : "PeoteClientTest.hx", lineNumber : 33, className : "PeoteClientTest", methodName : "new"});
	}, onData : $bind(this,this.onData)});
	this.peoteClient.enterJoint("localhost",7680,"testserver");
};
$hxClasses["PeoteClientTest"] = PeoteClientTest;
PeoteClientTest.__name__ = true;
PeoteClientTest.__super__ = lime_app_Application;
PeoteClientTest.prototype = $extend(lime_app_Application.prototype,{
	onData: function(jointNr,data) {
		haxe_Log.trace("onData: jointNr=" + jointNr,{ fileName : "PeoteClientTest.hx", lineNumber : 44, className : "PeoteClientTest", methodName : "onData"});
		var bytes = haxe_io_Bytes.ofData(new ArrayBuffer(data.length));
		var _g1 = 0;
		var _g = data.length;
		while(_g1 < _g) {
			var i = _g1++;
			bytes.b[i] = data[i] & 255;
		}
		this.debug_output(bytes);
	}
	,debug_output: function(bytes) {
		var s = "";
		var _g1 = 0;
		var _g = bytes.length;
		while(_g1 < _g) {
			var i = _g1++;
			s += bytes.b[i] + " ";
		}
		haxe_Log.trace("onData:" + s,{ fileName : "PeoteClientTest.hx", lineNumber : 61, className : "PeoteClientTest", methodName : "debug_output"});
	}
	,__class__: PeoteClientTest
});
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
var _$UInt_UInt_$Impl_$ = {};
$hxClasses["_UInt.UInt_Impl_"] = _$UInt_UInt_$Impl_$;
_$UInt_UInt_$Impl_$.__name__ = true;
_$UInt_UInt_$Impl_$.toFloat = function(this1) {
	var $int = this1;
	if($int < 0) return 4294967296.0 + $int; else return $int + 0.0;
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = true;
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
$hxClasses["haxe._Int64.___Int64"] = haxe__$Int64__$_$_$Int64;
haxe__$Int64__$_$_$Int64.__name__ = true;
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.measure = function(f,pos) {
	var t0 = haxe_Timer.stamp();
	var r = f();
	haxe_Log.trace(haxe_Timer.stamp() - t0 + "s",pos);
	return r;
};
haxe_Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_crypto_BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw new js__$Boot_HaxeError("BaseCode : base length must be a power of two.");
	this.base = base;
	this.nbits = nbits;
};
$hxClasses["haxe.crypto.BaseCode"] = haxe_crypto_BaseCode;
haxe_crypto_BaseCode.__name__ = true;
haxe_crypto_BaseCode.prototype = {
	encodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		var size = b.length * 8 / nbits | 0;
		var out = haxe_io_Bytes.alloc(size + (b.length * 8 % nbits == 0?0:1));
		var buf = 0;
		var curbits = 0;
		var mask = (1 << nbits) - 1;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < nbits) {
				curbits += 8;
				buf <<= 8;
				buf |= b.get(pin++);
			}
			curbits -= nbits;
			out.set(pout++,base.b[buf >> curbits & mask]);
		}
		if(curbits > 0) out.set(pout++,base.b[buf << nbits - curbits & mask]);
		return out;
	}
	,__class__: haxe_crypto_BaseCode
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
$hxClasses["haxe.ds._StringMap.StringMapIterator"] = haxe_ds__$StringMap_StringMapIterator;
haxe_ds__$StringMap_StringMapIterator.__name__ = true;
haxe_ds__$StringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.ofString = function(s) {
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) return hb;
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		if(srcpos == 0 && len == src.length) this.b.set(src.b,pos); else this.b.set(src.b.subarray(srcpos,srcpos + len),pos);
	}
	,setUInt16: function(pos,v) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		this.data.setUint16(pos,v,true);
	}
	,setInt32: function(pos,v) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		this.data.setInt32(pos,v,true);
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = true;
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxClasses["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
$hxClasses["haxe.io.FPHelper"] = haxe_io_FPHelper;
haxe_io_FPHelper.__name__ = true;
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = true;
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = true;
js_Browser.alert = function(v) {
	window.alert(js_Boot.__string_rec(v,""));
};
var js_html__$CanvasElement_CanvasUtil = function() { };
$hxClasses["js.html._CanvasElement.CanvasUtil"] = js_html__$CanvasElement_CanvasUtil;
js_html__$CanvasElement_CanvasUtil.__name__ = true;
js_html__$CanvasElement_CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0;
	var _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
$hxClasses["js.html.compat.ArrayBuffer"] = js_html_compat_ArrayBuffer;
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
$hxClasses["js.html.compat.DataView"] = js_html_compat_DataView;
js_html_compat_DataView.__name__ = true;
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
$hxClasses["js.html.compat.Uint8Array"] = js_html_compat_Uint8Array;
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var lime_AssetCache = function() {
	this.enabled = true;
	this.audio = new haxe_ds_StringMap();
	this.font = new haxe_ds_StringMap();
	this.image = new haxe_ds_StringMap();
	this.version = Std["int"](Math.random() * 1000000);
};
$hxClasses["lime.AssetCache"] = lime_AssetCache;
lime_AssetCache.__name__ = true;
lime_AssetCache.prototype = {
	clear: function(prefix) {
		if(prefix == null) {
			this.audio = new haxe_ds_StringMap();
			this.font = new haxe_ds_StringMap();
			this.image = new haxe_ds_StringMap();
		} else {
			var keys = this.audio.keys();
			while( keys.hasNext() ) {
				var key = keys.next();
				if(StringTools.startsWith(key,prefix)) this.audio.remove(key);
			}
			var keys1 = this.font.keys();
			while( keys1.hasNext() ) {
				var key1 = keys1.next();
				if(StringTools.startsWith(key1,prefix)) this.font.remove(key1);
			}
			var keys2 = this.image.keys();
			while( keys2.hasNext() ) {
				var key2 = keys2.next();
				if(StringTools.startsWith(key2,prefix)) this.image.remove(key2);
			}
		}
	}
	,__class__: lime_AssetCache
};
var lime_app_Event_$Void_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_Void_Void"] = lime_app_Event_$Void_$Void;
lime_app_Event_$Void_$Void.__name__ = true;
lime_app_Event_$Void_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function() {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i]();
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$Void_$Void
};
var lime_Assets = function() { };
$hxClasses["lime.Assets"] = lime_Assets;
lime_Assets.__name__ = true;
lime_Assets.exists = function(id,type) {
	lime_Assets.initialize();
	if(type == null) type = "BINARY";
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) return library.exists(symbolName,type);
	return false;
};
lime_Assets.getAudioBuffer = function(id,useCache) {
	if(useCache == null) useCache = true;
	lime_Assets.initialize();
	if(useCache && lime_Assets.cache.enabled && lime_Assets.cache.audio.exists(id)) {
		var audio = lime_Assets.cache.audio.get(id);
		if(lime_Assets.isValidAudio(audio)) return audio;
	}
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"SOUND")) {
			if(library.isLocal(symbolName,"SOUND")) {
				var audio1 = library.getAudioBuffer(symbolName);
				if(useCache && lime_Assets.cache.enabled) lime_Assets.cache.audio.set(id,audio1);
				return audio1;
			} else haxe_Log.trace("[Assets] Audio asset \"" + id + "\" exists, but only asynchronously",{ fileName : "Assets.hx", lineNumber : 122, className : "lime.Assets", methodName : "getAudioBuffer"});
		} else haxe_Log.trace("[Assets] There is no audio asset with an ID of \"" + id + "\"",{ fileName : "Assets.hx", lineNumber : 128, className : "lime.Assets", methodName : "getAudioBuffer"});
	} else haxe_Log.trace("[Assets] There is no asset library named \"" + libraryName + "\"",{ fileName : "Assets.hx", lineNumber : 134, className : "lime.Assets", methodName : "getAudioBuffer"});
	return null;
};
lime_Assets.getBytes = function(id) {
	lime_Assets.initialize();
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"BINARY")) {
			if(library.isLocal(symbolName,"BINARY")) return library.getBytes(symbolName); else haxe_Log.trace("[Assets] String or Bytes asset \"" + id + "\" exists, but only asynchronously",{ fileName : "Assets.hx", lineNumber : 171, className : "lime.Assets", methodName : "getBytes"});
		} else haxe_Log.trace("[Assets] There is no String or Bytes asset with an ID of \"" + id + "\"",{ fileName : "Assets.hx", lineNumber : 177, className : "lime.Assets", methodName : "getBytes"});
	} else haxe_Log.trace("[Assets] There is no asset library named \"" + libraryName + "\"",{ fileName : "Assets.hx", lineNumber : 183, className : "lime.Assets", methodName : "getBytes"});
	return null;
};
lime_Assets.getFont = function(id,useCache) {
	if(useCache == null) useCache = true;
	lime_Assets.initialize();
	if(useCache && lime_Assets.cache.enabled && lime_Assets.cache.font.exists(id)) return lime_Assets.cache.font.get(id);
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"FONT")) {
			if(library.isLocal(symbolName,"FONT")) {
				var font = library.getFont(symbolName);
				if(useCache && lime_Assets.cache.enabled) lime_Assets.cache.font.set(id,font);
				return font;
			} else haxe_Log.trace("[Assets] Font asset \"" + id + "\" exists, but only asynchronously",{ fileName : "Assets.hx", lineNumber : 234, className : "lime.Assets", methodName : "getFont"});
		} else haxe_Log.trace("[Assets] There is no Font asset with an ID of \"" + id + "\"",{ fileName : "Assets.hx", lineNumber : 240, className : "lime.Assets", methodName : "getFont"});
	} else haxe_Log.trace("[Assets] There is no asset library named \"" + libraryName + "\"",{ fileName : "Assets.hx", lineNumber : 246, className : "lime.Assets", methodName : "getFont"});
	return null;
};
lime_Assets.getImage = function(id,useCache) {
	if(useCache == null) useCache = true;
	lime_Assets.initialize();
	if(useCache && lime_Assets.cache.enabled && lime_Assets.cache.image.exists(id)) {
		var image = lime_Assets.cache.image.get(id);
		if(lime_Assets.isValidImage(image)) return image;
	}
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"IMAGE")) {
			if(library.isLocal(symbolName,"IMAGE")) {
				var image1 = library.getImage(symbolName);
				if(useCache && lime_Assets.cache.enabled) lime_Assets.cache.image.set(id,image1);
				return image1;
			} else haxe_Log.trace("[Assets] Image asset \"" + id + "\" exists, but only asynchronously",{ fileName : "Assets.hx", lineNumber : 304, className : "lime.Assets", methodName : "getImage"});
		} else haxe_Log.trace("[Assets] There is no Image asset with an ID of \"" + id + "\"",{ fileName : "Assets.hx", lineNumber : 310, className : "lime.Assets", methodName : "getImage"});
	} else haxe_Log.trace("[Assets] There is no asset library named \"" + libraryName + "\"",{ fileName : "Assets.hx", lineNumber : 316, className : "lime.Assets", methodName : "getImage"});
	return null;
};
lime_Assets.getLibrary = function(name) {
	if(name == null || name == "") name = "default";
	return lime_Assets.libraries.get(name);
};
lime_Assets.getPath = function(id) {
	lime_Assets.initialize();
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,null)) return library.getPath(symbolName); else haxe_Log.trace("[Assets] There is no asset with an ID of \"" + id + "\"",{ fileName : "Assets.hx", lineNumber : 364, className : "lime.Assets", methodName : "getPath"});
	} else haxe_Log.trace("[Assets] There is no asset library named \"" + libraryName + "\"",{ fileName : "Assets.hx", lineNumber : 370, className : "lime.Assets", methodName : "getPath"});
	return null;
};
lime_Assets.getText = function(id) {
	lime_Assets.initialize();
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"TEXT")) {
			if(library.isLocal(symbolName,"TEXT")) return library.getText(symbolName); else haxe_Log.trace("[Assets] String asset \"" + id + "\" exists, but only asynchronously",{ fileName : "Assets.hx", lineNumber : 407, className : "lime.Assets", methodName : "getText"});
		} else haxe_Log.trace("[Assets] There is no String asset with an ID of \"" + id + "\"",{ fileName : "Assets.hx", lineNumber : 413, className : "lime.Assets", methodName : "getText"});
	} else haxe_Log.trace("[Assets] There is no asset library named \"" + libraryName + "\"",{ fileName : "Assets.hx", lineNumber : 419, className : "lime.Assets", methodName : "getText"});
	return null;
};
lime_Assets.initialize = function() {
	if(!lime_Assets.initialized) {
		lime_Assets.registerLibrary("default",new DefaultAssetLibrary());
		lime_Assets.initialized = true;
	}
};
lime_Assets.isLocal = function(id,type,useCache) {
	if(useCache == null) useCache = true;
	lime_Assets.initialize();
	if(useCache && lime_Assets.cache.enabled) {
		if(type == "IMAGE" || type == null) {
			if(lime_Assets.cache.image.exists(id)) return true;
		}
		if(type == "FONT" || type == null) {
			if(lime_Assets.cache.font.exists(id)) return true;
		}
		if(type == "SOUND" || type == "MUSIC" || type == null) {
			if(lime_Assets.cache.audio.exists(id)) return true;
		}
	}
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) return library.isLocal(symbolName,type);
	return false;
};
lime_Assets.isValidAudio = function(buffer) {
	return buffer != null;
};
lime_Assets.isValidImage = function(buffer) {
	return true;
};
lime_Assets.list = function(type) {
	lime_Assets.initialize();
	var items = [];
	var $it0 = lime_Assets.libraries.iterator();
	while( $it0.hasNext() ) {
		var library = $it0.next();
		var libraryItems = library.list(type);
		if(libraryItems != null) items = items.concat(libraryItems);
	}
	return items;
};
lime_Assets.loadAudioBuffer = function(id,useCache) {
	if(useCache == null) useCache = true;
	lime_Assets.initialize();
	var promise = new lime_app_Promise();
	if(useCache && lime_Assets.cache.enabled && lime_Assets.cache.audio.exists(id)) {
		var audio = lime_Assets.cache.audio.get(id);
		if(lime_Assets.isValidAudio(audio)) {
			promise.complete(audio);
			return promise.future;
		}
	}
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"SOUND")) {
			var future = library.loadAudioBuffer(symbolName);
			if(useCache && lime_Assets.cache.enabled) future.onComplete(function(audio1) {
				lime_Assets.cache.audio.set(id,audio1);
			});
			promise.completeWith(future);
		} else promise.error("[Assets] There is no audio asset with an ID of \"" + id + "\"");
	} else promise.error("[Assets] There is no asset library named \"" + libraryName + "\"");
	return promise.future;
};
lime_Assets.loadBytes = function(id) {
	lime_Assets.initialize();
	var promise = new lime_app_Promise();
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"BINARY")) promise.completeWith(library.loadBytes(symbolName)); else promise.error("[Assets] There is no String or Bytes asset with an ID of \"" + id + "\"");
	} else promise.error("[Assets] There is no asset library named \"" + libraryName + "\"");
	return promise.future;
};
lime_Assets.loadFont = function(id) {
	lime_Assets.initialize();
	var promise = new lime_app_Promise();
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"FONT")) promise.completeWith(library.loadFont(symbolName)); else promise.error("[Assets] There is no Font asset with an ID of \"" + id + "\"");
	} else promise.error("[Assets] There is no asset library named \"" + libraryName + "\"");
	return promise.future;
};
lime_Assets.loadImage = function(id,useCache) {
	if(useCache == null) useCache = true;
	lime_Assets.initialize();
	var promise = new lime_app_Promise();
	if(useCache && lime_Assets.cache.enabled && lime_Assets.cache.image.exists(id)) {
		var image = lime_Assets.cache.image.get(id);
		if(lime_Assets.isValidImage(image)) {
			promise.complete(image);
			return promise.future;
		}
	}
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"IMAGE")) {
			var future = library.loadImage(symbolName);
			if(useCache && lime_Assets.cache.enabled) future.onComplete(function(image1) {
				lime_Assets.cache.image.set(id,image1);
			});
			promise.completeWith(future);
		} else promise.error("[Assets] There is no Image asset with an ID of \"" + id + "\"");
	} else promise.error("[Assets] There is no asset library named \"" + libraryName + "\"");
	return promise.future;
};
lime_Assets.loadLibrary = function(name) {
	lime_Assets.initialize();
	var promise = new lime_app_Promise();
	var data = lime_Assets.getText("libraries/" + name + ".json");
	if(data != null && data != "") {
		var info = JSON.parse(data);
		var library = Type.createInstance(Type.resolveClass(info.type),info.args);
		lime_Assets.libraries.set(name,library);
		library.onChange.add(($_=lime_Assets.onChange,$bind($_,$_.dispatch)));
		promise.completeWith(library.load());
	} else promise.error("[Assets] There is no asset library named \"" + name + "\"");
	return promise.future;
};
lime_Assets.loadText = function(id) {
	lime_Assets.initialize();
	var promise = new lime_app_Promise();
	var libraryName = id.substring(0,id.indexOf(":"));
	var symbolName;
	var pos = id.indexOf(":") + 1;
	symbolName = HxOverrides.substr(id,pos,null);
	var library = lime_Assets.getLibrary(libraryName);
	if(library != null) {
		if(library.exists(symbolName,"TEXT")) promise.completeWith(library.loadText(symbolName)); else promise.error("[Assets] There is no String asset with an ID of \"" + id + "\"");
	} else promise.error("[Assets] There is no asset library named \"" + libraryName + "\"");
	return promise.future;
};
lime_Assets.registerLibrary = function(name,library) {
	if(lime_Assets.libraries.exists(name)) {
		if(lime_Assets.libraries.get(name) == library) return; else lime_Assets.unloadLibrary(name);
	}
	if(library != null) library.onChange.add(lime_Assets.library_onChange);
	lime_Assets.libraries.set(name,library);
};
lime_Assets.unloadLibrary = function(name) {
	lime_Assets.initialize();
	var library = lime_Assets.libraries.get(name);
	if(library != null) {
		lime_Assets.cache.clear(name + ":");
		library.onChange.remove(lime_Assets.library_onChange);
		library.unload();
	}
	lime_Assets.libraries.remove(name);
};
lime_Assets.library_onChange = function() {
	lime_Assets.cache.clear();
	lime_Assets.onChange.dispatch();
};
var lime__$backend_html5_HTML5Application = function(parent) {
	this.gameDeviceCache = new haxe_ds_IntMap();
	this.parent = parent;
	this.currentUpdate = 0;
	this.lastUpdate = 0;
	this.nextUpdate = 0;
	this.framePeriod = -1;
	lime_audio_AudioManager.init();
};
$hxClasses["lime._backend.html5.HTML5Application"] = lime__$backend_html5_HTML5Application;
lime__$backend_html5_HTML5Application.__name__ = true;
lime__$backend_html5_HTML5Application.prototype = {
	convertKeyCode: function(keyCode) {
		if(keyCode >= 65 && keyCode <= 90) return keyCode + 32;
		switch(keyCode) {
		case 16:
			return 1073742049;
		case 17:
			return 1073742048;
		case 18:
			return 1073742050;
		case 20:
			return 1073741881;
		case 144:
			return 1073741907;
		case 37:
			return 1073741904;
		case 38:
			return 1073741906;
		case 39:
			return 1073741903;
		case 40:
			return 1073741905;
		case 45:
			return 1073741897;
		case 46:
			return 127;
		case 36:
			return 1073741898;
		case 35:
			return 1073741901;
		case 33:
			return 1073741899;
		case 34:
			return 1073741902;
		case 112:
			return 1073741882;
		case 113:
			return 1073741883;
		case 114:
			return 1073741884;
		case 115:
			return 1073741885;
		case 116:
			return 1073741886;
		case 117:
			return 1073741887;
		case 118:
			return 1073741888;
		case 119:
			return 1073741889;
		case 120:
			return 1073741890;
		case 121:
			return 1073741891;
		case 122:
			return 1073741892;
		case 123:
			return 1073741893;
		case 124:
			return 1073741928;
		case 125:
			return 1073741929;
		case 126:
			return 1073741930;
		case 186:
			return 59;
		case 187:
			return 61;
		case 188:
			return 44;
		case 189:
			return 45;
		case 190:
			return 46;
		case 191:
			return 47;
		case 192:
			return 96;
		case 219:
			return 91;
		case 220:
			return 92;
		case 221:
			return 93;
		case 222:
			return 39;
		}
		return keyCode;
	}
	,create: function(config) {
	}
	,exec: function() {
		window.addEventListener("keydown",$bind(this,this.handleKeyEvent),false);
		window.addEventListener("keyup",$bind(this,this.handleKeyEvent),false);
		window.addEventListener("focus",$bind(this,this.handleWindowEvent),false);
		window.addEventListener("blur",$bind(this,this.handleWindowEvent),false);
		window.addEventListener("resize",$bind(this,this.handleWindowEvent),false);
		window.addEventListener("beforeunload",$bind(this,this.handleWindowEvent),false);
		
			var lastTime = 0;
			var vendors = ['ms', 'moz', 'webkit', 'o'];
			for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
				window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
			}
			
			if (!window.requestAnimationFrame)
				window.requestAnimationFrame = function(callback, element) {
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, 16 - (currTime - lastTime));
					var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
					  timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				};
			
			if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = function(id) {
					clearTimeout(id);
				};
			
			window.requestAnimFrame = window.requestAnimationFrame;
		;
		this.lastUpdate = new Date().getTime();
		this.handleApplicationEvent();
		return 0;
	}
	,exit: function() {
	}
	,getFrameRate: function() {
		if(this.framePeriod < 0) return 60; else if(this.framePeriod == 1000) return 0; else return 1000 / this.framePeriod;
	}
	,handleApplicationEvent: function(__) {
		this.updateGameDevices();
		this.currentUpdate = new Date().getTime();
		if(this.currentUpdate >= this.nextUpdate) {
			this.deltaTime = this.currentUpdate - this.lastUpdate;
			this.parent.onUpdate.dispatch(this.deltaTime | 0);
			if(this.parent.renderers[0] != null) {
				this.parent.renderers[0].onRender.dispatch();
				this.parent.renderers[0].flip();
			}
			if(this.framePeriod < 0) {
				this.nextUpdate = this.currentUpdate;
				this.nextUpdate = this.currentUpdate;
			} else this.nextUpdate = this.currentUpdate + this.framePeriod;
			this.lastUpdate = this.currentUpdate;
		}
		window.requestAnimationFrame($bind(this,this.handleApplicationEvent));
	}
	,handleKeyEvent: function(event) {
		if(this.parent.windows[0] != null) {
			var keyCode = this.convertKeyCode(event.keyCode != null?event.keyCode:event.which);
			var modifier;
			modifier = (event.shiftKey?3:0) | (event.ctrlKey?192:0) | (event.altKey?768:0) | (event.metaKey?3072:0);
			if(event.type == "keydown") {
				this.parent.windows[0].onKeyDown.dispatch(keyCode,modifier);
				if(this.parent.windows[0].onKeyDown.canceled) event.preventDefault();
			} else {
				this.parent.windows[0].onKeyUp.dispatch(keyCode,modifier);
				if(this.parent.windows[0].onKeyUp.canceled) event.preventDefault();
			}
		}
	}
	,handleWindowEvent: function(event) {
		if(this.parent.windows[0] != null) {
			var _g = event.type;
			switch(_g) {
			case "focus":
				this.parent.windows[0].onFocusIn.dispatch();
				this.parent.windows[0].onActivate.dispatch();
				break;
			case "blur":
				this.parent.windows[0].onFocusOut.dispatch();
				this.parent.windows[0].onDeactivate.dispatch();
				break;
			case "resize":
				var cacheWidth = this.parent.windows[0].__width;
				var cacheHeight = this.parent.windows[0].__height;
				this.parent.windows[0].backend.handleResize();
				if(this.parent.windows[0].__width != cacheWidth || this.parent.windows[0].__height != cacheHeight) this.parent.windows[0].onResize.dispatch(this.parent.windows[0].__width,this.parent.windows[0].__height);
				break;
			case "beforeunload":
				this.parent.windows[0].onClose.dispatch();
				break;
			}
		}
	}
	,setFrameRate: function(value) {
		if(value >= 60) this.framePeriod = -1; else if(value > 0) this.framePeriod = 1000 / value; else this.framePeriod = 1000;
		return value;
	}
	,updateGameDevices: function() {
		var devices = lime_ui_Joystick.__getDeviceData();
		if(devices == null) return;
		var id;
		var gamepad;
		var joystick;
		var data;
		var cache;
		var _g1 = 0;
		var _g = devices.length;
		while(_g1 < _g) {
			var i = _g1++;
			id = i;
			data = devices[id];
			if(data == null) continue;
			if(!this.gameDeviceCache.h.hasOwnProperty(id)) {
				cache = new lime__$backend_html5_GameDeviceData();
				cache.id = id;
				cache.connected = data.connected;
				var _g3 = 0;
				var _g2 = data.buttons.length;
				while(_g3 < _g2) {
					var i1 = _g3++;
					cache.buttons.push(data.buttons[i1].value);
				}
				var _g31 = 0;
				var _g21 = data.axes.length;
				while(_g31 < _g21) {
					var i2 = _g31++;
					cache.axes.push(data.axes[i2]);
				}
				if(data.mapping == "standard") cache.isGamepad = true;
				this.gameDeviceCache.h[id] = cache;
				if(data.connected) {
					lime_ui_Joystick.__connect(id);
					if(cache.isGamepad) lime_ui_Gamepad.__connect(id);
				}
			}
			cache = this.gameDeviceCache.h[id];
			joystick = lime_ui_Joystick.devices.h[id];
			gamepad = lime_ui_Gamepad.devices.h[id];
			if(data.connected) {
				var button;
				var value;
				var _g32 = 0;
				var _g22 = data.buttons.length;
				while(_g32 < _g22) {
					var i3 = _g32++;
					value = data.buttons[i3].value;
					if(value != cache.buttons[i3]) {
						if(i3 == 6) {
							joystick.onAxisMove.dispatch(data.axes.length,value);
							if(gamepad != null) gamepad.onAxisMove.dispatch(4,value);
						} else if(i3 == 7) {
							joystick.onAxisMove.dispatch(data.axes.length + 1,value);
							if(gamepad != null) gamepad.onAxisMove.dispatch(5,value);
						} else {
							if(value > 0) joystick.onButtonDown.dispatch(i3); else joystick.onButtonUp.dispatch(i3);
							if(gamepad != null) {
								switch(i3) {
								case 0:
									button = 0;
									break;
								case 1:
									button = 1;
									break;
								case 2:
									button = 2;
									break;
								case 3:
									button = 3;
									break;
								case 4:
									button = 9;
									break;
								case 5:
									button = 10;
									break;
								case 8:
									button = 4;
									break;
								case 9:
									button = 6;
									break;
								case 10:
									button = 7;
									break;
								case 11:
									button = 8;
									break;
								case 12:
									button = 11;
									break;
								case 13:
									button = 12;
									break;
								case 14:
									button = 13;
									break;
								case 15:
									button = 14;
									break;
								case 16:
									button = 5;
									break;
								default:
									continue;
								}
								if(value > 0) gamepad.onButtonDown.dispatch(button); else gamepad.onButtonUp.dispatch(button);
							}
						}
						cache.buttons[i3] = value;
					}
				}
				var _g33 = 0;
				var _g23 = data.axes.length;
				while(_g33 < _g23) {
					var i4 = _g33++;
					if(data.axes[i4] != cache.axes[i4]) {
						joystick.onAxisMove.dispatch(i4,data.axes[i4]);
						if(gamepad != null) gamepad.onAxisMove.dispatch(i4,data.axes[i4]);
						cache.axes[i4] = data.axes[i4];
					}
				}
			} else if(cache.connected) {
				cache.connected = false;
				lime_ui_Joystick.__disconnect(id);
				lime_ui_Gamepad.__disconnect(id);
			}
		}
	}
	,__class__: lime__$backend_html5_HTML5Application
};
var lime__$backend_html5_GameDeviceData = function() {
	this.connected = true;
	this.buttons = [];
	this.axes = [];
};
$hxClasses["lime._backend.html5.GameDeviceData"] = lime__$backend_html5_GameDeviceData;
lime__$backend_html5_GameDeviceData.__name__ = true;
lime__$backend_html5_GameDeviceData.prototype = {
	__class__: lime__$backend_html5_GameDeviceData
};
var lime__$backend_html5_HTML5Renderer = function(parent) {
	this.parent = parent;
};
$hxClasses["lime._backend.html5.HTML5Renderer"] = lime__$backend_html5_HTML5Renderer;
lime__$backend_html5_HTML5Renderer.__name__ = true;
lime__$backend_html5_HTML5Renderer.prototype = {
	create: function() {
		this.createContext();
		{
			var _g = this.parent.context;
			switch(_g[1]) {
			case 0:
				this.parent.window.backend.canvas.addEventListener("webglcontextlost",$bind(this,this.handleEvent),false);
				this.parent.window.backend.canvas.addEventListener("webglcontextrestored",$bind(this,this.handleEvent),false);
				break;
			default:
			}
		}
	}
	,createContext: function() {
		if(this.parent.window.backend.div != null) {
			this.parent.context = lime_graphics_RenderContext.DOM(this.parent.window.backend.div);
			this.parent.type = lime_graphics_RendererType.DOM;
		} else if(this.parent.window.backend.canvas != null) {
			var webgl = null;
			if(!Object.prototype.hasOwnProperty.call(this.parent.window.config,"hardware") || this.parent.window.config.hardware) {
				var options = { alpha : false, antialias : Object.prototype.hasOwnProperty.call(this.parent.window.config,"antialiasing")?this.parent.window.config.antialiasing > 0:false, depth : Object.prototype.hasOwnProperty.call(this.parent.window.config,"depthBuffer")?this.parent.window.config.depthBuffer:true, premultipliedAlpha : false, stencil : Object.prototype.hasOwnProperty.call(this.parent.window.config,"stencilBuffer")?this.parent.window.config.stencilBuffer:false, preserveDrawingBuffer : false};
				webgl = js_html__$CanvasElement_CanvasUtil.getContextWebGL(this.parent.window.backend.canvas,options);
			}
			if(webgl == null) {
				this.parent.context = lime_graphics_RenderContext.CANVAS(this.parent.window.backend.canvas.getContext("2d"));
				this.parent.type = lime_graphics_RendererType.CANVAS;
			} else {
				lime_graphics_opengl_GL.context = webgl;
				this.parent.context = lime_graphics_RenderContext.OPENGL(lime_graphics_opengl_GL.context);
				this.parent.type = lime_graphics_RendererType.OPENGL;
			}
		}
	}
	,flip: function() {
	}
	,handleEvent: function(event) {
		var _g = event.type;
		switch(_g) {
		case "webglcontextlost":
			event.preventDefault();
			this.parent.context = null;
			this.parent.onContextLost.dispatch();
			break;
		case "webglcontextrestored":
			this.createContext();
			this.parent.onContextRestored.dispatch(this.parent.context);
			break;
		default:
		}
	}
	,readPixels: function(rect) {
		if(this.parent.window.backend.canvas != null) {
			if(rect == null) rect = new lime_math_Rectangle(0,0,this.parent.window.backend.canvas.width,this.parent.window.backend.canvas.height); else rect.__contract(0,0,this.parent.window.backend.canvas.width,this.parent.window.backend.canvas.height);
			if(rect.width > 0 && rect.height > 0) {
				var canvas = window.document.createElement("canvas");
				canvas.width = rect.width | 0;
				canvas.height = rect.height | 0;
				var context = canvas.getContext("2d");
				context.drawImage(this.parent.window.backend.canvas,-rect.x,-rect.y);
				return lime_graphics_Image.fromCanvas(canvas);
			}
		}
		return null;
	}
	,render: function() {
	}
	,__class__: lime__$backend_html5_HTML5Renderer
};
var lime__$backend_html5_HTML5Window = function(parent) {
	this.unusedTouchesPool = new List();
	this.currentTouches = new haxe_ds_IntMap();
	this.parent = parent;
	if(parent.config != null && Object.prototype.hasOwnProperty.call(parent.config,"element")) this.element = parent.config.element;
};
$hxClasses["lime._backend.html5.HTML5Window"] = lime__$backend_html5_HTML5Window;
lime__$backend_html5_HTML5Window.__name__ = true;
lime__$backend_html5_HTML5Window.prototype = {
	alert: function(message,title) {
		if(message != null) js_Browser.alert(message);
	}
	,close: function() {
		this.parent.application.removeWindow(this.parent);
	}
	,create: function(application) {
		this.setWidth = this.parent.__width;
		this.setHeight = this.parent.__height;
		this.parent.id = lime__$backend_html5_HTML5Window.windowID++;
		if(js_Boot.__instanceof(this.element,HTMLCanvasElement)) this.canvas = this.element; else this.canvas = window.document.createElement("canvas");
		if(this.canvas != null) {
			var style = this.canvas.style;
			style.setProperty("-webkit-transform","translateZ(0)",null);
			style.setProperty("transform","translateZ(0)",null);
		} else if(this.div != null) {
			var style1 = this.div.style;
			style1.setProperty("-webkit-transform","translate3D(0,0,0)",null);
			style1.setProperty("transform","translate3D(0,0,0)",null);
			style1.position = "relative";
			style1.overflow = "hidden";
			style1.setProperty("-webkit-user-select","none",null);
			style1.setProperty("-moz-user-select","none",null);
			style1.setProperty("-ms-user-select","none",null);
			style1.setProperty("-o-user-select","none",null);
		}
		if(this.parent.__width == 0 && this.parent.__height == 0) {
			if(this.element != null) {
				this.parent.set_width(this.element.clientWidth);
				this.parent.set_height(this.element.clientHeight);
			} else {
				this.parent.set_width(window.innerWidth);
				this.parent.set_height(window.innerHeight);
			}
			this.parent.set_fullscreen(true);
		}
		if(this.canvas != null) {
			this.canvas.width = this.parent.__width;
			this.canvas.height = this.parent.__height;
		} else {
			this.div.style.width = this.parent.__width + "px";
			this.div.style.height = this.parent.__height + "px";
		}
		this.handleResize();
		if(this.element != null) {
			if(this.canvas != null) {
				if(this.element != this.canvas) this.element.appendChild(this.canvas);
			} else this.element.appendChild(this.div);
			var events = ["mousedown","mouseenter","mouseleave","mousemove","mouseup","wheel"];
			var _g = 0;
			while(_g < events.length) {
				var event = events[_g];
				++_g;
				this.element.addEventListener(event,$bind(this,this.handleMouseEvent),true);
			}
			window.document.addEventListener("dragstart",function(e) {
				if(e.target.nodeName.toLowerCase() == "img") {
					e.preventDefault();
					return false;
				}
				return true;
			},false);
			this.element.addEventListener("touchstart",$bind(this,this.handleTouchEvent),true);
			this.element.addEventListener("touchmove",$bind(this,this.handleTouchEvent),true);
			this.element.addEventListener("touchend",$bind(this,this.handleTouchEvent),true);
			this.element.addEventListener("gamepadconnected",$bind(this,this.handleGamepadEvent),true);
			this.element.addEventListener("gamepaddisconnected",$bind(this,this.handleGamepadEvent),true);
		}
	}
	,focus: function() {
	}
	,getDisplay: function() {
		return lime_system_System.getDisplay(0);
	}
	,getEnableTextEvents: function() {
		return this.enableTextEvents;
	}
	,handleFocusEvent: function(event) {
		if(this.enableTextEvents) haxe_Timer.delay(function() {
			lime__$backend_html5_HTML5Window.textInput.focus();
		},20);
	}
	,handleGamepadEvent: function(event) {
		var _g = event.type;
		switch(_g) {
		case "gamepadconnected":
			lime_ui_Joystick.__connect(event.gamepad.index);
			if(event.gamepad.mapping == "standard") lime_ui_Gamepad.__connect(event.gamepad.index);
			break;
		case "gamepaddisconnected":
			lime_ui_Joystick.__disconnect(event.gamepad.index);
			lime_ui_Gamepad.__disconnect(event.gamepad.index);
			break;
		default:
		}
	}
	,handleInputEvent: function(event) {
		if(lime__$backend_html5_HTML5Window.textInput.value != "") {
			this.parent.onTextInput.dispatch(lime__$backend_html5_HTML5Window.textInput.value);
			lime__$backend_html5_HTML5Window.textInput.value = "";
		}
	}
	,handleMouseEvent: function(event) {
		var x = 0.0;
		var y = 0.0;
		if(event.type != "wheel") {
			if(this.element != null) {
				if(this.canvas != null) {
					var rect = this.canvas.getBoundingClientRect();
					x = (event.clientX - rect.left) * (this.parent.__width / rect.width);
					y = (event.clientY - rect.top) * (this.parent.__height / rect.height);
				} else if(this.div != null) {
					var rect1 = this.div.getBoundingClientRect();
					x = event.clientX - rect1.left;
					y = event.clientY - rect1.top;
				} else {
					var rect2 = this.element.getBoundingClientRect();
					x = (event.clientX - rect2.left) * (this.parent.__width / rect2.width);
					y = (event.clientY - rect2.top) * (this.parent.__height / rect2.height);
				}
			} else {
				x = event.clientX;
				y = event.clientY;
			}
			var _g = event.type;
			switch(_g) {
			case "mousedown":
				this.parent.onMouseDown.dispatch(x,y,event.button);
				break;
			case "mouseenter":
				this.parent.onEnter.dispatch();
				break;
			case "mouseleave":
				this.parent.onLeave.dispatch();
				break;
			case "mouseup":
				this.parent.onMouseUp.dispatch(x,y,event.button);
				break;
			case "mousemove":
				this.parent.onMouseMove.dispatch(x,y);
				break;
			default:
			}
		} else this.parent.onMouseWheel.dispatch(event.deltaX,-event.deltaY);
	}
	,handleResize: function() {
		var stretch = this.parent.__fullscreen || this.setWidth == 0 && this.setHeight == 0;
		if(this.element != null && (this.div == null || this.div != null && stretch)) {
			if(stretch) {
				if(this.parent.__width != this.element.clientWidth || this.parent.__height != this.element.clientHeight) {
					this.parent.set_width(this.element.clientWidth);
					this.parent.set_height(this.element.clientHeight);
					if(this.canvas != null) {
						if(this.element != this.canvas) {
							this.canvas.width = this.element.clientWidth;
							this.canvas.height = this.element.clientHeight;
						}
					} else {
						this.div.style.width = this.element.clientWidth + "px";
						this.div.style.height = this.element.clientHeight + "px";
					}
				}
			} else {
				var scaleX = this.element.clientWidth / this.setWidth;
				var scaleY = this.element.clientHeight / this.setHeight;
				var currentRatio = scaleX / scaleY;
				var targetRatio = Math.min(scaleX,scaleY);
				if(this.canvas != null) {
					if(this.element != this.canvas) {
						this.canvas.style.width = this.setWidth * targetRatio + "px";
						this.canvas.style.height = this.setHeight * targetRatio + "px";
						this.canvas.style.marginLeft = (this.element.clientWidth - this.setWidth * targetRatio) / 2 + "px";
						this.canvas.style.marginTop = (this.element.clientHeight - this.setHeight * targetRatio) / 2 + "px";
					}
				} else {
					this.div.style.width = this.setWidth * targetRatio + "px";
					this.div.style.height = this.setHeight * targetRatio + "px";
					this.div.style.marginLeft = (this.element.clientWidth - this.setWidth * targetRatio) / 2 + "px";
					this.div.style.marginTop = (this.element.clientHeight - this.setHeight * targetRatio) / 2 + "px";
				}
			}
		}
	}
	,handleTouchEvent: function(event) {
		event.preventDefault();
		var rect = null;
		if(this.element != null) {
			if(this.canvas != null) rect = this.canvas.getBoundingClientRect(); else if(this.div != null) rect = this.div.getBoundingClientRect(); else rect = this.element.getBoundingClientRect();
		}
		var windowWidth = this.setWidth;
		var windowHeight = this.setHeight;
		if(windowWidth == 0 || windowHeight == 0) {
			if(rect != null) {
				windowWidth = rect.width;
				windowHeight = rect.height;
			} else {
				windowWidth = 1;
				windowHeight = 1;
			}
		}
		var _g = 0;
		var _g1 = event.changedTouches;
		while(_g < _g1.length) {
			var data = _g1[_g];
			++_g;
			var x = 0.0;
			var y = 0.0;
			if(rect != null) {
				x = (data.clientX - rect.left) * (windowWidth / rect.width);
				y = (data.clientY - rect.top) * (windowHeight / rect.height);
			} else {
				x = data.clientX;
				y = data.clientY;
			}
			var _g2 = event.type;
			switch(_g2) {
			case "touchstart":
				var touch = this.unusedTouchesPool.pop();
				if(touch == null) touch = new lime_ui_Touch(x / windowWidth,y / windowHeight,data.identifier,0,0,data.force,this.parent.id); else {
					touch.x = x / windowWidth;
					touch.y = y / windowHeight;
					touch.id = data.identifier;
					touch.dx = 0;
					touch.dy = 0;
					touch.pressure = data.force;
					touch.device = this.parent.id;
				}
				this.currentTouches.h[data.identifier] = touch;
				lime_ui_Touch.onStart.dispatch(touch);
				if(this.primaryTouch == null) this.primaryTouch = touch;
				if(touch == this.primaryTouch) this.parent.onMouseDown.dispatch(x,y,0);
				break;
			case "touchend":
				var touch1 = this.currentTouches.h[data.identifier];
				if(touch1 != null) {
					var cacheX = touch1.x;
					var cacheY = touch1.y;
					touch1.x = x / windowWidth;
					touch1.y = y / windowHeight;
					touch1.dx = touch1.x - cacheX;
					touch1.dy = touch1.y - cacheY;
					touch1.pressure = data.force;
					lime_ui_Touch.onEnd.dispatch(touch1);
					this.currentTouches.remove(data.identifier);
					this.unusedTouchesPool.add(touch1);
					if(touch1 == this.primaryTouch) {
						this.parent.onMouseUp.dispatch(x,y,0);
						this.primaryTouch = null;
					}
				}
				break;
			case "touchmove":
				var touch2 = this.currentTouches.h[data.identifier];
				if(touch2 != null) {
					var cacheX1 = touch2.x;
					var cacheY1 = touch2.y;
					touch2.x = x / windowWidth;
					touch2.y = y / windowHeight;
					touch2.dx = touch2.x - cacheX1;
					touch2.dy = touch2.y - cacheY1;
					touch2.pressure = data.force;
					lime_ui_Touch.onMove.dispatch(touch2);
					if(touch2 == this.primaryTouch) this.parent.onMouseMove.dispatch(x,y);
				}
				break;
			default:
			}
		}
	}
	,move: function(x,y) {
	}
	,resize: function(width,height) {
	}
	,setBorderless: function(value) {
		return value;
	}
	,setEnableTextEvents: function(value) {
		if(value) {
			if(lime__$backend_html5_HTML5Window.textInput == null) {
				lime__$backend_html5_HTML5Window.textInput = window.document.createElement("input");
				lime__$backend_html5_HTML5Window.textInput.type = "text";
				lime__$backend_html5_HTML5Window.textInput.style.position = "absolute";
				lime__$backend_html5_HTML5Window.textInput.style.opacity = "0";
				lime__$backend_html5_HTML5Window.textInput.style.color = "transparent";
				lime__$backend_html5_HTML5Window.textInput.value = "";
				lime__$backend_html5_HTML5Window.textInput.autocapitalize = "off";
				lime__$backend_html5_HTML5Window.textInput.autocorrect = "off";
				lime__$backend_html5_HTML5Window.textInput.autocomplete = "off";
				lime__$backend_html5_HTML5Window.textInput.style.left = "0px";
				lime__$backend_html5_HTML5Window.textInput.style.top = "50%";
				if(new EReg("(iPad|iPhone|iPod).*OS 8_","gi").match(window.navigator.userAgent)) {
					lime__$backend_html5_HTML5Window.textInput.style.fontSize = "0px";
					lime__$backend_html5_HTML5Window.textInput.style.width = "0px";
					lime__$backend_html5_HTML5Window.textInput.style.height = "0px";
				} else {
					lime__$backend_html5_HTML5Window.textInput.style.width = "1px";
					lime__$backend_html5_HTML5Window.textInput.style.height = "1px";
				}
				lime__$backend_html5_HTML5Window.textInput.style.pointerEvents = "none";
				lime__$backend_html5_HTML5Window.textInput.style.zIndex = "-10000000";
				window.document.body.appendChild(lime__$backend_html5_HTML5Window.textInput);
			}
			if(!this.enableTextEvents) {
				lime__$backend_html5_HTML5Window.textInput.addEventListener("input",$bind(this,this.handleInputEvent),true);
				lime__$backend_html5_HTML5Window.textInput.addEventListener("blur",$bind(this,this.handleFocusEvent),true);
			}
			lime__$backend_html5_HTML5Window.textInput.focus();
		} else if(lime__$backend_html5_HTML5Window.textInput != null) {
			lime__$backend_html5_HTML5Window.textInput.removeEventListener("input",$bind(this,this.handleInputEvent),true);
			lime__$backend_html5_HTML5Window.textInput.removeEventListener("blur",$bind(this,this.handleFocusEvent),true);
			lime__$backend_html5_HTML5Window.textInput.blur();
		}
		return this.enableTextEvents = value;
	}
	,setFullscreen: function(value) {
		return false;
	}
	,setIcon: function(image) {
	}
	,setMinimized: function(value) {
		return false;
	}
	,setResizable: function(value) {
		return value;
	}
	,setTitle: function(value) {
		return value;
	}
	,__class__: lime__$backend_html5_HTML5Window
};
var lime_app_Event = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event"] = lime_app_Event;
lime_app_Event.__name__ = true;
lime_app_Event.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,__class__: lime_app_Event
};
var lime_app_Event_$Dynamic_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_Dynamic_Void"] = lime_app_Event_$Dynamic_$Void;
lime_app_Event_$Dynamic_$Void.__name__ = true;
lime_app_Event_$Dynamic_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$Dynamic_$Void
};
var lime_app_Event_$Float_$Float_$Int_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_Float_Float_Int_Void"] = lime_app_Event_$Float_$Float_$Int_$Void;
lime_app_Event_$Float_$Float_$Int_$Void.__name__ = true;
lime_app_Event_$Float_$Float_$Int_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a,a1,a2) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a,a1,a2);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$Float_$Float_$Int_$Void
};
var lime_app_Event_$Float_$Float_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_Float_Float_Void"] = lime_app_Event_$Float_$Float_$Void;
lime_app_Event_$Float_$Float_$Void.__name__ = true;
lime_app_Event_$Float_$Float_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a,a1) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a,a1);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$Float_$Float_$Void
};
var lime_app_Event_$Int_$Float_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_Int_Float_Void"] = lime_app_Event_$Int_$Float_$Void;
lime_app_Event_$Int_$Float_$Void.__name__ = true;
lime_app_Event_$Int_$Float_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a,a1) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a,a1);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$Int_$Float_$Void
};
var lime_app_Event_$Int_$Int_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_Int_Int_Void"] = lime_app_Event_$Int_$Int_$Void;
lime_app_Event_$Int_$Int_$Void.__name__ = true;
lime_app_Event_$Int_$Int_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a,a1) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a,a1);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$Int_$Int_$Void
};
var lime_app_Event_$Int_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_Int_Void"] = lime_app_Event_$Int_$Void;
lime_app_Event_$Int_$Void.__name__ = true;
lime_app_Event_$Int_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$Int_$Void
};
var lime_app_Event_$Int_$lime_$ui_$JoystickHatPosition_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_Int_lime_ui_JoystickHatPosition_Void"] = lime_app_Event_$Int_$lime_$ui_$JoystickHatPosition_$Void;
lime_app_Event_$Int_$lime_$ui_$JoystickHatPosition_$Void.__name__ = true;
lime_app_Event_$Int_$lime_$ui_$JoystickHatPosition_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a,a1) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a,a1);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$Int_$lime_$ui_$JoystickHatPosition_$Void
};
var lime_app_Event_$String_$Int_$Int_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_String_Int_Int_Void"] = lime_app_Event_$String_$Int_$Int_$Void;
lime_app_Event_$String_$Int_$Int_$Void.__name__ = true;
lime_app_Event_$String_$Int_$Int_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a,a1,a2) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a,a1,a2);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$String_$Int_$Int_$Void
};
var lime_app_Event_$String_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_String_Void"] = lime_app_Event_$String_$Void;
lime_app_Event_$String_$Void.__name__ = true;
lime_app_Event_$String_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$String_$Void
};
var lime_app_Event_$lime_$graphics_$RenderContext_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_lime_graphics_RenderContext_Void"] = lime_app_Event_$lime_$graphics_$RenderContext_$Void;
lime_app_Event_$lime_$graphics_$RenderContext_$Void.__name__ = true;
lime_app_Event_$lime_$graphics_$RenderContext_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$lime_$graphics_$RenderContext_$Void
};
var lime_app_Event_$lime_$ui_$GamepadAxis_$Float_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_lime_ui_GamepadAxis_Float_Void"] = lime_app_Event_$lime_$ui_$GamepadAxis_$Float_$Void;
lime_app_Event_$lime_$ui_$GamepadAxis_$Float_$Void.__name__ = true;
lime_app_Event_$lime_$ui_$GamepadAxis_$Float_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a,a1) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a,a1);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$lime_$ui_$GamepadAxis_$Float_$Void
};
var lime_app_Event_$lime_$ui_$GamepadButton_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_lime_ui_GamepadButton_Void"] = lime_app_Event_$lime_$ui_$GamepadButton_$Void;
lime_app_Event_$lime_$ui_$GamepadButton_$Void.__name__ = true;
lime_app_Event_$lime_$ui_$GamepadButton_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$lime_$ui_$GamepadButton_$Void
};
var lime_app_Event_$lime_$ui_$Gamepad_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_lime_ui_Gamepad_Void"] = lime_app_Event_$lime_$ui_$Gamepad_$Void;
lime_app_Event_$lime_$ui_$Gamepad_$Void.__name__ = true;
lime_app_Event_$lime_$ui_$Gamepad_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$lime_$ui_$Gamepad_$Void
};
var lime_app_Event_$lime_$ui_$Joystick_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_lime_ui_Joystick_Void"] = lime_app_Event_$lime_$ui_$Joystick_$Void;
lime_app_Event_$lime_$ui_$Joystick_$Void.__name__ = true;
lime_app_Event_$lime_$ui_$Joystick_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$lime_$ui_$Joystick_$Void
};
var lime_app_Event_$lime_$ui_$KeyCode_$lime_$ui_$KeyModifier_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_lime_ui_KeyCode_lime_ui_KeyModifier_Void"] = lime_app_Event_$lime_$ui_$KeyCode_$lime_$ui_$KeyModifier_$Void;
lime_app_Event_$lime_$ui_$KeyCode_$lime_$ui_$KeyModifier_$Void.__name__ = true;
lime_app_Event_$lime_$ui_$KeyCode_$lime_$ui_$KeyModifier_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a,a1) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a,a1);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$lime_$ui_$KeyCode_$lime_$ui_$KeyModifier_$Void
};
var lime_app_Event_$lime_$ui_$Touch_$Void = function() {
	this.canceled = false;
	this.__listeners = [];
	this.__priorities = [];
	this.__repeat = [];
};
$hxClasses["lime.app.Event_lime_ui_Touch_Void"] = lime_app_Event_$lime_$ui_$Touch_$Void;
lime_app_Event_$lime_$ui_$Touch_$Void.__name__ = true;
lime_app_Event_$lime_$ui_$Touch_$Void.prototype = {
	add: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		var _g1 = 0;
		var _g = this.__priorities.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(priority > this.__priorities[i]) {
				this.__listeners.splice(i,0,listener);
				this.__priorities.splice(i,0,priority);
				this.__repeat.splice(i,0,!once);
				return;
			}
		}
		this.__listeners.push(listener);
		this.__priorities.push(priority);
		this.__repeat.push(!once);
	}
	,cancel: function() {
		this.canceled = true;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.__listeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			if(Reflect.compareMethods(l,listener)) return true;
		}
		return false;
	}
	,remove: function(listener) {
		var i = this.__listeners.length;
		while(--i >= 0) if(Reflect.compareMethods(this.__listeners[i],listener)) {
			this.__listeners.splice(i,1);
			this.__priorities.splice(i,1);
			this.__repeat.splice(i,1);
		}
	}
	,dispatch: function(a) {
		this.canceled = false;
		var listeners = this.__listeners;
		var repeat = this.__repeat;
		var i = 0;
		while(i < listeners.length) {
			listeners[i](a);
			if(!repeat[i]) this.remove(listeners[i]); else i++;
			if(this.canceled) break;
		}
	}
	,__class__: lime_app_Event_$lime_$ui_$Touch_$Void
};
var lime_app_Future = function(work) {
	if(work != null) {
		if(lime_app_Future.__threadPool == null) {
			lime_app_Future.__threadPool = new lime_system_ThreadPool();
			lime_app_Future.__threadPool.doWork.add(lime_app_Future.threadPool_doWork);
			lime_app_Future.__threadPool.onComplete.add(lime_app_Future.threadPool_onComplete);
			lime_app_Future.__threadPool.onError.add(lime_app_Future.threadPool_onError);
		}
		var promise = new lime_app_Promise();
		promise.future = this;
		lime_app_Future.__threadPool.queue({ promise : promise, work : work});
	}
};
$hxClasses["lime.app.Future"] = lime_app_Future;
lime_app_Future.__name__ = true;
lime_app_Future.threadPool_doWork = function(state) {
	try {
		var result = state.work();
		lime_app_Future.__threadPool.sendComplete({ promise : state.promise, result : result});
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		lime_app_Future.__threadPool.sendError({ promise : state.promise, error : e});
	}
};
lime_app_Future.threadPool_onComplete = function(state) {
	state.promise.complete(state.result);
};
lime_app_Future.threadPool_onError = function(state) {
	state.promise.error(state.error);
};
lime_app_Future.prototype = {
	onComplete: function(listener) {
		if(listener != null) {
			if(this.__completed) listener(this.value); else if(!this.__errored) {
				if(this.__completeListeners == null) this.__completeListeners = [];
				this.__completeListeners.push(listener);
			}
		}
		return this;
	}
	,onError: function(listener) {
		if(listener != null) {
			if(this.__errored) listener(this.__errorMessage); else if(!this.__completed) {
				if(this.__errorListeners == null) this.__errorListeners = [];
				this.__errorListeners.push(listener);
			}
		}
		return this;
	}
	,onProgress: function(listener) {
		if(listener != null) {
			if(this.__progressListeners == null) this.__progressListeners = [];
			this.__progressListeners.push(listener);
		}
		return this;
	}
	,then: function(next) {
		if(this.__completed) return next(this.value); else if(this.__errored) {
			var future = new lime_app_Future();
			future.onError(this.__errorMessage);
			return future;
		} else {
			var promise = new lime_app_Promise();
			this.onError($bind(promise,promise.error));
			this.onProgress($bind(promise,promise.progress));
			this.onComplete(function(val) {
				var future1 = next(val);
				future1.onError($bind(promise,promise.error));
				future1.onComplete($bind(promise,promise.complete));
			});
			return promise.future;
		}
	}
	,get_isCompleted: function() {
		return this.__completed || this.__errored;
	}
	,__class__: lime_app_Future
};
var lime_app_Preloader = function() {
	this.total = 0;
	this.loaded = 0;
	this.onProgress = new lime_app_Event_$Int_$Int_$Void();
	this.onComplete = new lime_app_Event_$Void_$Void();
	this.onProgress.add($bind(this,this.update));
};
$hxClasses["lime.app.Preloader"] = lime_app_Preloader;
lime_app_Preloader.__name__ = true;
lime_app_Preloader.prototype = {
	create: function(config) {
	}
	,load: function(urls,types) {
		var url = null;
		var cacheVersion = lime_Assets.cache.version;
		var _g1 = 0;
		var _g = urls.length;
		while(_g1 < _g) {
			var i = _g1++;
			url = urls[i];
			var _g2 = types[i];
			switch(_g2) {
			case "IMAGE":
				if(!lime_app_Preloader.images.exists(url)) {
					var image = new Image();
					lime_app_Preloader.images.set(url,image);
					image.onload = $bind(this,this.image_onLoad);
					image.src = url + "?" + cacheVersion;
					this.total++;
				}
				break;
			case "BINARY":
				if(!lime_app_Preloader.loaders.exists(url)) {
					var loader = new lime_net_HTTPRequest();
					lime_app_Preloader.loaders.set(url,loader);
					this.total++;
				}
				break;
			case "TEXT":
				if(!lime_app_Preloader.loaders.exists(url)) {
					var loader1 = new lime_net_HTTPRequest();
					lime_app_Preloader.loaders.set(url,loader1);
					this.total++;
				}
				break;
			case "FONT":
				this.total++;
				this.loadFont(url);
				break;
			default:
			}
		}
		var $it0 = lime_app_Preloader.loaders.keys();
		while( $it0.hasNext() ) {
			var url1 = $it0.next();
			var loader2 = lime_app_Preloader.loaders.get(url1);
			var future = loader2.load(url1 + "?" + cacheVersion);
			future.onComplete($bind(this,this.loader_onComplete));
		}
		if(this.total == 0) this.start();
	}
	,loadFont: function(font) {
		var _g = this;
		if(window.document.fonts && ($_=window.document.fonts,$bind($_,$_.load))) window.document.fonts.load("1em '" + font + "'").then(function(_) {
			_g.loaded++;
			_g.onProgress.dispatch(_g.loaded,_g.total);
			if(_g.loaded == _g.total) _g.start();
		}); else {
			var node = window.document.createElement("span");
			node.innerHTML = "giItT1WQy@!-/#";
			var style = node.style;
			style.position = "absolute";
			style.left = "-10000px";
			style.top = "-10000px";
			style.fontSize = "300px";
			style.fontFamily = "sans-serif";
			style.fontVariant = "normal";
			style.fontStyle = "normal";
			style.fontWeight = "normal";
			style.letterSpacing = "0";
			window.document.body.appendChild(node);
			var width = node.offsetWidth;
			style.fontFamily = "'" + font + "', sans-serif";
			var interval = null;
			var found = false;
			var checkFont = function() {
				if(node.offsetWidth != width) {
					if(!found) {
						found = true;
						return false;
					}
					_g.loaded++;
					if(interval != null) window.clearInterval(interval);
					node.parentNode.removeChild(node);
					node = null;
					_g.onProgress.dispatch(_g.loaded,_g.total);
					if(_g.loaded == _g.total) _g.start();
					return true;
				}
				return false;
			};
			if(!checkFont()) interval = window.setInterval(checkFont,50);
		}
	}
	,start: function() {
		this.complete = true;
		this.onComplete.dispatch();
	}
	,update: function(loaded,total) {
	}
	,image_onLoad: function(_) {
		this.loaded++;
		this.onProgress.dispatch(this.loaded,this.total);
		if(this.loaded == this.total) this.start();
	}
	,loader_onComplete: function(_) {
		this.loaded++;
		this.onProgress.dispatch(this.loaded,this.total);
		if(this.loaded == this.total) this.start();
	}
	,__class__: lime_app_Preloader
};
var lime_app_Promise = function() {
	this.future = new lime_app_Future();
};
$hxClasses["lime.app.Promise"] = lime_app_Promise;
lime_app_Promise.__name__ = true;
lime_app_Promise.prototype = {
	complete: function(data) {
		if(!this.future.__errored) {
			this.future.__completed = true;
			this.future.value = data;
			if(this.future.__completeListeners != null) {
				var _g = 0;
				var _g1 = this.future.__completeListeners;
				while(_g < _g1.length) {
					var listener = _g1[_g];
					++_g;
					listener(data);
				}
				this.future.__completeListeners = null;
			}
		}
		return this;
	}
	,completeWith: function(future) {
		future.onComplete($bind(this,this.complete));
		future.onError($bind(this,this.error));
		future.onProgress($bind(this,this.progress));
		return this;
	}
	,error: function(msg) {
		if(!this.future.__completed) {
			this.future.__errored = true;
			this.future.__errorMessage = msg;
			if(this.future.__errorListeners != null) {
				var _g = 0;
				var _g1 = this.future.__errorListeners;
				while(_g < _g1.length) {
					var listener = _g1[_g];
					++_g;
					listener(msg);
				}
				this.future.__errorListeners = null;
			}
		}
		return this;
	}
	,progress: function(progress) {
		if(!this.future.__errored && !this.future.__completed) {
			if(this.future.__progressListeners != null) {
				var _g = 0;
				var _g1 = this.future.__progressListeners;
				while(_g < _g1.length) {
					var listener = _g1[_g];
					++_g;
					listener(progress);
				}
			}
		}
		return this;
	}
	,get_isCompleted: function() {
		return this.future.get_isCompleted();
	}
	,__class__: lime_app_Promise
};
var lime_audio_ALAudioContext = function() {
	this.EXPONENT_DISTANCE_CLAMPED = 53254;
	this.EXPONENT_DISTANCE = 53253;
	this.LINEAR_DISTANCE_CLAMPED = 53252;
	this.LINEAR_DISTANCE = 53251;
	this.INVERSE_DISTANCE_CLAMPED = 53250;
	this.INVERSE_DISTANCE = 53249;
	this.DISTANCE_MODEL = 53248;
	this.DOPPLER_VELOCITY = 49153;
	this.SPEED_OF_SOUND = 49155;
	this.DOPPLER_FACTOR = 49152;
	this.EXTENSIONS = 45060;
	this.RENDERER = 45059;
	this.VERSION = 45058;
	this.VENDOR = 45057;
	this.OUT_OF_MEMORY = 40965;
	this.INVALID_OPERATION = 40964;
	this.INVALID_VALUE = 40963;
	this.INVALID_ENUM = 40962;
	this.INVALID_NAME = 40961;
	this.NO_ERROR = 0;
	this.SIZE = 8196;
	this.CHANNELS = 8195;
	this.BITS = 8194;
	this.FREQUENCY = 8193;
	this.FORMAT_STEREO16 = 4355;
	this.FORMAT_STEREO8 = 4354;
	this.FORMAT_MONO16 = 4353;
	this.FORMAT_MONO8 = 4352;
	this.UNDETERMINED = 4144;
	this.STREAMING = 4137;
	this.STATIC = 4136;
	this.SOURCE_TYPE = 4135;
	this.BYTE_OFFSET = 4134;
	this.SAMPLE_OFFSET = 4133;
	this.SEC_OFFSET = 4132;
	this.MAX_DISTANCE = 4131;
	this.CONE_OUTER_GAIN = 4130;
	this.ROLLOFF_FACTOR = 4129;
	this.REFERENCE_DISTANCE = 4128;
	this.BUFFERS_PROCESSED = 4118;
	this.BUFFERS_QUEUED = 4117;
	this.STOPPED = 4116;
	this.PAUSED = 4115;
	this.PLAYING = 4114;
	this.INITIAL = 4113;
	this.SOURCE_STATE = 4112;
	this.ORIENTATION = 4111;
	this.MAX_GAIN = 4110;
	this.MIN_GAIN = 4109;
	this.GAIN = 4106;
	this.BUFFER = 4105;
	this.LOOPING = 4103;
	this.VELOCITY = 4102;
	this.DIRECTION = 4101;
	this.POSITION = 4100;
	this.PITCH = 4099;
	this.CONE_OUTER_ANGLE = 4098;
	this.CONE_INNER_ANGLE = 4097;
	this.SOURCE_RELATIVE = 514;
	this.TRUE = 1;
	this.FALSE = 0;
	this.NONE = 0;
};
$hxClasses["lime.audio.ALAudioContext"] = lime_audio_ALAudioContext;
lime_audio_ALAudioContext.__name__ = true;
lime_audio_ALAudioContext.prototype = {
	bufferData: function(buffer,format,data,size,freq) {
		lime_audio_openal_AL.bufferData(buffer,format,data,size,freq);
	}
	,buffer3f: function(buffer,param,value1,value2,value3) {
		lime_audio_openal_AL.buffer3f(buffer,param,value1,value2,value3);
	}
	,buffer3i: function(buffer,param,value1,value2,value3) {
		lime_audio_openal_AL.buffer3i(buffer,param,value1,value2,value3);
	}
	,bufferf: function(buffer,param,value) {
		lime_audio_openal_AL.bufferf(buffer,param,value);
	}
	,bufferfv: function(buffer,param,values) {
		lime_audio_openal_AL.bufferfv(buffer,param,values);
	}
	,bufferi: function(buffer,param,value) {
		lime_audio_openal_AL.bufferi(buffer,param,value);
	}
	,bufferiv: function(buffer,param,values) {
		lime_audio_openal_AL.bufferiv(buffer,param,values);
	}
	,deleteBuffer: function(buffer) {
		lime_audio_openal_AL.deleteBuffer(buffer);
	}
	,deleteBuffers: function(buffers) {
		lime_audio_openal_AL.deleteBuffers(buffers);
	}
	,deleteSource: function(source) {
		lime_audio_openal_AL.deleteSource(source);
	}
	,deleteSources: function(sources) {
		lime_audio_openal_AL.deleteSources(sources);
	}
	,disable: function(capability) {
		lime_audio_openal_AL.disable(capability);
	}
	,distanceModel: function(distanceModel) {
		lime_audio_openal_AL.distanceModel(distanceModel);
	}
	,dopplerFactor: function(value) {
		lime_audio_openal_AL.dopplerFactor(value);
	}
	,dopplerVelocity: function(value) {
		lime_audio_openal_AL.dopplerVelocity(value);
	}
	,enable: function(capability) {
		lime_audio_openal_AL.enable(capability);
	}
	,genSource: function() {
		return lime_audio_openal_AL.genSource();
	}
	,genSources: function(n) {
		return lime_audio_openal_AL.genSources(n);
	}
	,genBuffer: function() {
		return lime_audio_openal_AL.genBuffer();
	}
	,genBuffers: function(n) {
		return lime_audio_openal_AL.genBuffers(n);
	}
	,getBoolean: function(param) {
		return lime_audio_openal_AL.getBoolean(param);
	}
	,getBooleanv: function(param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getBooleanv(param,count);
	}
	,getBuffer3f: function(buffer,param) {
		return lime_audio_openal_AL.getBuffer3f(buffer,param);
	}
	,getBuffer3i: function(buffer,param) {
		return lime_audio_openal_AL.getBuffer3i(buffer,param);
	}
	,getBufferf: function(buffer,param) {
		return lime_audio_openal_AL.getBufferf(buffer,param);
	}
	,getBufferfv: function(buffer,param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getBufferfv(buffer,param,count);
	}
	,getBufferi: function(buffer,param) {
		return lime_audio_openal_AL.getBufferi(buffer,param);
	}
	,getBufferiv: function(buffer,param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getBufferiv(buffer,param,count);
	}
	,getDouble: function(param) {
		return lime_audio_openal_AL.getDouble(param);
	}
	,getDoublev: function(param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getDoublev(param,count);
	}
	,getEnumValue: function(ename) {
		return lime_audio_openal_AL.getEnumValue(ename);
	}
	,getError: function() {
		return lime_audio_openal_AL.getError();
	}
	,getErrorString: function() {
		return lime_audio_openal_AL.getErrorString();
	}
	,getFloat: function(param) {
		return lime_audio_openal_AL.getFloat(param);
	}
	,getFloatv: function(param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getFloatv(param,count);
	}
	,getInteger: function(param) {
		return lime_audio_openal_AL.getInteger(param);
	}
	,getIntegerv: function(param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getIntegerv(param,count);
	}
	,getListener3f: function(param) {
		return lime_audio_openal_AL.getListener3f(param);
	}
	,getListener3i: function(param) {
		return lime_audio_openal_AL.getListener3i(param);
	}
	,getListenerf: function(param) {
		return lime_audio_openal_AL.getListenerf(param);
	}
	,getListenerfv: function(param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getListenerfv(param,count);
	}
	,getListeneri: function(param) {
		return lime_audio_openal_AL.getListeneri(param);
	}
	,getListeneriv: function(param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getListeneriv(param,count);
	}
	,getProcAddress: function(fname) {
		return lime_audio_openal_AL.getProcAddress(fname);
	}
	,getSource3f: function(source,param) {
		return lime_audio_openal_AL.getSource3f(source,param);
	}
	,getSourcef: function(source,param) {
		return lime_audio_openal_AL.getSourcef(source,param);
	}
	,getSource3i: function(source,param) {
		return lime_audio_openal_AL.getSource3i(source,param);
	}
	,getSourcefv: function(source,param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getSourcefv(source,param);
	}
	,getSourcei: function(source,param) {
		return lime_audio_openal_AL.getSourcei(source,param);
	}
	,getSourceiv: function(source,param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_AL.getSourceiv(source,param,count);
	}
	,getString: function(param) {
		return lime_audio_openal_AL.getString(param);
	}
	,isBuffer: function(buffer) {
		return lime_audio_openal_AL.isBuffer(buffer);
	}
	,isEnabled: function(capability) {
		return lime_audio_openal_AL.isEnabled(capability);
	}
	,isExtensionPresent: function(extname) {
		return lime_audio_openal_AL.isExtensionPresent(extname);
	}
	,isSource: function(source) {
		return lime_audio_openal_AL.isSource(source);
	}
	,listener3f: function(param,value1,value2,value3) {
		lime_audio_openal_AL.listener3f(param,value1,value2,value3);
	}
	,listener3i: function(param,value1,value2,value3) {
		lime_audio_openal_AL.listener3i(param,value1,value2,value3);
	}
	,listenerf: function(param,value) {
		lime_audio_openal_AL.listenerf(param,value);
	}
	,listenerfv: function(param,values) {
		lime_audio_openal_AL.listenerfv(param,values);
	}
	,listeneri: function(param,value) {
		lime_audio_openal_AL.listeneri(param,value);
	}
	,listeneriv: function(param,values) {
		lime_audio_openal_AL.listeneriv(param,values);
	}
	,source3f: function(source,param,value1,value2,value3) {
		lime_audio_openal_AL.source3f(source,param,value1,value2,value3);
	}
	,source3i: function(source,param,value1,value2,value3) {
		lime_audio_openal_AL.source3i(source,param,value1,value2,value3);
	}
	,sourcef: function(source,param,value) {
		lime_audio_openal_AL.sourcef(source,param,value);
	}
	,sourcefv: function(source,param,values) {
		lime_audio_openal_AL.sourcefv(source,param,values);
	}
	,sourcei: function(source,param,value) {
		lime_audio_openal_AL.sourcei(source,param,value);
	}
	,sourceiv: function(source,param,values) {
		lime_audio_openal_AL.sourceiv(source,param,values);
	}
	,sourcePlay: function(source) {
		lime_audio_openal_AL.sourcePlay(source);
	}
	,sourcePlayv: function(sources) {
		lime_audio_openal_AL.sourcePlayv(sources);
	}
	,sourceStop: function(source) {
		lime_audio_openal_AL.sourceStop(source);
	}
	,sourceStopv: function(sources) {
		lime_audio_openal_AL.sourceStopv(sources);
	}
	,sourceRewind: function(source) {
		lime_audio_openal_AL.sourceRewind(source);
	}
	,sourceRewindv: function(sources) {
		lime_audio_openal_AL.sourceRewindv(sources);
	}
	,sourcePause: function(source) {
		lime_audio_openal_AL.sourcePause(source);
	}
	,sourcePausev: function(sources) {
		lime_audio_openal_AL.sourcePausev(sources);
	}
	,sourceQueueBuffer: function(source,buffer) {
		lime_audio_openal_AL.sourceQueueBuffer(source,buffer);
	}
	,sourceQueueBuffers: function(source,nb,buffers) {
		lime_audio_openal_AL.sourceQueueBuffers(source,nb,buffers);
	}
	,sourceUnqueueBuffer: function(source) {
		return lime_audio_openal_AL.sourceUnqueueBuffer(source);
	}
	,sourceUnqueueBuffers: function(source,nb) {
		return lime_audio_openal_AL.sourceUnqueueBuffers(source,nb);
	}
	,speedOfSound: function(value) {
		lime_audio_openal_AL.speedOfSound(value);
	}
	,__class__: lime_audio_ALAudioContext
};
var lime_audio_ALCAudioContext = function() {
	this.ALL_DEVICES_SPECIFIER = 4115;
	this.DEFAULT_ALL_DEVICES_SPECIFIER = 4114;
	this.ENUMERATE_ALL_EXT = 1;
	this.EXTENSIONS = 4102;
	this.DEVICE_SPECIFIER = 4101;
	this.DEFAULT_DEVICE_SPECIFIER = 4100;
	this.ALL_ATTRIBUTES = 4099;
	this.ATTRIBUTES_SIZE = 4098;
	this.OUT_OF_MEMORY = 40965;
	this.INVALID_VALUE = 40964;
	this.INVALID_ENUM = 40963;
	this.INVALID_CONTEXT = 40962;
	this.INVALID_DEVICE = 40961;
	this.NO_ERROR = 0;
	this.STEREO_SOURCES = 4113;
	this.MONO_SOURCES = 4112;
	this.SYNC = 4105;
	this.REFRESH = 4104;
	this.FREQUENCY = 4103;
	this.TRUE = 1;
	this.FALSE = 0;
};
$hxClasses["lime.audio.ALCAudioContext"] = lime_audio_ALCAudioContext;
lime_audio_ALCAudioContext.__name__ = true;
lime_audio_ALCAudioContext.prototype = {
	closeDevice: function(device) {
		return lime_audio_openal_ALC.closeDevice(device);
	}
	,createContext: function(device,attrlist) {
		return lime_audio_openal_ALC.createContext(device,attrlist);
	}
	,destroyContext: function(context) {
		lime_audio_openal_ALC.destroyContext(context);
	}
	,getContextsDevice: function(context) {
		return lime_audio_openal_ALC.getContextsDevice(context);
	}
	,getCurrentContext: function() {
		return lime_audio_openal_ALC.getCurrentContext();
	}
	,getError: function(device) {
		return lime_audio_openal_ALC.getError(device);
	}
	,getErrorString: function(device) {
		return lime_audio_openal_ALC.getErrorString(device);
	}
	,getIntegerv: function(device,param,count) {
		if(count == null) count = 1;
		return lime_audio_openal_ALC.getIntegerv(device,param,count);
	}
	,getString: function(device,param) {
		return lime_audio_openal_ALC.getString(device,param);
	}
	,makeContextCurrent: function(context) {
		return lime_audio_openal_ALC.makeContextCurrent(context);
	}
	,openDevice: function(deviceName) {
		return lime_audio_openal_ALC.openDevice(deviceName);
	}
	,processContext: function(context) {
		lime_audio_openal_ALC.processContext(context);
	}
	,suspendContext: function(context) {
		lime_audio_openal_ALC.suspendContext(context);
	}
	,__class__: lime_audio_ALCAudioContext
};
var lime_audio_AudioBuffer = function() {
	this.id = 0;
};
$hxClasses["lime.audio.AudioBuffer"] = lime_audio_AudioBuffer;
lime_audio_AudioBuffer.__name__ = true;
lime_audio_AudioBuffer.fromBytes = function(bytes) {
	return null;
};
lime_audio_AudioBuffer.fromFile = function(path) {
	return null;
};
lime_audio_AudioBuffer.fromURL = function(url,handler) {
	if(url != null && url.indexOf("http://") == -1 && url.indexOf("https://") == -1) handler(lime_audio_AudioBuffer.fromFile(url)); else {
	}
};
lime_audio_AudioBuffer.prototype = {
	dispose: function() {
	}
	,__class__: lime_audio_AudioBuffer
};
var lime_audio_AudioContext = $hxClasses["lime.audio.AudioContext"] = { __ename__ : true, __constructs__ : ["OPENAL","HTML5","WEB","FLASH","CUSTOM"] };
lime_audio_AudioContext.OPENAL = function(alc,al) { var $x = ["OPENAL",0,alc,al]; $x.__enum__ = lime_audio_AudioContext; $x.toString = $estr; return $x; };
lime_audio_AudioContext.HTML5 = function(context) { var $x = ["HTML5",1,context]; $x.__enum__ = lime_audio_AudioContext; $x.toString = $estr; return $x; };
lime_audio_AudioContext.WEB = function(context) { var $x = ["WEB",2,context]; $x.__enum__ = lime_audio_AudioContext; $x.toString = $estr; return $x; };
lime_audio_AudioContext.FLASH = function(context) { var $x = ["FLASH",3,context]; $x.__enum__ = lime_audio_AudioContext; $x.toString = $estr; return $x; };
lime_audio_AudioContext.CUSTOM = function(data) { var $x = ["CUSTOM",4,data]; $x.__enum__ = lime_audio_AudioContext; $x.toString = $estr; return $x; };
var lime_audio_AudioManager = function() { };
$hxClasses["lime.audio.AudioManager"] = lime_audio_AudioManager;
lime_audio_AudioManager.__name__ = true;
lime_audio_AudioManager.init = function(context) {
	if(lime_audio_AudioManager.context == null) {
		if(context == null) try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;;
			lime_audio_AudioManager.context = lime_audio_AudioContext.WEB(new AudioContext ());
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			lime_audio_AudioManager.context = lime_audio_AudioContext.HTML5(new lime_audio_HTML5AudioContext());
		} else lime_audio_AudioManager.context = context;
	}
};
lime_audio_AudioManager.resume = function() {
	if(lime_audio_AudioManager.context != null) {
		var _g = lime_audio_AudioManager.context;
		switch(_g[1]) {
		case 0:
			var al = _g[3];
			var alc = _g[2];
			alc.processContext(alc.getCurrentContext());
			break;
		default:
		}
	}
};
lime_audio_AudioManager.shutdown = function() {
	if(lime_audio_AudioManager.context != null) {
		var _g = lime_audio_AudioManager.context;
		switch(_g[1]) {
		case 0:
			var al = _g[3];
			var alc = _g[2];
			var currentContext = alc.getCurrentContext();
			if(currentContext != null) {
				var device = alc.getContextsDevice(currentContext);
				alc.makeContextCurrent(null);
				alc.destroyContext(currentContext);
				alc.closeDevice(device);
			}
			break;
		default:
		}
	}
};
lime_audio_AudioManager.suspend = function() {
	if(lime_audio_AudioManager.context != null) {
		var _g = lime_audio_AudioManager.context;
		switch(_g[1]) {
		case 0:
			var al = _g[3];
			var alc = _g[2];
			alc.suspendContext(alc.getCurrentContext());
			break;
		default:
		}
	}
};
var lime_audio_AudioSource = function(buffer,offset,length,loops) {
	if(loops == null) loops = 0;
	if(offset == null) offset = 0;
	this.onComplete = new lime_app_Event_$Void_$Void();
	this.buffer = buffer;
	this.offset = offset;
	if(length != null && length != 0) this.set_length(length);
	this.set_loops(loops);
	this.id = 0;
	if(buffer != null) this.init();
};
$hxClasses["lime.audio.AudioSource"] = lime_audio_AudioSource;
lime_audio_AudioSource.__name__ = true;
lime_audio_AudioSource.prototype = {
	dispose: function() {
		{
			var _g = lime_audio_AudioManager.context;
			switch(_g[1]) {
			case 0:
				var al = _g[3];
				var alc = _g[2];
				if(this.id != 0) al.deleteSource(this.id);
				break;
			default:
			}
		}
	}
	,init: function() {
		{
			var _g = lime_audio_AudioManager.context;
			switch(_g[1]) {
			case 0:
				var al = _g[3];
				var alc = _g[2];
				if(this.buffer.id == 0) {
					this.buffer.id = al.genBuffer();
					var format = 0;
					if(this.buffer.channels == 1) {
						if(this.buffer.bitsPerSample == 8) format = al.FORMAT_MONO8; else if(this.buffer.bitsPerSample == 16) format = al.FORMAT_MONO16;
					} else if(this.buffer.channels == 2) {
						if(this.buffer.bitsPerSample == 8) format = al.FORMAT_STEREO8; else if(this.buffer.bitsPerSample == 16) format = al.FORMAT_STEREO16;
					}
					al.bufferData(this.buffer.id,format,this.buffer.data,this.buffer.data.length,this.buffer.sampleRate);
				}
				this.id = al.genSource();
				al.sourcei(this.id,al.BUFFER,this.buffer.id);
				break;
			default:
			}
		}
	}
	,play: function() {
	}
	,pause: function() {
	}
	,stop: function() {
	}
	,timer_onRun: function() {
	}
	,get_currentTime: function() {
		return 0;
	}
	,set_currentTime: function(value) {
		return this.pauseTime = value;
	}
	,get_gain: function() {
		return 1;
	}
	,set_gain: function(value) {
		return 1;
	}
	,get_length: function() {
		if(this.__length != null) return this.__length;
		return 0;
	}
	,set_length: function(value) {
		return this.__length = value;
	}
	,get_loops: function() {
		return this.__loops;
	}
	,set_loops: function(loops) {
		return this.__loops = loops;
	}
	,__class__: lime_audio_AudioSource
};
var lime_audio_FlashAudioContext = function() {
};
$hxClasses["lime.audio.FlashAudioContext"] = lime_audio_FlashAudioContext;
lime_audio_FlashAudioContext.__name__ = true;
lime_audio_FlashAudioContext.prototype = {
	createBuffer: function(stream,context) {
		return null;
	}
	,getBytesLoaded: function(buffer) {
		return 0;
	}
	,getBytesTotal: function(buffer) {
		return 0;
	}
	,getID3: function(buffer) {
		return null;
	}
	,getIsBuffering: function(buffer) {
		return false;
	}
	,getIsURLInaccessible: function(buffer) {
		return false;
	}
	,getLength: function(buffer) {
		return 0;
	}
	,getURL: function(buffer) {
		return null;
	}
	,close: function(buffer) {
	}
	,extract: function(buffer,target,length,startPosition) {
		if(startPosition == null) startPosition = -1;
		return 0;
	}
	,load: function(buffer,stream,context) {
	}
	,loadCompressedDataFromByteArray: function(buffer,bytes,bytesLength) {
	}
	,loadPCMFromByteArray: function(buffer,bytes,samples,format,stereo,sampleRate) {
		if(sampleRate == null) sampleRate = 44100;
		if(stereo == null) stereo = true;
	}
	,play: function(buffer,startTime,loops,sndTransform) {
		if(loops == null) loops = 0;
		if(startTime == null) startTime = 0;
		return null;
	}
	,__class__: lime_audio_FlashAudioContext
};
var lime_audio_HTML5AudioContext = function() {
	this.NETWORK_NO_SOURCE = 3;
	this.NETWORK_LOADING = 2;
	this.NETWORK_IDLE = 1;
	this.NETWORK_EMPTY = 0;
	this.HAVE_NOTHING = 0;
	this.HAVE_METADATA = 1;
	this.HAVE_FUTURE_DATA = 3;
	this.HAVE_ENOUGH_DATA = 4;
	this.HAVE_CURRENT_DATA = 2;
};
$hxClasses["lime.audio.HTML5AudioContext"] = lime_audio_HTML5AudioContext;
lime_audio_HTML5AudioContext.__name__ = true;
lime_audio_HTML5AudioContext.prototype = {
	canPlayType: function(buffer,type) {
		if(buffer.src != null) return buffer.src.canPlayType(type);
		return null;
	}
	,createBuffer: function(urlString) {
		var buffer = new lime_audio_AudioBuffer();
		buffer.src = new Audio();
		buffer.src.src = urlString;
		return buffer;
	}
	,getAutoplay: function(buffer) {
		if(buffer.src != null) return buffer.src.autoplay;
		return false;
	}
	,getBuffered: function(buffer) {
		if(buffer.src != null) return buffer.src.buffered;
		return null;
	}
	,getCurrentSrc: function(buffer) {
		if(buffer.src != null) return buffer.src.currentSrc;
		return null;
	}
	,getCurrentTime: function(buffer) {
		if(buffer.src != null) return buffer.src.currentTime;
		return 0;
	}
	,getDefaultPlaybackRate: function(buffer) {
		if(buffer.src != null) return buffer.src.defaultPlaybackRate;
		return 1;
	}
	,getDuration: function(buffer) {
		if(buffer.src != null) return buffer.src.duration;
		return 0;
	}
	,getEnded: function(buffer) {
		if(buffer.src != null) return buffer.src.ended;
		return false;
	}
	,getError: function(buffer) {
		if(buffer.src != null) return buffer.src.error;
		return null;
	}
	,getLoop: function(buffer) {
		if(buffer.src != null) return buffer.src.loop;
		return false;
	}
	,getMuted: function(buffer) {
		if(buffer.src != null) return buffer.src.muted;
		return false;
	}
	,getNetworkState: function(buffer) {
		if(buffer.src != null) return buffer.src.networkState;
		return 0;
	}
	,getPaused: function(buffer) {
		if(buffer.src != null) return buffer.src.paused;
		return false;
	}
	,getPlaybackRate: function(buffer) {
		if(buffer.src != null) return buffer.src.playbackRate;
		return 1;
	}
	,getPlayed: function(buffer) {
		if(buffer.src != null) return buffer.src.played;
		return null;
	}
	,getPreload: function(buffer) {
		if(buffer.src != null) return buffer.src.preload;
		return null;
	}
	,getReadyState: function(buffer) {
		if(buffer.src != null) return buffer.src.readyState;
		return 0;
	}
	,getSeekable: function(buffer) {
		if(buffer.src != null) return buffer.src.seekable;
		return null;
	}
	,getSeeking: function(buffer) {
		if(buffer.src != null) return buffer.src.seeking;
		return false;
	}
	,getSrc: function(buffer) {
		if(buffer.src != null) return buffer.src.src;
		return null;
	}
	,getStartTime: function(buffer) {
		if(buffer.src != null) return buffer.src.playbackRate;
		return 0;
	}
	,getVolume: function(buffer) {
		if(buffer.src != null) return buffer.src.volume;
		return 1;
	}
	,load: function(buffer) {
		if(buffer.src != null) return buffer.src.load();
	}
	,pause: function(buffer) {
		if(buffer.src != null) return buffer.src.pause();
	}
	,play: function(buffer) {
		if(buffer.src != null) return buffer.src.play();
	}
	,setAutoplay: function(buffer,value) {
		if(buffer.src != null) buffer.src.autoplay = value;
	}
	,setCurrentTime: function(buffer,value) {
		if(buffer.src != null) buffer.src.currentTime = value;
	}
	,setDefaultPlaybackRate: function(buffer,value) {
		if(buffer.src != null) buffer.src.defaultPlaybackRate = value;
	}
	,setLoop: function(buffer,value) {
		if(buffer.src != null) buffer.src.loop = value;
	}
	,setMuted: function(buffer,value) {
		if(buffer.src != null) buffer.src.muted = value;
	}
	,setPlaybackRate: function(buffer,value) {
		if(buffer.src != null) buffer.src.playbackRate = value;
	}
	,setPreload: function(buffer,value) {
		if(buffer.src != null) buffer.src.preload = value;
	}
	,setSrc: function(buffer,value) {
		if(buffer.src != null) buffer.src.src = value;
	}
	,setVolume: function(buffer,value) {
		if(buffer.src != null) buffer.src.volume = value;
	}
	,__class__: lime_audio_HTML5AudioContext
};
var lime_audio_openal_AL = function() { };
$hxClasses["lime.audio.openal.AL"] = lime_audio_openal_AL;
lime_audio_openal_AL.__name__ = true;
lime_audio_openal_AL.bufferData = function(buffer,format,data,size,freq) {
};
lime_audio_openal_AL.buffer3f = function(buffer,param,value1,value2,value3) {
};
lime_audio_openal_AL.buffer3i = function(buffer,param,value1,value2,value3) {
};
lime_audio_openal_AL.bufferf = function(buffer,param,value) {
};
lime_audio_openal_AL.bufferfv = function(buffer,param,values) {
};
lime_audio_openal_AL.bufferi = function(buffer,param,value) {
};
lime_audio_openal_AL.bufferiv = function(buffer,param,values) {
};
lime_audio_openal_AL.deleteBuffer = function(buffer) {
};
lime_audio_openal_AL.deleteBuffers = function(buffers) {
};
lime_audio_openal_AL.deleteSource = function(source) {
};
lime_audio_openal_AL.deleteSources = function(sources) {
};
lime_audio_openal_AL.disable = function(capability) {
};
lime_audio_openal_AL.distanceModel = function(distanceModel) {
};
lime_audio_openal_AL.dopplerFactor = function(value) {
};
lime_audio_openal_AL.dopplerVelocity = function(value) {
};
lime_audio_openal_AL.enable = function(capability) {
};
lime_audio_openal_AL.genSource = function() {
	return 0;
};
lime_audio_openal_AL.genSources = function(n) {
	return null;
};
lime_audio_openal_AL.genBuffer = function() {
	return 0;
};
lime_audio_openal_AL.genBuffers = function(n) {
	return null;
};
lime_audio_openal_AL.getBoolean = function(param) {
	return false;
};
lime_audio_openal_AL.getBooleanv = function(param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getBuffer3f = function(buffer,param) {
	return null;
};
lime_audio_openal_AL.getBuffer3i = function(buffer,param) {
	return null;
};
lime_audio_openal_AL.getBufferf = function(buffer,param) {
	return 0;
};
lime_audio_openal_AL.getBufferfv = function(buffer,param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getBufferi = function(buffer,param) {
	return 0;
};
lime_audio_openal_AL.getBufferiv = function(buffer,param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getDouble = function(param) {
	return 0;
};
lime_audio_openal_AL.getDoublev = function(param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getEnumValue = function(ename) {
	return 0;
};
lime_audio_openal_AL.getError = function() {
	return 0;
};
lime_audio_openal_AL.getErrorString = function() {
	var _g = lime_audio_openal_AL.getError();
	switch(_g) {
	case 40961:
		return "INVALID_NAME: Invalid parameter name";
	case 40962:
		return "INVALID_ENUM: Invalid enum value";
	case 40963:
		return "INVALID_VALUE: Invalid parameter value";
	case 40964:
		return "INVALID_OPERATION: Illegal operation or call";
	case 40965:
		return "OUT_OF_MEMORY: OpenAL has run out of memory";
	default:
		return "";
	}
};
lime_audio_openal_AL.getFloat = function(param) {
	return 0;
};
lime_audio_openal_AL.getFloatv = function(param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getInteger = function(param) {
	return 0;
};
lime_audio_openal_AL.getIntegerv = function(param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getListener3f = function(param) {
	return null;
};
lime_audio_openal_AL.getListener3i = function(param) {
	return null;
};
lime_audio_openal_AL.getListenerf = function(param) {
	return 0;
};
lime_audio_openal_AL.getListenerfv = function(param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getListeneri = function(param) {
	return 0;
};
lime_audio_openal_AL.getListeneriv = function(param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getProcAddress = function(fname) {
	return null;
};
lime_audio_openal_AL.getSource3f = function(source,param) {
	return null;
};
lime_audio_openal_AL.getSourcef = function(source,param) {
	return 0;
};
lime_audio_openal_AL.getSource3i = function(source,param) {
	return null;
};
lime_audio_openal_AL.getSourcefv = function(source,param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getSourcei = function(source,param) {
	return 0;
};
lime_audio_openal_AL.getSourceiv = function(source,param,count) {
	if(count == null) count = 1;
	return null;
};
lime_audio_openal_AL.getString = function(param) {
	return null;
};
lime_audio_openal_AL.isBuffer = function(buffer) {
	return false;
};
lime_audio_openal_AL.isEnabled = function(capability) {
	return false;
};
lime_audio_openal_AL.isExtensionPresent = function(extname) {
	return false;
};
lime_audio_openal_AL.isSource = function(source) {
	return false;
};
lime_audio_openal_AL.listener3f = function(param,value1,value2,value3) {
};
lime_audio_openal_AL.listener3i = function(param,value1,value2,value3) {
};
lime_audio_openal_AL.listenerf = function(param,value) {
};
lime_audio_openal_AL.listenerfv = function(param,values) {
};
lime_audio_openal_AL.listeneri = function(param,value) {
};
lime_audio_openal_AL.listeneriv = function(param,values) {
};
lime_audio_openal_AL.source3f = function(source,param,value1,value2,value3) {
};
lime_audio_openal_AL.source3i = function(source,param,value1,value2,value3) {
};
lime_audio_openal_AL.sourcef = function(source,param,value) {
};
lime_audio_openal_AL.sourcefv = function(source,param,values) {
};
lime_audio_openal_AL.sourcei = function(source,param,value) {
};
lime_audio_openal_AL.sourceiv = function(source,param,values) {
};
lime_audio_openal_AL.sourcePlay = function(source) {
};
lime_audio_openal_AL.sourcePlayv = function(sources) {
};
lime_audio_openal_AL.sourceStop = function(source) {
};
lime_audio_openal_AL.sourceStopv = function(sources) {
};
lime_audio_openal_AL.sourceRewind = function(source) {
};
lime_audio_openal_AL.sourceRewindv = function(sources) {
};
lime_audio_openal_AL.sourcePause = function(source) {
};
lime_audio_openal_AL.sourcePausev = function(sources) {
};
lime_audio_openal_AL.sourceQueueBuffer = function(source,buffer) {
};
lime_audio_openal_AL.sourceQueueBuffers = function(source,nb,buffers) {
};
lime_audio_openal_AL.sourceUnqueueBuffer = function(source) {
	return 0;
};
lime_audio_openal_AL.sourceUnqueueBuffers = function(source,nb) {
	return null;
};
lime_audio_openal_AL.speedOfSound = function(value) {
};
var lime_audio_openal_ALC = function() { };
$hxClasses["lime.audio.openal.ALC"] = lime_audio_openal_ALC;
lime_audio_openal_ALC.__name__ = true;
lime_audio_openal_ALC.closeDevice = function(device) {
	return false;
};
lime_audio_openal_ALC.createContext = function(device,attrlist) {
	return null;
};
lime_audio_openal_ALC.destroyContext = function(context) {
};
lime_audio_openal_ALC.getContextsDevice = function(context) {
	return null;
};
lime_audio_openal_ALC.getCurrentContext = function() {
	return null;
};
lime_audio_openal_ALC.getError = function(device) {
	return 0;
};
lime_audio_openal_ALC.getErrorString = function(device) {
	var _g = lime_audio_openal_ALC.getError(device);
	switch(_g) {
	case 40961:
		return "INVALID_DEVICE: Invalid device (or no device?)";
	case 40962:
		return "INVALID_CONTEXT: Invalid context (or no context?)";
	case 40963:
		return "INVALID_ENUM: Invalid enum value";
	case 40964:
		return "INVALID_VALUE: Invalid param value";
	case 40965:
		return "OUT_OF_MEMORY: OpenAL has run out of memory";
	default:
		return "";
	}
};
lime_audio_openal_ALC.getIntegerv = function(device,param,size) {
	return null;
};
lime_audio_openal_ALC.getString = function(device,param) {
	return null;
};
lime_audio_openal_ALC.makeContextCurrent = function(context) {
	return false;
};
lime_audio_openal_ALC.openDevice = function(deviceName) {
	return null;
};
lime_audio_openal_ALC.processContext = function(context) {
};
lime_audio_openal_ALC.suspendContext = function(context) {
};
var lime_audio_openal__$ALContext_ALContext_$Impl_$ = {};
$hxClasses["lime.audio.openal._ALContext.ALContext_Impl_"] = lime_audio_openal__$ALContext_ALContext_$Impl_$;
lime_audio_openal__$ALContext_ALContext_$Impl_$.__name__ = true;
lime_audio_openal__$ALContext_ALContext_$Impl_$._new = function(handle) {
	return handle;
};
var lime_audio_openal__$ALDevice_ALDevice_$Impl_$ = {};
$hxClasses["lime.audio.openal._ALDevice.ALDevice_Impl_"] = lime_audio_openal__$ALDevice_ALDevice_$Impl_$;
lime_audio_openal__$ALDevice_ALDevice_$Impl_$.__name__ = true;
lime_audio_openal__$ALDevice_ALDevice_$Impl_$._new = function(handle) {
	return handle;
};
var lime_graphics_ConsoleRenderContext = function() {
};
$hxClasses["lime.graphics.ConsoleRenderContext"] = lime_graphics_ConsoleRenderContext;
lime_graphics_ConsoleRenderContext.__name__ = true;
lime_graphics_ConsoleRenderContext.prototype = {
	createIndexBuffer: function(indices,count) {
		return new lime_graphics_console_IndexBuffer();
	}
	,createVertexBuffer: function(decl,count) {
		return new lime_graphics_console_VertexBuffer();
	}
	,lookupShader: function(name) {
		return new lime_graphics_console_Shader();
	}
	,clear: function(r,g,b,a,depth,stencil) {
		if(stencil == null) stencil = 0;
		if(depth == null) depth = 1.0;
	}
	,bindShader: function(shader) {
	}
	,setViewport: function(x,y,width,height,nearPlane,farPlane) {
		if(farPlane == null) farPlane = 1.0;
		if(nearPlane == null) nearPlane = 0.0;
	}
	,setVertexShaderConstantF: function(startRegister,vec4,vec4count) {
	}
	,setVertexSource: function(vb) {
	}
	,setIndexSource: function(ib) {
	}
	,draw: function(primitive,startVertex,primitiveCount) {
	}
	,drawIndexed: function(primitive,vertexCount,startIndex,primitiveCount) {
	}
	,get_width: function() {
		return 0;
	}
	,get_height: function() {
		return 0;
	}
	,__class__: lime_graphics_ConsoleRenderContext
};
var lime_graphics_FlashRenderContext = function() {
};
$hxClasses["lime.graphics.FlashRenderContext"] = lime_graphics_FlashRenderContext;
lime_graphics_FlashRenderContext.__name__ = true;
lime_graphics_FlashRenderContext.prototype = {
	addChild: function(child) {
		return null;
	}
	,addChildAt: function(child,index) {
		return null;
	}
	,addEventListener: function(type,listener,useCapture,priority,useWeakReference) {
		if(useWeakReference == null) useWeakReference = false;
		if(priority == null) priority = 0;
		if(useCapture == null) useCapture = false;
	}
	,areInaccessibleObjectsUnderPoint: function(point) {
		return false;
	}
	,contains: function(child) {
		return false;
	}
	,dispatchEvent: function(event) {
		return false;
	}
	,getBounds: function(targetCoordinateSpace) {
		return null;
	}
	,getChildAt: function(index) {
		return null;
	}
	,getChildByName: function(name) {
		return null;
	}
	,getChildIndex: function(child) {
		return 0;
	}
	,getObjectsUnderPoint: function(point) {
		return null;
	}
	,getRect: function(targetCoordinateSpace) {
		return null;
	}
	,globalToLocal: function(point) {
		return null;
	}
	,globalToLocal3D: function(point) {
		return null;
	}
	,hasEventListener: function(type) {
		return false;
	}
	,hitTestObject: function(obj) {
		return false;
	}
	,hitTestPoint: function(x,y,shapeFlag) {
		if(shapeFlag == null) shapeFlag = false;
		return false;
	}
	,local3DToGlobal: function(point3d) {
		return null;
	}
	,localToGlobal: function(point) {
		return null;
	}
	,removeChild: function(child) {
		return null;
	}
	,removeChildAt: function(index) {
		return null;
	}
	,removeChildren: function(beginIndex,endIndex) {
		if(endIndex == null) endIndex = 2147483647;
		if(beginIndex == null) beginIndex = 0;
	}
	,removeEventListener: function(type,listener,useCapture) {
		if(useCapture == null) useCapture = false;
	}
	,requestSoftKeyboard: function() {
		return false;
	}
	,setChildIndex: function(child,index) {
	}
	,startDrag: function(lockCenter,bounds) {
		if(lockCenter == null) lockCenter = false;
	}
	,startTouchDrag: function(touchPointID,lockCenter,bounds) {
		if(lockCenter == null) lockCenter = false;
	}
	,stopAllMovieClips: function() {
	}
	,stopDrag: function() {
	}
	,stopTouchDrag: function(touchPointID) {
	}
	,swapChildren: function(child1,child2) {
	}
	,swapChildrenAt: function(index1,index2) {
	}
	,toString: function() {
		return null;
	}
	,willTrigger: function(type) {
		return false;
	}
	,__class__: lime_graphics_FlashRenderContext
};
var lime_graphics_Image = function(buffer,offsetX,offsetY,width,height,color,type) {
	if(height == null) height = -1;
	if(width == null) width = -1;
	if(offsetY == null) offsetY = 0;
	if(offsetX == null) offsetX = 0;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.width = width;
	this.height = height;
	if(type == null) {
		if(lime_app_Application.current != null && lime_app_Application.current.renderers[0] != null) {
			var _g = lime_app_Application.current.renderers[0].context;
			switch(_g[1]) {
			case 2:case 1:
				this.type = lime_graphics_ImageType.CANVAS;
				break;
			case 3:
				this.type = lime_graphics_ImageType.FLASH;
				break;
			default:
				this.type = lime_graphics_ImageType.DATA;
			}
		} else this.type = lime_graphics_ImageType.DATA;
	} else this.type = type;
	if(buffer == null) {
		if(width > 0 && height > 0) {
			var _g1 = this.type;
			switch(_g1[1]) {
			case 0:
				this.buffer = new lime_graphics_ImageBuffer(null,width,height);
				lime_graphics_utils_ImageCanvasUtil.createCanvas(this,width,height);
				if(color != null) this.fillRect(new lime_math_Rectangle(0,0,width,height),color);
				break;
			case 1:
				this.buffer = new lime_graphics_ImageBuffer((function($this) {
					var $r;
					var elements = width * height * 4;
					var this1;
					if(elements != null) this1 = new Uint8Array(elements); else this1 = null;
					$r = this1;
					return $r;
				}(this)),width,height);
				if(color != null) this.fillRect(new lime_math_Rectangle(0,0,width,height),color);
				break;
			case 2:
				break;
			default:
			}
		}
	} else this.__fromImageBuffer(buffer);
};
$hxClasses["lime.graphics.Image"] = lime_graphics_Image;
lime_graphics_Image.__name__ = true;
lime_graphics_Image.fromBase64 = function(base64,type,onload) {
	if(base64 == null) return null;
	var image = new lime_graphics_Image();
	image.__fromBase64(base64,type,onload);
	return image;
};
lime_graphics_Image.fromBitmapData = function(bitmapData) {
	if(bitmapData == null) return null;
	return bitmapData.image;
};
lime_graphics_Image.fromBytes = function(bytes,onload) {
	if(bytes == null) return null;
	var image = new lime_graphics_Image();
	image.__fromBytes(bytes,onload);
	return image;
};
lime_graphics_Image.fromCanvas = function(canvas) {
	if(canvas == null) return null;
	var buffer = new lime_graphics_ImageBuffer(null,canvas.width,canvas.height);
	buffer.set_src(canvas);
	return new lime_graphics_Image(buffer);
};
lime_graphics_Image.fromFile = function(path,onload,onerror) {
	var image = new lime_graphics_Image();
	image.__fromFile(path,onload,onerror);
	return image;
};
lime_graphics_Image.fromImageElement = function(image) {
	if(image == null) return null;
	var buffer = new lime_graphics_ImageBuffer(null,image.width,image.height);
	buffer.set_src(image);
	return new lime_graphics_Image(buffer);
};
lime_graphics_Image.__base64Encode = function(bytes) {
	var extension;
	var _g = bytes.length % 3;
	switch(_g) {
	case 1:
		extension = "==";
		break;
	case 2:
		extension = "=";
		break;
	default:
		extension = "";
	}
	if(lime_graphics_Image.__base64Encoder == null) lime_graphics_Image.__base64Encoder = new haxe_crypto_BaseCode(haxe_io_Bytes.ofString(lime_graphics_Image.__base64Chars));
	return lime_graphics_Image.__base64Encoder.encodeBytes(bytes).toString() + extension;
};
lime_graphics_Image.__isJPG = function(bytes) {
	return bytes.b[0] == 255 && bytes.b[1] == 216;
};
lime_graphics_Image.__isPNG = function(bytes) {
	return bytes.b[0] == 137 && bytes.b[1] == 80 && bytes.b[2] == 78 && bytes.b[3] == 71 && bytes.b[4] == 13 && bytes.b[5] == 10 && bytes.b[6] == 26 && bytes.b[7] == 10;
};
lime_graphics_Image.__isGIF = function(bytes) {
	if(bytes.b[0] == 71 && bytes.b[1] == 73 && bytes.b[2] == 70 && bytes.b[3] == 56) {
		var b = bytes.b[4];
		return (b == 55 || b == 57) && bytes.b[5] == 97;
	}
	return false;
};
lime_graphics_Image.prototype = {
	clone: function() {
		if(this.buffer != null) {
			if(this.type == lime_graphics_ImageType.CANVAS && this.buffer.__srcImage == null) {
				lime_graphics_utils_ImageCanvasUtil.convertToCanvas(this);
				lime_graphics_utils_ImageCanvasUtil.sync(this,true);
			}
			var image = new lime_graphics_Image(this.buffer.clone(),this.offsetX,this.offsetY,this.width,this.height,null,this.type);
			image.dirty = this.dirty;
			return image;
		} else return new lime_graphics_Image(null,this.offsetX,this.offsetY,this.width,this.height,null,this.type);
	}
	,colorTransform: function(rect,colorMatrix) {
		rect = this.__clipRect(rect);
		if(this.buffer == null || rect == null) return;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.colorTransform(this,rect,colorMatrix);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			lime_graphics_utils_ImageDataUtil.colorTransform(this,rect,colorMatrix);
			break;
		case 2:
			rect.offset(this.offsetX,this.offsetY);
			this.buffer.__srcBitmapData.colorTransform(rect.__toFlashRectangle(),lime_math__$ColorMatrix_ColorMatrix_$Impl_$.__toFlashColorTransform(colorMatrix));
			break;
		default:
		}
	}
	,copyChannel: function(sourceImage,sourceRect,destPoint,sourceChannel,destChannel) {
		sourceRect = this.__clipRect(sourceRect);
		if(this.buffer == null || sourceRect == null) return;
		if(destChannel == lime_graphics_ImageChannel.ALPHA && !this.get_transparent()) return;
		if(sourceRect.width <= 0 || sourceRect.height <= 0) return;
		if(sourceRect.x + sourceRect.width > sourceImage.width) sourceRect.width = sourceImage.width - sourceRect.x;
		if(sourceRect.y + sourceRect.height > sourceImage.height) sourceRect.height = sourceImage.height - sourceRect.y;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.copyChannel(this,sourceImage,sourceRect,destPoint,sourceChannel,destChannel);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			lime_graphics_utils_ImageDataUtil.copyChannel(this,sourceImage,sourceRect,destPoint,sourceChannel,destChannel);
			break;
		case 2:
			var srcChannel;
			switch(sourceChannel[1]) {
			case 0:
				srcChannel = 1;
				break;
			case 1:
				srcChannel = 2;
				break;
			case 2:
				srcChannel = 4;
				break;
			case 3:
				srcChannel = 8;
				break;
			}
			var dstChannel;
			switch(destChannel[1]) {
			case 0:
				dstChannel = 1;
				break;
			case 1:
				dstChannel = 2;
				break;
			case 2:
				dstChannel = 4;
				break;
			case 3:
				dstChannel = 8;
				break;
			}
			sourceRect.offset(sourceImage.offsetX,sourceImage.offsetY);
			destPoint.offset(this.offsetX,this.offsetY);
			this.buffer.__srcBitmapData.copyChannel(sourceImage.buffer.get_src(),sourceRect.__toFlashRectangle(),destPoint.__toFlashPoint(),srcChannel,dstChannel);
			break;
		default:
		}
	}
	,copyPixels: function(sourceImage,sourceRect,destPoint,alphaImage,alphaPoint,mergeAlpha) {
		if(mergeAlpha == null) mergeAlpha = false;
		if(this.buffer == null || sourceImage == null) return;
		if(sourceRect.width <= 0 || sourceRect.height <= 0) return;
		if(this.width <= 0 || this.height <= 0) return;
		if(sourceRect.x + sourceRect.width > sourceImage.width) sourceRect.width = sourceImage.width - sourceRect.x;
		if(sourceRect.y + sourceRect.height > sourceImage.height) sourceRect.height = sourceImage.height - sourceRect.y;
		if(sourceRect.x < 0) {
			sourceRect.width += sourceRect.x;
			sourceRect.x = 0;
		}
		if(sourceRect.y < 0) {
			sourceRect.height += sourceRect.y;
			sourceRect.y = 0;
		}
		if(destPoint.x + sourceRect.width > this.width) sourceRect.width = this.width - destPoint.x;
		if(destPoint.y + sourceRect.height > this.height) sourceRect.height = this.height - destPoint.y;
		if(destPoint.x < 0) {
			sourceRect.width += destPoint.x;
			sourceRect.x = -destPoint.x;
			destPoint.x = 0;
		}
		if(destPoint.y < 0) {
			sourceRect.height += destPoint.y;
			sourceRect.y = -destPoint.y;
			destPoint.y = 0;
		}
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.convertToCanvas(this);
			lime_graphics_utils_ImageCanvasUtil.copyPixels(this,sourceImage,sourceRect,destPoint,alphaImage,alphaPoint,mergeAlpha);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			lime_graphics_utils_ImageCanvasUtil.convertToData(sourceImage);
			lime_graphics_utils_ImageDataUtil.copyPixels(this,sourceImage,sourceRect,destPoint,alphaImage,alphaPoint,mergeAlpha);
			break;
		case 2:
			sourceRect.offset(sourceImage.offsetX,sourceImage.offsetY);
			destPoint.offset(this.offsetX,this.offsetY);
			if(alphaImage != null && alphaPoint != null) alphaPoint.offset(alphaImage.offsetX,alphaImage.offsetY);
			this.buffer.__srcBitmapData.copyPixels(sourceImage.buffer.__srcBitmapData,sourceRect.__toFlashRectangle(),destPoint.__toFlashPoint(),alphaImage != null?alphaImage.buffer.get_src():null,alphaPoint != null?alphaPoint.__toFlashPoint():null,mergeAlpha);
			break;
		default:
		}
	}
	,encode: function(format,quality) {
		if(quality == null) quality = 90;
		if(format == null) format = "png";
		switch(format) {
		case "png":
			return lime_graphics_format_PNG.encode(this);
		case "jpg":case "jpeg":
			return lime_graphics_format_JPEG.encode(this,quality);
		case "bmp":
			return lime_graphics_format_BMP.encode(this);
		default:
		}
		return null;
	}
	,fillRect: function(rect,color,format) {
		rect = this.__clipRect(rect);
		if(this.buffer == null || rect == null) return;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.fillRect(this,rect,color,format);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			if(this.buffer.data.length == 0) return;
			lime_graphics_utils_ImageDataUtil.fillRect(this,rect,color,format);
			break;
		case 2:
			rect.offset(this.offsetX,this.offsetY);
			var argb;
			if(format != null) switch(format) {
			case 1:
				argb = color;
				break;
			case 2:
				{
					var bgra = color;
					var argb1 = 0;
					argb1 = (bgra & 255 & 255) << 24 | (bgra >> 8 & 255 & 255) << 16 | (bgra >> 16 & 255 & 255) << 8 | bgra >> 24 & 255 & 255;
					argb = argb1;
				}
				break;
			default:
				{
					var rgba = color;
					var argb2 = 0;
					argb2 = (rgba & 255 & 255) << 24 | (rgba >> 24 & 255 & 255) << 16 | (rgba >> 16 & 255 & 255) << 8 | rgba >> 8 & 255 & 255;
					argb = argb2;
				}
			} else {
				var rgba1 = color;
				var argb3 = 0;
				argb3 = (rgba1 & 255 & 255) << 24 | (rgba1 >> 24 & 255 & 255) << 16 | (rgba1 >> 16 & 255 & 255) << 8 | rgba1 >> 8 & 255 & 255;
				argb = argb3;
			}
			this.buffer.__srcBitmapData.fillRect(rect.__toFlashRectangle(),argb);
			break;
		default:
		}
	}
	,floodFill: function(x,y,color,format) {
		if(this.buffer == null) return;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.floodFill(this,x,y,color,format);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			lime_graphics_utils_ImageDataUtil.floodFill(this,x,y,color,format);
			break;
		case 2:
			var argb;
			if(format != null) switch(format) {
			case 1:
				argb = color;
				break;
			case 2:
				{
					var bgra = color;
					var argb1 = 0;
					argb1 = (bgra & 255 & 255) << 24 | (bgra >> 8 & 255 & 255) << 16 | (bgra >> 16 & 255 & 255) << 8 | bgra >> 24 & 255 & 255;
					argb = argb1;
				}
				break;
			default:
				{
					var rgba = color;
					var argb2 = 0;
					argb2 = (rgba & 255 & 255) << 24 | (rgba >> 24 & 255 & 255) << 16 | (rgba >> 16 & 255 & 255) << 8 | rgba >> 8 & 255 & 255;
					argb = argb2;
				}
			} else {
				var rgba1 = color;
				var argb3 = 0;
				argb3 = (rgba1 & 255 & 255) << 24 | (rgba1 >> 24 & 255 & 255) << 16 | (rgba1 >> 16 & 255 & 255) << 8 | rgba1 >> 8 & 255 & 255;
				argb = argb3;
			}
			this.buffer.__srcBitmapData.floodFill(x + this.offsetX,y + this.offsetY,argb);
			break;
		default:
		}
	}
	,getColorBoundsRect: function(mask,color,findColor,format) {
		if(findColor == null) findColor = true;
		if(this.buffer == null) return null;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			return lime_graphics_utils_ImageDataUtil.getColorBoundsRect(this,mask,color,findColor,format);
		case 1:
			return lime_graphics_utils_ImageDataUtil.getColorBoundsRect(this,mask,color,findColor,format);
		case 2:
			var rect = this.buffer.__srcBitmapData.getColorBoundsRect(mask,color,findColor);
			return new lime_math_Rectangle(rect.x,rect.y,rect.width,rect.height);
		default:
			return null;
		}
	}
	,getPixel: function(x,y,format) {
		if(this.buffer == null || x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			return lime_graphics_utils_ImageCanvasUtil.getPixel(this,x,y,format);
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			return lime_graphics_utils_ImageDataUtil.getPixel(this,x,y,format);
		case 2:
			var color = this.buffer.__srcBitmapData.getPixel(x + this.offsetX,y + this.offsetY);
			if(format != null) switch(format) {
			case 1:
				return color;
			case 2:
				var bgra;
				{
					var bgra1 = 0;
					bgra1 = (color & 255 & 255) << 24 | (color >> 8 & 255 & 255) << 16 | (color >> 16 & 255 & 255) << 8 | color >> 24 & 255 & 255;
					bgra = bgra1;
				}
				return bgra;
			default:
				var rgba;
				{
					var rgba1 = 0;
					rgba1 = (color >> 16 & 255 & 255) << 24 | (color >> 8 & 255 & 255) << 16 | (color & 255 & 255) << 8 | color >> 24 & 255 & 255;
					rgba = rgba1;
				}
				return rgba;
			} else {
				var rgba2;
				{
					var rgba3 = 0;
					rgba3 = (color >> 16 & 255 & 255) << 24 | (color >> 8 & 255 & 255) << 16 | (color & 255 & 255) << 8 | color >> 24 & 255 & 255;
					rgba2 = rgba3;
				}
				return rgba2;
			}
			break;
		default:
			return 0;
		}
	}
	,getPixel32: function(x,y,format) {
		if(this.buffer == null || x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			return lime_graphics_utils_ImageCanvasUtil.getPixel32(this,x,y,format);
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			return lime_graphics_utils_ImageDataUtil.getPixel32(this,x,y,format);
		case 2:
			var color = this.buffer.__srcBitmapData.getPixel32(x + this.offsetX,y + this.offsetY);
			if(format != null) switch(format) {
			case 1:
				return color;
			case 2:
				var bgra;
				{
					var bgra1 = 0;
					bgra1 = (color & 255 & 255) << 24 | (color >> 8 & 255 & 255) << 16 | (color >> 16 & 255 & 255) << 8 | color >> 24 & 255 & 255;
					bgra = bgra1;
				}
				return bgra;
			default:
				var rgba;
				{
					var rgba1 = 0;
					rgba1 = (color >> 16 & 255 & 255) << 24 | (color >> 8 & 255 & 255) << 16 | (color & 255 & 255) << 8 | color >> 24 & 255 & 255;
					rgba = rgba1;
				}
				return rgba;
			} else {
				var rgba2;
				{
					var rgba3 = 0;
					rgba3 = (color >> 16 & 255 & 255) << 24 | (color >> 8 & 255 & 255) << 16 | (color & 255 & 255) << 8 | color >> 24 & 255 & 255;
					rgba2 = rgba3;
				}
				return rgba2;
			}
			break;
		default:
			return 0;
		}
	}
	,getPixels: function(rect,format) {
		if(this.buffer == null) return null;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			return lime_graphics_utils_ImageCanvasUtil.getPixels(this,rect,format);
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			return lime_graphics_utils_ImageDataUtil.getPixels(this,rect,format);
		case 2:
			return null;
		default:
			return null;
		}
	}
	,merge: function(sourceImage,sourceRect,destPoint,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
		if(this.buffer == null || sourceImage == null) return;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.convertToCanvas(this);
			lime_graphics_utils_ImageCanvasUtil.merge(this,sourceImage,sourceRect,destPoint,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			lime_graphics_utils_ImageCanvasUtil.convertToData(sourceImage);
			lime_graphics_utils_ImageDataUtil.merge(this,sourceImage,sourceRect,destPoint,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
			break;
		case 2:
			sourceRect.offset(this.offsetX,this.offsetY);
			this.buffer.__srcBitmapData.merge(sourceImage.buffer.__srcBitmapData,sourceRect.__toFlashRectangle(),destPoint.__toFlashPoint(),redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
			break;
		default:
			return null;
		}
	}
	,resize: function(newWidth,newHeight) {
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.resize(this,newWidth,newHeight);
			break;
		case 1:
			lime_graphics_utils_ImageDataUtil.resize(this,newWidth,newHeight);
			break;
		case 2:
			break;
		default:
		}
		this.buffer.width = newWidth;
		this.buffer.height = newHeight;
		this.offsetX = 0;
		this.offsetY = 0;
		this.width = newWidth;
		this.height = newHeight;
	}
	,scroll: function(x,y) {
		if(this.buffer == null) return;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.scroll(this,x,y);
			break;
		case 1:
			this.copyPixels(this,this.get_rect(),new lime_math_Vector2(x,y));
			break;
		case 2:
			this.buffer.__srcBitmapData.scroll(x + this.offsetX,y + this.offsetX);
			break;
		default:
		}
	}
	,setPixel: function(x,y,color,format) {
		if(this.buffer == null || x < 0 || y < 0 || x >= this.width || y >= this.height) return;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.setPixel(this,x,y,color,format);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			lime_graphics_utils_ImageDataUtil.setPixel(this,x,y,color,format);
			break;
		case 2:
			var argb;
			if(format != null) switch(format) {
			case 1:
				argb = color;
				break;
			case 2:
				{
					var bgra = color;
					var argb1 = 0;
					argb1 = (bgra & 255 & 255) << 24 | (bgra >> 8 & 255 & 255) << 16 | (bgra >> 16 & 255 & 255) << 8 | bgra >> 24 & 255 & 255;
					argb = argb1;
				}
				break;
			default:
				{
					var rgba = color;
					var argb2 = 0;
					argb2 = (rgba & 255 & 255) << 24 | (rgba >> 24 & 255 & 255) << 16 | (rgba >> 16 & 255 & 255) << 8 | rgba >> 8 & 255 & 255;
					argb = argb2;
				}
			} else {
				var rgba1 = color;
				var argb3 = 0;
				argb3 = (rgba1 & 255 & 255) << 24 | (rgba1 >> 24 & 255 & 255) << 16 | (rgba1 >> 16 & 255 & 255) << 8 | rgba1 >> 8 & 255 & 255;
				argb = argb3;
			}
			this.buffer.__srcBitmapData.setPixel(x + this.offsetX,y + this.offsetX,argb);
			break;
		default:
		}
	}
	,setPixel32: function(x,y,color,format) {
		if(this.buffer == null || x < 0 || y < 0 || x >= this.width || y >= this.height) return;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.setPixel32(this,x,y,color,format);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			lime_graphics_utils_ImageDataUtil.setPixel32(this,x,y,color,format);
			break;
		case 2:
			var argb;
			if(format != null) switch(format) {
			case 1:
				argb = color;
				break;
			case 2:
				{
					var bgra = color;
					var argb1 = 0;
					argb1 = (bgra & 255 & 255) << 24 | (bgra >> 8 & 255 & 255) << 16 | (bgra >> 16 & 255 & 255) << 8 | bgra >> 24 & 255 & 255;
					argb = argb1;
				}
				break;
			default:
				{
					var rgba = color;
					var argb2 = 0;
					argb2 = (rgba & 255 & 255) << 24 | (rgba >> 24 & 255 & 255) << 16 | (rgba >> 16 & 255 & 255) << 8 | rgba >> 8 & 255 & 255;
					argb = argb2;
				}
			} else {
				var rgba1 = color;
				var argb3 = 0;
				argb3 = (rgba1 & 255 & 255) << 24 | (rgba1 >> 24 & 255 & 255) << 16 | (rgba1 >> 16 & 255 & 255) << 8 | rgba1 >> 8 & 255 & 255;
				argb = argb3;
			}
			this.buffer.__srcBitmapData.setPixel32(x + this.offsetX,y + this.offsetY,argb);
			break;
		default:
		}
	}
	,setPixels: function(rect,bytes,format) {
		rect = this.__clipRect(rect);
		if(this.buffer == null || rect == null) return;
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			lime_graphics_utils_ImageCanvasUtil.setPixels(this,rect,bytes,format);
			break;
		case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			lime_graphics_utils_ImageDataUtil.setPixels(this,rect,bytes,format);
			break;
		case 2:
			break;
		default:
		}
	}
	,threshold: function(sourceImage,sourceRect,destPoint,operation,threshold,color,mask,copySource,format) {
		if(copySource == null) copySource = false;
		if(mask == null) mask = -1;
		if(color == null) color = 0;
		if(this.buffer == null || sourceImage == null || sourceRect == null) return 0;
		var _g = this.type;
		switch(_g[1]) {
		case 0:case 1:
			lime_graphics_utils_ImageCanvasUtil.convertToData(this);
			return lime_graphics_utils_ImageDataUtil.threshold(this,sourceImage,sourceRect,destPoint,operation,threshold,color,mask,copySource,format);
		case 2:
			var _color;
			if(format != null) switch(format) {
			case 1:
				_color = color;
				break;
			case 2:
				{
					var bgra = color;
					var argb = 0;
					argb = (bgra & 255 & 255) << 24 | (bgra >> 8 & 255 & 255) << 16 | (bgra >> 16 & 255 & 255) << 8 | bgra >> 24 & 255 & 255;
					_color = argb;
				}
				break;
			default:
				{
					var rgba = color;
					var argb1 = 0;
					argb1 = (rgba & 255 & 255) << 24 | (rgba >> 24 & 255 & 255) << 16 | (rgba >> 16 & 255 & 255) << 8 | rgba >> 8 & 255 & 255;
					_color = argb1;
				}
			} else {
				var rgba1 = color;
				var argb2 = 0;
				argb2 = (rgba1 & 255 & 255) << 24 | (rgba1 >> 24 & 255 & 255) << 16 | (rgba1 >> 16 & 255 & 255) << 8 | rgba1 >> 8 & 255 & 255;
				_color = argb2;
			}
			var _mask;
			if(format != null) switch(format) {
			case 1:
				_mask = mask;
				break;
			case 2:
				{
					var bgra1 = mask;
					var argb3 = 0;
					argb3 = (bgra1 & 255 & 255) << 24 | (bgra1 >> 8 & 255 & 255) << 16 | (bgra1 >> 16 & 255 & 255) << 8 | bgra1 >> 24 & 255 & 255;
					_mask = argb3;
				}
				break;
			default:
				{
					var rgba2 = mask;
					var argb4 = 0;
					argb4 = (rgba2 & 255 & 255) << 24 | (rgba2 >> 24 & 255 & 255) << 16 | (rgba2 >> 16 & 255 & 255) << 8 | rgba2 >> 8 & 255 & 255;
					_mask = argb4;
				}
			} else {
				var rgba3 = mask;
				var argb5 = 0;
				argb5 = (rgba3 & 255 & 255) << 24 | (rgba3 >> 24 & 255 & 255) << 16 | (rgba3 >> 16 & 255 & 255) << 8 | rgba3 >> 8 & 255 & 255;
				_mask = argb5;
			}
			sourceRect.offset(sourceImage.offsetX,sourceImage.offsetY);
			destPoint.offset(this.offsetX,this.offsetY);
			return this.buffer.__srcBitmapData.threshold(sourceImage.buffer.get_src(),sourceRect.__toFlashRectangle(),destPoint.__toFlashPoint(),operation,threshold,_color,_mask,copySource);
		default:
		}
		return 0;
	}
	,__clipRect: function(r) {
		if(r == null) return null;
		if(r.x < 0) {
			r.width -= -r.x;
			r.x = 0;
			if(r.x + r.width <= 0) return null;
		}
		if(r.y < 0) {
			r.height -= -r.y;
			r.y = 0;
			if(r.y + r.height <= 0) return null;
		}
		if(r.x + r.width >= this.width) {
			r.width -= r.x + r.width - this.width;
			if(r.width <= 0) return null;
		}
		if(r.y + r.height >= this.height) {
			r.height -= r.y + r.height - this.height;
			if(r.height <= 0) return null;
		}
		return r;
	}
	,__fromBase64: function(base64,type,onload) {
		var _g = this;
		var image = new Image();
		image.crossOrigin = "Anonymous";
		var image_onLoaded = function(event) {
			_g.buffer = new lime_graphics_ImageBuffer(null,image.width,image.height);
			_g.buffer.__srcImage = image;
			_g.offsetX = 0;
			_g.offsetY = 0;
			_g.width = _g.buffer.width;
			_g.height = _g.buffer.height;
			if(onload != null) onload(_g);
		};
		image.addEventListener("load",image_onLoaded,false);
		image.src = "data:" + type + ";base64," + base64;
	}
	,__fromBytes: function(bytes,onload) {
		var type = "";
		if(lime_graphics_Image.__isPNG(bytes)) type = "image/png"; else if(lime_graphics_Image.__isJPG(bytes)) type = "image/jpeg"; else if(lime_graphics_Image.__isGIF(bytes)) type = "image/gif"; else throw new js__$Boot_HaxeError("Image tried to read PNG/JPG Bytes, but found an invalid header.");
		this.__fromBase64(lime_graphics_Image.__base64Encode(bytes),type,onload);
	}
	,__fromFile: function(path,onload,onerror) {
		var _g = this;
		var image = new Image();
		image.crossOrigin = "Anonymous";
		image.onload = function(_) {
			_g.buffer = new lime_graphics_ImageBuffer(null,image.width,image.height);
			_g.buffer.__srcImage = image;
			_g.width = image.width;
			_g.height = image.height;
			if(onload != null) onload(_g);
		};
		image.onerror = function(_1) {
			if(onerror != null) onerror();
		};
		image.src = path;
		if(image.complete) {
		}
	}
	,__fromImageBuffer: function(buffer) {
		this.buffer = buffer;
		if(buffer != null) {
			if(this.width == -1) this.width = buffer.width;
			if(this.height == -1) this.height = buffer.height;
		}
	}
	,get_data: function() {
		if(this.buffer.data == null && this.buffer.width > 0 && this.buffer.height > 0) {
			lime_graphics_utils_ImageCanvasUtil.convertToCanvas(this);
			lime_graphics_utils_ImageCanvasUtil.sync(this,false);
			lime_graphics_utils_ImageCanvasUtil.createImageData(this);
		}
		return this.buffer.data;
	}
	,set_data: function(value) {
		return this.buffer.data = value;
	}
	,get_format: function() {
		return this.buffer.format;
	}
	,set_format: function(value) {
		if(this.buffer.format != value) {
			var _g = this.type;
			switch(_g[1]) {
			case 1:
				lime_graphics_utils_ImageDataUtil.setFormat(this,value);
				break;
			default:
			}
		}
		return this.buffer.format = value;
	}
	,get_powerOfTwo: function() {
		return this.buffer.width != 0 && (this.buffer.width & ~this.buffer.width + 1) == this.buffer.width && (this.buffer.height != 0 && (this.buffer.height & ~this.buffer.height + 1) == this.buffer.height);
	}
	,set_powerOfTwo: function(value) {
		if(value != this.get_powerOfTwo()) {
			var newWidth = 1;
			var newHeight = 1;
			while(newWidth < this.buffer.width) newWidth <<= 1;
			while(newHeight < this.buffer.height) newHeight <<= 1;
			var _g = this.type;
			switch(_g[1]) {
			case 0:
				break;
			case 1:
				lime_graphics_utils_ImageDataUtil.resizeBuffer(this,newWidth,newHeight);
				break;
			case 2:
				break;
			default:
			}
		}
		return value;
	}
	,get_premultiplied: function() {
		return this.buffer.premultiplied;
	}
	,set_premultiplied: function(value) {
		if(value && !this.buffer.premultiplied) {
			var _g = this.type;
			switch(_g[1]) {
			case 1:
				lime_graphics_utils_ImageCanvasUtil.convertToData(this);
				lime_graphics_utils_ImageDataUtil.multiplyAlpha(this);
				break;
			default:
			}
		} else if(!value && this.buffer.premultiplied) {
			var _g1 = this.type;
			switch(_g1[1]) {
			case 1:
				lime_graphics_utils_ImageCanvasUtil.convertToData(this);
				lime_graphics_utils_ImageDataUtil.unmultiplyAlpha(this);
				break;
			default:
			}
		}
		return value;
	}
	,get_rect: function() {
		return new lime_math_Rectangle(0,0,this.width,this.height);
	}
	,get_src: function() {
		if(this.buffer.__srcCanvas == null) lime_graphics_utils_ImageCanvasUtil.convertToCanvas(this);
		return this.buffer.get_src();
	}
	,set_src: function(value) {
		return this.buffer.set_src(value);
	}
	,get_transparent: function() {
		if(this.buffer == null) return false;
		return this.buffer.transparent;
	}
	,set_transparent: function(value) {
		if(this.buffer == null) return false;
		return this.buffer.transparent = value;
	}
	,__class__: lime_graphics_Image
};
var lime_graphics_ImageBuffer = function(data,width,height,bitsPerPixel,format) {
	if(bitsPerPixel == null) bitsPerPixel = 32;
	if(height == null) height = 0;
	if(width == null) width = 0;
	this.data = data;
	this.width = width;
	this.height = height;
	this.bitsPerPixel = bitsPerPixel;
	if(format == null) this.format = 0; else this.format = format;
	this.transparent = true;
};
$hxClasses["lime.graphics.ImageBuffer"] = lime_graphics_ImageBuffer;
lime_graphics_ImageBuffer.__name__ = true;
lime_graphics_ImageBuffer.prototype = {
	clone: function() {
		var buffer = new lime_graphics_ImageBuffer(this.data,this.width,this.height,this.bitsPerPixel);
		if(this.data != null) {
			var elements = this.data.byteLength;
			var this1;
			if(elements != null) this1 = new Uint8Array(elements); else this1 = null;
			buffer.data = this1;
			var copy;
			var view = this.data;
			var this2;
			if(view != null) this2 = new Uint8Array(view); else this2 = null;
			copy = this2;
			buffer.data.set(copy);
		} else if(this.__srcImageData != null) {
			buffer.__srcCanvas = window.document.createElement("canvas");
			buffer.__srcContext = buffer.__srcCanvas.getContext("2d");
			buffer.__srcCanvas.width = this.__srcImageData.width;
			buffer.__srcCanvas.height = this.__srcImageData.height;
			buffer.__srcImageData = buffer.__srcContext.createImageData(this.__srcImageData.width,this.__srcImageData.height);
			var copy1 = new Uint8ClampedArray(this.__srcImageData.data);
			buffer.__srcImageData.data.set(copy1);
		} else if(this.__srcCanvas != null) {
			buffer.__srcCanvas = window.document.createElement("canvas");
			buffer.__srcContext = buffer.__srcCanvas.getContext("2d");
			buffer.__srcCanvas.width = this.__srcCanvas.width;
			buffer.__srcCanvas.height = this.__srcCanvas.height;
			buffer.__srcContext.drawImage(this.__srcCanvas,0,0);
		} else buffer.__srcImage = this.__srcImage;
		buffer.bitsPerPixel = this.bitsPerPixel;
		buffer.format = this.format;
		buffer.premultiplied = this.premultiplied;
		buffer.transparent = this.transparent;
		return buffer;
	}
	,get_src: function() {
		if(this.__srcImage != null) return this.__srcImage;
		return this.__srcCanvas;
	}
	,set_src: function(value) {
		if(js_Boot.__instanceof(value,Image)) this.__srcImage = value; else if(js_Boot.__instanceof(value,HTMLCanvasElement)) {
			this.__srcCanvas = value;
			this.__srcContext = this.__srcCanvas.getContext("2d");
		}
		return value;
	}
	,get_stride: function() {
		return this.width * 4;
	}
	,__class__: lime_graphics_ImageBuffer
};
var lime_graphics_ImageChannel = $hxClasses["lime.graphics.ImageChannel"] = { __ename__ : true, __constructs__ : ["RED","GREEN","BLUE","ALPHA"] };
lime_graphics_ImageChannel.RED = ["RED",0];
lime_graphics_ImageChannel.RED.toString = $estr;
lime_graphics_ImageChannel.RED.__enum__ = lime_graphics_ImageChannel;
lime_graphics_ImageChannel.GREEN = ["GREEN",1];
lime_graphics_ImageChannel.GREEN.toString = $estr;
lime_graphics_ImageChannel.GREEN.__enum__ = lime_graphics_ImageChannel;
lime_graphics_ImageChannel.BLUE = ["BLUE",2];
lime_graphics_ImageChannel.BLUE.toString = $estr;
lime_graphics_ImageChannel.BLUE.__enum__ = lime_graphics_ImageChannel;
lime_graphics_ImageChannel.ALPHA = ["ALPHA",3];
lime_graphics_ImageChannel.ALPHA.toString = $estr;
lime_graphics_ImageChannel.ALPHA.__enum__ = lime_graphics_ImageChannel;
var lime_graphics_ImageType = $hxClasses["lime.graphics.ImageType"] = { __ename__ : true, __constructs__ : ["CANVAS","DATA","FLASH","CUSTOM"] };
lime_graphics_ImageType.CANVAS = ["CANVAS",0];
lime_graphics_ImageType.CANVAS.toString = $estr;
lime_graphics_ImageType.CANVAS.__enum__ = lime_graphics_ImageType;
lime_graphics_ImageType.DATA = ["DATA",1];
lime_graphics_ImageType.DATA.toString = $estr;
lime_graphics_ImageType.DATA.__enum__ = lime_graphics_ImageType;
lime_graphics_ImageType.FLASH = ["FLASH",2];
lime_graphics_ImageType.FLASH.toString = $estr;
lime_graphics_ImageType.FLASH.__enum__ = lime_graphics_ImageType;
lime_graphics_ImageType.CUSTOM = ["CUSTOM",3];
lime_graphics_ImageType.CUSTOM.toString = $estr;
lime_graphics_ImageType.CUSTOM.__enum__ = lime_graphics_ImageType;
var lime_graphics_RenderContext = $hxClasses["lime.graphics.RenderContext"] = { __ename__ : true, __constructs__ : ["OPENGL","CANVAS","DOM","FLASH","CAIRO","CONSOLE","CUSTOM","NONE"] };
lime_graphics_RenderContext.OPENGL = function(gl) { var $x = ["OPENGL",0,gl]; $x.__enum__ = lime_graphics_RenderContext; $x.toString = $estr; return $x; };
lime_graphics_RenderContext.CANVAS = function(context) { var $x = ["CANVAS",1,context]; $x.__enum__ = lime_graphics_RenderContext; $x.toString = $estr; return $x; };
lime_graphics_RenderContext.DOM = function(element) { var $x = ["DOM",2,element]; $x.__enum__ = lime_graphics_RenderContext; $x.toString = $estr; return $x; };
lime_graphics_RenderContext.FLASH = function(stage) { var $x = ["FLASH",3,stage]; $x.__enum__ = lime_graphics_RenderContext; $x.toString = $estr; return $x; };
lime_graphics_RenderContext.CAIRO = function(cairo) { var $x = ["CAIRO",4,cairo]; $x.__enum__ = lime_graphics_RenderContext; $x.toString = $estr; return $x; };
lime_graphics_RenderContext.CONSOLE = function(context) { var $x = ["CONSOLE",5,context]; $x.__enum__ = lime_graphics_RenderContext; $x.toString = $estr; return $x; };
lime_graphics_RenderContext.CUSTOM = function(data) { var $x = ["CUSTOM",6,data]; $x.__enum__ = lime_graphics_RenderContext; $x.toString = $estr; return $x; };
lime_graphics_RenderContext.NONE = ["NONE",7];
lime_graphics_RenderContext.NONE.toString = $estr;
lime_graphics_RenderContext.NONE.__enum__ = lime_graphics_RenderContext;
var lime_graphics_Renderer = function(window) {
	this.onRender = new lime_app_Event_$Void_$Void();
	this.onContextRestored = new lime_app_Event_$lime_$graphics_$RenderContext_$Void();
	this.onContextLost = new lime_app_Event_$Void_$Void();
	this.window = window;
	this.backend = new lime__$backend_html5_HTML5Renderer(this);
	this.window.renderer = this;
};
$hxClasses["lime.graphics.Renderer"] = lime_graphics_Renderer;
lime_graphics_Renderer.__name__ = true;
lime_graphics_Renderer.prototype = {
	create: function() {
		this.backend.create();
	}
	,flip: function() {
		this.backend.flip();
	}
	,readPixels: function(rect) {
		return this.backend.readPixels(rect);
	}
	,render: function() {
		this.backend.render();
	}
	,__class__: lime_graphics_Renderer
};
var lime_graphics_RendererType = $hxClasses["lime.graphics.RendererType"] = { __ename__ : true, __constructs__ : ["OPENGL","CANVAS","DOM","FLASH","CAIRO","CONSOLE","CUSTOM"] };
lime_graphics_RendererType.OPENGL = ["OPENGL",0];
lime_graphics_RendererType.OPENGL.toString = $estr;
lime_graphics_RendererType.OPENGL.__enum__ = lime_graphics_RendererType;
lime_graphics_RendererType.CANVAS = ["CANVAS",1];
lime_graphics_RendererType.CANVAS.toString = $estr;
lime_graphics_RendererType.CANVAS.__enum__ = lime_graphics_RendererType;
lime_graphics_RendererType.DOM = ["DOM",2];
lime_graphics_RendererType.DOM.toString = $estr;
lime_graphics_RendererType.DOM.__enum__ = lime_graphics_RendererType;
lime_graphics_RendererType.FLASH = ["FLASH",3];
lime_graphics_RendererType.FLASH.toString = $estr;
lime_graphics_RendererType.FLASH.__enum__ = lime_graphics_RendererType;
lime_graphics_RendererType.CAIRO = ["CAIRO",4];
lime_graphics_RendererType.CAIRO.toString = $estr;
lime_graphics_RendererType.CAIRO.__enum__ = lime_graphics_RendererType;
lime_graphics_RendererType.CONSOLE = ["CONSOLE",5];
lime_graphics_RendererType.CONSOLE.toString = $estr;
lime_graphics_RendererType.CONSOLE.__enum__ = lime_graphics_RendererType;
lime_graphics_RendererType.CUSTOM = ["CUSTOM",6];
lime_graphics_RendererType.CUSTOM.toString = $estr;
lime_graphics_RendererType.CUSTOM.__enum__ = lime_graphics_RendererType;
var lime_graphics_cairo_Cairo = function(surface) {
	if(surface != null) {
	}
};
$hxClasses["lime.graphics.cairo.Cairo"] = lime_graphics_cairo_Cairo;
lime_graphics_cairo_Cairo.__name__ = true;
lime_graphics_cairo_Cairo.get_version = function() {
	return 0;
};
lime_graphics_cairo_Cairo.get_versionString = function() {
	return "";
};
lime_graphics_cairo_Cairo.prototype = {
	arc: function(xc,yc,radius,angle1,angle2) {
	}
	,arcNegative: function(xc,yc,radius,angle1,angle2) {
	}
	,clip: function() {
	}
	,clipExtents: function(x1,y1,x2,y2) {
	}
	,clipPreserve: function() {
	}
	,closePath: function() {
	}
	,copyPage: function() {
	}
	,curveTo: function(x1,y1,x2,y2,x3,y3) {
	}
	,fill: function() {
	}
	,fillExtents: function(x1,y1,x2,y2) {
	}
	,fillPreserve: function() {
	}
	,identityMatrix: function() {
	}
	,inClip: function(x,y) {
		return false;
	}
	,inFill: function(x,y) {
		return false;
	}
	,inStroke: function(x,y) {
		return false;
	}
	,lineTo: function(x,y) {
	}
	,moveTo: function(x,y) {
	}
	,mask: function(pattern) {
	}
	,maskSurface: function(surface,x,y) {
	}
	,newPath: function() {
	}
	,paint: function() {
	}
	,paintWithAlpha: function(alpha) {
	}
	,popGroup: function() {
		return null;
	}
	,popGroupToSource: function() {
	}
	,pushGroup: function() {
	}
	,pushGroupWithContent: function(content) {
	}
	,recreate: function(surface) {
	}
	,rectangle: function(x,y,width,height) {
	}
	,relCurveTo: function(dx1,dy1,dx2,dy2,dx3,dy3) {
	}
	,relLineTo: function(dx,dy) {
	}
	,relMoveTo: function(dx,dy) {
	}
	,resetClip: function() {
	}
	,restore: function() {
	}
	,save: function() {
	}
	,setFontSize: function(size) {
	}
	,setSourceRGB: function(r,g,b) {
	}
	,setSourceRGBA: function(r,g,b,a) {
	}
	,setSourceSurface: function(surface,x,y) {
	}
	,showPage: function() {
	}
	,showText: function(utf8) {
	}
	,status: function() {
		return 0;
	}
	,stroke: function() {
	}
	,strokeExtents: function(x1,y1,x2,y2) {
	}
	,strokePreserve: function() {
	}
	,transform: function(matrix) {
	}
	,rotate: function(amount) {
	}
	,scale: function(x,y) {
	}
	,translate: function(x,y) {
	}
	,get_antialias: function() {
		return 0;
	}
	,set_antialias: function(value) {
		return value;
	}
	,get_currentPoint: function() {
		return null;
	}
	,get_dash: function() {
		return [];
	}
	,set_dash: function(value) {
		return value;
	}
	,get_dashCount: function() {
		return 0;
	}
	,get_fillRule: function() {
		return 0;
	}
	,set_fillRule: function(value) {
		return value;
	}
	,get_fontFace: function() {
		return 0;
	}
	,set_fontFace: function(value) {
		return value;
	}
	,get_fontOptions: function() {
		return null;
	}
	,set_fontOptions: function(value) {
		return value;
	}
	,get_groupTarget: function() {
		return 0;
	}
	,get_hasCurrentPoint: function() {
		return false;
	}
	,get_lineCap: function() {
		return 0;
	}
	,set_lineCap: function(value) {
		return value;
	}
	,get_lineJoin: function() {
		return 0;
	}
	,set_lineJoin: function(value) {
		return value;
	}
	,get_lineWidth: function() {
		return 0;
	}
	,set_lineWidth: function(value) {
		return value;
	}
	,get_matrix: function() {
		return null;
	}
	,set_matrix: function(value) {
		return value;
	}
	,get_miterLimit: function() {
		return 0;
	}
	,set_miterLimit: function(value) {
		return value;
	}
	,get_operator: function() {
		return 0;
	}
	,set_operator: function(value) {
		return value;
	}
	,get_source: function() {
		return 0;
	}
	,set_source: function(value) {
		return value;
	}
	,get_target: function() {
		return 0;
	}
	,get_tolerance: function() {
		return 0;
	}
	,set_tolerance: function(value) {
		return value;
	}
	,__class__: lime_graphics_cairo_Cairo
};
var lime_graphics_cairo__$CairoFontFace_CairoFontFace_$Impl_$ = {};
$hxClasses["lime.graphics.cairo._CairoFontFace.CairoFontFace_Impl_"] = lime_graphics_cairo__$CairoFontFace_CairoFontFace_$Impl_$;
lime_graphics_cairo__$CairoFontFace_CairoFontFace_$Impl_$.__name__ = true;
lime_graphics_cairo__$CairoFontFace_CairoFontFace_$Impl_$._new = function() {
	return null;
};
lime_graphics_cairo__$CairoFontFace_CairoFontFace_$Impl_$.status = function(this1) {
	return 0;
};
var lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$ = {};
$hxClasses["lime.graphics.cairo._CairoFontOptions.CairoFontOptions_Impl_"] = lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$;
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.__name__ = true;
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$._new = function() {
	return null;
};
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.get_antialias = function(this1) {
	return 0;
};
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.set_antialias = function(this1,value) {
	return value;
};
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.get_hintMetrics = function(this1) {
	return 0;
};
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.set_hintMetrics = function(this1,value) {
	return value;
};
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.get_hintStyle = function(this1) {
	return 0;
};
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.set_hintStyle = function(this1,value) {
	return value;
};
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.get_subpixelOrder = function(this1) {
	return 0;
};
lime_graphics_cairo__$CairoFontOptions_CairoFontOptions_$Impl_$.set_subpixelOrder = function(this1,value) {
	return value;
};
var lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$ = {};
$hxClasses["lime.graphics.cairo._CairoPattern.CairoPattern_Impl_"] = lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$;
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.__name__ = true;
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$._new = function(handle) {
	return handle;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.addColorStopRGB = function(this1,offset,r,g,b) {
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.addColorStopRGBA = function(this1,offset,r,g,b,a) {
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.createForSurface = function(surface) {
	return 0;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.createLinear = function(x0,y0,x1,y1) {
	return 0;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.createRadial = function(cx0,cy0,radius0,cx1,cy1,radius1) {
	return 0;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.createRGB = function(r,g,b) {
	return 0;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.createRGBA = function(r,g,b,a) {
	return 0;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.get_colorStopCount = function(this1) {
	return 0;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.get_extend = function(this1) {
	return 0;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.set_extend = function(this1,value) {
	return value;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.get_filter = function(this1) {
	return 0;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.set_filter = function(this1,value) {
	return value;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.get_matrix = function(this1) {
	return null;
};
lime_graphics_cairo__$CairoPattern_CairoPattern_$Impl_$.set_matrix = function(this1,value) {
	return value;
};
var lime_graphics_cairo__$CairoSurface_CairoSurface_$Impl_$ = {};
$hxClasses["lime.graphics.cairo._CairoSurface.CairoSurface_Impl_"] = lime_graphics_cairo__$CairoSurface_CairoSurface_$Impl_$;
lime_graphics_cairo__$CairoSurface_CairoSurface_$Impl_$.__name__ = true;
lime_graphics_cairo__$CairoSurface_CairoSurface_$Impl_$.flush = function(this1) {
};
var lime_graphics_console_IndexBuffer = function() {
};
$hxClasses["lime.graphics.console.IndexBuffer"] = lime_graphics_console_IndexBuffer;
lime_graphics_console_IndexBuffer.__name__ = true;
lime_graphics_console_IndexBuffer.prototype = {
	__class__: lime_graphics_console_IndexBuffer
};
var lime_graphics_console_Primitive = $hxClasses["lime.graphics.console.Primitive"] = { __ename__ : true, __constructs__ : ["Point","Line","LineStrip","Triangle","TriangleStrip"] };
lime_graphics_console_Primitive.Point = ["Point",0];
lime_graphics_console_Primitive.Point.toString = $estr;
lime_graphics_console_Primitive.Point.__enum__ = lime_graphics_console_Primitive;
lime_graphics_console_Primitive.Line = ["Line",1];
lime_graphics_console_Primitive.Line.toString = $estr;
lime_graphics_console_Primitive.Line.__enum__ = lime_graphics_console_Primitive;
lime_graphics_console_Primitive.LineStrip = ["LineStrip",2];
lime_graphics_console_Primitive.LineStrip.toString = $estr;
lime_graphics_console_Primitive.LineStrip.__enum__ = lime_graphics_console_Primitive;
lime_graphics_console_Primitive.Triangle = ["Triangle",3];
lime_graphics_console_Primitive.Triangle.toString = $estr;
lime_graphics_console_Primitive.Triangle.__enum__ = lime_graphics_console_Primitive;
lime_graphics_console_Primitive.TriangleStrip = ["TriangleStrip",4];
lime_graphics_console_Primitive.TriangleStrip.toString = $estr;
lime_graphics_console_Primitive.TriangleStrip.__enum__ = lime_graphics_console_Primitive;
var lime_graphics_console_Shader = function() {
};
$hxClasses["lime.graphics.console.Shader"] = lime_graphics_console_Shader;
lime_graphics_console_Shader.__name__ = true;
lime_graphics_console_Shader.prototype = {
	__class__: lime_graphics_console_Shader
};
var lime_graphics_console_VertexBuffer = function() {
};
$hxClasses["lime.graphics.console.VertexBuffer"] = lime_graphics_console_VertexBuffer;
lime_graphics_console_VertexBuffer.__name__ = true;
lime_graphics_console_VertexBuffer.prototype = {
	lock: function() {
		return new lime_graphics_console_VertexOutput();
	}
	,unlock: function() {
	}
	,__class__: lime_graphics_console_VertexBuffer
};
var lime_graphics_console_VertexOutput = function() {
};
$hxClasses["lime.graphics.console.VertexOutput"] = lime_graphics_console_VertexOutput;
lime_graphics_console_VertexOutput.__name__ = true;
lime_graphics_console_VertexOutput.prototype = {
	vec2: function(x,y) {
	}
	,vec3: function(x,y,z) {
	}
	,color: function(r,g,b,a) {
	}
	,__class__: lime_graphics_console_VertexOutput
};
var lime_graphics_format_BMP = function() { };
$hxClasses["lime.graphics.format.BMP"] = lime_graphics_format_BMP;
lime_graphics_format_BMP.__name__ = true;
lime_graphics_format_BMP.encode = function(image,type) {
	if(image.get_premultiplied() || image.get_format() != 0) {
		image = image.clone();
		image.set_premultiplied(false);
		image.set_format(0);
	}
	if(type == null) type = lime_graphics_format_BMPType.RGB;
	var fileHeaderLength = 14;
	var infoHeaderLength = 40;
	var pixelValuesLength = image.width * image.height * 4;
	if(type != null) switch(type[1]) {
	case 1:
		infoHeaderLength = 108;
		break;
	case 2:
		fileHeaderLength = 0;
		pixelValuesLength += image.width * image.height;
		break;
	case 0:
		pixelValuesLength = image.width * 3 + image.width * 3 % 4 + image.height * 3 + image.height * 3;
		break;
	default:
	} else {
	}
	var data = haxe_io_Bytes.alloc(fileHeaderLength + infoHeaderLength + pixelValuesLength);
	var position = 0;
	if(fileHeaderLength > 0) {
		data.set(position++,66);
		data.set(position++,77);
		data.setInt32(position,data.length);
		position += 4;
		data.setUInt16(position,0);
		position += 2;
		data.setUInt16(position,0);
		position += 2;
		data.setInt32(position,fileHeaderLength + infoHeaderLength);
		position += 4;
	}
	data.setInt32(position,infoHeaderLength);
	position += 4;
	data.setInt32(position,image.width);
	position += 4;
	data.setInt32(position,type == lime_graphics_format_BMPType.ICO?image.height * 2:image.height);
	position += 4;
	data.setUInt16(position,1);
	position += 2;
	data.setUInt16(position,type == lime_graphics_format_BMPType.RGB?24:32);
	position += 2;
	data.setInt32(position,type == lime_graphics_format_BMPType.BITFIELD?3:0);
	position += 4;
	data.setInt32(position,pixelValuesLength);
	position += 4;
	data.setInt32(position,11824);
	position += 4;
	data.setInt32(position,11824);
	position += 4;
	data.setInt32(position,0);
	position += 4;
	data.setInt32(position,0);
	position += 4;
	if(type == lime_graphics_format_BMPType.BITFIELD) {
		data.setInt32(position,16711680);
		position += 4;
		data.setInt32(position,65280);
		position += 4;
		data.setInt32(position,255);
		position += 4;
		data.setInt32(position,-16777216);
		position += 4;
		data.set(position++,32);
		data.set(position++,110);
		data.set(position++,105);
		data.set(position++,87);
		var _g = 0;
		while(_g < 48) {
			var i = _g++;
			data.set(position++,0);
		}
	}
	var pixels = image.getPixels(new lime_math_Rectangle(0,0,image.width,image.height),1);
	var readPosition = 0;
	var a;
	var r;
	var g;
	var b;
	if(type != null) switch(type[1]) {
	case 1:
		var _g1 = 0;
		var _g2 = image.height;
		while(_g1 < _g2) {
			var y = _g1++;
			readPosition = (image.height - 1 - y) * 4 * image.width;
			var _g3 = 0;
			var _g21 = image.width;
			while(_g3 < _g21) {
				var x = _g3++;
				a = pixels.get(readPosition++);
				r = pixels.get(readPosition++);
				g = pixels.get(readPosition++);
				b = pixels.get(readPosition++);
				data.set(position++,b);
				data.set(position++,g);
				data.set(position++,r);
				data.set(position++,a);
			}
		}
		break;
	case 2:
		var andMask = haxe_io_Bytes.alloc(image.width * image.height);
		var maskPosition = 0;
		var _g11 = 0;
		var _g4 = image.height;
		while(_g11 < _g4) {
			var y1 = _g11++;
			readPosition = (image.height - 1 - y1) * 4 * image.width;
			var _g31 = 0;
			var _g22 = image.width;
			while(_g31 < _g22) {
				var x1 = _g31++;
				a = pixels.get(readPosition++);
				r = pixels.get(readPosition++);
				g = pixels.get(readPosition++);
				b = pixels.get(readPosition++);
				data.set(position++,b);
				data.set(position++,g);
				data.set(position++,r);
				data.set(position++,a);
				andMask.set(maskPosition++,0);
			}
		}
		data.blit(position,andMask,0,image.width * image.height);
		break;
	case 0:
		var _g12 = 0;
		var _g5 = image.height;
		while(_g12 < _g5) {
			var y2 = _g12++;
			readPosition = (image.height - 1 - y2) * 4 * image.width;
			var _g32 = 0;
			var _g23 = image.width;
			while(_g32 < _g23) {
				var x2 = _g32++;
				a = pixels.get(readPosition++);
				r = pixels.get(readPosition++);
				g = pixels.get(readPosition++);
				b = pixels.get(readPosition++);
				data.set(position++,b);
				data.set(position++,g);
				data.set(position++,r);
			}
			var _g33 = 0;
			var _g24 = image.width * 3 % 4;
			while(_g33 < _g24) {
				var i1 = _g33++;
				data.set(position++,0);
			}
		}
		break;
	default:
	} else {
	}
	return data;
};
var lime_graphics_format_BMPType = $hxClasses["lime.graphics.format.BMPType"] = { __ename__ : true, __constructs__ : ["RGB","BITFIELD","ICO"] };
lime_graphics_format_BMPType.RGB = ["RGB",0];
lime_graphics_format_BMPType.RGB.toString = $estr;
lime_graphics_format_BMPType.RGB.__enum__ = lime_graphics_format_BMPType;
lime_graphics_format_BMPType.BITFIELD = ["BITFIELD",1];
lime_graphics_format_BMPType.BITFIELD.toString = $estr;
lime_graphics_format_BMPType.BITFIELD.__enum__ = lime_graphics_format_BMPType;
lime_graphics_format_BMPType.ICO = ["ICO",2];
lime_graphics_format_BMPType.ICO.toString = $estr;
lime_graphics_format_BMPType.ICO.__enum__ = lime_graphics_format_BMPType;
var lime_graphics_format_JPEG = function() { };
$hxClasses["lime.graphics.format.JPEG"] = lime_graphics_format_JPEG;
lime_graphics_format_JPEG.__name__ = true;
lime_graphics_format_JPEG.decodeBytes = function(bytes,decodeData) {
	if(decodeData == null) decodeData = true;
	return null;
};
lime_graphics_format_JPEG.decodeFile = function(path,decodeData) {
	if(decodeData == null) decodeData = true;
	return null;
};
lime_graphics_format_JPEG.encode = function(image,quality) {
	if(image.get_premultiplied() || image.get_format() != 0) {
		image = image.clone();
		image.set_premultiplied(false);
		image.set_format(0);
	}
	lime_graphics_utils_ImageCanvasUtil.sync(image,false);
	if(image.buffer.__srcCanvas != null) {
		var data = image.buffer.__srcCanvas.toDataURL("image/jpeg",quality / 100);
		var buffer = window.atob(data.split(";base64,")[1]);
		var bytes = haxe_io_Bytes.alloc(buffer.length);
		var _g1 = 0;
		var _g = buffer.length;
		while(_g1 < _g) {
			var i = _g1++;
			bytes.set(i,HxOverrides.cca(buffer,i));
		}
		return bytes;
	}
	return null;
};
var lime_graphics_format_PNG = function() { };
$hxClasses["lime.graphics.format.PNG"] = lime_graphics_format_PNG;
lime_graphics_format_PNG.__name__ = true;
lime_graphics_format_PNG.decodeBytes = function(bytes,decodeData) {
	if(decodeData == null) decodeData = true;
	return null;
};
lime_graphics_format_PNG.decodeFile = function(path,decodeData) {
	if(decodeData == null) decodeData = true;
	return null;
};
lime_graphics_format_PNG.encode = function(image) {
	if(image.get_premultiplied() || image.get_format() != 0) {
		image = image.clone();
		image.set_premultiplied(false);
		image.set_format(0);
	}
	return null;
};
var lime_graphics_opengl_GL = function() { };
$hxClasses["lime.graphics.opengl.GL"] = lime_graphics_opengl_GL;
lime_graphics_opengl_GL.__name__ = true;
lime_graphics_opengl_GL.activeTexture = function(texture) {
	lime_graphics_opengl_GL.context.activeTexture(texture);
};
lime_graphics_opengl_GL.attachShader = function(program,shader) {
	lime_graphics_opengl_GL.context.attachShader(program,shader);
};
lime_graphics_opengl_GL.bindAttribLocation = function(program,index,name) {
	lime_graphics_opengl_GL.context.bindAttribLocation(program,index,name);
};
lime_graphics_opengl_GL.bindBuffer = function(target,buffer) {
	lime_graphics_opengl_GL.context.bindBuffer(target,buffer);
};
lime_graphics_opengl_GL.bindFramebuffer = function(target,framebuffer) {
	lime_graphics_opengl_GL.context.bindFramebuffer(target,framebuffer);
};
lime_graphics_opengl_GL.bindRenderbuffer = function(target,renderbuffer) {
	lime_graphics_opengl_GL.context.bindRenderbuffer(target,renderbuffer);
};
lime_graphics_opengl_GL.bindTexture = function(target,texture) {
	lime_graphics_opengl_GL.context.bindTexture(target,texture);
};
lime_graphics_opengl_GL.blendColor = function(red,green,blue,alpha) {
	lime_graphics_opengl_GL.context.blendColor(red,green,blue,alpha);
};
lime_graphics_opengl_GL.blendEquation = function(mode) {
	lime_graphics_opengl_GL.context.blendEquation(mode);
};
lime_graphics_opengl_GL.blendEquationSeparate = function(modeRGB,modeAlpha) {
	lime_graphics_opengl_GL.context.blendEquationSeparate(modeRGB,modeAlpha);
};
lime_graphics_opengl_GL.blendFunc = function(sfactor,dfactor) {
	lime_graphics_opengl_GL.context.blendFunc(sfactor,dfactor);
};
lime_graphics_opengl_GL.blendFuncSeparate = function(srcRGB,dstRGB,srcAlpha,dstAlpha) {
	lime_graphics_opengl_GL.context.blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);
};
lime_graphics_opengl_GL.bufferData = function(target,data,usage) {
	lime_graphics_opengl_GL.context.bufferData(target,data,usage);
};
lime_graphics_opengl_GL.bufferSubData = function(target,offset,data) {
	lime_graphics_opengl_GL.context.bufferSubData(target,offset,data);
};
lime_graphics_opengl_GL.checkFramebufferStatus = function(target) {
	return lime_graphics_opengl_GL.context.checkFramebufferStatus(target);
};
lime_graphics_opengl_GL.clear = function(mask) {
	lime_graphics_opengl_GL.context.clear(mask);
};
lime_graphics_opengl_GL.clearColor = function(red,green,blue,alpha) {
	lime_graphics_opengl_GL.context.clearColor(red,green,blue,alpha);
};
lime_graphics_opengl_GL.clearDepth = function(depth) {
	lime_graphics_opengl_GL.context.clearDepth(depth);
};
lime_graphics_opengl_GL.clearStencil = function(s) {
	lime_graphics_opengl_GL.context.clearStencil(s);
};
lime_graphics_opengl_GL.colorMask = function(red,green,blue,alpha) {
	lime_graphics_opengl_GL.context.colorMask(red,green,blue,alpha);
};
lime_graphics_opengl_GL.compileShader = function(shader) {
	lime_graphics_opengl_GL.context.compileShader(shader);
};
lime_graphics_opengl_GL.compressedTexImage2D = function(target,level,internalformat,width,height,border,data) {
	lime_graphics_opengl_GL.context.compressedTexImage2D(target,level,internalformat,width,height,border,data);
};
lime_graphics_opengl_GL.compressedTexSubImage2D = function(target,level,xoffset,yoffset,width,height,format,data) {
	lime_graphics_opengl_GL.context.compressedTexSubImage2D(target,level,xoffset,yoffset,width,height,format,data);
};
lime_graphics_opengl_GL.copyTexImage2D = function(target,level,internalformat,x,y,width,height,border) {
	lime_graphics_opengl_GL.context.copyTexImage2D(target,level,internalformat,x,y,width,height,border);
};
lime_graphics_opengl_GL.copyTexSubImage2D = function(target,level,xoffset,yoffset,x,y,width,height) {
	lime_graphics_opengl_GL.context.copyTexSubImage2D(target,level,xoffset,yoffset,x,y,width,height);
};
lime_graphics_opengl_GL.createBuffer = function() {
	return lime_graphics_opengl_GL.context.createBuffer();
};
lime_graphics_opengl_GL.createFramebuffer = function() {
	return lime_graphics_opengl_GL.context.createFramebuffer();
};
lime_graphics_opengl_GL.createProgram = function() {
	return lime_graphics_opengl_GL.context.createProgram();
};
lime_graphics_opengl_GL.createRenderbuffer = function() {
	return lime_graphics_opengl_GL.context.createRenderbuffer();
};
lime_graphics_opengl_GL.createShader = function(type) {
	return lime_graphics_opengl_GL.context.createShader(type);
};
lime_graphics_opengl_GL.createTexture = function() {
	return lime_graphics_opengl_GL.context.createTexture();
};
lime_graphics_opengl_GL.cullFace = function(mode) {
	lime_graphics_opengl_GL.context.cullFace(mode);
};
lime_graphics_opengl_GL.deleteBuffer = function(buffer) {
	lime_graphics_opengl_GL.context.deleteBuffer(buffer);
};
lime_graphics_opengl_GL.deleteFramebuffer = function(framebuffer) {
	lime_graphics_opengl_GL.context.deleteFramebuffer(framebuffer);
};
lime_graphics_opengl_GL.deleteProgram = function(program) {
	lime_graphics_opengl_GL.context.deleteProgram(program);
};
lime_graphics_opengl_GL.deleteRenderbuffer = function(renderbuffer) {
	lime_graphics_opengl_GL.context.deleteRenderbuffer(renderbuffer);
};
lime_graphics_opengl_GL.deleteShader = function(shader) {
	lime_graphics_opengl_GL.context.deleteShader(shader);
};
lime_graphics_opengl_GL.deleteTexture = function(texture) {
	lime_graphics_opengl_GL.context.deleteTexture(texture);
};
lime_graphics_opengl_GL.depthFunc = function(func) {
	lime_graphics_opengl_GL.context.depthFunc(func);
};
lime_graphics_opengl_GL.depthMask = function(flag) {
	lime_graphics_opengl_GL.context.depthMask(flag);
};
lime_graphics_opengl_GL.depthRange = function(zNear,zFar) {
	lime_graphics_opengl_GL.context.depthRange(zNear,zFar);
};
lime_graphics_opengl_GL.detachShader = function(program,shader) {
	lime_graphics_opengl_GL.context.detachShader(program,shader);
};
lime_graphics_opengl_GL.disable = function(cap) {
	lime_graphics_opengl_GL.context.disable(cap);
};
lime_graphics_opengl_GL.disableVertexAttribArray = function(index) {
	lime_graphics_opengl_GL.context.disableVertexAttribArray(index);
};
lime_graphics_opengl_GL.drawArrays = function(mode,first,count) {
	lime_graphics_opengl_GL.context.drawArrays(mode,first,count);
};
lime_graphics_opengl_GL.drawElements = function(mode,count,type,offset) {
	lime_graphics_opengl_GL.context.drawElements(mode,count,type,offset);
};
lime_graphics_opengl_GL.enable = function(cap) {
	lime_graphics_opengl_GL.context.enable(cap);
};
lime_graphics_opengl_GL.enableVertexAttribArray = function(index) {
	lime_graphics_opengl_GL.context.enableVertexAttribArray(index);
};
lime_graphics_opengl_GL.finish = function() {
	lime_graphics_opengl_GL.context.finish();
};
lime_graphics_opengl_GL.flush = function() {
	lime_graphics_opengl_GL.context.flush();
};
lime_graphics_opengl_GL.framebufferRenderbuffer = function(target,attachment,renderbuffertarget,renderbuffer) {
	lime_graphics_opengl_GL.context.framebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer);
};
lime_graphics_opengl_GL.framebufferTexture2D = function(target,attachment,textarget,texture,level) {
	lime_graphics_opengl_GL.context.framebufferTexture2D(target,attachment,textarget,texture,level);
};
lime_graphics_opengl_GL.frontFace = function(mode) {
	lime_graphics_opengl_GL.context.frontFace(mode);
};
lime_graphics_opengl_GL.generateMipmap = function(target) {
	lime_graphics_opengl_GL.context.generateMipmap(target);
};
lime_graphics_opengl_GL.getActiveAttrib = function(program,index) {
	return lime_graphics_opengl_GL.context.getActiveAttrib(program,index);
};
lime_graphics_opengl_GL.getActiveUniform = function(program,index) {
	return lime_graphics_opengl_GL.context.getActiveUniform(program,index);
};
lime_graphics_opengl_GL.getAttachedShaders = function(program) {
	return lime_graphics_opengl_GL.context.getAttachedShaders(program);
};
lime_graphics_opengl_GL.getAttribLocation = function(program,name) {
	return lime_graphics_opengl_GL.context.getAttribLocation(program,name);
};
lime_graphics_opengl_GL.getBufferParameter = function(target,pname) {
	return lime_graphics_opengl_GL.context.getBufferParameter(target,pname);
};
lime_graphics_opengl_GL.getContextAttributes = function() {
	return lime_graphics_opengl_GL.context.getContextAttributes();
};
lime_graphics_opengl_GL.getError = function() {
	return lime_graphics_opengl_GL.context.getError();
};
lime_graphics_opengl_GL.getExtension = function(name) {
	return lime_graphics_opengl_GL.context.getExtension(name);
};
lime_graphics_opengl_GL.getFramebufferAttachmentParameter = function(target,attachment,pname) {
	return lime_graphics_opengl_GL.context.getFramebufferAttachmentParameter(target,attachment,pname);
};
lime_graphics_opengl_GL.getParameter = function(pname) {
	return lime_graphics_opengl_GL.context.getParameter(pname);
};
lime_graphics_opengl_GL.getProgramInfoLog = function(program) {
	return lime_graphics_opengl_GL.context.getProgramInfoLog(program);
};
lime_graphics_opengl_GL.getProgramParameter = function(program,pname) {
	return lime_graphics_opengl_GL.context.getProgramParameter(program,pname);
};
lime_graphics_opengl_GL.getRenderbufferParameter = function(target,pname) {
	return lime_graphics_opengl_GL.context.getRenderbufferParameter(target,pname);
};
lime_graphics_opengl_GL.getShaderInfoLog = function(shader) {
	return lime_graphics_opengl_GL.context.getShaderInfoLog(shader);
};
lime_graphics_opengl_GL.getShaderParameter = function(shader,pname) {
	return lime_graphics_opengl_GL.context.getShaderParameter(shader,pname);
};
lime_graphics_opengl_GL.getShaderPrecisionFormat = function(shadertype,precisiontype) {
	return lime_graphics_opengl_GL.context.getShaderPrecisionFormat(shadertype,precisiontype);
};
lime_graphics_opengl_GL.getShaderSource = function(shader) {
	return lime_graphics_opengl_GL.context.getShaderSource(shader);
};
lime_graphics_opengl_GL.getSupportedExtensions = function() {
	return lime_graphics_opengl_GL.context.getSupportedExtensions();
};
lime_graphics_opengl_GL.getTexParameter = function(target,pname) {
	return lime_graphics_opengl_GL.context.getTexParameter(target,pname);
};
lime_graphics_opengl_GL.getUniform = function(program,location) {
	return lime_graphics_opengl_GL.context.getUniform(program,location);
};
lime_graphics_opengl_GL.getUniformLocation = function(program,name) {
	return lime_graphics_opengl_GL.context.getUniformLocation(program,name);
};
lime_graphics_opengl_GL.getVertexAttrib = function(index,pname) {
	return lime_graphics_opengl_GL.context.getVertexAttrib(index,pname);
};
lime_graphics_opengl_GL.getVertexAttribOffset = function(index,pname) {
	return lime_graphics_opengl_GL.context.getVertexAttribOffset(index,pname);
};
lime_graphics_opengl_GL.hint = function(target,mode) {
	lime_graphics_opengl_GL.context.hint(target,mode);
};
lime_graphics_opengl_GL.isBuffer = function(buffer) {
	return lime_graphics_opengl_GL.context.isBuffer(buffer);
};
lime_graphics_opengl_GL.isContextLost = function() {
	return lime_graphics_opengl_GL.context.isContextLost();
};
lime_graphics_opengl_GL.isEnabled = function(cap) {
	return lime_graphics_opengl_GL.context.isEnabled(cap);
};
lime_graphics_opengl_GL.isFramebuffer = function(framebuffer) {
	return lime_graphics_opengl_GL.context.isFramebuffer(framebuffer);
};
lime_graphics_opengl_GL.isProgram = function(program) {
	return lime_graphics_opengl_GL.context.isProgram(program);
};
lime_graphics_opengl_GL.isRenderbuffer = function(renderbuffer) {
	return lime_graphics_opengl_GL.context.isRenderbuffer(renderbuffer);
};
lime_graphics_opengl_GL.isShader = function(shader) {
	return lime_graphics_opengl_GL.context.isShader(shader);
};
lime_graphics_opengl_GL.isTexture = function(texture) {
	return lime_graphics_opengl_GL.context.isTexture(texture);
};
lime_graphics_opengl_GL.lineWidth = function(width) {
	lime_graphics_opengl_GL.context.lineWidth(width);
};
lime_graphics_opengl_GL.linkProgram = function(program) {
	lime_graphics_opengl_GL.context.linkProgram(program);
};
lime_graphics_opengl_GL.pixelStorei = function(pname,param) {
	lime_graphics_opengl_GL.context.pixelStorei(pname,param);
};
lime_graphics_opengl_GL.polygonOffset = function(factor,units) {
	lime_graphics_opengl_GL.context.polygonOffset(factor,units);
};
lime_graphics_opengl_GL.readPixels = function(x,y,width,height,format,type,pixels) {
	lime_graphics_opengl_GL.context.readPixels(x,y,width,height,format,type,pixels);
};
lime_graphics_opengl_GL.renderbufferStorage = function(target,internalformat,width,height) {
	lime_graphics_opengl_GL.context.renderbufferStorage(target,internalformat,width,height);
};
lime_graphics_opengl_GL.sampleCoverage = function(value,invert) {
	lime_graphics_opengl_GL.context.sampleCoverage(value,invert);
};
lime_graphics_opengl_GL.scissor = function(x,y,width,height) {
	lime_graphics_opengl_GL.context.scissor(x,y,width,height);
};
lime_graphics_opengl_GL.shaderSource = function(shader,source) {
	lime_graphics_opengl_GL.context.shaderSource(shader,source);
};
lime_graphics_opengl_GL.stencilFunc = function(func,ref,mask) {
	lime_graphics_opengl_GL.context.stencilFunc(func,ref,mask);
};
lime_graphics_opengl_GL.stencilFuncSeparate = function(face,func,ref,mask) {
	lime_graphics_opengl_GL.context.stencilFuncSeparate(face,func,ref,mask);
};
lime_graphics_opengl_GL.stencilMask = function(mask) {
	lime_graphics_opengl_GL.context.stencilMask(mask);
};
lime_graphics_opengl_GL.stencilMaskSeparate = function(face,mask) {
	lime_graphics_opengl_GL.context.stencilMaskSeparate(face,mask);
};
lime_graphics_opengl_GL.stencilOp = function(fail,zfail,zpass) {
	lime_graphics_opengl_GL.context.stencilOp(fail,zfail,zpass);
};
lime_graphics_opengl_GL.stencilOpSeparate = function(face,fail,zfail,zpass) {
	lime_graphics_opengl_GL.context.stencilOpSeparate(face,fail,zfail,zpass);
};
lime_graphics_opengl_GL.texImage2D = function(target,level,internalformat,width,height,border,format,type,pixels) {
	lime_graphics_opengl_GL.context.texImage2D(target,level,internalformat,width,height,border,format,type,pixels);
};
lime_graphics_opengl_GL.texParameterf = function(target,pname,param) {
	lime_graphics_opengl_GL.context.texParameterf(target,pname,param);
};
lime_graphics_opengl_GL.texParameteri = function(target,pname,param) {
	lime_graphics_opengl_GL.context.texParameteri(target,pname,param);
};
lime_graphics_opengl_GL.texSubImage2D = function(target,level,xoffset,yoffset,width,height,format,type,pixels) {
	lime_graphics_opengl_GL.context.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels);
};
lime_graphics_opengl_GL.uniform1f = function(location,x) {
	lime_graphics_opengl_GL.context.uniform1f(location,x);
};
lime_graphics_opengl_GL.uniform1fv = function(location,x) {
	lime_graphics_opengl_GL.context.uniform1fv(location,x);
};
lime_graphics_opengl_GL.uniform1i = function(location,x) {
	lime_graphics_opengl_GL.context.uniform1i(location,x);
};
lime_graphics_opengl_GL.uniform1iv = function(location,v) {
	lime_graphics_opengl_GL.context.uniform1iv(location,v);
};
lime_graphics_opengl_GL.uniform2f = function(location,x,y) {
	lime_graphics_opengl_GL.context.uniform2f(location,x,y);
};
lime_graphics_opengl_GL.uniform2fv = function(location,v) {
	lime_graphics_opengl_GL.context.uniform2fv(location,v);
};
lime_graphics_opengl_GL.uniform2i = function(location,x,y) {
	lime_graphics_opengl_GL.context.uniform2i(location,x,y);
};
lime_graphics_opengl_GL.uniform2iv = function(location,v) {
	lime_graphics_opengl_GL.context.uniform2iv(location,v);
};
lime_graphics_opengl_GL.uniform3f = function(location,x,y,z) {
	lime_graphics_opengl_GL.context.uniform3f(location,x,y,z);
};
lime_graphics_opengl_GL.uniform3fv = function(location,v) {
	lime_graphics_opengl_GL.context.uniform3fv(location,v);
};
lime_graphics_opengl_GL.uniform3i = function(location,x,y,z) {
	lime_graphics_opengl_GL.context.uniform3i(location,x,y,z);
};
lime_graphics_opengl_GL.uniform3iv = function(location,v) {
	lime_graphics_opengl_GL.context.uniform3iv(location,v);
};
lime_graphics_opengl_GL.uniform4f = function(location,x,y,z,w) {
	lime_graphics_opengl_GL.context.uniform4f(location,x,y,z,w);
};
lime_graphics_opengl_GL.uniform4fv = function(location,v) {
	lime_graphics_opengl_GL.context.uniform4fv(location,v);
};
lime_graphics_opengl_GL.uniform4i = function(location,x,y,z,w) {
	lime_graphics_opengl_GL.context.uniform4i(location,x,y,z,w);
};
lime_graphics_opengl_GL.uniform4iv = function(location,v) {
	lime_graphics_opengl_GL.context.uniform4iv(location,v);
};
lime_graphics_opengl_GL.uniformMatrix2fv = function(location,transpose,v) {
	lime_graphics_opengl_GL.context.uniformMatrix2fv(location,transpose,v);
};
lime_graphics_opengl_GL.uniformMatrix3fv = function(location,transpose,v) {
	lime_graphics_opengl_GL.context.uniformMatrix3fv(location,transpose,v);
};
lime_graphics_opengl_GL.uniformMatrix4fv = function(location,transpose,v) {
	lime_graphics_opengl_GL.context.uniformMatrix4fv(location,transpose,v);
};
lime_graphics_opengl_GL.useProgram = function(program) {
	lime_graphics_opengl_GL.context.useProgram(program);
};
lime_graphics_opengl_GL.validateProgram = function(program) {
	lime_graphics_opengl_GL.context.validateProgram(program);
};
lime_graphics_opengl_GL.vertexAttrib1f = function(indx,x) {
	lime_graphics_opengl_GL.context.vertexAttrib1f(indx,x);
};
lime_graphics_opengl_GL.vertexAttrib1fv = function(indx,values) {
	lime_graphics_opengl_GL.context.vertexAttrib1fv(indx,values);
};
lime_graphics_opengl_GL.vertexAttrib2f = function(indx,x,y) {
	lime_graphics_opengl_GL.context.vertexAttrib2f(indx,x,y);
};
lime_graphics_opengl_GL.vertexAttrib2fv = function(indx,values) {
	lime_graphics_opengl_GL.context.vertexAttrib2fv(indx,values);
};
lime_graphics_opengl_GL.vertexAttrib3f = function(indx,x,y,z) {
	lime_graphics_opengl_GL.context.vertexAttrib3f(indx,x,y,z);
};
lime_graphics_opengl_GL.vertexAttrib3fv = function(indx,values) {
	lime_graphics_opengl_GL.context.vertexAttrib3fv(indx,values);
};
lime_graphics_opengl_GL.vertexAttrib4f = function(indx,x,y,z,w) {
	lime_graphics_opengl_GL.context.vertexAttrib4f(indx,x,y,z,w);
};
lime_graphics_opengl_GL.vertexAttrib4fv = function(indx,values) {
	lime_graphics_opengl_GL.context.vertexAttrib4fv(indx,values);
};
lime_graphics_opengl_GL.vertexAttribPointer = function(indx,size,type,normalized,stride,offset) {
	lime_graphics_opengl_GL.context.vertexAttribPointer(indx,size,type,normalized,stride,offset);
};
lime_graphics_opengl_GL.viewport = function(x,y,width,height) {
	lime_graphics_opengl_GL.context.viewport(x,y,width,height);
};
lime_graphics_opengl_GL.get_version = function() {
	return 2;
};
var lime_graphics_utils_ImageCanvasUtil = function() { };
$hxClasses["lime.graphics.utils.ImageCanvasUtil"] = lime_graphics_utils_ImageCanvasUtil;
lime_graphics_utils_ImageCanvasUtil.__name__ = true;
lime_graphics_utils_ImageCanvasUtil.colorTransform = function(image,rect,colorMatrix) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	lime_graphics_utils_ImageDataUtil.colorTransform(image,rect,colorMatrix);
};
lime_graphics_utils_ImageCanvasUtil.convertToCanvas = function(image) {
	var buffer = image.buffer;
	if(buffer.__srcImage != null) {
		if(buffer.__srcCanvas == null) {
			lime_graphics_utils_ImageCanvasUtil.createCanvas(image,buffer.__srcImage.width,buffer.__srcImage.height);
			buffer.__srcContext.drawImage(buffer.__srcImage,0,0);
		}
		buffer.__srcImage = null;
	} else if(buffer.data != null && buffer.__srcCanvas == null) {
		lime_graphics_utils_ImageCanvasUtil.createCanvas(image,buffer.width,buffer.height);
		lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	} else if(buffer.data == null && buffer.__srcImageData != null) buffer.data = buffer.__srcImageData.data;
};
lime_graphics_utils_ImageCanvasUtil.convertToData = function(image) {
	if(image.buffer.data == null) {
		lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
		lime_graphics_utils_ImageCanvasUtil.sync(image,false);
		lime_graphics_utils_ImageCanvasUtil.createImageData(image);
		image.buffer.__srcCanvas = null;
		image.buffer.__srcContext = null;
	}
};
lime_graphics_utils_ImageCanvasUtil.copyChannel = function(image,sourceImage,sourceRect,destPoint,sourceChannel,destChannel) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(sourceImage);
	lime_graphics_utils_ImageCanvasUtil.createImageData(sourceImage);
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	lime_graphics_utils_ImageDataUtil.copyChannel(image,sourceImage,sourceRect,destPoint,sourceChannel,destChannel);
};
lime_graphics_utils_ImageCanvasUtil.copyPixels = function(image,sourceImage,sourceRect,destPoint,alphaImage,alphaPoint,mergeAlpha) {
	if(mergeAlpha == null) mergeAlpha = false;
	if(destPoint == null || destPoint.x >= image.width || destPoint.y >= image.height || sourceRect == null || sourceRect.width < 1 || sourceRect.height < 1) return;
	if(alphaImage != null && alphaImage.get_transparent()) {
		if(alphaPoint == null) alphaPoint = new lime_math_Vector2();
		var tempData = image.clone();
		tempData.copyChannel(alphaImage,new lime_math_Rectangle(alphaPoint.x,alphaPoint.y,sourceRect.width,sourceRect.height),new lime_math_Vector2(sourceRect.x,sourceRect.y),lime_graphics_ImageChannel.ALPHA,lime_graphics_ImageChannel.ALPHA);
		sourceImage = tempData;
	}
	lime_graphics_utils_ImageCanvasUtil.sync(image,true);
	if(!mergeAlpha) {
		if(image.get_transparent() && sourceImage.get_transparent()) image.buffer.__srcContext.clearRect(destPoint.x + image.offsetX,destPoint.y + image.offsetY,sourceRect.width + image.offsetX,sourceRect.height + image.offsetY);
	}
	lime_graphics_utils_ImageCanvasUtil.sync(sourceImage,false);
	if(sourceImage.buffer.get_src() != null) image.buffer.__srcContext.drawImage(sourceImage.buffer.get_src(),sourceRect.x + sourceImage.offsetX | 0,sourceRect.y + sourceImage.offsetY | 0,sourceRect.width | 0,sourceRect.height | 0,destPoint.x + image.offsetX | 0,destPoint.y + image.offsetY | 0,sourceRect.width | 0,sourceRect.height | 0);
};
lime_graphics_utils_ImageCanvasUtil.createCanvas = function(image,width,height) {
	var buffer = image.buffer;
	if(buffer.__srcCanvas == null) {
		buffer.__srcCanvas = window.document.createElement("canvas");
		buffer.__srcCanvas.width = width;
		buffer.__srcCanvas.height = height;
		if(!image.get_transparent()) {
			if(!image.get_transparent()) buffer.__srcCanvas.setAttribute("moz-opaque","true");
			buffer.__srcContext = buffer.__srcCanvas.getContext ("2d", { alpha: false });
		} else buffer.__srcContext = buffer.__srcCanvas.getContext("2d");
		buffer.__srcContext.mozImageSmoothingEnabled = false;
		buffer.__srcContext.msImageSmoothingEnabled = false;
		buffer.__srcContext.imageSmoothingEnabled = false;
	}
};
lime_graphics_utils_ImageCanvasUtil.createImageData = function(image) {
	var buffer = image.buffer;
	if(buffer.__srcImageData == null) {
		if(buffer.data == null) buffer.__srcImageData = buffer.__srcContext.getImageData(0,0,buffer.width,buffer.height); else {
			buffer.__srcImageData = buffer.__srcContext.createImageData(buffer.width,buffer.height);
			buffer.__srcImageData.data.set(buffer.data);
		}
		var elements = buffer.__srcImageData.data.buffer;
		var this1;
		if(elements != null) this1 = new Uint8Array(elements); else this1 = null;
		buffer.data = this1;
	}
};
lime_graphics_utils_ImageCanvasUtil.fillRect = function(image,rect,color,format) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.sync(image,true);
	if(rect.x == 0 && rect.y == 0 && rect.width == image.width && rect.height == image.height) {
		if(image.get_transparent() && (color & 255) == 0) {
			image.buffer.__srcCanvas.width = image.buffer.width;
			return;
		}
	}
	var r;
	var g;
	var b;
	var a;
	if(format == 1) {
		r = color >> 16 & 255;
		g = color >> 8 & 255;
		b = color & 255;
		if(image.get_transparent()) a = color >> 24 & 255; else a = 255;
	} else {
		r = color >> 24 & 255;
		g = color >> 16 & 255;
		b = color >> 8 & 255;
		if(image.get_transparent()) a = color & 255; else a = 255;
	}
	image.buffer.__srcContext.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a / 255 + ")";
	image.buffer.__srcContext.fillRect(rect.x + image.offsetX,rect.y + image.offsetY,rect.width + image.offsetX,rect.height + image.offsetY);
};
lime_graphics_utils_ImageCanvasUtil.floodFill = function(image,x,y,color,format) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	lime_graphics_utils_ImageDataUtil.floodFill(image,x,y,color,format);
};
lime_graphics_utils_ImageCanvasUtil.getPixel = function(image,x,y,format) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	return lime_graphics_utils_ImageDataUtil.getPixel(image,x,y,format);
};
lime_graphics_utils_ImageCanvasUtil.getPixel32 = function(image,x,y,format) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	return lime_graphics_utils_ImageDataUtil.getPixel32(image,x,y,format);
};
lime_graphics_utils_ImageCanvasUtil.getPixels = function(image,rect,format) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	return lime_graphics_utils_ImageDataUtil.getPixels(image,rect,format);
};
lime_graphics_utils_ImageCanvasUtil.merge = function(image,sourceImage,sourceRect,destPoint,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(sourceImage);
	lime_graphics_utils_ImageCanvasUtil.createImageData(sourceImage);
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	lime_graphics_utils_ImageDataUtil.merge(image,sourceImage,sourceRect,destPoint,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
};
lime_graphics_utils_ImageCanvasUtil.resize = function(image,newWidth,newHeight) {
	var buffer = image.buffer;
	if(buffer.__srcCanvas == null) {
		lime_graphics_utils_ImageCanvasUtil.createCanvas(image,newWidth,newHeight);
		buffer.__srcContext.drawImage(buffer.get_src(),0,0,newWidth,newHeight);
	} else {
		lime_graphics_utils_ImageCanvasUtil.sync(image,true);
		var sourceCanvas = buffer.__srcCanvas;
		buffer.__srcCanvas = null;
		lime_graphics_utils_ImageCanvasUtil.createCanvas(image,newWidth,newHeight);
		buffer.__srcContext.drawImage(sourceCanvas,0,0,newWidth,newHeight);
	}
};
lime_graphics_utils_ImageCanvasUtil.scroll = function(image,x,y) {
	if(x % image.width == 0 && y % image.height == 0) return;
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.sync(image,true);
	image.buffer.__srcContext.clearRect(x,y,image.width,image.height);
	image.buffer.__srcContext.drawImage(image.buffer.__srcCanvas,x,y);
};
lime_graphics_utils_ImageCanvasUtil.setPixel = function(image,x,y,color,format) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	lime_graphics_utils_ImageDataUtil.setPixel(image,x,y,color,format);
};
lime_graphics_utils_ImageCanvasUtil.setPixel32 = function(image,x,y,color,format) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	lime_graphics_utils_ImageDataUtil.setPixel32(image,x,y,color,format);
};
lime_graphics_utils_ImageCanvasUtil.setPixels = function(image,rect,bytes,format) {
	lime_graphics_utils_ImageCanvasUtil.convertToCanvas(image);
	lime_graphics_utils_ImageCanvasUtil.createImageData(image);
	lime_graphics_utils_ImageDataUtil.setPixels(image,rect,bytes,format);
};
lime_graphics_utils_ImageCanvasUtil.sync = function(image,clear) {
	if(image.dirty && image.buffer.__srcImageData != null && image.type != lime_graphics_ImageType.DATA) {
		image.buffer.__srcContext.putImageData(image.buffer.__srcImageData,0,0);
		image.buffer.data = null;
		image.dirty = false;
	}
	if(clear) {
		image.buffer.__srcImageData = null;
		image.buffer.data = null;
	}
};
var lime_graphics_utils_ImageDataUtil = function() { };
$hxClasses["lime.graphics.utils.ImageDataUtil"] = lime_graphics_utils_ImageDataUtil;
lime_graphics_utils_ImageDataUtil.__name__ = true;
lime_graphics_utils_ImageDataUtil.colorTransform = function(image,rect,colorMatrix) {
	var data = image.buffer.data;
	if(data == null) return;
	var format = image.buffer.format;
	var premultiplied = image.buffer.premultiplied;
	var dataView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(image,rect);
	var alphaTable = lime_math__$ColorMatrix_ColorMatrix_$Impl_$.getAlphaTable(colorMatrix);
	var redTable = lime_math__$ColorMatrix_ColorMatrix_$Impl_$.getRedTable(colorMatrix);
	var greenTable = lime_math__$ColorMatrix_ColorMatrix_$Impl_$.getGreenTable(colorMatrix);
	var blueTable = lime_math__$ColorMatrix_ColorMatrix_$Impl_$.getBlueTable(colorMatrix);
	var row;
	var offset;
	var pixel;
	var _g1 = 0;
	var _g = dataView.height;
	while(_g1 < _g) {
		var y = _g1++;
		row = dataView.offset + dataView.stride * y;
		var _g3 = 0;
		var _g2 = dataView.width;
		while(_g3 < _g2) {
			var x = _g3++;
			offset = row + x * 4;
			switch(format) {
			case 2:
				pixel = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
				break;
			case 0:
				pixel = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
				break;
			case 1:
				pixel = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
				break;
			}
			if(premultiplied) {
				if((pixel & 255) != 0 && (pixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (pixel & 255);
					var r;
					var idx = Math.round((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
					var g;
					var idx1 = Math.round((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
					var b;
					var idx2 = Math.round((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
					pixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | pixel & 255 & 255;
				}
			}
			pixel = (redTable[pixel >> 24 & 255] & 255) << 24 | (greenTable[pixel >> 16 & 255] & 255) << 16 | (blueTable[pixel >> 8 & 255] & 255) << 8 | alphaTable[pixel & 255] & 255;
			if(premultiplied) {
				if((pixel & 255) == 0) {
					if(pixel != 0) pixel = 0;
				} else if((pixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[pixel & 255];
					pixel = ((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | pixel & 255 & 255;
				}
			}
			switch(format) {
			case 2:
				data[offset] = pixel >> 8 & 255;
				data[offset + 1] = pixel >> 16 & 255;
				data[offset + 2] = pixel >> 24 & 255;
				data[offset + 3] = pixel & 255;
				break;
			case 0:
				data[offset] = pixel >> 24 & 255;
				data[offset + 1] = pixel >> 16 & 255;
				data[offset + 2] = pixel >> 8 & 255;
				data[offset + 3] = pixel & 255;
				break;
			case 1:
				data[offset] = pixel & 255;
				data[offset + 1] = pixel >> 24 & 255;
				data[offset + 2] = pixel >> 16 & 255;
				data[offset + 3] = pixel >> 8 & 255;
				break;
			}
		}
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.copyChannel = function(image,sourceImage,sourceRect,destPoint,sourceChannel,destChannel) {
	var destIdx;
	switch(destChannel[1]) {
	case 0:
		destIdx = 0;
		break;
	case 1:
		destIdx = 1;
		break;
	case 2:
		destIdx = 2;
		break;
	case 3:
		destIdx = 3;
		break;
	}
	var srcIdx;
	switch(sourceChannel[1]) {
	case 0:
		srcIdx = 0;
		break;
	case 1:
		srcIdx = 1;
		break;
	case 2:
		srcIdx = 2;
		break;
	case 3:
		srcIdx = 3;
		break;
	}
	var srcData = sourceImage.buffer.data;
	var destData = image.buffer.data;
	if(srcData == null || destData == null) return;
	var srcView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(sourceImage,sourceRect);
	var destView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(image,new lime_math_Rectangle(destPoint.x,destPoint.y,srcView.width,srcView.height));
	var srcFormat = sourceImage.buffer.format;
	var destFormat = image.buffer.format;
	var srcPremultiplied = sourceImage.buffer.premultiplied;
	var destPremultiplied = image.buffer.premultiplied;
	var srcPosition;
	var destPosition;
	var srcPixel;
	var destPixel;
	var value = 0;
	var _g1 = 0;
	var _g = destView.height;
	while(_g1 < _g) {
		var y = _g1++;
		srcPosition = srcView.offset + srcView.stride * y;
		destPosition = destView.offset + destView.stride * y;
		var _g3 = 0;
		var _g2 = destView.width;
		while(_g3 < _g2) {
			var x = _g3++;
			switch(srcFormat) {
			case 2:
				srcPixel = (srcData[srcPosition + 2] & 255) << 24 | (srcData[srcPosition + 1] & 255) << 16 | (srcData[srcPosition] & 255) << 8 | srcData[srcPosition + 3] & 255;
				break;
			case 0:
				srcPixel = (srcData[srcPosition] & 255) << 24 | (srcData[srcPosition + 1] & 255) << 16 | (srcData[srcPosition + 2] & 255) << 8 | srcData[srcPosition + 3] & 255;
				break;
			case 1:
				srcPixel = (srcData[srcPosition + 1] & 255) << 24 | (srcData[srcPosition + 2] & 255) << 16 | (srcData[srcPosition + 3] & 255) << 8 | srcData[srcPosition] & 255;
				break;
			}
			if(srcPremultiplied) {
				if((srcPixel & 255) != 0 && (srcPixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (srcPixel & 255);
					var r;
					var idx = Math.round((srcPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
					var g;
					var idx1 = Math.round((srcPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
					var b;
					var idx2 = Math.round((srcPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
					srcPixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | srcPixel & 255 & 255;
				}
			}
			switch(destFormat) {
			case 2:
				destPixel = (destData[destPosition + 2] & 255) << 24 | (destData[destPosition + 1] & 255) << 16 | (destData[destPosition] & 255) << 8 | destData[destPosition + 3] & 255;
				break;
			case 0:
				destPixel = (destData[destPosition] & 255) << 24 | (destData[destPosition + 1] & 255) << 16 | (destData[destPosition + 2] & 255) << 8 | destData[destPosition + 3] & 255;
				break;
			case 1:
				destPixel = (destData[destPosition + 1] & 255) << 24 | (destData[destPosition + 2] & 255) << 16 | (destData[destPosition + 3] & 255) << 8 | destData[destPosition] & 255;
				break;
			}
			if(destPremultiplied) {
				if((destPixel & 255) != 0 && (destPixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (destPixel & 255);
					var r1;
					var idx3 = Math.round((destPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					r1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx3];
					var g1;
					var idx4 = Math.round((destPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					g1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx4];
					var b1;
					var idx5 = Math.round((destPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					b1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx5];
					destPixel = (r1 & 255) << 24 | (g1 & 255) << 16 | (b1 & 255) << 8 | destPixel & 255 & 255;
				}
			}
			switch(srcIdx) {
			case 0:
				value = srcPixel >> 24 & 255;
				break;
			case 1:
				value = srcPixel >> 16 & 255;
				break;
			case 2:
				value = srcPixel >> 8 & 255;
				break;
			case 3:
				value = srcPixel & 255;
				break;
			}
			switch(destIdx) {
			case 0:
				destPixel = (value & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | destPixel & 255 & 255;
				value;
				break;
			case 1:
				destPixel = (destPixel >> 24 & 255 & 255) << 24 | (value & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | destPixel & 255 & 255;
				value;
				break;
			case 2:
				destPixel = (destPixel >> 24 & 255 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (value & 255) << 8 | destPixel & 255 & 255;
				value;
				break;
			case 3:
				destPixel = (destPixel >> 24 & 255 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | value & 255;
				value;
				break;
			}
			if(destPremultiplied) {
				if((destPixel & 255) == 0) {
					if(destPixel != 0) destPixel = 0;
				} else if((destPixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[destPixel & 255];
					destPixel = ((destPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((destPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((destPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | destPixel & 255 & 255;
				}
			}
			switch(destFormat) {
			case 2:
				destData[destPosition] = destPixel >> 8 & 255;
				destData[destPosition + 1] = destPixel >> 16 & 255;
				destData[destPosition + 2] = destPixel >> 24 & 255;
				destData[destPosition + 3] = destPixel & 255;
				break;
			case 0:
				destData[destPosition] = destPixel >> 24 & 255;
				destData[destPosition + 1] = destPixel >> 16 & 255;
				destData[destPosition + 2] = destPixel >> 8 & 255;
				destData[destPosition + 3] = destPixel & 255;
				break;
			case 1:
				destData[destPosition] = destPixel & 255;
				destData[destPosition + 1] = destPixel >> 24 & 255;
				destData[destPosition + 2] = destPixel >> 16 & 255;
				destData[destPosition + 3] = destPixel >> 8 & 255;
				break;
			}
			srcPosition += 4;
			destPosition += 4;
		}
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.copyPixels = function(image,sourceImage,sourceRect,destPoint,alphaImage,alphaPoint,mergeAlpha) {
	if(mergeAlpha == null) mergeAlpha = false;
	var sourceData = sourceImage.buffer.data;
	var destData = image.buffer.data;
	if(sourceData == null || destData == null) return;
	var sourceView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(sourceImage,sourceRect);
	var destView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(image,new lime_math_Rectangle(destPoint.x,destPoint.y,sourceView.width,sourceView.height));
	var sourceFormat = sourceImage.buffer.format;
	var destFormat = image.buffer.format;
	var sourcePremultiplied = sourceImage.buffer.premultiplied;
	var destPremultiplied = image.buffer.premultiplied;
	var sourcePosition;
	var destPosition;
	var sourcePixel;
	if(!mergeAlpha || !sourceImage.get_transparent()) {
		var _g1 = 0;
		var _g = destView.height;
		while(_g1 < _g) {
			var y = _g1++;
			sourcePosition = sourceView.offset + sourceView.stride * y;
			destPosition = destView.offset + destView.stride * y;
			var _g3 = 0;
			var _g2 = destView.width;
			while(_g3 < _g2) {
				var x = _g3++;
				switch(sourceFormat) {
				case 2:
					sourcePixel = (sourceData[sourcePosition + 2] & 255) << 24 | (sourceData[sourcePosition + 1] & 255) << 16 | (sourceData[sourcePosition] & 255) << 8 | sourceData[sourcePosition + 3] & 255;
					break;
				case 0:
					sourcePixel = (sourceData[sourcePosition] & 255) << 24 | (sourceData[sourcePosition + 1] & 255) << 16 | (sourceData[sourcePosition + 2] & 255) << 8 | sourceData[sourcePosition + 3] & 255;
					break;
				case 1:
					sourcePixel = (sourceData[sourcePosition + 1] & 255) << 24 | (sourceData[sourcePosition + 2] & 255) << 16 | (sourceData[sourcePosition + 3] & 255) << 8 | sourceData[sourcePosition] & 255;
					break;
				}
				if(sourcePremultiplied) {
					if((sourcePixel & 255) != 0 && (sourcePixel & 255) != 255) {
						lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (sourcePixel & 255);
						var r;
						var idx = Math.round((sourcePixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
						r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
						var g;
						var idx1 = Math.round((sourcePixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
						g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
						var b;
						var idx2 = Math.round((sourcePixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
						b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
						sourcePixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | sourcePixel & 255 & 255;
					}
				}
				if(destPremultiplied) {
					if((sourcePixel & 255) == 0) {
						if(sourcePixel != 0) sourcePixel = 0;
					} else if((sourcePixel & 255) != 255) {
						lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[sourcePixel & 255];
						sourcePixel = ((sourcePixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((sourcePixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((sourcePixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | sourcePixel & 255 & 255;
					}
				}
				switch(destFormat) {
				case 2:
					destData[destPosition] = sourcePixel >> 8 & 255;
					destData[destPosition + 1] = sourcePixel >> 16 & 255;
					destData[destPosition + 2] = sourcePixel >> 24 & 255;
					destData[destPosition + 3] = sourcePixel & 255;
					break;
				case 0:
					destData[destPosition] = sourcePixel >> 24 & 255;
					destData[destPosition + 1] = sourcePixel >> 16 & 255;
					destData[destPosition + 2] = sourcePixel >> 8 & 255;
					destData[destPosition + 3] = sourcePixel & 255;
					break;
				case 1:
					destData[destPosition] = sourcePixel & 255;
					destData[destPosition + 1] = sourcePixel >> 24 & 255;
					destData[destPosition + 2] = sourcePixel >> 16 & 255;
					destData[destPosition + 3] = sourcePixel >> 8 & 255;
					break;
				}
				sourcePosition += 4;
				destPosition += 4;
			}
		}
	} else {
		var sourceAlpha;
		var destAlpha;
		var oneMinusSourceAlpha;
		var blendAlpha;
		var destPixel;
		if(alphaImage == null) {
			var _g11 = 0;
			var _g4 = destView.height;
			while(_g11 < _g4) {
				var y1 = _g11++;
				sourcePosition = sourceView.offset + sourceView.stride * y1;
				destPosition = destView.offset + destView.stride * y1;
				var _g31 = 0;
				var _g21 = destView.width;
				while(_g31 < _g21) {
					var x1 = _g31++;
					switch(sourceFormat) {
					case 2:
						sourcePixel = (sourceData[sourcePosition + 2] & 255) << 24 | (sourceData[sourcePosition + 1] & 255) << 16 | (sourceData[sourcePosition] & 255) << 8 | sourceData[sourcePosition + 3] & 255;
						break;
					case 0:
						sourcePixel = (sourceData[sourcePosition] & 255) << 24 | (sourceData[sourcePosition + 1] & 255) << 16 | (sourceData[sourcePosition + 2] & 255) << 8 | sourceData[sourcePosition + 3] & 255;
						break;
					case 1:
						sourcePixel = (sourceData[sourcePosition + 1] & 255) << 24 | (sourceData[sourcePosition + 2] & 255) << 16 | (sourceData[sourcePosition + 3] & 255) << 8 | sourceData[sourcePosition] & 255;
						break;
					}
					if(sourcePremultiplied) {
						if((sourcePixel & 255) != 0 && (sourcePixel & 255) != 255) {
							lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (sourcePixel & 255);
							var r1;
							var idx3 = Math.round((sourcePixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							r1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx3];
							var g1;
							var idx4 = Math.round((sourcePixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							g1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx4];
							var b1;
							var idx5 = Math.round((sourcePixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							b1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx5];
							sourcePixel = (r1 & 255) << 24 | (g1 & 255) << 16 | (b1 & 255) << 8 | sourcePixel & 255 & 255;
						}
					}
					switch(destFormat) {
					case 2:
						destPixel = (destData[destPosition + 2] & 255) << 24 | (destData[destPosition + 1] & 255) << 16 | (destData[destPosition] & 255) << 8 | destData[destPosition + 3] & 255;
						break;
					case 0:
						destPixel = (destData[destPosition] & 255) << 24 | (destData[destPosition + 1] & 255) << 16 | (destData[destPosition + 2] & 255) << 8 | destData[destPosition + 3] & 255;
						break;
					case 1:
						destPixel = (destData[destPosition + 1] & 255) << 24 | (destData[destPosition + 2] & 255) << 16 | (destData[destPosition + 3] & 255) << 8 | destData[destPosition] & 255;
						break;
					}
					if(destPremultiplied) {
						if((destPixel & 255) != 0 && (destPixel & 255) != 255) {
							lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (destPixel & 255);
							var r2;
							var idx6 = Math.round((destPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							r2 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx6];
							var g2;
							var idx7 = Math.round((destPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							g2 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx7];
							var b2;
							var idx8 = Math.round((destPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							b2 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx8];
							destPixel = (r2 & 255) << 24 | (g2 & 255) << 16 | (b2 & 255) << 8 | destPixel & 255 & 255;
						}
					}
					sourceAlpha = (sourcePixel & 255) / 255.0;
					destAlpha = (destPixel & 255) / 255.0;
					oneMinusSourceAlpha = 1 - sourceAlpha;
					blendAlpha = sourceAlpha + destAlpha * oneMinusSourceAlpha;
					if(blendAlpha == 0) destPixel = 0; else {
						var value;
						var idx9 = Math.round(((sourcePixel >> 24 & 255) * sourceAlpha + (destPixel >> 24 & 255) * destAlpha * oneMinusSourceAlpha) / blendAlpha);
						value = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx9];
						destPixel = (value & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | destPixel & 255 & 255;
						value;
						var value1;
						var idx10 = Math.round(((sourcePixel >> 16 & 255) * sourceAlpha + (destPixel >> 16 & 255) * destAlpha * oneMinusSourceAlpha) / blendAlpha);
						value1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx10];
						destPixel = (destPixel >> 24 & 255 & 255) << 24 | (value1 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | destPixel & 255 & 255;
						value1;
						var value2;
						var idx11 = Math.round(((sourcePixel >> 8 & 255) * sourceAlpha + (destPixel >> 8 & 255) * destAlpha * oneMinusSourceAlpha) / blendAlpha);
						value2 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx11];
						destPixel = (destPixel >> 24 & 255 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (value2 & 255) << 8 | destPixel & 255 & 255;
						value2;
						var value3;
						var idx12 = Math.round(blendAlpha * 255.0);
						value3 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx12];
						destPixel = (destPixel >> 24 & 255 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | value3 & 255;
						value3;
					}
					if(destPremultiplied) {
						if((destPixel & 255) == 0) {
							if(destPixel != 0) destPixel = 0;
						} else if((destPixel & 255) != 255) {
							lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[destPixel & 255];
							destPixel = ((destPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((destPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((destPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | destPixel & 255 & 255;
						}
					}
					switch(destFormat) {
					case 2:
						destData[destPosition] = destPixel >> 8 & 255;
						destData[destPosition + 1] = destPixel >> 16 & 255;
						destData[destPosition + 2] = destPixel >> 24 & 255;
						destData[destPosition + 3] = destPixel & 255;
						break;
					case 0:
						destData[destPosition] = destPixel >> 24 & 255;
						destData[destPosition + 1] = destPixel >> 16 & 255;
						destData[destPosition + 2] = destPixel >> 8 & 255;
						destData[destPosition + 3] = destPixel & 255;
						break;
					case 1:
						destData[destPosition] = destPixel & 255;
						destData[destPosition + 1] = destPixel >> 24 & 255;
						destData[destPosition + 2] = destPixel >> 16 & 255;
						destData[destPosition + 3] = destPixel >> 8 & 255;
						break;
					}
					sourcePosition += 4;
					destPosition += 4;
				}
			}
		} else {
			if(alphaPoint == null) alphaPoint = new lime_math_Vector2();
			var alphaData = alphaImage.buffer.data;
			var alphaFormat = alphaImage.buffer.format;
			var alphaPremultiplied = alphaImage.buffer.premultiplied;
			var alphaView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(alphaImage,new lime_math_Rectangle(alphaPoint.x,alphaPoint.y,destView.width,destView.height));
			var alphaPosition;
			var alphaPixel;
			var _g12 = 0;
			var _g5 = alphaView.height;
			while(_g12 < _g5) {
				var y2 = _g12++;
				sourcePosition = sourceView.offset + sourceView.stride * y2;
				destPosition = destView.offset + destView.stride * y2;
				alphaPosition = alphaView.offset + alphaView.stride * y2;
				var _g32 = 0;
				var _g22 = alphaView.width;
				while(_g32 < _g22) {
					var x2 = _g32++;
					switch(sourceFormat) {
					case 2:
						sourcePixel = (sourceData[sourcePosition + 2] & 255) << 24 | (sourceData[sourcePosition + 1] & 255) << 16 | (sourceData[sourcePosition] & 255) << 8 | sourceData[sourcePosition + 3] & 255;
						break;
					case 0:
						sourcePixel = (sourceData[sourcePosition] & 255) << 24 | (sourceData[sourcePosition + 1] & 255) << 16 | (sourceData[sourcePosition + 2] & 255) << 8 | sourceData[sourcePosition + 3] & 255;
						break;
					case 1:
						sourcePixel = (sourceData[sourcePosition + 1] & 255) << 24 | (sourceData[sourcePosition + 2] & 255) << 16 | (sourceData[sourcePosition + 3] & 255) << 8 | sourceData[sourcePosition] & 255;
						break;
					}
					if(sourcePremultiplied) {
						if((sourcePixel & 255) != 0 && (sourcePixel & 255) != 255) {
							lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (sourcePixel & 255);
							var r3;
							var idx13 = Math.round((sourcePixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							r3 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx13];
							var g3;
							var idx14 = Math.round((sourcePixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							g3 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx14];
							var b3;
							var idx15 = Math.round((sourcePixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							b3 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx15];
							sourcePixel = (r3 & 255) << 24 | (g3 & 255) << 16 | (b3 & 255) << 8 | sourcePixel & 255 & 255;
						}
					}
					switch(destFormat) {
					case 2:
						destPixel = (destData[destPosition + 2] & 255) << 24 | (destData[destPosition + 1] & 255) << 16 | (destData[destPosition] & 255) << 8 | destData[destPosition + 3] & 255;
						break;
					case 0:
						destPixel = (destData[destPosition] & 255) << 24 | (destData[destPosition + 1] & 255) << 16 | (destData[destPosition + 2] & 255) << 8 | destData[destPosition + 3] & 255;
						break;
					case 1:
						destPixel = (destData[destPosition + 1] & 255) << 24 | (destData[destPosition + 2] & 255) << 16 | (destData[destPosition + 3] & 255) << 8 | destData[destPosition] & 255;
						break;
					}
					if(destPremultiplied) {
						if((destPixel & 255) != 0 && (destPixel & 255) != 255) {
							lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (destPixel & 255);
							var r4;
							var idx16 = Math.round((destPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							r4 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx16];
							var g4;
							var idx17 = Math.round((destPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							g4 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx17];
							var b4;
							var idx18 = Math.round((destPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							b4 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx18];
							destPixel = (r4 & 255) << 24 | (g4 & 255) << 16 | (b4 & 255) << 8 | destPixel & 255 & 255;
						}
					}
					switch(alphaFormat) {
					case 2:
						alphaPixel = (alphaData[alphaPosition + 2] & 255) << 24 | (alphaData[alphaPosition + 1] & 255) << 16 | (alphaData[alphaPosition] & 255) << 8 | alphaData[alphaPosition + 3] & 255;
						break;
					case 0:
						alphaPixel = (alphaData[alphaPosition] & 255) << 24 | (alphaData[alphaPosition + 1] & 255) << 16 | (alphaData[alphaPosition + 2] & 255) << 8 | alphaData[alphaPosition + 3] & 255;
						break;
					case 1:
						alphaPixel = (alphaData[alphaPosition + 1] & 255) << 24 | (alphaData[alphaPosition + 2] & 255) << 16 | (alphaData[alphaPosition + 3] & 255) << 8 | alphaData[alphaPosition] & 255;
						break;
					}
					if(alphaPremultiplied) {
						if((alphaPixel & 255) != 0 && (alphaPixel & 255) != 255) {
							lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (alphaPixel & 255);
							var r5;
							var idx19 = Math.round((alphaPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							r5 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx19];
							var g5;
							var idx20 = Math.round((alphaPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							g5 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx20];
							var b5;
							var idx21 = Math.round((alphaPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
							b5 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx21];
							alphaPixel = (r5 & 255) << 24 | (g5 & 255) << 16 | (b5 & 255) << 8 | alphaPixel & 255 & 255;
						}
					}
					sourceAlpha = (alphaPixel & 255) / 255;
					destAlpha = (destPixel & 255) / 255;
					oneMinusSourceAlpha = 1 - sourceAlpha;
					blendAlpha = sourceAlpha + destAlpha * oneMinusSourceAlpha;
					if(blendAlpha == 0) destPixel = 0; else {
						var value4;
						var idx22 = Math.round(((sourcePixel >> 24 & 255) * sourceAlpha + (destPixel >> 24 & 255) * destAlpha * oneMinusSourceAlpha) / blendAlpha);
						value4 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx22];
						destPixel = (value4 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | destPixel & 255 & 255;
						value4;
						var value5;
						var idx23 = Math.round(((sourcePixel >> 16 & 255) * sourceAlpha + (destPixel >> 16 & 255) * destAlpha * oneMinusSourceAlpha) / blendAlpha);
						value5 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx23];
						destPixel = (destPixel >> 24 & 255 & 255) << 24 | (value5 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | destPixel & 255 & 255;
						value5;
						var value6;
						var idx24 = Math.round(((sourcePixel >> 8 & 255) * sourceAlpha + (destPixel >> 8 & 255) * destAlpha * oneMinusSourceAlpha) / blendAlpha);
						value6 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx24];
						destPixel = (destPixel >> 24 & 255 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (value6 & 255) << 8 | destPixel & 255 & 255;
						value6;
						var value7;
						var idx25 = Math.round(blendAlpha * 255.0);
						value7 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx25];
						destPixel = (destPixel >> 24 & 255 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | value7 & 255;
						value7;
					}
					if(destPremultiplied) {
						if((destPixel & 255) == 0) {
							if(destPixel != 0) destPixel = 0;
						} else if((destPixel & 255) != 255) {
							lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[destPixel & 255];
							destPixel = ((destPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((destPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((destPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | destPixel & 255 & 255;
						}
					}
					switch(destFormat) {
					case 2:
						destData[destPosition] = destPixel >> 8 & 255;
						destData[destPosition + 1] = destPixel >> 16 & 255;
						destData[destPosition + 2] = destPixel >> 24 & 255;
						destData[destPosition + 3] = destPixel & 255;
						break;
					case 0:
						destData[destPosition] = destPixel >> 24 & 255;
						destData[destPosition + 1] = destPixel >> 16 & 255;
						destData[destPosition + 2] = destPixel >> 8 & 255;
						destData[destPosition + 3] = destPixel & 255;
						break;
					case 1:
						destData[destPosition] = destPixel & 255;
						destData[destPosition + 1] = destPixel >> 24 & 255;
						destData[destPosition + 2] = destPixel >> 16 & 255;
						destData[destPosition + 3] = destPixel >> 8 & 255;
						break;
					}
					sourcePosition += 4;
					destPosition += 4;
				}
			}
		}
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.fillRect = function(image,rect,color,format) {
	var fillColor;
	switch(format) {
	case 1:
		{
			var argb = color;
			var rgba = 0;
			rgba = (argb >> 16 & 255 & 255) << 24 | (argb >> 8 & 255 & 255) << 16 | (argb & 255 & 255) << 8 | argb >> 24 & 255 & 255;
			fillColor = rgba;
		}
		break;
	case 2:
		{
			var bgra = color;
			var rgba1 = 0;
			rgba1 = (bgra >> 8 & 255 & 255) << 24 | (bgra >> 16 & 255 & 255) << 16 | (bgra >> 24 & 255 & 255) << 8 | bgra & 255 & 255;
			fillColor = rgba1;
		}
		break;
	default:
		fillColor = color;
	}
	if(!image.get_transparent()) {
		fillColor = (fillColor >> 24 & 255 & 255) << 24 | (fillColor >> 16 & 255 & 255) << 16 | (fillColor >> 8 & 255 & 255) << 8 | 255;
		255;
	}
	var data = image.buffer.data;
	if(data == null) return;
	var format1 = image.buffer.format;
	var premultiplied = image.buffer.premultiplied;
	var dataView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(image,rect);
	var row;
	var _g1 = 0;
	var _g = dataView.height;
	while(_g1 < _g) {
		var y = _g1++;
		row = dataView.offset + dataView.stride * y;
		var _g3 = 0;
		var _g2 = dataView.width;
		while(_g3 < _g2) {
			var x = _g3++;
			var offset = row + x * 4;
			if(premultiplied) {
				if((fillColor & 255) == 0) {
					if(fillColor != 0) fillColor = 0;
				} else if((fillColor & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[fillColor & 255];
					fillColor = ((fillColor >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((fillColor >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((fillColor >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | fillColor & 255 & 255;
				}
			}
			switch(format1) {
			case 2:
				data[offset] = fillColor >> 8 & 255;
				data[offset + 1] = fillColor >> 16 & 255;
				data[offset + 2] = fillColor >> 24 & 255;
				data[offset + 3] = fillColor & 255;
				break;
			case 0:
				data[offset] = fillColor >> 24 & 255;
				data[offset + 1] = fillColor >> 16 & 255;
				data[offset + 2] = fillColor >> 8 & 255;
				data[offset + 3] = fillColor & 255;
				break;
			case 1:
				data[offset] = fillColor & 255;
				data[offset + 1] = fillColor >> 24 & 255;
				data[offset + 2] = fillColor >> 16 & 255;
				data[offset + 3] = fillColor >> 8 & 255;
				break;
			}
		}
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.floodFill = function(image,x,y,color,format) {
	var data = image.buffer.data;
	if(data == null) return;
	if(format == 1) color = (color & 16777215) << 8 | color >> 24 & 255;
	var format1 = image.buffer.format;
	var premultiplied = image.buffer.premultiplied;
	var fillColor = color;
	var hitColor;
	var offset = (y + image.offsetY) * (image.buffer.width * 4) + (x + image.offsetX) * 4;
	switch(format1) {
	case 2:
		hitColor = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 0:
		hitColor = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 1:
		hitColor = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
		break;
	}
	if(premultiplied) {
		if((hitColor & 255) != 0 && (hitColor & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (hitColor & 255);
			var r;
			var idx = Math.round((hitColor >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
			var g;
			var idx1 = Math.round((hitColor >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
			var b;
			var idx2 = Math.round((hitColor >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
			hitColor = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | hitColor & 255 & 255;
		}
	}
	if(!image.get_transparent()) {
		fillColor = (fillColor >> 24 & 255 & 255) << 24 | (fillColor >> 16 & 255 & 255) << 16 | (fillColor >> 8 & 255 & 255) << 8 | 255;
		255;
		hitColor = (hitColor >> 24 & 255 & 255) << 24 | (hitColor >> 16 & 255 & 255) << 16 | (hitColor >> 8 & 255 & 255) << 8 | 255;
		255;
	}
	if(fillColor == hitColor) return;
	var dx = [0,-1,1,0];
	var dy = [-1,0,0,1];
	var minX = -image.offsetX;
	var minY = -image.offsetY;
	var maxX = minX + image.width;
	var maxY = minY + image.height;
	var queue = [];
	queue.push(x);
	queue.push(y);
	var curPointX;
	var curPointY;
	var nextPointX;
	var nextPointY;
	var nextPointOffset;
	var readColor;
	while(queue.length > 0) {
		curPointY = queue.pop();
		curPointX = queue.pop();
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			nextPointX = curPointX + dx[i];
			nextPointY = curPointY + dy[i];
			if(nextPointX < minX || nextPointY < minY || nextPointX >= maxX || nextPointY >= maxY) continue;
			nextPointOffset = (nextPointY * image.width + nextPointX) * 4;
			switch(format1) {
			case 2:
				readColor = (data[nextPointOffset + 2] & 255) << 24 | (data[nextPointOffset + 1] & 255) << 16 | (data[nextPointOffset] & 255) << 8 | data[nextPointOffset + 3] & 255;
				break;
			case 0:
				readColor = (data[nextPointOffset] & 255) << 24 | (data[nextPointOffset + 1] & 255) << 16 | (data[nextPointOffset + 2] & 255) << 8 | data[nextPointOffset + 3] & 255;
				break;
			case 1:
				readColor = (data[nextPointOffset + 1] & 255) << 24 | (data[nextPointOffset + 2] & 255) << 16 | (data[nextPointOffset + 3] & 255) << 8 | data[nextPointOffset] & 255;
				break;
			}
			if(premultiplied) {
				if((readColor & 255) != 0 && (readColor & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (readColor & 255);
					var r1;
					var idx3 = Math.round((readColor >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					r1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx3];
					var g1;
					var idx4 = Math.round((readColor >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					g1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx4];
					var b1;
					var idx5 = Math.round((readColor >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					b1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx5];
					readColor = (r1 & 255) << 24 | (g1 & 255) << 16 | (b1 & 255) << 8 | readColor & 255 & 255;
				}
			}
			if(readColor == hitColor) {
				if(premultiplied) {
					if((fillColor & 255) == 0) {
						if(fillColor != 0) fillColor = 0;
					} else if((fillColor & 255) != 255) {
						lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[fillColor & 255];
						fillColor = ((fillColor >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((fillColor >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((fillColor >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | fillColor & 255 & 255;
					}
				}
				switch(format1) {
				case 2:
					data[nextPointOffset] = fillColor >> 8 & 255;
					data[nextPointOffset + 1] = fillColor >> 16 & 255;
					data[nextPointOffset + 2] = fillColor >> 24 & 255;
					data[nextPointOffset + 3] = fillColor & 255;
					break;
				case 0:
					data[nextPointOffset] = fillColor >> 24 & 255;
					data[nextPointOffset + 1] = fillColor >> 16 & 255;
					data[nextPointOffset + 2] = fillColor >> 8 & 255;
					data[nextPointOffset + 3] = fillColor & 255;
					break;
				case 1:
					data[nextPointOffset] = fillColor & 255;
					data[nextPointOffset + 1] = fillColor >> 24 & 255;
					data[nextPointOffset + 2] = fillColor >> 16 & 255;
					data[nextPointOffset + 3] = fillColor >> 8 & 255;
					break;
				}
				queue.push(nextPointX);
				queue.push(nextPointY);
			}
		}
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.getColorBoundsRect = function(image,mask,color,findColor,format) {
	if(findColor == null) findColor = true;
	var left = image.width + 1;
	var right = 0;
	var top = image.height + 1;
	var bottom = 0;
	var _color;
	var _mask;
	switch(format) {
	case 1:
		{
			var argb = color;
			var rgba = 0;
			rgba = (argb >> 16 & 255 & 255) << 24 | (argb >> 8 & 255 & 255) << 16 | (argb & 255 & 255) << 8 | argb >> 24 & 255 & 255;
			_color = rgba;
		}
		{
			var argb1 = mask;
			var rgba1 = 0;
			rgba1 = (argb1 >> 16 & 255 & 255) << 24 | (argb1 >> 8 & 255 & 255) << 16 | (argb1 & 255 & 255) << 8 | argb1 >> 24 & 255 & 255;
			_mask = rgba1;
		}
		break;
	case 2:
		{
			var bgra = color;
			var rgba2 = 0;
			rgba2 = (bgra >> 8 & 255 & 255) << 24 | (bgra >> 16 & 255 & 255) << 16 | (bgra >> 24 & 255 & 255) << 8 | bgra & 255 & 255;
			_color = rgba2;
		}
		{
			var bgra1 = mask;
			var rgba3 = 0;
			rgba3 = (bgra1 >> 8 & 255 & 255) << 24 | (bgra1 >> 16 & 255 & 255) << 16 | (bgra1 >> 24 & 255 & 255) << 8 | bgra1 & 255 & 255;
			_mask = rgba3;
		}
		break;
	default:
		_color = color;
		_mask = mask;
	}
	if(!image.get_transparent()) {
		_color = (_color >> 24 & 255 & 255) << 24 | (_color >> 16 & 255 & 255) << 16 | (_color >> 8 & 255 & 255) << 8 | 255;
		255;
		_mask = (_mask >> 24 & 255 & 255) << 24 | (_mask >> 16 & 255 & 255) << 16 | (_mask >> 8 & 255 & 255) << 8 | 255;
		255;
	}
	var pixel;
	var hit;
	var _g1 = 0;
	var _g = image.width;
	while(_g1 < _g) {
		var x = _g1++;
		hit = false;
		var _g3 = 0;
		var _g2 = image.height;
		while(_g3 < _g2) {
			var y = _g3++;
			pixel = image.getPixel32(x,y,0);
			if(findColor) hit = (pixel & _mask) == _color; else hit = (pixel & _mask) != _color;
			if(hit) {
				if(x < left) left = x;
				break;
			}
		}
		if(hit) break;
	}
	var ix;
	var _g11 = 0;
	var _g4 = image.width;
	while(_g11 < _g4) {
		var x1 = _g11++;
		ix = image.width - 1 - x1;
		hit = false;
		var _g31 = 0;
		var _g21 = image.height;
		while(_g31 < _g21) {
			var y1 = _g31++;
			pixel = image.getPixel32(ix,y1,0);
			if(findColor) hit = (pixel & _mask) == _color; else hit = (pixel & _mask) != _color;
			if(hit) {
				if(ix > right) right = ix;
				break;
			}
		}
		if(hit) break;
	}
	var _g12 = 0;
	var _g5 = image.height;
	while(_g12 < _g5) {
		var y2 = _g12++;
		hit = false;
		var _g32 = 0;
		var _g22 = image.width;
		while(_g32 < _g22) {
			var x2 = _g32++;
			pixel = image.getPixel32(x2,y2,0);
			if(findColor) hit = (pixel & _mask) == _color; else hit = (pixel & _mask) != _color;
			if(hit) {
				if(y2 < top) top = y2;
				break;
			}
		}
		if(hit) break;
	}
	var iy;
	var _g13 = 0;
	var _g6 = image.height;
	while(_g13 < _g6) {
		var y3 = _g13++;
		iy = image.height - 1 - y3;
		hit = false;
		var _g33 = 0;
		var _g23 = image.width;
		while(_g33 < _g23) {
			var x3 = _g33++;
			pixel = image.getPixel32(x3,iy,0);
			if(findColor) hit = (pixel & _mask) == _color; else hit = (pixel & _mask) != _color;
			if(hit) {
				if(iy > bottom) bottom = iy;
				break;
			}
		}
		if(hit) break;
	}
	var w = right - left;
	var h = bottom - top;
	if(w > 0) w++;
	if(h > 0) h++;
	if(w < 0) w = 0;
	if(h < 0) h = 0;
	if(left == right) w = 1;
	if(top == bottom) h = 1;
	if(left > image.width) left = 0;
	if(top > image.height) top = 0;
	return new lime_math_Rectangle(left,top,w,h);
};
lime_graphics_utils_ImageDataUtil.getPixel = function(image,x,y,format) {
	var pixel;
	var data = image.buffer.data;
	var offset = 4 * (y + image.offsetY) * image.buffer.width + (x + image.offsetX) * 4;
	switch(image.buffer.format) {
	case 2:
		pixel = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 0:
		pixel = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 1:
		pixel = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
		break;
	}
	if(image.buffer.premultiplied) {
		if((pixel & 255) != 0 && (pixel & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (pixel & 255);
			var r;
			var idx = Math.round((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
			var g;
			var idx1 = Math.round((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
			var b;
			var idx2 = Math.round((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
			pixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | pixel & 255 & 255;
		}
	}
	pixel = (pixel >> 24 & 255 & 255) << 24 | (pixel >> 16 & 255 & 255) << 16 | (pixel >> 8 & 255 & 255) << 8 | 0;
	0;
	switch(format) {
	case 1:
		return (function($this) {
			var $r;
			var argb = 0;
			argb = (pixel & 255 & 255) << 24 | (pixel >> 24 & 255 & 255) << 16 | (pixel >> 16 & 255 & 255) << 8 | pixel >> 8 & 255 & 255;
			$r = argb;
			return $r;
		}(this));
	case 2:
		return (function($this) {
			var $r;
			var bgra = 0;
			bgra = (pixel >> 8 & 255 & 255) << 24 | (pixel >> 16 & 255 & 255) << 16 | (pixel >> 24 & 255 & 255) << 8 | pixel & 255 & 255;
			$r = bgra;
			return $r;
		}(this));
	default:
		return pixel;
	}
};
lime_graphics_utils_ImageDataUtil.getPixel32 = function(image,x,y,format) {
	var pixel;
	var data = image.buffer.data;
	var offset = 4 * (y + image.offsetY) * image.buffer.width + (x + image.offsetX) * 4;
	switch(image.buffer.format) {
	case 2:
		pixel = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 0:
		pixel = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 1:
		pixel = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
		break;
	}
	if(image.buffer.premultiplied) {
		if((pixel & 255) != 0 && (pixel & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (pixel & 255);
			var r;
			var idx = Math.round((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
			var g;
			var idx1 = Math.round((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
			var b;
			var idx2 = Math.round((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
			pixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | pixel & 255 & 255;
		}
	}
	switch(format) {
	case 1:
		return (function($this) {
			var $r;
			var argb = 0;
			argb = (pixel & 255 & 255) << 24 | (pixel >> 24 & 255 & 255) << 16 | (pixel >> 16 & 255 & 255) << 8 | pixel >> 8 & 255 & 255;
			$r = argb;
			return $r;
		}(this));
	case 2:
		return (function($this) {
			var $r;
			var bgra = 0;
			bgra = (pixel >> 8 & 255 & 255) << 24 | (pixel >> 16 & 255 & 255) << 16 | (pixel >> 24 & 255 & 255) << 8 | pixel & 255 & 255;
			$r = bgra;
			return $r;
		}(this));
	default:
		return pixel;
	}
};
lime_graphics_utils_ImageDataUtil.getPixels = function(image,rect,format) {
	if(image.buffer.data == null) return null;
	var length = rect.width * rect.height | 0;
	var bytes = haxe_io_Bytes.alloc(length * 4);
	var data = image.buffer.data;
	var sourceFormat = image.buffer.format;
	var premultiplied = image.buffer.premultiplied;
	var dataView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(image,rect);
	var position;
	var argb;
	var bgra;
	var pixel;
	var destPosition = 0;
	var _g1 = 0;
	var _g = dataView.height;
	while(_g1 < _g) {
		var y = _g1++;
		position = dataView.offset + dataView.stride * y;
		var _g3 = 0;
		var _g2 = dataView.width;
		while(_g3 < _g2) {
			var x = _g3++;
			switch(sourceFormat) {
			case 2:
				pixel = (data[position + 2] & 255) << 24 | (data[position + 1] & 255) << 16 | (data[position] & 255) << 8 | data[position + 3] & 255;
				break;
			case 0:
				pixel = (data[position] & 255) << 24 | (data[position + 1] & 255) << 16 | (data[position + 2] & 255) << 8 | data[position + 3] & 255;
				break;
			case 1:
				pixel = (data[position + 1] & 255) << 24 | (data[position + 2] & 255) << 16 | (data[position + 3] & 255) << 8 | data[position] & 255;
				break;
			}
			if(premultiplied) {
				if((pixel & 255) != 0 && (pixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (pixel & 255);
					var r;
					var idx = Math.round((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
					var g;
					var idx1 = Math.round((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
					var b;
					var idx2 = Math.round((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
					pixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | pixel & 255 & 255;
				}
			}
			switch(format) {
			case 1:
				{
					var argb1 = 0;
					argb1 = (pixel & 255 & 255) << 24 | (pixel >> 24 & 255 & 255) << 16 | (pixel >> 16 & 255 & 255) << 8 | pixel >> 8 & 255 & 255;
					argb = argb1;
				}
				pixel = argb;
				break;
			case 2:
				{
					var bgra1 = 0;
					bgra1 = (pixel >> 8 & 255 & 255) << 24 | (pixel >> 16 & 255 & 255) << 16 | (pixel >> 24 & 255 & 255) << 8 | pixel & 255 & 255;
					bgra = bgra1;
				}
				pixel = bgra;
				break;
			default:
			}
			bytes.set(destPosition++,pixel >> 24 & 255);
			bytes.set(destPosition++,pixel >> 16 & 255);
			bytes.set(destPosition++,pixel >> 8 & 255);
			bytes.set(destPosition++,pixel & 255);
			position += 4;
		}
	}
	return bytes;
};
lime_graphics_utils_ImageDataUtil.merge = function(image,sourceImage,sourceRect,destPoint,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	if(image.buffer.data == null || sourceImage.buffer.data == null) return;
	var sourceView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(sourceImage,sourceRect);
	var destView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(image,new lime_math_Rectangle(destPoint.x,destPoint.y,sourceView.width,sourceView.height));
	var sourceData = sourceImage.buffer.data;
	var destData = image.buffer.data;
	var sourceFormat = sourceImage.buffer.format;
	var destFormat = image.buffer.format;
	var sourcePremultiplied = sourceImage.buffer.premultiplied;
	var destPremultiplied = image.buffer.premultiplied;
	var sourcePosition;
	var destPosition;
	var sourcePixel;
	var destPixel;
	var _g1 = 0;
	var _g = destView.height;
	while(_g1 < _g) {
		var y = _g1++;
		sourcePosition = sourceView.offset + sourceView.stride * y;
		destPosition = destView.offset + destView.stride * y;
		var _g3 = 0;
		var _g2 = destView.width;
		while(_g3 < _g2) {
			var x = _g3++;
			switch(sourceFormat) {
			case 2:
				sourcePixel = (sourceData[sourcePosition + 2] & 255) << 24 | (sourceData[sourcePosition + 1] & 255) << 16 | (sourceData[sourcePosition] & 255) << 8 | sourceData[sourcePosition + 3] & 255;
				break;
			case 0:
				sourcePixel = (sourceData[sourcePosition] & 255) << 24 | (sourceData[sourcePosition + 1] & 255) << 16 | (sourceData[sourcePosition + 2] & 255) << 8 | sourceData[sourcePosition + 3] & 255;
				break;
			case 1:
				sourcePixel = (sourceData[sourcePosition + 1] & 255) << 24 | (sourceData[sourcePosition + 2] & 255) << 16 | (sourceData[sourcePosition + 3] & 255) << 8 | sourceData[sourcePosition] & 255;
				break;
			}
			if(sourcePremultiplied) {
				if((sourcePixel & 255) != 0 && (sourcePixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (sourcePixel & 255);
					var r;
					var idx = Math.round((sourcePixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
					var g;
					var idx1 = Math.round((sourcePixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
					var b;
					var idx2 = Math.round((sourcePixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
					sourcePixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | sourcePixel & 255 & 255;
				}
			}
			switch(destFormat) {
			case 2:
				destPixel = (destData[destPosition + 2] & 255) << 24 | (destData[destPosition + 1] & 255) << 16 | (destData[destPosition] & 255) << 8 | destData[destPosition + 3] & 255;
				break;
			case 0:
				destPixel = (destData[destPosition] & 255) << 24 | (destData[destPosition + 1] & 255) << 16 | (destData[destPosition + 2] & 255) << 8 | destData[destPosition + 3] & 255;
				break;
			case 1:
				destPixel = (destData[destPosition + 1] & 255) << 24 | (destData[destPosition + 2] & 255) << 16 | (destData[destPosition + 3] & 255) << 8 | destData[destPosition] & 255;
				break;
			}
			if(destPremultiplied) {
				if((destPixel & 255) != 0 && (destPixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (destPixel & 255);
					var r1;
					var idx3 = Math.round((destPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					r1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx3];
					var g1;
					var idx4 = Math.round((destPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					g1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx4];
					var b1;
					var idx5 = Math.round((destPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					b1 = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx5];
					destPixel = (r1 & 255) << 24 | (g1 & 255) << 16 | (b1 & 255) << 8 | destPixel & 255 & 255;
				}
			}
			var value = ((sourcePixel >> 24 & 255) * redMultiplier + (destPixel >> 24 & 255) * (256 - redMultiplier)) / 256 | 0;
			destPixel = (value & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | destPixel & 255 & 255;
			value;
			var value1 = ((sourcePixel >> 16 & 255) * greenMultiplier + (destPixel >> 16 & 255) * (256 - greenMultiplier)) / 256 | 0;
			destPixel = (destPixel >> 24 & 255 & 255) << 24 | (value1 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | destPixel & 255 & 255;
			value1;
			var value2 = ((sourcePixel >> 8 & 255) * blueMultiplier + (destPixel >> 8 & 255) * (256 - blueMultiplier)) / 256 | 0;
			destPixel = (destPixel >> 24 & 255 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (value2 & 255) << 8 | destPixel & 255 & 255;
			value2;
			var value3 = ((sourcePixel & 255) * alphaMultiplier + (destPixel & 255) * (256 - alphaMultiplier)) / 256 | 0;
			destPixel = (destPixel >> 24 & 255 & 255) << 24 | (destPixel >> 16 & 255 & 255) << 16 | (destPixel >> 8 & 255 & 255) << 8 | value3 & 255;
			value3;
			if(destPremultiplied) {
				if((destPixel & 255) == 0) {
					if(destPixel != 0) destPixel = 0;
				} else if((destPixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[destPixel & 255];
					destPixel = ((destPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((destPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((destPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | destPixel & 255 & 255;
				}
			}
			switch(destFormat) {
			case 2:
				destData[destPosition] = destPixel >> 8 & 255;
				destData[destPosition + 1] = destPixel >> 16 & 255;
				destData[destPosition + 2] = destPixel >> 24 & 255;
				destData[destPosition + 3] = destPixel & 255;
				break;
			case 0:
				destData[destPosition] = destPixel >> 24 & 255;
				destData[destPosition + 1] = destPixel >> 16 & 255;
				destData[destPosition + 2] = destPixel >> 8 & 255;
				destData[destPosition + 3] = destPixel & 255;
				break;
			case 1:
				destData[destPosition] = destPixel & 255;
				destData[destPosition + 1] = destPixel >> 24 & 255;
				destData[destPosition + 2] = destPixel >> 16 & 255;
				destData[destPosition + 3] = destPixel >> 8 & 255;
				break;
			}
			sourcePosition += 4;
			destPosition += 4;
		}
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.multiplyAlpha = function(image) {
	var data = image.buffer.data;
	if(data == null || !image.buffer.transparent) return;
	var format = image.buffer.format;
	var length = data.length / 4 | 0;
	var pixel;
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		var offset = i * 4;
		switch(format) {
		case 2:
			pixel = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
			break;
		case 0:
			pixel = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
			break;
		case 1:
			pixel = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
			break;
		}
		var offset1 = i * 4;
		if((pixel & 255) == 0) {
			if(pixel != 0) pixel = 0;
		} else if((pixel & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[pixel & 255];
			pixel = ((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | pixel & 255 & 255;
		}
		switch(format) {
		case 2:
			data[offset1] = pixel >> 8 & 255;
			data[offset1 + 1] = pixel >> 16 & 255;
			data[offset1 + 2] = pixel >> 24 & 255;
			data[offset1 + 3] = pixel & 255;
			break;
		case 0:
			data[offset1] = pixel >> 24 & 255;
			data[offset1 + 1] = pixel >> 16 & 255;
			data[offset1 + 2] = pixel >> 8 & 255;
			data[offset1 + 3] = pixel & 255;
			break;
		case 1:
			data[offset1] = pixel & 255;
			data[offset1 + 1] = pixel >> 24 & 255;
			data[offset1 + 2] = pixel >> 16 & 255;
			data[offset1 + 3] = pixel >> 8 & 255;
			break;
		}
	}
	image.buffer.premultiplied = true;
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.resize = function(image,newWidth,newHeight) {
	var buffer = image.buffer;
	if(buffer.width == newWidth && buffer.height == newHeight) return;
	var newBuffer = new lime_graphics_ImageBuffer((function($this) {
		var $r;
		var elements = newWidth * newHeight * 4;
		var this1;
		if(elements != null) this1 = new Uint8Array(elements); else this1 = null;
		$r = this1;
		return $r;
	}(this)),newWidth,newHeight);
	var imageWidth = image.width;
	var imageHeight = image.height;
	var data = image.get_data();
	var newData = newBuffer.data;
	var sourceIndex;
	var sourceIndexX;
	var sourceIndexY;
	var sourceIndexXY;
	var index;
	var sourceX;
	var sourceY;
	var u;
	var v;
	var uRatio;
	var vRatio;
	var uOpposite;
	var vOpposite;
	var _g = 0;
	while(_g < newHeight) {
		var y = _g++;
		var _g1 = 0;
		while(_g1 < newWidth) {
			var x = _g1++;
			u = (x + 0.5) / newWidth * imageWidth - 0.5;
			v = (y + 0.5) / newHeight * imageHeight - 0.5;
			sourceX = u | 0;
			sourceY = v | 0;
			sourceIndex = (sourceY * imageWidth + sourceX) * 4;
			if(sourceX < imageWidth - 1) sourceIndexX = sourceIndex + 4; else sourceIndexX = sourceIndex;
			if(sourceY < imageHeight - 1) sourceIndexY = sourceIndex + imageWidth * 4; else sourceIndexY = sourceIndex;
			if(sourceIndexX != sourceIndex) sourceIndexXY = sourceIndexY + 4; else sourceIndexXY = sourceIndexY;
			index = (y * newWidth + x) * 4;
			uRatio = u - sourceX;
			vRatio = v - sourceY;
			uOpposite = 1 - uRatio;
			vOpposite = 1 - vRatio;
			var val = Std["int"]((_$UInt_UInt_$Impl_$.toFloat(data[sourceIndex]) * uOpposite + _$UInt_UInt_$Impl_$.toFloat(data[sourceIndexX]) * uRatio) * vOpposite + (_$UInt_UInt_$Impl_$.toFloat(data[sourceIndexY]) * uOpposite + _$UInt_UInt_$Impl_$.toFloat(data[sourceIndexXY]) * uRatio) * vRatio);
			newData[index] = val;
			var val1 = Std["int"]((_$UInt_UInt_$Impl_$.toFloat(data[sourceIndex + 1]) * uOpposite + _$UInt_UInt_$Impl_$.toFloat(data[sourceIndexX + 1]) * uRatio) * vOpposite + (_$UInt_UInt_$Impl_$.toFloat(data[sourceIndexY + 1]) * uOpposite + _$UInt_UInt_$Impl_$.toFloat(data[sourceIndexXY + 1]) * uRatio) * vRatio);
			newData[index + 1] = val1;
			var val2 = Std["int"]((_$UInt_UInt_$Impl_$.toFloat(data[sourceIndex + 2]) * uOpposite + _$UInt_UInt_$Impl_$.toFloat(data[sourceIndexX + 2]) * uRatio) * vOpposite + (_$UInt_UInt_$Impl_$.toFloat(data[sourceIndexY + 2]) * uOpposite + _$UInt_UInt_$Impl_$.toFloat(data[sourceIndexXY + 2]) * uRatio) * vRatio);
			newData[index + 2] = val2;
			if(data[sourceIndexX + 3] == 0 || data[sourceIndexY + 3] == 0 || data[sourceIndexXY + 3] == 0) newData[index + 3] = 0; else newData[index + 3] = data[sourceIndex + 3];
		}
	}
	buffer.data = newBuffer.data;
	buffer.width = newWidth;
	buffer.height = newHeight;
};
lime_graphics_utils_ImageDataUtil.resizeBuffer = function(image,newWidth,newHeight) {
	var buffer = image.buffer;
	var data = image.get_data();
	var newData;
	var elements = newWidth * newHeight * 4;
	var this1;
	if(elements != null) this1 = new Uint8Array(elements); else this1 = null;
	newData = this1;
	var sourceIndex;
	var index;
	var _g1 = 0;
	var _g = buffer.height;
	while(_g1 < _g) {
		var y = _g1++;
		var _g3 = 0;
		var _g2 = buffer.width;
		while(_g3 < _g2) {
			var x = _g3++;
			sourceIndex = (y * buffer.width + x) * 4;
			index = (y * newWidth + x) * 4;
			newData[index] = data[sourceIndex];
			newData[index + 1] = data[sourceIndex + 1];
			newData[index + 2] = data[sourceIndex + 2];
			newData[index + 3] = data[sourceIndex + 3];
		}
	}
	buffer.data = newData;
	buffer.width = newWidth;
	buffer.height = newHeight;
};
lime_graphics_utils_ImageDataUtil.setFormat = function(image,format) {
	var data = image.buffer.data;
	if(data == null) return;
	var index;
	var a16;
	var length = data.length / 4 | 0;
	var r1;
	var g1;
	var b1;
	var a1;
	var r2;
	var g2;
	var b2;
	var a2;
	var r;
	var g;
	var b;
	var a;
	var _g = image.get_format();
	switch(_g) {
	case 0:
		r1 = 0;
		g1 = 1;
		b1 = 2;
		a1 = 3;
		break;
	case 1:
		r1 = 1;
		g1 = 2;
		b1 = 3;
		a1 = 0;
		break;
	case 2:
		r1 = 2;
		g1 = 1;
		b1 = 0;
		a1 = 3;
		break;
	}
	switch(format) {
	case 0:
		r2 = 0;
		g2 = 1;
		b2 = 2;
		a2 = 3;
		break;
	case 1:
		r2 = 1;
		g2 = 2;
		b2 = 3;
		a2 = 0;
		break;
	case 2:
		r2 = 2;
		g2 = 1;
		b2 = 0;
		a2 = 3;
		break;
	}
	var _g1 = 0;
	while(_g1 < length) {
		var i = _g1++;
		index = i * 4;
		r = data[index + r1];
		g = data[index + g1];
		b = data[index + b1];
		a = data[index + a1];
		data[index + r2] = r;
		data[index + g2] = g;
		data[index + b2] = b;
		data[index + a2] = a;
	}
	image.buffer.format = format;
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.setPixel = function(image,x,y,color,format) {
	var pixel;
	switch(format) {
	case 1:
		{
			var argb = color;
			var rgba = 0;
			rgba = (argb >> 16 & 255 & 255) << 24 | (argb >> 8 & 255 & 255) << 16 | (argb & 255 & 255) << 8 | argb >> 24 & 255 & 255;
			pixel = rgba;
		}
		break;
	case 2:
		{
			var bgra = color;
			var rgba1 = 0;
			rgba1 = (bgra >> 8 & 255 & 255) << 24 | (bgra >> 16 & 255 & 255) << 16 | (bgra >> 24 & 255 & 255) << 8 | bgra & 255 & 255;
			pixel = rgba1;
		}
		break;
	default:
		pixel = color;
	}
	var source = 0;
	var data = image.buffer.data;
	var offset = 4 * (y + image.offsetY) * image.buffer.width + (x + image.offsetX) * 4;
	switch(image.buffer.format) {
	case 2:
		source = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 0:
		source = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 1:
		source = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
		break;
	}
	if(image.buffer.premultiplied) {
		if((source & 255) != 0 && (source & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (source & 255);
			var r;
			var idx = Math.round((source >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
			var g;
			var idx1 = Math.round((source >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
			var b;
			var idx2 = Math.round((source >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
			source = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | source & 255 & 255;
		}
	}
	var value = source & 255;
	pixel = (pixel >> 24 & 255 & 255) << 24 | (pixel >> 16 & 255 & 255) << 16 | (pixel >> 8 & 255 & 255) << 8 | value & 255;
	value;
	var data1 = image.buffer.data;
	var offset1 = 4 * (y + image.offsetY) * image.buffer.width + (x + image.offsetX) * 4;
	if(image.buffer.premultiplied) {
		if((pixel & 255) == 0) {
			if(pixel != 0) pixel = 0;
		} else if((pixel & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[pixel & 255];
			pixel = ((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | pixel & 255 & 255;
		}
	}
	switch(image.buffer.format) {
	case 2:
		data1[offset1] = pixel >> 8 & 255;
		data1[offset1 + 1] = pixel >> 16 & 255;
		data1[offset1 + 2] = pixel >> 24 & 255;
		data1[offset1 + 3] = pixel & 255;
		break;
	case 0:
		data1[offset1] = pixel >> 24 & 255;
		data1[offset1 + 1] = pixel >> 16 & 255;
		data1[offset1 + 2] = pixel >> 8 & 255;
		data1[offset1 + 3] = pixel & 255;
		break;
	case 1:
		data1[offset1] = pixel & 255;
		data1[offset1 + 1] = pixel >> 24 & 255;
		data1[offset1 + 2] = pixel >> 16 & 255;
		data1[offset1 + 3] = pixel >> 8 & 255;
		break;
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.setPixel32 = function(image,x,y,color,format) {
	var pixel;
	switch(format) {
	case 1:
		{
			var argb = color;
			var rgba = 0;
			rgba = (argb >> 16 & 255 & 255) << 24 | (argb >> 8 & 255 & 255) << 16 | (argb & 255 & 255) << 8 | argb >> 24 & 255 & 255;
			pixel = rgba;
		}
		break;
	case 2:
		{
			var bgra = color;
			var rgba1 = 0;
			rgba1 = (bgra >> 8 & 255 & 255) << 24 | (bgra >> 16 & 255 & 255) << 16 | (bgra >> 24 & 255 & 255) << 8 | bgra & 255 & 255;
			pixel = rgba1;
		}
		break;
	default:
		pixel = color;
	}
	if(!image.get_transparent()) {
		pixel = (pixel >> 24 & 255 & 255) << 24 | (pixel >> 16 & 255 & 255) << 16 | (pixel >> 8 & 255 & 255) << 8 | 255;
		255;
	}
	var data = image.buffer.data;
	var offset = 4 * (y + image.offsetY) * image.buffer.width + (x + image.offsetX) * 4;
	if(image.buffer.premultiplied) {
		if((pixel & 255) == 0) {
			if(pixel != 0) pixel = 0;
		} else if((pixel & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[pixel & 255];
			pixel = ((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | pixel & 255 & 255;
		}
	}
	switch(image.buffer.format) {
	case 2:
		data[offset] = pixel >> 8 & 255;
		data[offset + 1] = pixel >> 16 & 255;
		data[offset + 2] = pixel >> 24 & 255;
		data[offset + 3] = pixel & 255;
		break;
	case 0:
		data[offset] = pixel >> 24 & 255;
		data[offset + 1] = pixel >> 16 & 255;
		data[offset + 2] = pixel >> 8 & 255;
		data[offset + 3] = pixel & 255;
		break;
	case 1:
		data[offset] = pixel & 255;
		data[offset + 1] = pixel >> 24 & 255;
		data[offset + 2] = pixel >> 16 & 255;
		data[offset + 3] = pixel >> 8 & 255;
		break;
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.setPixels = function(image,rect,bytes,format) {
	if(image.buffer.data == null) return;
	var data = image.buffer.data;
	var sourceFormat = image.buffer.format;
	var premultiplied = image.buffer.premultiplied;
	var dataView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(image,rect);
	var row;
	var color;
	var pixel;
	var transparent = image.get_transparent();
	var dataPosition = 0;
	var _g1 = 0;
	var _g = dataView.height;
	while(_g1 < _g) {
		var y = _g1++;
		row = dataView.offset + dataView.stride * y;
		var _g3 = 0;
		var _g2 = dataView.width;
		while(_g3 < _g2) {
			var x = _g3++;
			color = bytes.b[dataPosition + 3] | bytes.b[dataPosition + 2] << 8 | bytes.b[dataPosition + 1] << 16 | bytes.b[dataPosition] << 24;
			dataPosition += 4;
			switch(format) {
			case 1:
				{
					var argb = color;
					var rgba = 0;
					rgba = (argb >> 16 & 255 & 255) << 24 | (argb >> 8 & 255 & 255) << 16 | (argb & 255 & 255) << 8 | argb >> 24 & 255 & 255;
					pixel = rgba;
				}
				break;
			case 2:
				{
					var bgra = color;
					var rgba1 = 0;
					rgba1 = (bgra >> 8 & 255 & 255) << 24 | (bgra >> 16 & 255 & 255) << 16 | (bgra >> 24 & 255 & 255) << 8 | bgra & 255 & 255;
					pixel = rgba1;
				}
				break;
			default:
				pixel = color;
			}
			if(!transparent) {
				pixel = (pixel >> 24 & 255 & 255) << 24 | (pixel >> 16 & 255 & 255) << 16 | (pixel >> 8 & 255 & 255) << 8 | 255;
				255;
			}
			var offset = row + x * 4;
			if(premultiplied) {
				if((pixel & 255) == 0) {
					if(pixel != 0) pixel = 0;
				} else if((pixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[pixel & 255];
					pixel = ((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | pixel & 255 & 255;
				}
			}
			switch(sourceFormat) {
			case 2:
				data[offset] = pixel >> 8 & 255;
				data[offset + 1] = pixel >> 16 & 255;
				data[offset + 2] = pixel >> 24 & 255;
				data[offset + 3] = pixel & 255;
				break;
			case 0:
				data[offset] = pixel >> 24 & 255;
				data[offset + 1] = pixel >> 16 & 255;
				data[offset + 2] = pixel >> 8 & 255;
				data[offset + 3] = pixel & 255;
				break;
			case 1:
				data[offset] = pixel & 255;
				data[offset + 1] = pixel >> 24 & 255;
				data[offset + 2] = pixel >> 16 & 255;
				data[offset + 3] = pixel >> 8 & 255;
				break;
			}
		}
	}
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.threshold = function(image,sourceImage,sourceRect,destPoint,operation,threshold,color,mask,copySource,format) {
	var _color;
	var _mask;
	var _threshold;
	switch(format) {
	case 1:
		{
			var argb = color;
			var rgba = 0;
			rgba = (argb >> 16 & 255 & 255) << 24 | (argb >> 8 & 255 & 255) << 16 | (argb & 255 & 255) << 8 | argb >> 24 & 255 & 255;
			_color = rgba;
		}
		{
			var argb1 = mask;
			var rgba1 = 0;
			rgba1 = (argb1 >> 16 & 255 & 255) << 24 | (argb1 >> 8 & 255 & 255) << 16 | (argb1 & 255 & 255) << 8 | argb1 >> 24 & 255 & 255;
			_mask = rgba1;
		}
		{
			var argb2 = threshold;
			var rgba2 = 0;
			rgba2 = (argb2 >> 16 & 255 & 255) << 24 | (argb2 >> 8 & 255 & 255) << 16 | (argb2 & 255 & 255) << 8 | argb2 >> 24 & 255 & 255;
			_threshold = rgba2;
		}
		break;
	case 2:
		{
			var bgra = color;
			var rgba3 = 0;
			rgba3 = (bgra >> 8 & 255 & 255) << 24 | (bgra >> 16 & 255 & 255) << 16 | (bgra >> 24 & 255 & 255) << 8 | bgra & 255 & 255;
			_color = rgba3;
		}
		{
			var bgra1 = mask;
			var rgba4 = 0;
			rgba4 = (bgra1 >> 8 & 255 & 255) << 24 | (bgra1 >> 16 & 255 & 255) << 16 | (bgra1 >> 24 & 255 & 255) << 8 | bgra1 & 255 & 255;
			_mask = rgba4;
		}
		{
			var bgra2 = threshold;
			var rgba5 = 0;
			rgba5 = (bgra2 >> 8 & 255 & 255) << 24 | (bgra2 >> 16 & 255 & 255) << 16 | (bgra2 >> 24 & 255 & 255) << 8 | bgra2 & 255 & 255;
			_threshold = rgba5;
		}
		break;
	default:
		_color = color;
		_mask = mask;
		_threshold = threshold;
	}
	var _operation;
	switch(operation) {
	case "!=":
		_operation = 0;
		break;
	case "==":
		_operation = 1;
		break;
	case "<":
		_operation = 2;
		break;
	case "<=":
		_operation = 3;
		break;
	case ">":
		_operation = 4;
		break;
	case ">=":
		_operation = 5;
		break;
	default:
		_operation = -1;
	}
	if(_operation == -1) return 0;
	var srcData = sourceImage.buffer.data;
	var destData = image.buffer.data;
	if(srcData == null || destData == null) return 0;
	var hits = 0;
	var srcView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(sourceImage,sourceRect);
	var destView = new lime_graphics_utils__$ImageDataUtil_ImageDataView(image,new lime_math_Rectangle(destPoint.x,destPoint.y,srcView.width,srcView.height));
	var srcFormat = sourceImage.buffer.format;
	var destFormat = image.buffer.format;
	var srcPremultiplied = sourceImage.buffer.premultiplied;
	var destPremultiplied = image.buffer.premultiplied;
	var srcPosition;
	var destPosition;
	var srcPixel;
	var destPixel;
	var pixelMask;
	var test;
	var value;
	var _g1 = 0;
	var _g = destView.height;
	while(_g1 < _g) {
		var y = _g1++;
		srcPosition = srcView.offset + srcView.stride * y;
		destPosition = destView.offset + destView.stride * y;
		var _g3 = 0;
		var _g2 = destView.width;
		while(_g3 < _g2) {
			var x = _g3++;
			switch(srcFormat) {
			case 2:
				srcPixel = (srcData[srcPosition + 2] & 255) << 24 | (srcData[srcPosition + 1] & 255) << 16 | (srcData[srcPosition] & 255) << 8 | srcData[srcPosition + 3] & 255;
				break;
			case 0:
				srcPixel = (srcData[srcPosition] & 255) << 24 | (srcData[srcPosition + 1] & 255) << 16 | (srcData[srcPosition + 2] & 255) << 8 | srcData[srcPosition + 3] & 255;
				break;
			case 1:
				srcPixel = (srcData[srcPosition + 1] & 255) << 24 | (srcData[srcPosition + 2] & 255) << 16 | (srcData[srcPosition + 3] & 255) << 8 | srcData[srcPosition] & 255;
				break;
			}
			if(srcPremultiplied) {
				if((srcPixel & 255) != 0 && (srcPixel & 255) != 255) {
					lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (srcPixel & 255);
					var r;
					var idx = Math.round((srcPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
					var g;
					var idx1 = Math.round((srcPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
					var b;
					var idx2 = Math.round((srcPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
					b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
					srcPixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | srcPixel & 255 & 255;
				}
			}
			pixelMask = srcPixel & _mask;
			value = lime_graphics_utils_ImageDataUtil.__pixelCompare(pixelMask,_threshold);
			switch(_operation) {
			case 0:
				test = value != 0;
				break;
			case 1:
				test = value == 0;
				break;
			case 2:
				test = value == -1;
				break;
			case 3:
				test = value == 0 || value == -1;
				break;
			case 4:
				test = value == 1;
				break;
			case 5:
				test = value == 0 || value == 1;
				break;
			default:
				test = false;
			}
			if(test) {
				if(destPremultiplied) {
					if((_color & 255) == 0) {
						if(_color != 0) _color = 0;
					} else if((_color & 255) != 255) {
						lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[_color & 255];
						_color = ((_color >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((_color >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((_color >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | _color & 255 & 255;
					}
				}
				switch(destFormat) {
				case 2:
					destData[destPosition] = _color >> 8 & 255;
					destData[destPosition + 1] = _color >> 16 & 255;
					destData[destPosition + 2] = _color >> 24 & 255;
					destData[destPosition + 3] = _color & 255;
					break;
				case 0:
					destData[destPosition] = _color >> 24 & 255;
					destData[destPosition + 1] = _color >> 16 & 255;
					destData[destPosition + 2] = _color >> 8 & 255;
					destData[destPosition + 3] = _color & 255;
					break;
				case 1:
					destData[destPosition] = _color & 255;
					destData[destPosition + 1] = _color >> 24 & 255;
					destData[destPosition + 2] = _color >> 16 & 255;
					destData[destPosition + 3] = _color >> 8 & 255;
					break;
				}
				hits++;
			} else if(copySource) {
				if(destPremultiplied) {
					if((srcPixel & 255) == 0) {
						if(srcPixel != 0) srcPixel = 0;
					} else if((srcPixel & 255) != 255) {
						lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[srcPixel & 255];
						srcPixel = ((srcPixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((srcPixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((srcPixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | srcPixel & 255 & 255;
					}
				}
				switch(destFormat) {
				case 2:
					destData[destPosition] = srcPixel >> 8 & 255;
					destData[destPosition + 1] = srcPixel >> 16 & 255;
					destData[destPosition + 2] = srcPixel >> 24 & 255;
					destData[destPosition + 3] = srcPixel & 255;
					break;
				case 0:
					destData[destPosition] = srcPixel >> 24 & 255;
					destData[destPosition + 1] = srcPixel >> 16 & 255;
					destData[destPosition + 2] = srcPixel >> 8 & 255;
					destData[destPosition + 3] = srcPixel & 255;
					break;
				case 1:
					destData[destPosition] = srcPixel & 255;
					destData[destPosition + 1] = srcPixel >> 24 & 255;
					destData[destPosition + 2] = srcPixel >> 16 & 255;
					destData[destPosition + 3] = srcPixel >> 8 & 255;
					break;
				}
			}
			srcPosition += 4;
			destPosition += 4;
		}
	}
	if(hits > 0) image.dirty = true;
	return hits;
};
lime_graphics_utils_ImageDataUtil.unmultiplyAlpha = function(image) {
	var data = image.buffer.data;
	if(data == null) return;
	var format = image.buffer.format;
	var length = data.length / 4 | 0;
	var pixel;
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		var offset = i * 4;
		switch(format) {
		case 2:
			pixel = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
			break;
		case 0:
			pixel = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
			break;
		case 1:
			pixel = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
			break;
		}
		if((pixel & 255) != 0 && (pixel & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (pixel & 255);
			var r;
			var idx = Math.round((pixel >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
			var g;
			var idx1 = Math.round((pixel >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
			var b;
			var idx2 = Math.round((pixel >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
			pixel = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | pixel & 255 & 255;
		}
		var offset1 = i * 4;
		switch(format) {
		case 2:
			data[offset1] = pixel >> 8 & 255;
			data[offset1 + 1] = pixel >> 16 & 255;
			data[offset1 + 2] = pixel >> 24 & 255;
			data[offset1 + 3] = pixel & 255;
			break;
		case 0:
			data[offset1] = pixel >> 24 & 255;
			data[offset1 + 1] = pixel >> 16 & 255;
			data[offset1 + 2] = pixel >> 8 & 255;
			data[offset1 + 3] = pixel & 255;
			break;
		case 1:
			data[offset1] = pixel & 255;
			data[offset1 + 1] = pixel >> 24 & 255;
			data[offset1 + 2] = pixel >> 16 & 255;
			data[offset1 + 3] = pixel >> 8 & 255;
			break;
		}
	}
	image.buffer.premultiplied = false;
	image.dirty = true;
};
lime_graphics_utils_ImageDataUtil.__pixelCompare = function(n1,n2) {
	var tmp1;
	var tmp2;
	tmp1 = n1 >> 24 & 255;
	tmp2 = n2 >> 24 & 255;
	if(tmp1 != tmp2) if(tmp1 > tmp2) return 1; else return -1; else {
		tmp1 = n1 >> 16 & 255;
		tmp2 = n2 >> 16 & 255;
		if(tmp1 != tmp2) if(tmp1 > tmp2) return 1; else return -1; else {
			tmp1 = n1 >> 8 & 255;
			tmp2 = n2 >> 8 & 255;
			if(tmp1 != tmp2) if(tmp1 > tmp2) return 1; else return -1; else {
				tmp1 = n1 & 255;
				tmp2 = n2 & 255;
				if(tmp1 != tmp2) if(tmp1 > tmp2) return 1; else return -1; else return 0;
			}
		}
	}
};
var lime_graphics_utils__$ImageDataUtil_ImageDataView = function(image,rect) {
	this.image = image;
	if(rect == null) this.rect = image.get_rect(); else {
		if(rect.x < 0) rect.x = 0;
		if(rect.y < 0) rect.y = 0;
		if(rect.x + rect.width > image.width) rect.width = image.width - rect.x;
		if(rect.y + rect.height > image.height) rect.height = image.height - rect.y;
		if(rect.width < 0) rect.width = 0;
		if(rect.height < 0) rect.height = 0;
		this.rect = rect;
	}
	this.stride = image.buffer.get_stride();
	this.x = Math.ceil(this.rect.x);
	this.y = Math.ceil(this.rect.y);
	this.width = Math.floor(this.rect.width);
	this.height = Math.floor(this.rect.height);
	this.offset = this.stride * (this.y + image.offsetY) + (this.x + image.offsetX) * 4;
};
$hxClasses["lime.graphics.utils._ImageDataUtil.ImageDataView"] = lime_graphics_utils__$ImageDataUtil_ImageDataView;
lime_graphics_utils__$ImageDataUtil_ImageDataView.__name__ = true;
lime_graphics_utils__$ImageDataUtil_ImageDataView.prototype = {
	clip: function(x,y,width,height) {
		this.rect.__contract(x,y,width,height);
		this.x = Math.ceil(this.rect.x);
		this.y = Math.ceil(this.rect.y);
		this.width = Math.floor(this.rect.width);
		this.height = Math.floor(this.rect.height);
		this.offset = this.stride * (this.y + this.image.offsetY) + (this.x + this.image.offsetX) * 4;
	}
	,row: function(y) {
		return this.offset + this.stride * y;
	}
	,__class__: lime_graphics_utils__$ImageDataUtil_ImageDataView
};
var lime_math__$ColorMatrix_ColorMatrix_$Impl_$ = {};
$hxClasses["lime.math._ColorMatrix.ColorMatrix_Impl_"] = lime_math__$ColorMatrix_ColorMatrix_$Impl_$;
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.__name__ = true;
lime_math__$ColorMatrix_ColorMatrix_$Impl_$._new = function(data) {
	var this1;
	if(data != null && data.length == 20) this1 = data; else {
		var array = lime_math__$ColorMatrix_ColorMatrix_$Impl_$.__identity;
		var this2;
		if(array != null) this2 = new Float32Array(array); else this2 = null;
		this1 = this2;
	}
	return this1;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.clone = function(this1) {
	return lime_math__$ColorMatrix_ColorMatrix_$Impl_$._new((function($this) {
		var $r;
		var this2;
		if(this1 != null) this2 = new Float32Array(this1); else this2 = null;
		$r = this2;
		return $r;
	}(this)));
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.concat = function(this1,second) {
	var _g = this1;
	_g[0] = _g[0] + second[0];
	var _g1 = this1;
	_g1[6] = _g1[6] + second[6];
	var _g2 = this1;
	_g2[12] = _g2[12] + second[12];
	var _g3 = this1;
	_g3[18] = _g3[18] + second[18];
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.copyFrom = function(this1,other) {
	this1.set(other);
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.identity = function(this1) {
	this1[0] = 1;
	this1[1] = 0;
	this1[2] = 0;
	this1[3] = 0;
	this1[4] = 0;
	this1[5] = 0;
	this1[6] = 1;
	this1[7] = 0;
	this1[8] = 0;
	this1[9] = 0;
	this1[10] = 0;
	this1[11] = 0;
	this1[12] = 1;
	this1[13] = 0;
	this1[14] = 0;
	this1[15] = 0;
	this1[16] = 0;
	this1[17] = 0;
	this1[18] = 1;
	this1[19] = 0;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.getAlphaTable = function(this1) {
	var table;
	var this2;
	this2 = new Uint8Array(256);
	table = this2;
	var multiplier = this1[18];
	var offset = this1[19] * 255;
	var value;
	var _g = 0;
	while(_g < 256) {
		var i = _g++;
		value = Math.floor(i * multiplier + offset);
		if(value > 255) value = 255;
		if(value < 0) value = 0;
		table[i] = value;
	}
	return table;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.getBlueTable = function(this1) {
	var table;
	var this2;
	this2 = new Uint8Array(256);
	table = this2;
	var multiplier = this1[12];
	var offset = this1[14] * 255;
	var value;
	var _g = 0;
	while(_g < 256) {
		var i = _g++;
		value = Math.floor(i * multiplier + offset);
		if(value > 255) value = 255;
		if(value < 0) value = 0;
		table[i] = value;
	}
	return table;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.getGreenTable = function(this1) {
	var table;
	var this2;
	this2 = new Uint8Array(256);
	table = this2;
	var multiplier = this1[6];
	var offset = this1[9] * 255;
	var value;
	var _g = 0;
	while(_g < 256) {
		var i = _g++;
		value = Math.floor(i * multiplier + offset);
		if(value > 255) value = 255;
		if(value < 0) value = 0;
		table[i] = value;
	}
	return table;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.getRedTable = function(this1) {
	var table;
	var this2;
	this2 = new Uint8Array(256);
	table = this2;
	var multiplier = this1[0];
	var offset = this1[4] * 255;
	var value;
	var _g = 0;
	while(_g < 256) {
		var i = _g++;
		value = Math.floor(i * multiplier + offset);
		if(value > 255) value = 255;
		if(value < 0) value = 0;
		table[i] = value;
	}
	return table;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.__toFlashColorTransform = function(this1) {
	return null;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_alphaMultiplier = function(this1) {
	return this1[18];
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_alphaMultiplier = function(this1,value) {
	return this1[18] = value;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_alphaOffset = function(this1) {
	return this1[19] * 255;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_alphaOffset = function(this1,value) {
	return this1[19] = value / 255;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_blueMultiplier = function(this1) {
	return this1[12];
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_blueMultiplier = function(this1,value) {
	return this1[12] = value;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_blueOffset = function(this1) {
	return this1[14] * 255;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_blueOffset = function(this1,value) {
	return this1[14] = value / 255;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_color = function(this1) {
	return (this1[4] * 255 | 0) << 16 | (this1[9] * 255 | 0) << 8 | (this1[14] * 255 | 0);
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_color = function(this1,value) {
	this1[4] = (value >> 16 & 255) / 255;
	this1[9] = (value >> 8 & 255) / 255;
	this1[14] = (value & 255) / 255;
	this1[0] = 0;
	this1[6] = 0;
	this1[12] = 0;
	return lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_color(this1);
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_greenMultiplier = function(this1) {
	return this1[6];
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_greenMultiplier = function(this1,value) {
	return this1[6] = value;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_greenOffset = function(this1) {
	return this1[9] * 255;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_greenOffset = function(this1,value) {
	return this1[9] = value / 255;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_redMultiplier = function(this1) {
	return this1[0];
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_redMultiplier = function(this1,value) {
	return this1[0] = value;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get_redOffset = function(this1) {
	return this1[4] * 255;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set_redOffset = function(this1,value) {
	return this1[4] = value / 255;
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.get = function(this1,index) {
	return this1[index];
};
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.set = function(this1,index,value) {
	return this1[index] = value;
};
var lime_math_Matrix3 = function(a,b,c,d,tx,ty) {
	if(ty == null) ty = 0;
	if(tx == null) tx = 0;
	if(d == null) d = 1;
	if(c == null) c = 0;
	if(b == null) b = 0;
	if(a == null) a = 1;
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.tx = tx;
	this.ty = ty;
};
$hxClasses["lime.math.Matrix3"] = lime_math_Matrix3;
lime_math_Matrix3.__name__ = true;
lime_math_Matrix3.prototype = {
	clone: function() {
		return new lime_math_Matrix3(this.a,this.b,this.c,this.d,this.tx,this.ty);
	}
	,concat: function(m) {
		var a1 = this.a * m.a + this.b * m.c;
		this.b = this.a * m.b + this.b * m.d;
		this.a = a1;
		var c1 = this.c * m.a + this.d * m.c;
		this.d = this.c * m.b + this.d * m.d;
		this.c = c1;
		var tx1 = this.tx * m.a + this.ty * m.c + m.tx;
		this.ty = this.tx * m.b + this.ty * m.d + m.ty;
		this.tx = tx1;
	}
	,copyColumnFrom: function(column,vector4) {
		if(column > 2) throw new js__$Boot_HaxeError("Column " + column + " out of bounds (2)"); else if(column == 0) {
			this.a = vector4.x;
			this.c = vector4.y;
		} else if(column == 1) {
			this.b = vector4.x;
			this.d = vector4.y;
		} else {
			this.tx = vector4.x;
			this.ty = vector4.y;
		}
	}
	,copyColumnTo: function(column,vector4) {
		if(column > 2) throw new js__$Boot_HaxeError("Column " + column + " out of bounds (2)"); else if(column == 0) {
			vector4.x = this.a;
			vector4.y = this.c;
			vector4.z = 0;
		} else if(column == 1) {
			vector4.x = this.b;
			vector4.y = this.d;
			vector4.z = 0;
		} else {
			vector4.x = this.tx;
			vector4.y = this.ty;
			vector4.z = 1;
		}
	}
	,copyFrom: function(sourceMatrix3) {
		this.a = sourceMatrix3.a;
		this.b = sourceMatrix3.b;
		this.c = sourceMatrix3.c;
		this.d = sourceMatrix3.d;
		this.tx = sourceMatrix3.tx;
		this.ty = sourceMatrix3.ty;
	}
	,copyRowFrom: function(row,vector4) {
		if(row > 2) throw new js__$Boot_HaxeError("Row " + row + " out of bounds (2)"); else if(row == 0) {
			this.a = vector4.x;
			this.c = vector4.y;
		} else if(row == 1) {
			this.b = vector4.x;
			this.d = vector4.y;
		} else {
			this.tx = vector4.x;
			this.ty = vector4.y;
		}
	}
	,copyRowTo: function(row,vector4) {
		if(row > 2) throw new js__$Boot_HaxeError("Row " + row + " out of bounds (2)"); else if(row == 0) {
			vector4.x = this.a;
			vector4.y = this.b;
			vector4.z = this.tx;
		} else if(row == 1) {
			vector4.x = this.c;
			vector4.y = this.d;
			vector4.z = this.ty;
		} else {
			vector4.x = 0;
			vector4.y = 0;
			vector4.z = 1;
		}
	}
	,createBox: function(scaleX,scaleY,rotation,tx,ty) {
		if(ty == null) ty = 0;
		if(tx == null) tx = 0;
		if(rotation == null) rotation = 0;
		this.a = scaleX;
		this.d = scaleY;
		this.b = rotation;
		this.tx = tx;
		this.ty = ty;
	}
	,createGradientBox: function(width,height,rotation,tx,ty) {
		if(ty == null) ty = 0;
		if(tx == null) tx = 0;
		if(rotation == null) rotation = 0;
		this.a = width / 1638.4;
		this.d = height / 1638.4;
		if(rotation != 0) {
			var cos = Math.cos(rotation);
			var sin = Math.sin(rotation);
			this.b = sin * this.d;
			this.c = -sin * this.a;
			this.a *= cos;
			this.d *= cos;
		} else {
			this.b = 0;
			this.c = 0;
		}
		this.tx = tx + width / 2;
		this.ty = ty + height / 2;
	}
	,equals: function(Matrix3) {
		return Matrix3 != null && this.tx == Matrix3.tx && this.ty == Matrix3.ty && this.a == Matrix3.a && this.b == Matrix3.b && this.c == Matrix3.c && this.d == Matrix3.d;
	}
	,deltaTransformVector2: function(Vector2) {
		return new lime_math_Vector2(Vector2.x * this.a + Vector2.y * this.c,Vector2.x * this.b + Vector2.y * this.d);
	}
	,identity: function() {
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;
	}
	,invert: function() {
		var norm = this.a * this.d - this.b * this.c;
		if(norm == 0) {
			this.a = this.b = this.c = this.d = 0;
			this.tx = -this.tx;
			this.ty = -this.ty;
		} else {
			norm = 1.0 / norm;
			var a1 = this.d * norm;
			this.d = this.a * norm;
			this.a = a1;
			this.b *= -norm;
			this.c *= -norm;
			var tx1 = -this.a * this.tx - this.c * this.ty;
			this.ty = -this.b * this.tx - this.d * this.ty;
			this.tx = tx1;
		}
		return this;
	}
	,mult: function(m) {
		var result = new lime_math_Matrix3(this.a,this.b,this.c,this.d,this.tx,this.ty);
		result.concat(m);
		return result;
	}
	,rotate: function(theta) {
		var cos = Math.cos(theta);
		var sin = Math.sin(theta);
		var a1 = this.a * cos - this.b * sin;
		this.b = this.a * sin + this.b * cos;
		this.a = a1;
		var c1 = this.c * cos - this.d * sin;
		this.d = this.c * sin + this.d * cos;
		this.c = c1;
		var tx1 = this.tx * cos - this.ty * sin;
		this.ty = this.tx * sin + this.ty * cos;
		this.tx = tx1;
	}
	,scale: function(sx,sy) {
		this.a *= sx;
		this.b *= sy;
		this.c *= sx;
		this.d *= sy;
		this.tx *= sx;
		this.ty *= sy;
	}
	,setRotation: function(theta,scale) {
		if(scale == null) scale = 1;
		this.a = Math.cos(theta) * scale;
		this.c = Math.sin(theta) * scale;
		this.b = -this.c;
		this.d = this.a;
	}
	,setTo: function(a,b,c,d,tx,ty) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
	}
	,to3DString: function(roundPixels) {
		if(roundPixels == null) roundPixels = false;
		if(roundPixels) return "Matrix33d(" + this.a + ", " + this.b + ", " + "0, 0, " + this.c + ", " + this.d + ", " + "0, 0, 0, 0, 1, 0, " + (this.tx | 0) + ", " + (this.ty | 0) + ", 0, 1)"; else return "Matrix33d(" + this.a + ", " + this.b + ", " + "0, 0, " + this.c + ", " + this.d + ", " + "0, 0, 0, 0, 1, 0, " + this.tx + ", " + this.ty + ", 0, 1)";
	}
	,toMozString: function() {
		return "Matrix3(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + "px, " + this.ty + "px)";
	}
	,toString: function() {
		return "Matrix3(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + ", " + this.ty + ")";
	}
	,transformVector2: function(pos) {
		return new lime_math_Vector2(pos.x * this.a + pos.y * this.c + this.tx,pos.x * this.b + pos.y * this.d + this.ty);
	}
	,translate: function(dx,dy) {
		this.tx += dx;
		this.ty += dy;
	}
	,__cleanValues: function() {
		this.a = Math.round(this.a * 1000) / 1000;
		this.b = Math.round(this.b * 1000) / 1000;
		this.c = Math.round(this.c * 1000) / 1000;
		this.d = Math.round(this.d * 1000) / 1000;
		this.tx = Math.round(this.tx * 10) / 10;
		this.ty = Math.round(this.ty * 10) / 10;
	}
	,__transformX: function(pos) {
		return pos.x * this.a + pos.y * this.c + this.tx;
	}
	,__transformY: function(pos) {
		return pos.x * this.b + pos.y * this.d + this.ty;
	}
	,__translateTransformed: function(pos) {
		this.tx = pos.x * this.a + pos.y * this.c + this.tx;
		this.ty = pos.x * this.b + pos.y * this.d + this.ty;
	}
	,__class__: lime_math_Matrix3
};
var lime_math_Rectangle = function(x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
$hxClasses["lime.math.Rectangle"] = lime_math_Rectangle;
lime_math_Rectangle.__name__ = true;
lime_math_Rectangle.prototype = {
	clone: function() {
		return new lime_math_Rectangle(this.x,this.y,this.width,this.height);
	}
	,contains: function(x,y) {
		return x >= this.x && y >= this.y && x < this.get_right() && y < this.get_bottom();
	}
	,containsPoint: function(point) {
		return this.contains(point.x,point.y);
	}
	,containsRect: function(rect) {
		if(rect.width <= 0 || rect.height <= 0) return rect.x > this.x && rect.y > this.y && rect.get_right() < this.get_right() && rect.get_bottom() < this.get_bottom(); else return rect.x >= this.x && rect.y >= this.y && rect.get_right() <= this.get_right() && rect.get_bottom() <= this.get_bottom();
	}
	,copyFrom: function(sourceRect) {
		this.x = sourceRect.x;
		this.y = sourceRect.y;
		this.width = sourceRect.width;
		this.height = sourceRect.height;
	}
	,equals: function(toCompare) {
		return toCompare != null && this.x == toCompare.x && this.y == toCompare.y && this.width == toCompare.width && this.height == toCompare.height;
	}
	,inflate: function(dx,dy) {
		this.x -= dx;
		this.width += dx * 2;
		this.y -= dy;
		this.height += dy * 2;
	}
	,inflatePoint: function(point) {
		this.inflate(point.x,point.y);
	}
	,intersection: function(toIntersect) {
		var x0;
		if(this.x < toIntersect.x) x0 = toIntersect.x; else x0 = this.x;
		var x1;
		if(this.get_right() > toIntersect.get_right()) x1 = toIntersect.get_right(); else x1 = this.get_right();
		if(x1 <= x0) return new lime_math_Rectangle();
		var y0;
		if(this.y < toIntersect.y) y0 = toIntersect.y; else y0 = this.y;
		var y1;
		if(this.get_bottom() > toIntersect.get_bottom()) y1 = toIntersect.get_bottom(); else y1 = this.get_bottom();
		if(y1 <= y0) return new lime_math_Rectangle();
		return new lime_math_Rectangle(x0,y0,x1 - x0,y1 - y0);
	}
	,intersects: function(toIntersect) {
		var x0;
		if(this.x < toIntersect.x) x0 = toIntersect.x; else x0 = this.x;
		var x1;
		if(this.get_right() > toIntersect.get_right()) x1 = toIntersect.get_right(); else x1 = this.get_right();
		if(x1 <= x0) return false;
		var y0;
		if(this.y < toIntersect.y) y0 = toIntersect.y; else y0 = this.y;
		var y1;
		if(this.get_bottom() > toIntersect.get_bottom()) y1 = toIntersect.get_bottom(); else y1 = this.get_bottom();
		return y1 > y0;
	}
	,isEmpty: function() {
		return this.width <= 0 || this.height <= 0;
	}
	,offset: function(dx,dy) {
		this.x += dx;
		this.y += dy;
	}
	,offsetPoint: function(point) {
		this.x += point.x;
		this.y += point.y;
	}
	,setEmpty: function() {
		this.x = this.y = this.width = this.height = 0;
	}
	,setTo: function(xa,ya,widtha,heighta) {
		this.x = xa;
		this.y = ya;
		this.width = widtha;
		this.height = heighta;
	}
	,transform: function(m) {
		var tx0 = m.a * this.x + m.c * this.y;
		var tx1 = tx0;
		var ty0 = m.b * this.x + m.d * this.y;
		var ty1 = ty0;
		var tx = m.a * (this.x + this.width) + m.c * this.y;
		var ty = m.b * (this.x + this.width) + m.d * this.y;
		if(tx < tx0) tx0 = tx;
		if(ty < ty0) ty0 = ty;
		if(tx > tx1) tx1 = tx;
		if(ty > ty1) ty1 = ty;
		tx = m.a * (this.x + this.width) + m.c * (this.y + this.height);
		ty = m.b * (this.x + this.width) + m.d * (this.y + this.height);
		if(tx < tx0) tx0 = tx;
		if(ty < ty0) ty0 = ty;
		if(tx > tx1) tx1 = tx;
		if(ty > ty1) ty1 = ty;
		tx = m.a * this.x + m.c * (this.y + this.height);
		ty = m.b * this.x + m.d * (this.y + this.height);
		if(tx < tx0) tx0 = tx;
		if(ty < ty0) ty0 = ty;
		if(tx > tx1) tx1 = tx;
		if(ty > ty1) ty1 = ty;
		return new lime_math_Rectangle(tx0 + m.tx,ty0 + m.ty,tx1 - tx0,ty1 - ty0);
	}
	,union: function(toUnion) {
		if(this.width == 0 || this.height == 0) return toUnion.clone(); else if(toUnion.width == 0 || toUnion.height == 0) return this.clone();
		var x0;
		if(this.x > toUnion.x) x0 = toUnion.x; else x0 = this.x;
		var x1;
		if(this.get_right() < toUnion.get_right()) x1 = toUnion.get_right(); else x1 = this.get_right();
		var y0;
		if(this.y > toUnion.y) y0 = toUnion.y; else y0 = this.y;
		var y1;
		if(this.get_bottom() < toUnion.get_bottom()) y1 = toUnion.get_bottom(); else y1 = this.get_bottom();
		return new lime_math_Rectangle(x0,y0,x1 - x0,y1 - y0);
	}
	,__contract: function(x,y,width,height) {
		if(this.width == 0 && this.height == 0) return;
		if(this.x < x) this.x = x;
		if(this.y < y) this.y = y;
		if(this.get_right() > x + width) this.width = x + width - this.x;
		if(this.get_bottom() > y + height) this.height = y + height - this.y;
	}
	,__expand: function(x,y,width,height) {
		if(this.width == 0 && this.height == 0) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return;
		}
		var cacheRight = this.get_right();
		var cacheBottom = this.get_bottom();
		if(this.x > x) this.x = x;
		if(this.y > y) this.y = y;
		if(cacheRight < x + width) this.width = x + width - this.x;
		if(cacheBottom < y + height) this.height = y + height - this.y;
	}
	,__toFlashRectangle: function() {
		return null;
	}
	,get_bottom: function() {
		return this.y + this.height;
	}
	,set_bottom: function(b) {
		this.height = b - this.y;
		return b;
	}
	,get_bottomRight: function() {
		return new lime_math_Vector2(this.x + this.width,this.y + this.height);
	}
	,set_bottomRight: function(p) {
		this.width = p.x - this.x;
		this.height = p.y - this.y;
		return p.clone();
	}
	,get_left: function() {
		return this.x;
	}
	,set_left: function(l) {
		this.width -= l - this.x;
		this.x = l;
		return l;
	}
	,get_right: function() {
		return this.x + this.width;
	}
	,set_right: function(r) {
		this.width = r - this.x;
		return r;
	}
	,get_size: function() {
		return new lime_math_Vector2(this.width,this.height);
	}
	,set_size: function(p) {
		this.width = p.x;
		this.height = p.y;
		return p.clone();
	}
	,get_top: function() {
		return this.y;
	}
	,set_top: function(t) {
		this.height -= t - this.y;
		this.y = t;
		return t;
	}
	,get_topLeft: function() {
		return new lime_math_Vector2(this.x,this.y);
	}
	,set_topLeft: function(p) {
		this.x = p.x;
		this.y = p.y;
		return p.clone();
	}
	,__class__: lime_math_Rectangle
};
var lime_math_Vector2 = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
$hxClasses["lime.math.Vector2"] = lime_math_Vector2;
lime_math_Vector2.__name__ = true;
lime_math_Vector2.distance = function(pt1,pt2) {
	var dx = pt1.x - pt2.x;
	var dy = pt1.y - pt2.y;
	return Math.sqrt(dx * dx + dy * dy);
};
lime_math_Vector2.interpolate = function(pt1,pt2,f) {
	return new lime_math_Vector2(pt2.x + f * (pt1.x - pt2.x),pt2.y + f * (pt1.y - pt2.y));
};
lime_math_Vector2.polar = function(len,angle) {
	return new lime_math_Vector2(len * Math.cos(angle),len * Math.sin(angle));
};
lime_math_Vector2.prototype = {
	add: function(v) {
		return new lime_math_Vector2(v.x + this.x,v.y + this.y);
	}
	,clone: function() {
		return new lime_math_Vector2(this.x,this.y);
	}
	,equals: function(toCompare) {
		return toCompare != null && toCompare.x == this.x && toCompare.y == this.y;
	}
	,normalize: function(thickness) {
		if(this.x == 0 && this.y == 0) return; else {
			var norm = thickness / Math.sqrt(this.x * this.x + this.y * this.y);
			this.x *= norm;
			this.y *= norm;
		}
	}
	,offset: function(dx,dy) {
		this.x += dx;
		this.y += dy;
	}
	,setTo: function(xa,ya) {
		this.x = xa;
		this.y = ya;
	}
	,subtract: function(v) {
		return new lime_math_Vector2(this.x - v.x,this.y - v.y);
	}
	,__toFlashPoint: function() {
		return null;
	}
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,__class__: lime_math_Vector2
};
var lime_math_Vector4 = function(x,y,z,w) {
	if(w == null) w = 0.;
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.w = w;
	this.x = x;
	this.y = y;
	this.z = z;
};
$hxClasses["lime.math.Vector4"] = lime_math_Vector4;
lime_math_Vector4.__name__ = true;
lime_math_Vector4.angleBetween = function(a,b) {
	var a0 = new lime_math_Vector4(a.x,a.y,a.z,a.w);
	a0.normalize();
	var b0 = new lime_math_Vector4(b.x,b.y,b.z,b.w);
	b0.normalize();
	return Math.acos(a0.x * b0.x + a0.y * b0.y + a0.z * b0.z);
};
lime_math_Vector4.distance = function(pt1,pt2) {
	var x = pt2.x - pt1.x;
	var y = pt2.y - pt1.y;
	var z = pt2.z - pt1.z;
	return Math.sqrt(x * x + y * y + z * z);
};
lime_math_Vector4.get_X_AXIS = function() {
	return new lime_math_Vector4(1,0,0);
};
lime_math_Vector4.get_Y_AXIS = function() {
	return new lime_math_Vector4(0,1,0);
};
lime_math_Vector4.get_Z_AXIS = function() {
	return new lime_math_Vector4(0,0,1);
};
lime_math_Vector4.prototype = {
	add: function(a) {
		return new lime_math_Vector4(this.x + a.x,this.y + a.y,this.z + a.z);
	}
	,clone: function() {
		return new lime_math_Vector4(this.x,this.y,this.z,this.w);
	}
	,copyFrom: function(sourceVector4) {
		this.x = sourceVector4.x;
		this.y = sourceVector4.y;
		this.z = sourceVector4.z;
	}
	,crossProduct: function(a) {
		return new lime_math_Vector4(this.y * a.z - this.z * a.y,this.z * a.x - this.x * a.z,this.x * a.y - this.y * a.x,1);
	}
	,decrementBy: function(a) {
		this.x -= a.x;
		this.y -= a.y;
		this.z -= a.z;
	}
	,dotProduct: function(a) {
		return this.x * a.x + this.y * a.y + this.z * a.z;
	}
	,equals: function(toCompare,allFour) {
		if(allFour == null) allFour = false;
		return this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (!allFour || this.w == toCompare.w);
	}
	,incrementBy: function(a) {
		this.x += a.x;
		this.y += a.y;
		this.z += a.z;
	}
	,nearEquals: function(toCompare,tolerance,allFour) {
		if(allFour == null) allFour = false;
		return Math.abs(this.x - toCompare.x) < tolerance && Math.abs(this.y - toCompare.y) < tolerance && Math.abs(this.z - toCompare.z) < tolerance && (!allFour || Math.abs(this.w - toCompare.w) < tolerance);
	}
	,negate: function() {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
	}
	,normalize: function() {
		var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		if(l != 0) {
			this.x /= l;
			this.y /= l;
			this.z /= l;
		}
		return l;
	}
	,project: function() {
		this.x /= this.w;
		this.y /= this.w;
		this.z /= this.w;
	}
	,scaleBy: function(s) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
	}
	,setTo: function(xa,ya,za) {
		this.x = xa;
		this.y = ya;
		this.z = za;
	}
	,subtract: function(a) {
		return new lime_math_Vector4(this.x - a.x,this.y - a.y,this.z - a.z);
	}
	,toString: function() {
		return "Vector4(" + this.x + ", " + this.y + ", " + this.z + ")";
	}
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	,get_lengthSquared: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	,__class__: lime_math_Vector4
};
var lime_math_color__$ARGB_ARGB_$Impl_$ = {};
$hxClasses["lime.math.color._ARGB.ARGB_Impl_"] = lime_math_color__$ARGB_ARGB_$Impl_$;
lime_math_color__$ARGB_ARGB_$Impl_$.__name__ = true;
lime_math_color__$ARGB_ARGB_$Impl_$._new = function(argb) {
	if(argb == null) argb = 0;
	return argb;
};
lime_math_color__$ARGB_ARGB_$Impl_$.create = function(a,r,g,b) {
	var argb = 0;
	argb = (a & 255) << 24 | (r & 255) << 16 | (g & 255) << 8 | b & 255;
	return argb;
};
lime_math_color__$ARGB_ARGB_$Impl_$.multiplyAlpha = function(this1) {
	if((this1 >> 24 & 255) == 0) this1 = 0; else if((this1 >> 24 & 255) != 255) {
		lime_math_color__$ARGB_ARGB_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[this1 >> 24 & 255];
		this1 = (this1 >> 24 & 255 & 255) << 24 | ((this1 >> 16 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.a16 >> 16 & 255) << 16 | ((this1 >> 8 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.a16 >> 16 & 255) << 8 | (this1 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.a16 >> 16 & 255;
	}
};
lime_math_color__$ARGB_ARGB_$Impl_$.readUInt8 = function(this1,data,offset,format,premultiplied) {
	if(premultiplied == null) premultiplied = false;
	if(format == null) format = 0;
	switch(format) {
	case 2:
		this1 = (data[offset + 1] & 255) << 24 | (data[offset] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset + 2] & 255;
		break;
	case 0:
		this1 = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
		break;
	case 1:
		this1 = (data[offset + 2] & 255) << 24 | (data[offset + 3] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 1] & 255;
		break;
	}
	if(premultiplied) {
		if((this1 >> 24 & 255) != 0 && (this1 >> 24 & 255) != 255) {
			lime_math_color__$ARGB_ARGB_$Impl_$.unmult = 255.0 / (this1 >> 24 & 255);
			var r;
			var idx = Math.floor((this1 >> 16 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.unmult);
			r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
			var g;
			var idx1 = Math.floor((this1 >> 8 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.unmult);
			g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
			var b;
			var idx2 = Math.floor((this1 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.unmult);
			b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
			this1 = (this1 >> 24 & 255 & 255) << 24 | (r & 255) << 16 | (g & 255) << 8 | b & 255;
		}
	}
};
lime_math_color__$ARGB_ARGB_$Impl_$.set = function(this1,a,r,g,b) {
	this1 = (a & 255) << 24 | (r & 255) << 16 | (g & 255) << 8 | b & 255;
};
lime_math_color__$ARGB_ARGB_$Impl_$.unmultiplyAlpha = function(this1) {
	if((this1 >> 24 & 255) != 0 && (this1 >> 24 & 255) != 255) {
		lime_math_color__$ARGB_ARGB_$Impl_$.unmult = 255.0 / (this1 >> 24 & 255);
		var r;
		var idx = Math.floor((this1 >> 16 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.unmult);
		r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
		var g;
		var idx1 = Math.floor((this1 >> 8 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.unmult);
		g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
		var b;
		var idx2 = Math.floor((this1 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.unmult);
		b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
		this1 = (this1 >> 24 & 255 & 255) << 24 | (r & 255) << 16 | (g & 255) << 8 | b & 255;
	}
};
lime_math_color__$ARGB_ARGB_$Impl_$.writeUInt8 = function(this1,data,offset,format,premultiplied) {
	if(premultiplied == null) premultiplied = false;
	if(format == null) format = 0;
	if(premultiplied) {
		if((this1 >> 24 & 255) == 0) this1 = 0; else if((this1 >> 24 & 255) != 255) {
			lime_math_color__$ARGB_ARGB_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[this1 >> 24 & 255];
			this1 = (this1 >> 24 & 255 & 255) << 24 | ((this1 >> 16 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.a16 >> 16 & 255) << 16 | ((this1 >> 8 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.a16 >> 16 & 255) << 8 | (this1 & 255) * lime_math_color__$ARGB_ARGB_$Impl_$.a16 >> 16 & 255;
		}
	}
	switch(format) {
	case 2:
		data[offset] = this1 & 255;
		data[offset + 1] = this1 >> 8 & 255;
		data[offset + 2] = this1 >> 16 & 255;
		data[offset + 3] = this1 >> 24 & 255;
		break;
	case 0:
		data[offset] = this1 >> 16 & 255;
		data[offset + 1] = this1 >> 8 & 255;
		data[offset + 2] = this1 & 255;
		data[offset + 3] = this1 >> 24 & 255;
		break;
	case 1:
		data[offset] = this1 >> 24 & 255;
		data[offset + 1] = this1 >> 16 & 255;
		data[offset + 2] = this1 >> 8 & 255;
		data[offset + 3] = this1 & 255;
		break;
	}
};
lime_math_color__$ARGB_ARGB_$Impl_$.__fromBGRA = function(bgra) {
	var argb = 0;
	argb = (bgra & 255 & 255) << 24 | (bgra >> 8 & 255 & 255) << 16 | (bgra >> 16 & 255 & 255) << 8 | bgra >> 24 & 255 & 255;
	return argb;
};
lime_math_color__$ARGB_ARGB_$Impl_$.__fromRGBA = function(rgba) {
	var argb = 0;
	argb = (rgba & 255 & 255) << 24 | (rgba >> 24 & 255 & 255) << 16 | (rgba >> 16 & 255 & 255) << 8 | rgba >> 8 & 255 & 255;
	return argb;
};
lime_math_color__$ARGB_ARGB_$Impl_$.get_a = function(this1) {
	return this1 >> 24 & 255;
};
lime_math_color__$ARGB_ARGB_$Impl_$.set_a = function(this1,value) {
	this1 = (value & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
	return value;
};
lime_math_color__$ARGB_ARGB_$Impl_$.get_b = function(this1) {
	return this1 & 255;
};
lime_math_color__$ARGB_ARGB_$Impl_$.set_b = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | value & 255;
	return value;
};
lime_math_color__$ARGB_ARGB_$Impl_$.get_g = function(this1) {
	return this1 >> 8 & 255;
};
lime_math_color__$ARGB_ARGB_$Impl_$.set_g = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (value & 255) << 8 | this1 & 255 & 255;
	return value;
};
lime_math_color__$ARGB_ARGB_$Impl_$.get_r = function(this1) {
	return this1 >> 16 & 255;
};
lime_math_color__$ARGB_ARGB_$Impl_$.set_r = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (value & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
	return value;
};
var lime_math_color__$BGRA_BGRA_$Impl_$ = {};
$hxClasses["lime.math.color._BGRA.BGRA_Impl_"] = lime_math_color__$BGRA_BGRA_$Impl_$;
lime_math_color__$BGRA_BGRA_$Impl_$.__name__ = true;
lime_math_color__$BGRA_BGRA_$Impl_$._new = function(bgra) {
	if(bgra == null) bgra = 0;
	return bgra;
};
lime_math_color__$BGRA_BGRA_$Impl_$.create = function(b,g,r,a) {
	var bgra = 0;
	bgra = (b & 255) << 24 | (g & 255) << 16 | (r & 255) << 8 | a & 255;
	return bgra;
};
lime_math_color__$BGRA_BGRA_$Impl_$.multiplyAlpha = function(this1) {
	if((this1 & 255) == 0) this1 = 0; else if((this1 & 255) != 255) {
		lime_math_color__$BGRA_BGRA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[this1 & 255];
		this1 = ((this1 >> 24 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.a16 >> 16 & 255) << 24 | ((this1 >> 16 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.a16 >> 16 & 255) << 16 | ((this1 >> 8 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.a16 >> 16 & 255) << 8 | this1 & 255 & 255;
	}
};
lime_math_color__$BGRA_BGRA_$Impl_$.readUInt8 = function(this1,data,offset,format,premultiplied) {
	if(premultiplied == null) premultiplied = false;
	if(format == null) format = 0;
	switch(format) {
	case 2:
		this1 = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 0:
		this1 = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 1:
		this1 = (data[offset + 3] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 1] & 255) << 8 | data[offset] & 255;
		break;
	}
	if(premultiplied) {
		if((this1 & 255) != 0 && (this1 & 255) != 255) {
			lime_math_color__$BGRA_BGRA_$Impl_$.unmult = 255.0 / (this1 & 255);
			var b;
			var idx = Math.floor((this1 >> 24 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.unmult);
			b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
			var g;
			var idx1 = Math.floor((this1 >> 16 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.unmult);
			g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
			var r;
			var idx2 = Math.floor((this1 >> 8 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.unmult);
			r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
			this1 = (b & 255) << 24 | (g & 255) << 16 | (r & 255) << 8 | this1 & 255 & 255;
		}
	}
};
lime_math_color__$BGRA_BGRA_$Impl_$.set = function(this1,b,g,r,a) {
	this1 = (b & 255) << 24 | (g & 255) << 16 | (r & 255) << 8 | a & 255;
};
lime_math_color__$BGRA_BGRA_$Impl_$.unmultiplyAlpha = function(this1) {
	if((this1 & 255) != 0 && (this1 & 255) != 255) {
		lime_math_color__$BGRA_BGRA_$Impl_$.unmult = 255.0 / (this1 & 255);
		var b;
		var idx = Math.floor((this1 >> 24 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.unmult);
		b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
		var g;
		var idx1 = Math.floor((this1 >> 16 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.unmult);
		g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
		var r;
		var idx2 = Math.floor((this1 >> 8 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.unmult);
		r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
		this1 = (b & 255) << 24 | (g & 255) << 16 | (r & 255) << 8 | this1 & 255 & 255;
	}
};
lime_math_color__$BGRA_BGRA_$Impl_$.writeUInt8 = function(this1,data,offset,format,premultiplied) {
	if(premultiplied == null) premultiplied = false;
	if(format == null) format = 0;
	if(premultiplied) {
		if((this1 & 255) == 0) this1 = 0; else if((this1 & 255) != 255) {
			lime_math_color__$BGRA_BGRA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[this1 & 255];
			this1 = ((this1 >> 24 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.a16 >> 16 & 255) << 24 | ((this1 >> 16 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.a16 >> 16 & 255) << 16 | ((this1 >> 8 & 255) * lime_math_color__$BGRA_BGRA_$Impl_$.a16 >> 16 & 255) << 8 | this1 & 255 & 255;
		}
	}
	switch(format) {
	case 2:
		data[offset] = this1 >> 24 & 255;
		data[offset + 1] = this1 >> 16 & 255;
		data[offset + 2] = this1 >> 8 & 255;
		data[offset + 3] = this1 & 255;
		break;
	case 0:
		data[offset] = this1 >> 8 & 255;
		data[offset + 1] = this1 >> 16 & 255;
		data[offset + 2] = this1 >> 24 & 255;
		data[offset + 3] = this1 & 255;
		break;
	case 1:
		data[offset] = this1 & 255;
		data[offset + 1] = this1 >> 8 & 255;
		data[offset + 2] = this1 >> 16 & 255;
		data[offset + 3] = this1 >> 24 & 255;
		break;
	}
};
lime_math_color__$BGRA_BGRA_$Impl_$.__fromARGB = function(argb) {
	var bgra = 0;
	bgra = (argb & 255 & 255) << 24 | (argb >> 8 & 255 & 255) << 16 | (argb >> 16 & 255 & 255) << 8 | argb >> 24 & 255 & 255;
	return bgra;
};
lime_math_color__$BGRA_BGRA_$Impl_$.__fromRGBA = function(rgba) {
	var bgra = 0;
	bgra = (rgba >> 8 & 255 & 255) << 24 | (rgba >> 16 & 255 & 255) << 16 | (rgba >> 24 & 255 & 255) << 8 | rgba & 255 & 255;
	return bgra;
};
lime_math_color__$BGRA_BGRA_$Impl_$.get_a = function(this1) {
	return this1 & 255;
};
lime_math_color__$BGRA_BGRA_$Impl_$.set_a = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | value & 255;
	return value;
};
lime_math_color__$BGRA_BGRA_$Impl_$.get_b = function(this1) {
	return this1 >> 24 & 255;
};
lime_math_color__$BGRA_BGRA_$Impl_$.set_b = function(this1,value) {
	this1 = (value & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
	return value;
};
lime_math_color__$BGRA_BGRA_$Impl_$.get_g = function(this1) {
	return this1 >> 16 & 255;
};
lime_math_color__$BGRA_BGRA_$Impl_$.set_g = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (value & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
	return value;
};
lime_math_color__$BGRA_BGRA_$Impl_$.get_r = function(this1) {
	return this1 >> 8 & 255;
};
lime_math_color__$BGRA_BGRA_$Impl_$.set_r = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (value & 255) << 8 | this1 & 255 & 255;
	return value;
};
var lime_math_color__$RGBA_RGBA_$Impl_$ = {};
$hxClasses["lime.math.color._RGBA.RGBA_Impl_"] = lime_math_color__$RGBA_RGBA_$Impl_$;
lime_math_color__$RGBA_RGBA_$Impl_$.__name__ = true;
lime_math_color__$RGBA_RGBA_$Impl_$._new = function(rgba) {
	if(rgba == null) rgba = 0;
	return rgba;
};
lime_math_color__$RGBA_RGBA_$Impl_$.create = function(r,g,b,a) {
	var rgba = 0;
	rgba = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | a & 255;
	return rgba;
};
lime_math_color__$RGBA_RGBA_$Impl_$.multiplyAlpha = function(this1) {
	if((this1 & 255) == 0) {
		if(this1 != 0) this1 = 0;
	} else if((this1 & 255) != 255) {
		lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[this1 & 255];
		this1 = ((this1 >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((this1 >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((this1 >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | this1 & 255 & 255;
	}
};
lime_math_color__$RGBA_RGBA_$Impl_$.readUInt8 = function(this1,data,offset,format,premultiplied) {
	if(premultiplied == null) premultiplied = false;
	if(format == null) format = 0;
	switch(format) {
	case 2:
		this1 = (data[offset + 2] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 0:
		this1 = (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3] & 255;
		break;
	case 1:
		this1 = (data[offset + 1] & 255) << 24 | (data[offset + 2] & 255) << 16 | (data[offset + 3] & 255) << 8 | data[offset] & 255;
		break;
	}
	if(premultiplied) {
		if((this1 & 255) != 0 && (this1 & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (this1 & 255);
			var r;
			var idx = Math.round((this1 >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
			var g;
			var idx1 = Math.round((this1 >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
			var b;
			var idx2 = Math.round((this1 >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
			b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
			this1 = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | this1 & 255 & 255;
		}
	}
};
lime_math_color__$RGBA_RGBA_$Impl_$.set = function(this1,r,g,b,a) {
	this1 = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | a & 255;
};
lime_math_color__$RGBA_RGBA_$Impl_$.unmultiplyAlpha = function(this1) {
	if((this1 & 255) != 0 && (this1 & 255) != 255) {
		lime_math_color__$RGBA_RGBA_$Impl_$.unmult = 255.0 / (this1 & 255);
		var r;
		var idx = Math.round((this1 >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
		r = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx];
		var g;
		var idx1 = Math.round((this1 >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
		g = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx1];
		var b;
		var idx2 = Math.round((this1 >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.unmult);
		b = lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[idx2];
		this1 = (r & 255) << 24 | (g & 255) << 16 | (b & 255) << 8 | this1 & 255 & 255;
	}
};
lime_math_color__$RGBA_RGBA_$Impl_$.writeUInt8 = function(this1,data,offset,format,premultiplied) {
	if(premultiplied == null) premultiplied = false;
	if(format == null) format = 0;
	if(premultiplied) {
		if((this1 & 255) == 0) {
			if(this1 != 0) this1 = 0;
		} else if((this1 & 255) != 255) {
			lime_math_color__$RGBA_RGBA_$Impl_$.a16 = lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[this1 & 255];
			this1 = ((this1 >> 24 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 24 | ((this1 >> 16 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 16 | ((this1 >> 8 & 255) * lime_math_color__$RGBA_RGBA_$Impl_$.a16 >> 16 & 255) << 8 | this1 & 255 & 255;
		}
	}
	switch(format) {
	case 2:
		data[offset] = this1 >> 8 & 255;
		data[offset + 1] = this1 >> 16 & 255;
		data[offset + 2] = this1 >> 24 & 255;
		data[offset + 3] = this1 & 255;
		break;
	case 0:
		data[offset] = this1 >> 24 & 255;
		data[offset + 1] = this1 >> 16 & 255;
		data[offset + 2] = this1 >> 8 & 255;
		data[offset + 3] = this1 & 255;
		break;
	case 1:
		data[offset] = this1 & 255;
		data[offset + 1] = this1 >> 24 & 255;
		data[offset + 2] = this1 >> 16 & 255;
		data[offset + 3] = this1 >> 8 & 255;
		break;
	}
};
lime_math_color__$RGBA_RGBA_$Impl_$.__fromARGB = function(argb) {
	var rgba = 0;
	rgba = (argb >> 16 & 255 & 255) << 24 | (argb >> 8 & 255 & 255) << 16 | (argb & 255 & 255) << 8 | argb >> 24 & 255 & 255;
	return rgba;
};
lime_math_color__$RGBA_RGBA_$Impl_$.__fromBGRA = function(bgra) {
	var rgba = 0;
	rgba = (bgra >> 8 & 255 & 255) << 24 | (bgra >> 16 & 255 & 255) << 16 | (bgra >> 24 & 255 & 255) << 8 | bgra & 255 & 255;
	return rgba;
};
lime_math_color__$RGBA_RGBA_$Impl_$.get_a = function(this1) {
	return this1 & 255;
};
lime_math_color__$RGBA_RGBA_$Impl_$.set_a = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | value & 255;
	return value;
};
lime_math_color__$RGBA_RGBA_$Impl_$.get_b = function(this1) {
	return this1 >> 8 & 255;
};
lime_math_color__$RGBA_RGBA_$Impl_$.set_b = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (value & 255) << 8 | this1 & 255 & 255;
	return value;
};
lime_math_color__$RGBA_RGBA_$Impl_$.get_g = function(this1) {
	return this1 >> 16 & 255;
};
lime_math_color__$RGBA_RGBA_$Impl_$.set_g = function(this1,value) {
	this1 = (this1 >> 24 & 255 & 255) << 24 | (value & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
	return value;
};
lime_math_color__$RGBA_RGBA_$Impl_$.get_r = function(this1) {
	return this1 >> 24 & 255;
};
lime_math_color__$RGBA_RGBA_$Impl_$.set_r = function(this1,value) {
	this1 = (value & 255) << 24 | (this1 >> 16 & 255 & 255) << 16 | (this1 >> 8 & 255 & 255) << 8 | this1 & 255 & 255;
	return value;
};
var lime_net_HTTPRequest = function() {
	this.promise = new lime_app_Promise();
};
$hxClasses["lime.net.HTTPRequest"] = lime_net_HTTPRequest;
lime_net_HTTPRequest.__name__ = true;
lime_net_HTTPRequest.prototype = {
	load: function(url) {
		var _g = this;
		this.bytesLoaded = 0;
		this.bytesTotal = 0;
		var request = new XMLHttpRequest();
		request.addEventListener("progress",$bind(this,this.request_onProgress),false);
		request.onreadystatechange = function() {
			if(request.readyState != 4) return;
			if(request.status != null && request.status >= 200 && request.status <= 400) {
				_g.bytes = lime_utils_Bytes.ofData(request.response);
				_g.promise.complete(_g.bytes);
			} else _g.promise.error(request.status);
		};
		request.open("GET",url,true);
		request.responseType = "arraybuffer";
		request.send("");
		return this.promise.future;
	}
	,curl_onProgress: function(dltotal,dlnow,uptotal,upnow) {
		if(upnow > this.bytesLoaded || dlnow > this.bytesLoaded || uptotal > this.bytesTotal || dltotal > this.bytesTotal) {
			if(upnow > this.bytesLoaded) this.bytesLoaded = upnow | 0;
			if(dlnow > this.bytesLoaded) this.bytesLoaded = dlnow | 0;
			if(uptotal > this.bytesTotal) this.bytesTotal = uptotal | 0;
			if(dltotal > this.bytesTotal) this.bytesTotal = dltotal | 0;
			this.promise.progress(this.bytesLoaded / this.bytesTotal);
		}
		return 0;
	}
	,curl_onWrite: function(output,size,nmemb) {
		var cacheBytes = this.bytes;
		this.bytes = lime_utils_Bytes.alloc(this.bytes.length + output.length);
		this.bytes.blit(0,cacheBytes,0,cacheBytes.length);
		this.bytes.blit(cacheBytes.length,output,0,output.length);
		return size * nmemb;
	}
	,request_onProgress: function(event) {
		this.promise.progress(event.loaded / event.total);
	}
	,__class__: lime_net_HTTPRequest
};
var lime_net_curl__$CURL_CURL_$Impl_$ = {};
$hxClasses["lime.net.curl._CURL.CURL_Impl_"] = lime_net_curl__$CURL_CURL_$Impl_$;
lime_net_curl__$CURL_CURL_$Impl_$.__name__ = true;
lime_net_curl__$CURL_CURL_$Impl_$.getDate = function(date,now) {
	return 0;
};
lime_net_curl__$CURL_CURL_$Impl_$.globalCleanup = function() {
};
lime_net_curl__$CURL_CURL_$Impl_$.globalInit = function(flags) {
	return 0;
};
lime_net_curl__$CURL_CURL_$Impl_$.version = function() {
	return null;
};
lime_net_curl__$CURL_CURL_$Impl_$.versionInfo = function(type) {
	return null;
};
lime_net_curl__$CURL_CURL_$Impl_$.intGt = function(a,b) {
	return a > b;
};
var lime_net_curl_CURLEasy = function() { };
$hxClasses["lime.net.curl.CURLEasy"] = lime_net_curl_CURLEasy;
lime_net_curl_CURLEasy.__name__ = true;
lime_net_curl_CURLEasy.cleanup = function(handle) {
};
lime_net_curl_CURLEasy.duphandle = function(handle) {
	return 0;
};
lime_net_curl_CURLEasy.escape = function(handle,url,length) {
	return null;
};
lime_net_curl_CURLEasy.getinfo = function(handle,info) {
	return null;
};
lime_net_curl_CURLEasy.init = function() {
	return 0;
};
lime_net_curl_CURLEasy.pause = function(handle,bitMask) {
	return 0;
};
lime_net_curl_CURLEasy.perform = function(handle) {
	return 0;
};
lime_net_curl_CURLEasy.reset = function(handle) {
};
lime_net_curl_CURLEasy.setopt = function(handle,option,parameter) {
	return 0;
};
lime_net_curl_CURLEasy.strerror = function(code) {
	return null;
};
lime_net_curl_CURLEasy.unescape = function(handle,url,inLength,outLength) {
	return null;
};
lime_net_curl_CURLEasy.__writeCallback = function(callback,output,size,nmemb) {
	return 0;
};
var lime_system_BackgroundWorker = function() {
	this.onProgress = new lime_app_Event_$Dynamic_$Void();
	this.onError = new lime_app_Event_$Dynamic_$Void();
	this.onComplete = new lime_app_Event_$Dynamic_$Void();
	this.doWork = new lime_app_Event_$Dynamic_$Void();
};
$hxClasses["lime.system.BackgroundWorker"] = lime_system_BackgroundWorker;
lime_system_BackgroundWorker.__name__ = true;
lime_system_BackgroundWorker.prototype = {
	cancel: function() {
		this.canceled = true;
	}
	,run: function(message) {
		this.canceled = false;
		this.__runMessage = message;
		this.__doWork();
	}
	,sendComplete: function(message) {
		if(!this.canceled) {
			this.canceled = true;
			this.onComplete.dispatch(message);
		}
	}
	,sendError: function(message) {
		if(!this.canceled) {
			this.canceled = true;
			this.onError.dispatch(message);
		}
	}
	,sendProgress: function(message) {
		if(!this.canceled) this.onProgress.dispatch(message);
	}
	,__doWork: function() {
		this.doWork.dispatch(this.__runMessage);
	}
	,__update: function(deltaTime) {
	}
	,__class__: lime_system_BackgroundWorker
};
var lime_system_CFFI = function() { };
$hxClasses["lime.system.CFFI"] = lime_system_CFFI;
lime_system_CFFI.__name__ = true;
lime_system_CFFI.load = function(library,method,args,lazy) {
	if(lazy == null) lazy = false;
	if(args == null) args = 0;
	if(!lime_system_CFFI.enabled) return Reflect.makeVarArgs(function(__) {
		return { };
	});
	var result = null;
	return result;
};
lime_system_CFFI.__findHaxelib = function(library) {
	return "";
};
lime_system_CFFI.__loaderTrace = function(message) {
};
lime_system_CFFI.__sysName = function() {
	return null;
};
lime_system_CFFI.__tryLoad = function(name,library,func,args) {
	return null;
};
var lime_system__$CFFIPointer_CFFIPointer_$Impl_$ = {};
$hxClasses["lime.system._CFFIPointer.CFFIPointer_Impl_"] = lime_system__$CFFIPointer_CFFIPointer_$Impl_$;
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.__name__ = true;
lime_system__$CFFIPointer_CFFIPointer_$Impl_$._new = function(handle) {
	return handle;
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get = function(this1) {
	if(this1 != null) {
	}
	return 0;
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.equals = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) == b;
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.equalsPointer = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) == lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(b);
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.greaterThan = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) > b;
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.greaterThanPointer = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) > lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(b);
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.greaterThanOrEqual = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) >= b;
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.greaterThanOrEqualPointer = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) >= lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(b);
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.lessThan = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) < b;
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.lessThanPointer = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) < lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(b);
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.lessThanOrEqual = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) <= b;
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.lessThanOrEqualPointer = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) <= lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(b);
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.notEquals = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) != b;
};
lime_system__$CFFIPointer_CFFIPointer_$Impl_$.notEqualsPointer = function(a,b) {
	return lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(a) != lime_system__$CFFIPointer_CFFIPointer_$Impl_$.get(b);
};
var lime_system_Display = function() {
};
$hxClasses["lime.system.Display"] = lime_system_Display;
lime_system_Display.__name__ = true;
lime_system_Display.prototype = {
	__class__: lime_system_Display
};
var lime_system_DisplayMode = function(width,height,refreshRate,pixelFormat) {
	this.width = width;
	this.height = height;
	this.refreshRate = refreshRate;
	this.pixelFormat = pixelFormat;
};
$hxClasses["lime.system.DisplayMode"] = lime_system_DisplayMode;
lime_system_DisplayMode.__name__ = true;
lime_system_DisplayMode.prototype = {
	__class__: lime_system_DisplayMode
};
var lime_system_Endian = $hxClasses["lime.system.Endian"] = { __ename__ : true, __constructs__ : ["LITTLE_ENDIAN","BIG_ENDIAN"] };
lime_system_Endian.LITTLE_ENDIAN = ["LITTLE_ENDIAN",0];
lime_system_Endian.LITTLE_ENDIAN.toString = $estr;
lime_system_Endian.LITTLE_ENDIAN.__enum__ = lime_system_Endian;
lime_system_Endian.BIG_ENDIAN = ["BIG_ENDIAN",1];
lime_system_Endian.BIG_ENDIAN.toString = $estr;
lime_system_Endian.BIG_ENDIAN.__enum__ = lime_system_Endian;
var lime_system_System = function() { };
$hxClasses["lime.system.System"] = lime_system_System;
lime_system_System.__name__ = true;
lime_system_System.embed = $hx_exports.lime.embed = function(element,width,height,background,assetsPrefix) {
	var htmlElement = null;
	if(typeof(element) == "string") htmlElement = window.document.getElementById(js_Boot.__cast(element , String)); else if(element == null) htmlElement = window.document.createElement("div"); else htmlElement = element;
	var color = null;
	if(background != null) {
		background = StringTools.replace(background,"#","");
		if(background.indexOf("0x") > -1) color = Std.parseInt(background); else color = Std.parseInt("0x" + background);
	}
	if(width == null) width = 0;
	if(height == null) height = 0;
	ApplicationMain.config.windows[0].background = color;
	ApplicationMain.config.windows[0].element = htmlElement;
	ApplicationMain.config.windows[0].width = width;
	ApplicationMain.config.windows[0].height = height;
	ApplicationMain.config.assetsPrefix = assetsPrefix;
	ApplicationMain.create();
};
lime_system_System.exit = function(code) {
};
lime_system_System.getDisplay = function(id) {
	if(id == 0) {
		var display = new lime_system_Display();
		display.id = 0;
		display.name = "Generic Display";
		display.dpi = 96;
		display.currentMode = new lime_system_DisplayMode(window.screen.width,window.screen.height,60,1);
		display.supportedModes = [display.currentMode];
		display.bounds = new lime_math_Rectangle(0,0,display.currentMode.width,display.currentMode.height);
		return display;
	}
	return null;
};
lime_system_System.getTimer = function() {
	return new Date().getTime();
};
lime_system_System.load = function(library,method,args,lazy) {
	if(lazy == null) lazy = false;
	if(args == null) args = 0;
	return lime_system_CFFI.load(library,method,args,lazy);
};
lime_system_System.get_allowScreenTimeout = function() {
	return true;
};
lime_system_System.set_allowScreenTimeout = function(value) {
	return true;
};
lime_system_System.get_applicationDirectory = function() {
	return null;
};
lime_system_System.get_applicationStorageDirectory = function() {
	var company = "MyCompany";
	var file = "MyApplication";
	if(lime_app_Application.current != null && lime_app_Application.current.config != null) {
		if(lime_app_Application.current.config.company != null) company = lime_app_Application.current.config.company;
		if(lime_app_Application.current.config.file != null) file = lime_app_Application.current.config.file;
	}
	return null;
};
lime_system_System.get_desktopDirectory = function() {
	return null;
};
lime_system_System.get_documentsDirectory = function() {
	return null;
};
lime_system_System.get_fontsDirectory = function() {
	return null;
};
lime_system_System.get_numDisplays = function() {
	return 1;
};
lime_system_System.get_userDirectory = function() {
	return null;
};
lime_system_System.get_endianness = function() {
	return lime_system_Endian.LITTLE_ENDIAN;
};
var lime_system_ThreadPool = function(minThreads,maxThreads) {
	if(maxThreads == null) maxThreads = 1;
	if(minThreads == null) minThreads = 0;
	this.onProgress = new lime_app_Event_$Dynamic_$Void();
	this.onError = new lime_app_Event_$Dynamic_$Void();
	this.onComplete = new lime_app_Event_$Dynamic_$Void();
	this.doWork = new lime_app_Event_$Dynamic_$Void();
	this.minThreads = minThreads;
	this.maxThreads = maxThreads;
	this.currentThreads = 0;
};
$hxClasses["lime.system.ThreadPool"] = lime_system_ThreadPool;
lime_system_ThreadPool.__name__ = true;
lime_system_ThreadPool.prototype = {
	queue: function(state) {
		this.doWork.dispatch(state);
	}
	,sendComplete: function(state) {
		this.onComplete.dispatch(state);
	}
	,sendError: function(state) {
		this.onError.dispatch(state);
	}
	,sendProgress: function(state) {
		this.onProgress.dispatch(state);
	}
	,__class__: lime_system_ThreadPool
};
var lime_system__$ThreadPool_ThreadPoolMessageType = $hxClasses["lime.system._ThreadPool.ThreadPoolMessageType"] = { __ename__ : true, __constructs__ : ["COMPLETE","ERROR","EXIT","PROGRESS","WORK"] };
lime_system__$ThreadPool_ThreadPoolMessageType.COMPLETE = ["COMPLETE",0];
lime_system__$ThreadPool_ThreadPoolMessageType.COMPLETE.toString = $estr;
lime_system__$ThreadPool_ThreadPoolMessageType.COMPLETE.__enum__ = lime_system__$ThreadPool_ThreadPoolMessageType;
lime_system__$ThreadPool_ThreadPoolMessageType.ERROR = ["ERROR",1];
lime_system__$ThreadPool_ThreadPoolMessageType.ERROR.toString = $estr;
lime_system__$ThreadPool_ThreadPoolMessageType.ERROR.__enum__ = lime_system__$ThreadPool_ThreadPoolMessageType;
lime_system__$ThreadPool_ThreadPoolMessageType.EXIT = ["EXIT",2];
lime_system__$ThreadPool_ThreadPoolMessageType.EXIT.toString = $estr;
lime_system__$ThreadPool_ThreadPoolMessageType.EXIT.__enum__ = lime_system__$ThreadPool_ThreadPoolMessageType;
lime_system__$ThreadPool_ThreadPoolMessageType.PROGRESS = ["PROGRESS",3];
lime_system__$ThreadPool_ThreadPoolMessageType.PROGRESS.toString = $estr;
lime_system__$ThreadPool_ThreadPoolMessageType.PROGRESS.__enum__ = lime_system__$ThreadPool_ThreadPoolMessageType;
lime_system__$ThreadPool_ThreadPoolMessageType.WORK = ["WORK",4];
lime_system__$ThreadPool_ThreadPoolMessageType.WORK.toString = $estr;
lime_system__$ThreadPool_ThreadPoolMessageType.WORK.__enum__ = lime_system__$ThreadPool_ThreadPoolMessageType;
var lime_system__$ThreadPool_ThreadPoolMessage = function(type,state) {
	this.type = type;
	this.state = state;
};
$hxClasses["lime.system._ThreadPool.ThreadPoolMessage"] = lime_system__$ThreadPool_ThreadPoolMessage;
lime_system__$ThreadPool_ThreadPoolMessage.__name__ = true;
lime_system__$ThreadPool_ThreadPoolMessage.prototype = {
	__class__: lime_system__$ThreadPool_ThreadPoolMessage
};
var lime_text_Font = function(name) {
	if(name != null) this.name = name;
	if(this.__fontPath != null) this.__fromFile(this.__fontPath);
};
$hxClasses["lime.text.Font"] = lime_text_Font;
lime_text_Font.__name__ = true;
lime_text_Font.fromBytes = function(bytes) {
	var font = new lime_text_Font();
	font.__fromBytes(bytes);
	return font;
};
lime_text_Font.fromFile = function(path) {
	var font = new lime_text_Font();
	font.__fromFile(path);
	return font;
};
lime_text_Font.prototype = {
	decompose: function() {
		return null;
	}
	,getGlyph: function(character) {
		return -1;
	}
	,getGlyphs: function(characters) {
		if(characters == null) characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^`'\"/\\&*()[]{}<>|:;_-+=?,. ";
		return null;
	}
	,getGlyphMetrics: function(glyph) {
		return null;
	}
	,renderGlyph: function(glyph,fontSize) {
		return null;
	}
	,renderGlyphs: function(glyphs,fontSize) {
		return null;
	}
	,__fromBytes: function(bytes) {
		this.__fontPath = null;
	}
	,__fromFile: function(path) {
		this.__fontPath = path;
	}
	,get_ascender: function() {
		return 0;
	}
	,get_descender: function() {
		return 0;
	}
	,get_height: function() {
		return 0;
	}
	,get_numGlyphs: function() {
		return 0;
	}
	,get_underlinePosition: function() {
		return 0;
	}
	,get_underlineThickness: function() {
		return 0;
	}
	,get_unitsPerEM: function() {
		return 0;
	}
	,__class__: lime_text_Font
};
var lime_text__$Glyph_Glyph_$Impl_$ = {};
$hxClasses["lime.text._Glyph.Glyph_Impl_"] = lime_text__$Glyph_Glyph_$Impl_$;
lime_text__$Glyph_Glyph_$Impl_$.__name__ = true;
lime_text__$Glyph_Glyph_$Impl_$._new = function(i) {
	return i;
};
var lime_text_GlyphMetrics = function() {
};
$hxClasses["lime.text.GlyphMetrics"] = lime_text_GlyphMetrics;
lime_text_GlyphMetrics.__name__ = true;
lime_text_GlyphMetrics.prototype = {
	__class__: lime_text_GlyphMetrics
};
var lime_ui_Gamepad = function(id) {
	this.onDisconnect = new lime_app_Event_$Void_$Void();
	this.onButtonUp = new lime_app_Event_$lime_$ui_$GamepadButton_$Void();
	this.onButtonDown = new lime_app_Event_$lime_$ui_$GamepadButton_$Void();
	this.onAxisMove = new lime_app_Event_$lime_$ui_$GamepadAxis_$Float_$Void();
	this.id = id;
	this.connected = true;
};
$hxClasses["lime.ui.Gamepad"] = lime_ui_Gamepad;
lime_ui_Gamepad.__name__ = true;
lime_ui_Gamepad.addMappings = function(mappings) {
};
lime_ui_Gamepad.__connect = function(id) {
	if(!lime_ui_Gamepad.devices.h.hasOwnProperty(id)) {
		var gamepad = new lime_ui_Gamepad(id);
		lime_ui_Gamepad.devices.h[id] = gamepad;
		lime_ui_Gamepad.onConnect.dispatch(gamepad);
	}
};
lime_ui_Gamepad.__disconnect = function(id) {
	var gamepad = lime_ui_Gamepad.devices.h[id];
	if(gamepad != null) gamepad.connected = false;
	lime_ui_Gamepad.devices.remove(id);
	if(gamepad != null) gamepad.onDisconnect.dispatch();
};
lime_ui_Gamepad.prototype = {
	get_guid: function() {
		var devices = lime_ui_Joystick.__getDeviceData();
		return devices[this.id].id;
	}
	,get_name: function() {
		var devices = lime_ui_Joystick.__getDeviceData();
		return devices[this.id].id;
	}
	,__class__: lime_ui_Gamepad
};
var lime_ui__$GamepadAxis_GamepadAxis_$Impl_$ = {};
$hxClasses["lime.ui._GamepadAxis.GamepadAxis_Impl_"] = lime_ui__$GamepadAxis_GamepadAxis_$Impl_$;
lime_ui__$GamepadAxis_GamepadAxis_$Impl_$.__name__ = true;
lime_ui__$GamepadAxis_GamepadAxis_$Impl_$.toString = function(this1) {
	switch(this1) {
	case 0:
		return "LEFT_X";
	case 1:
		return "LEFT_Y";
	case 2:
		return "RIGHT_X";
	case 3:
		return "RIGHT_Y";
	case 4:
		return "TRIGGER_LEFT";
	case 5:
		return "TRIGGER_RIGHT";
	default:
		return "UNKNOWN (" + this1 + ")";
	}
};
var lime_ui__$GamepadButton_GamepadButton_$Impl_$ = {};
$hxClasses["lime.ui._GamepadButton.GamepadButton_Impl_"] = lime_ui__$GamepadButton_GamepadButton_$Impl_$;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.__name__ = true;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.toString = function(this1) {
	switch(this1) {
	case 0:
		return "A";
	case 1:
		return "B";
	case 2:
		return "X";
	case 3:
		return "Y";
	case 4:
		return "BACK";
	case 5:
		return "GUIDE";
	case 6:
		return "START";
	case 7:
		return "LEFT_STICK";
	case 8:
		return "RIGHT_STICK";
	case 9:
		return "LEFT_SHOULDER";
	case 10:
		return "RIGHT_SHOULDER";
	case 11:
		return "DPAD_UP";
	case 12:
		return "DPAD_DOWN";
	case 13:
		return "DPAD_LEFT";
	case 14:
		return "DPAD_RIGHT";
	default:
		return "UNKNOWN (" + this1 + ")";
	}
};
var lime_ui_Joystick = function(id) {
	this.onTrackballMove = new lime_app_Event_$Int_$Float_$Void();
	this.onHatMove = new lime_app_Event_$Int_$lime_$ui_$JoystickHatPosition_$Void();
	this.onDisconnect = new lime_app_Event_$Void_$Void();
	this.onButtonUp = new lime_app_Event_$Int_$Void();
	this.onButtonDown = new lime_app_Event_$Int_$Void();
	this.onAxisMove = new lime_app_Event_$Int_$Float_$Void();
	this.id = id;
	this.connected = true;
};
$hxClasses["lime.ui.Joystick"] = lime_ui_Joystick;
lime_ui_Joystick.__name__ = true;
lime_ui_Joystick.__connect = function(id) {
	if(!lime_ui_Joystick.devices.h.hasOwnProperty(id)) {
		var joystick = new lime_ui_Joystick(id);
		lime_ui_Joystick.devices.h[id] = joystick;
		lime_ui_Joystick.onConnect.dispatch(joystick);
	}
};
lime_ui_Joystick.__disconnect = function(id) {
	var joystick = lime_ui_Joystick.devices.h[id];
	if(joystick != null) joystick.connected = false;
	lime_ui_Joystick.devices.remove(id);
	if(joystick != null) joystick.onDisconnect.dispatch();
};
lime_ui_Joystick.__getDeviceData = function() {
	if(navigator.getGamepads) return navigator.getGamepads(); else if(navigator.webkitGetGamepads) return navigator.webkitGetGamepads(); else return null;
};
lime_ui_Joystick.prototype = {
	get_guid: function() {
		var devices = lime_ui_Joystick.__getDeviceData();
		return devices[this.id].id;
	}
	,get_name: function() {
		var devices = lime_ui_Joystick.__getDeviceData();
		return devices[this.id].id;
	}
	,get_numAxes: function() {
		var devices = lime_ui_Joystick.__getDeviceData();
		return devices[this.id].axes.length;
	}
	,get_numButtons: function() {
		var devices = lime_ui_Joystick.__getDeviceData();
		return devices[this.id].buttons.length;
	}
	,get_numHats: function() {
		return 0;
	}
	,get_numTrackballs: function() {
		return 0;
	}
	,__class__: lime_ui_Joystick
};
var lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$ = {};
$hxClasses["lime.ui._JoystickHatPosition.JoystickHatPosition_Impl_"] = lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.__name__ = true;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$._new = function(value) {
	return value;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.get_center = function(this1) {
	return this1 == 0;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.set_center = function(this1,value) {
	if(value) this1 = 0;
	return value;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.get_down = function(this1) {
	return (this1 & 4) > 0;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.set_down = function(this1,value) {
	if(value) this1 |= 4; else this1 &= 268435455 - 4;
	return value;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.get_left = function(this1) {
	return (this1 & 8) > 0;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.set_left = function(this1,value) {
	if(value) this1 |= 8; else this1 &= 268435455 - 8;
	return value;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.get_right = function(this1) {
	return (this1 & 2) > 0;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.set_right = function(this1,value) {
	if(value) this1 |= 2; else this1 &= 268435455 - 2;
	return value;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.get_up = function(this1) {
	return (this1 & 1) > 0;
};
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.set_up = function(this1,value) {
	if(value) this1 |= 1; else this1 &= 268435455 - 1;
	return value;
};
var lime_ui__$KeyCode_KeyCode_$Impl_$ = {};
$hxClasses["lime.ui._KeyCode.KeyCode_Impl_"] = lime_ui__$KeyCode_KeyCode_$Impl_$;
lime_ui__$KeyCode_KeyCode_$Impl_$.__name__ = true;
lime_ui__$KeyCode_KeyCode_$Impl_$.gt = function(a,b) {
	return a > b;
};
lime_ui__$KeyCode_KeyCode_$Impl_$.gte = function(a,b) {
	return a >= b;
};
lime_ui__$KeyCode_KeyCode_$Impl_$.lt = function(a,b) {
	return a < b;
};
lime_ui__$KeyCode_KeyCode_$Impl_$.lte = function(a,b) {
	return a <= b;
};
lime_ui__$KeyCode_KeyCode_$Impl_$.plus = function(a,b) {
	return a + b;
};
var lime_ui__$KeyModifier_KeyModifier_$Impl_$ = {};
$hxClasses["lime.ui._KeyModifier.KeyModifier_Impl_"] = lime_ui__$KeyModifier_KeyModifier_$Impl_$;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.__name__ = true;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.get_altKey = function(this1) {
	return (this1 & 256) > 0 || (this1 & 512) > 0;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.set_altKey = function(this1,value) {
	if(value) this1 |= 768; else this1 &= 268435455 - 768;
	return value;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.get_capsLock = function(this1) {
	return (this1 & 8192) > 0 || (this1 & 8192) > 0;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.set_capsLock = function(this1,value) {
	if(value) this1 |= 8192; else this1 &= 268435455 - 8192;
	return value;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.get_ctrlKey = function(this1) {
	return (this1 & 64) > 0 || (this1 & 128) > 0;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.set_ctrlKey = function(this1,value) {
	if(value) this1 |= 192; else this1 &= 268435455 - 192;
	return value;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.get_metaKey = function(this1) {
	return (this1 & 1024) > 0 || (this1 & 2048) > 0;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.set_metaKey = function(this1,value) {
	if(value) this1 |= 3072; else this1 &= 268435455 - 3072;
	return value;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.get_numLock = function(this1) {
	return (this1 & 4096) > 0 || (this1 & 4096) > 0;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.set_numLock = function(this1,value) {
	if(value) this1 |= 4096; else this1 &= 268435455 - 4096;
	return value;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.get_shiftKey = function(this1) {
	return (this1 & 1) > 0 || (this1 & 2) > 0;
};
lime_ui__$KeyModifier_KeyModifier_$Impl_$.set_shiftKey = function(this1,value) {
	if(value) this1 |= 3; else this1 &= 268435455 - 3;
	return value;
};
var lime_ui_Touch = function(x,y,id,dx,dy,pressure,device) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.dx = dx;
	this.dy = dy;
	this.pressure = pressure;
	this.device = device;
};
$hxClasses["lime.ui.Touch"] = lime_ui_Touch;
lime_ui_Touch.__name__ = true;
lime_ui_Touch.prototype = {
	__class__: lime_ui_Touch
};
var lime_ui_Window = function(config) {
	this.onTextInput = new lime_app_Event_$String_$Void();
	this.onTextEdit = new lime_app_Event_$String_$Int_$Int_$Void();
	this.onRestore = new lime_app_Event_$Void_$Void();
	this.onResize = new lime_app_Event_$Int_$Int_$Void();
	this.onMove = new lime_app_Event_$Float_$Float_$Void();
	this.onMouseWheel = new lime_app_Event_$Float_$Float_$Void();
	this.onMouseUp = new lime_app_Event_$Float_$Float_$Int_$Void();
	this.onMouseMoveRelative = new lime_app_Event_$Float_$Float_$Void();
	this.onMouseMove = new lime_app_Event_$Float_$Float_$Void();
	this.onMouseDown = new lime_app_Event_$Float_$Float_$Int_$Void();
	this.onMinimize = new lime_app_Event_$Void_$Void();
	this.onLeave = new lime_app_Event_$Void_$Void();
	this.onKeyUp = new lime_app_Event_$lime_$ui_$KeyCode_$lime_$ui_$KeyModifier_$Void();
	this.onKeyDown = new lime_app_Event_$lime_$ui_$KeyCode_$lime_$ui_$KeyModifier_$Void();
	this.onFullscreen = new lime_app_Event_$Void_$Void();
	this.onFocusOut = new lime_app_Event_$Void_$Void();
	this.onFocusIn = new lime_app_Event_$Void_$Void();
	this.onEnter = new lime_app_Event_$Void_$Void();
	this.onDeactivate = new lime_app_Event_$Void_$Void();
	this.onCreate = new lime_app_Event_$Void_$Void();
	this.onClose = new lime_app_Event_$Void_$Void();
	this.onActivate = new lime_app_Event_$Void_$Void();
	this.config = config;
	this.__width = 0;
	this.__height = 0;
	this.__fullscreen = false;
	this.__scale = 1;
	this.__x = 0;
	this.__y = 0;
	this.__title = "";
	this.id = -1;
	if(config != null) {
		if(Object.prototype.hasOwnProperty.call(config,"width")) this.__width = config.width;
		if(Object.prototype.hasOwnProperty.call(config,"height")) this.__height = config.height;
		if(Object.prototype.hasOwnProperty.call(config,"x")) this.__x = config.x;
		if(Object.prototype.hasOwnProperty.call(config,"y")) this.__y = config.y;
		if(Object.prototype.hasOwnProperty.call(config,"fullscreen")) this.__fullscreen = config.fullscreen;
		if(Object.prototype.hasOwnProperty.call(config,"borderless")) this.__borderless = config.borderless;
		if(Object.prototype.hasOwnProperty.call(config,"resizable")) this.__resizable = config.resizable;
		if(Object.prototype.hasOwnProperty.call(config,"title")) this.__title = config.title;
	}
	this.backend = new lime__$backend_html5_HTML5Window(this);
};
$hxClasses["lime.ui.Window"] = lime_ui_Window;
lime_ui_Window.__name__ = true;
lime_ui_Window.prototype = {
	alert: function(message,title) {
		this.backend.alert(message,title);
	}
	,close: function() {
		this.backend.close();
	}
	,create: function(application) {
		this.application = application;
		this.backend.create(application);
		if(this.renderer != null) this.renderer.create();
	}
	,focus: function() {
		this.backend.focus();
	}
	,move: function(x,y) {
		this.backend.move(x,y);
		this.__x = x;
		this.__y = y;
	}
	,resize: function(width,height) {
		this.backend.resize(width,height);
		this.__width = width;
		this.__height = height;
	}
	,setIcon: function(image) {
		if(image == null) return;
		this.backend.setIcon(image);
	}
	,toString: function() {
		return "[object Window]";
	}
	,get_display: function() {
		return this.backend.getDisplay();
	}
	,get_borderless: function() {
		return this.__borderless;
	}
	,set_borderless: function(value) {
		return this.__borderless = this.backend.setBorderless(value);
	}
	,get_enableTextEvents: function() {
		return this.backend.getEnableTextEvents();
	}
	,set_enableTextEvents: function(value) {
		return this.backend.setEnableTextEvents(value);
	}
	,get_fullscreen: function() {
		return this.__fullscreen;
	}
	,set_fullscreen: function(value) {
		return this.__fullscreen = this.backend.setFullscreen(value);
	}
	,get_height: function() {
		return this.__height;
	}
	,set_height: function(value) {
		this.resize(this.__width,value);
		return this.__height;
	}
	,get_minimized: function() {
		return this.__minimized;
	}
	,set_minimized: function(value) {
		return this.__minimized = this.backend.setMinimized(value);
	}
	,get_resizable: function() {
		return this.__resizable;
	}
	,set_resizable: function(value) {
		this.__resizable = this.backend.setResizable(value);
		return this.__resizable;
	}
	,get_scale: function() {
		return this.__scale;
	}
	,get_title: function() {
		return this.__title;
	}
	,set_title: function(value) {
		return this.__title = this.backend.setTitle(this.__title);
	}
	,get_width: function() {
		return this.__width;
	}
	,set_width: function(value) {
		this.resize(value,this.__height);
		return this.__width;
	}
	,get_x: function() {
		return this.__x;
	}
	,set_x: function(value) {
		this.move(value,this.__y);
		return this.__x;
	}
	,get_y: function() {
		return this.__y;
	}
	,set_y: function(value) {
		this.move(this.__x,value);
		return this.__y;
	}
	,__class__: lime_ui_Window
};
var lime_utils_TAError = $hxClasses["lime.utils.TAError"] = { __ename__ : true, __constructs__ : ["RangeError"] };
lime_utils_TAError.RangeError = ["RangeError",0];
lime_utils_TAError.RangeError.toString = $estr;
lime_utils_TAError.RangeError.__enum__ = lime_utils_TAError;
var lime_utils_Bytes = function(length,bytesData) {
	haxe_io_Bytes.call(this,bytesData);
};
$hxClasses["lime.utils.Bytes"] = lime_utils_Bytes;
lime_utils_Bytes.__name__ = true;
lime_utils_Bytes.alloc = function(length) {
	var bytes = haxe_io_Bytes.alloc(length);
	return new lime_utils_Bytes(bytes.length,bytes.b.bufferValue);
};
lime_utils_Bytes.fastGet = function(b,pos) {
	return b.bytes[pos];
};
lime_utils_Bytes.ofData = function(b) {
	var bytes = haxe_io_Bytes.ofData(b);
	return new lime_utils_Bytes(bytes.length,bytes.b.bufferValue);
};
lime_utils_Bytes.ofString = function(s) {
	var bytes = haxe_io_Bytes.ofString(s);
	return new lime_utils_Bytes(bytes.length,bytes.b.bufferValue);
};
lime_utils_Bytes.readFile = function(path) {
	return null;
};
lime_utils_Bytes.lime_bytes_from_data_pointer = function(data,length) {
	return lime_utils_Bytes.cffi_lime_bytes_from_data_pointer(data,length);
};
lime_utils_Bytes.lime_bytes_get_data_pointer = function(data) {
	return lime_utils_Bytes.cffi_lime_bytes_get_data_pointer(data);
};
lime_utils_Bytes.lime_bytes_read_file = function(path) {
	return lime_utils_Bytes.cffi_lime_bytes_read_file(path);
};
lime_utils_Bytes.__super__ = haxe_io_Bytes;
lime_utils_Bytes.prototype = $extend(haxe_io_Bytes.prototype,{
	__class__: lime_utils_Bytes
});
var lime_utils__$Float32Array_Float32Array_$Impl_$ = {};
$hxClasses["lime.utils._Float32Array.Float32Array_Impl_"] = lime_utils__$Float32Array_Float32Array_$Impl_$;
lime_utils__$Float32Array_Float32Array_$Impl_$.__name__ = true;
lime_utils__$Float32Array_Float32Array_$Impl_$.__set = function(this1,idx,val) {
	return this1[idx] = val;
};
lime_utils__$Float32Array_Float32Array_$Impl_$.__get = function(this1,idx) {
	return this1[idx];
};
lime_utils__$Float32Array_Float32Array_$Impl_$.fromBytes = function(bytes,byteOffset,len) {
	if(byteOffset == null) byteOffset = 0;
	if(byteOffset == null) return new Float32Array(bytes.b.bufferValue);
	if(len == null) return new Float32Array(bytes.b.bufferValue,byteOffset);
	return new Float32Array(bytes.b.bufferValue,byteOffset,len);
};
lime_utils__$Float32Array_Float32Array_$Impl_$.toBytes = function(this1) {
	return new haxe_io_Bytes(new Uint8Array(this1.buffer));
};
lime_utils__$Float32Array_Float32Array_$Impl_$.toString = function(this1) {
	if(this1 != null) return "Float32Array [byteLength:" + this1.byteLength + ", length:" + this1.length + "]"; else return null;
};
var lime_utils__$Int32Array_Int32Array_$Impl_$ = {};
$hxClasses["lime.utils._Int32Array.Int32Array_Impl_"] = lime_utils__$Int32Array_Int32Array_$Impl_$;
lime_utils__$Int32Array_Int32Array_$Impl_$.__name__ = true;
lime_utils__$Int32Array_Int32Array_$Impl_$.__set = function(this1,idx,val) {
	return this1[idx] = val;
};
lime_utils__$Int32Array_Int32Array_$Impl_$.__get = function(this1,idx) {
	return this1[idx];
};
lime_utils__$Int32Array_Int32Array_$Impl_$.fromBytes = function(bytes,byteOffset,len) {
	if(byteOffset == null) byteOffset = 0;
	if(byteOffset == null) return new Int32Array(bytes.b.bufferValue);
	if(len == null) return new Int32Array(bytes.b.bufferValue,byteOffset);
	return new Int32Array(bytes.b.bufferValue,byteOffset,len);
};
lime_utils__$Int32Array_Int32Array_$Impl_$.toBytes = function(this1) {
	return new haxe_io_Bytes(new Uint8Array(this1.buffer));
};
lime_utils__$Int32Array_Int32Array_$Impl_$.toString = function(this1) {
	if(this1 != null) return "Int32Array [byteLength:" + this1.byteLength + ", length:" + this1.length + "]"; else return null;
};
var lime_utils__$UInt32Array_UInt32Array_$Impl_$ = {};
$hxClasses["lime.utils._UInt32Array.UInt32Array_Impl_"] = lime_utils__$UInt32Array_UInt32Array_$Impl_$;
lime_utils__$UInt32Array_UInt32Array_$Impl_$.__name__ = true;
lime_utils__$UInt32Array_UInt32Array_$Impl_$.__set = function(this1,idx,val) {
	return this1[idx] = val;
};
lime_utils__$UInt32Array_UInt32Array_$Impl_$.__get = function(this1,idx) {
	return this1[idx];
};
lime_utils__$UInt32Array_UInt32Array_$Impl_$.fromBytes = function(bytes,byteOffset,len) {
	if(byteOffset == null) byteOffset = 0;
	if(byteOffset == null) return new Uint32Array(bytes.b.bufferValue);
	if(len == null) return new Uint32Array(bytes.b.bufferValue,byteOffset);
	return new Uint32Array(bytes.b.bufferValue,byteOffset,len);
};
lime_utils__$UInt32Array_UInt32Array_$Impl_$.toBytes = function(this1) {
	return new haxe_io_Bytes(new Uint8Array(this1.buffer));
};
lime_utils__$UInt32Array_UInt32Array_$Impl_$.toString = function(this1) {
	if(this1 != null) return "UInt32Array [byteLength:" + this1.byteLength + ", length:" + this1.length + "]"; else return null;
};
var lime_utils__$UInt8Array_UInt8Array_$Impl_$ = {};
$hxClasses["lime.utils._UInt8Array.UInt8Array_Impl_"] = lime_utils__$UInt8Array_UInt8Array_$Impl_$;
lime_utils__$UInt8Array_UInt8Array_$Impl_$.__name__ = true;
lime_utils__$UInt8Array_UInt8Array_$Impl_$.__set = function(this1,idx,val) {
	return this1[idx] = val;
};
lime_utils__$UInt8Array_UInt8Array_$Impl_$.__get = function(this1,idx) {
	return this1[idx];
};
lime_utils__$UInt8Array_UInt8Array_$Impl_$.fromBytes = function(bytes,byteOffset,len) {
	if(byteOffset == null) return new Uint8Array(bytes.b.bufferValue);
	if(len == null) return new Uint8Array(bytes.b.bufferValue,byteOffset);
	return new Uint8Array(bytes.b.bufferValue,byteOffset,len);
};
lime_utils__$UInt8Array_UInt8Array_$Impl_$.toBytes = function(this1) {
	return new haxe_io_Bytes(new Uint8Array(this1.buffer));
};
lime_utils__$UInt8Array_UInt8Array_$Impl_$.toString = function(this1) {
	if(this1 != null) return "UInt8Array [byteLength:" + this1.byteLength + ", length:" + this1.length + "]"; else return null;
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
$hxClasses.Array = Array;
Array.__name__ = true;
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
var this1;
this1 = new Uint32Array(256);
lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16 = this1;
var _g = 0;
while(_g < 256) {
	var i = _g++;
	var val = Math.ceil(i * 257.00392156862745);
	lime_math_color__$RGBA_RGBA_$Impl_$.__alpha16[i] = val;
}
var this2;
this2 = new Uint8Array(510);
lime_math_color__$RGBA_RGBA_$Impl_$.__clamp = this2;
var _g1 = 0;
while(_g1 < 255) {
	var i1 = _g1++;
	lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[i1] = i1;
}
var _g11 = 255;
var _g2 = 511;
while(_g11 < _g2) {
	var i2 = _g11++;
	lime_math_color__$RGBA_RGBA_$Impl_$.__clamp[i2] = 255;
}
lime_system_CFFI.available = false;
lime_system_CFFI.enabled = false;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
lime_Assets.cache = new lime_AssetCache();
lime_Assets.libraries = new haxe_ds_StringMap();
lime_Assets.onChange = new lime_app_Event_$Void_$Void();
lime_Assets.initialized = false;
lime__$backend_html5_HTML5Window.windowID = 0;
lime_app_Preloader.images = new haxe_ds_StringMap();
lime_app_Preloader.loaders = new haxe_ds_StringMap();
lime_audio_openal_AL.NONE = 0;
lime_audio_openal_AL.FALSE = 0;
lime_audio_openal_AL.TRUE = 1;
lime_audio_openal_AL.SOURCE_RELATIVE = 514;
lime_audio_openal_AL.CONE_INNER_ANGLE = 4097;
lime_audio_openal_AL.CONE_OUTER_ANGLE = 4098;
lime_audio_openal_AL.PITCH = 4099;
lime_audio_openal_AL.POSITION = 4100;
lime_audio_openal_AL.DIRECTION = 4101;
lime_audio_openal_AL.VELOCITY = 4102;
lime_audio_openal_AL.LOOPING = 4103;
lime_audio_openal_AL.BUFFER = 4105;
lime_audio_openal_AL.GAIN = 4106;
lime_audio_openal_AL.MIN_GAIN = 4109;
lime_audio_openal_AL.MAX_GAIN = 4110;
lime_audio_openal_AL.ORIENTATION = 4111;
lime_audio_openal_AL.SOURCE_STATE = 4112;
lime_audio_openal_AL.INITIAL = 4113;
lime_audio_openal_AL.PLAYING = 4114;
lime_audio_openal_AL.PAUSED = 4115;
lime_audio_openal_AL.STOPPED = 4116;
lime_audio_openal_AL.BUFFERS_QUEUED = 4117;
lime_audio_openal_AL.BUFFERS_PROCESSED = 4118;
lime_audio_openal_AL.REFERENCE_DISTANCE = 4128;
lime_audio_openal_AL.ROLLOFF_FACTOR = 4129;
lime_audio_openal_AL.CONE_OUTER_GAIN = 4130;
lime_audio_openal_AL.MAX_DISTANCE = 4131;
lime_audio_openal_AL.SEC_OFFSET = 4132;
lime_audio_openal_AL.SAMPLE_OFFSET = 4133;
lime_audio_openal_AL.BYTE_OFFSET = 4134;
lime_audio_openal_AL.SOURCE_TYPE = 4135;
lime_audio_openal_AL.STATIC = 4136;
lime_audio_openal_AL.STREAMING = 4137;
lime_audio_openal_AL.UNDETERMINED = 4144;
lime_audio_openal_AL.FORMAT_MONO8 = 4352;
lime_audio_openal_AL.FORMAT_MONO16 = 4353;
lime_audio_openal_AL.FORMAT_STEREO8 = 4354;
lime_audio_openal_AL.FORMAT_STEREO16 = 4355;
lime_audio_openal_AL.FREQUENCY = 8193;
lime_audio_openal_AL.BITS = 8194;
lime_audio_openal_AL.CHANNELS = 8195;
lime_audio_openal_AL.SIZE = 8196;
lime_audio_openal_AL.NO_ERROR = 0;
lime_audio_openal_AL.INVALID_NAME = 40961;
lime_audio_openal_AL.INVALID_ENUM = 40962;
lime_audio_openal_AL.INVALID_VALUE = 40963;
lime_audio_openal_AL.INVALID_OPERATION = 40964;
lime_audio_openal_AL.OUT_OF_MEMORY = 40965;
lime_audio_openal_AL.VENDOR = 45057;
lime_audio_openal_AL.VERSION = 45058;
lime_audio_openal_AL.RENDERER = 45059;
lime_audio_openal_AL.EXTENSIONS = 45060;
lime_audio_openal_AL.DOPPLER_FACTOR = 49152;
lime_audio_openal_AL.SPEED_OF_SOUND = 49155;
lime_audio_openal_AL.DOPPLER_VELOCITY = 49153;
lime_audio_openal_AL.DISTANCE_MODEL = 53248;
lime_audio_openal_AL.INVERSE_DISTANCE = 53249;
lime_audio_openal_AL.INVERSE_DISTANCE_CLAMPED = 53250;
lime_audio_openal_AL.LINEAR_DISTANCE = 53251;
lime_audio_openal_AL.LINEAR_DISTANCE_CLAMPED = 53252;
lime_audio_openal_AL.EXPONENT_DISTANCE = 53253;
lime_audio_openal_AL.EXPONENT_DISTANCE_CLAMPED = 53254;
lime_audio_openal_ALC.FALSE = 0;
lime_audio_openal_ALC.TRUE = 1;
lime_audio_openal_ALC.FREQUENCY = 4103;
lime_audio_openal_ALC.REFRESH = 4104;
lime_audio_openal_ALC.SYNC = 4105;
lime_audio_openal_ALC.MONO_SOURCES = 4112;
lime_audio_openal_ALC.STEREO_SOURCES = 4113;
lime_audio_openal_ALC.NO_ERROR = 0;
lime_audio_openal_ALC.INVALID_DEVICE = 40961;
lime_audio_openal_ALC.INVALID_CONTEXT = 40962;
lime_audio_openal_ALC.INVALID_ENUM = 40963;
lime_audio_openal_ALC.INVALID_VALUE = 40964;
lime_audio_openal_ALC.OUT_OF_MEMORY = 40965;
lime_audio_openal_ALC.ATTRIBUTES_SIZE = 4098;
lime_audio_openal_ALC.ALL_ATTRIBUTES = 4099;
lime_audio_openal_ALC.DEFAULT_DEVICE_SPECIFIER = 4100;
lime_audio_openal_ALC.DEVICE_SPECIFIER = 4101;
lime_audio_openal_ALC.EXTENSIONS = 4102;
lime_audio_openal_ALC.ENUMERATE_ALL_EXT = 1;
lime_audio_openal_ALC.DEFAULT_ALL_DEVICES_SPECIFIER = 4114;
lime_audio_openal_ALC.ALL_DEVICES_SPECIFIER = 4115;
lime_graphics_Image.__base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
lime_graphics_opengl_GL.DEPTH_BUFFER_BIT = 256;
lime_graphics_opengl_GL.STENCIL_BUFFER_BIT = 1024;
lime_graphics_opengl_GL.COLOR_BUFFER_BIT = 16384;
lime_graphics_opengl_GL.POINTS = 0;
lime_graphics_opengl_GL.LINES = 1;
lime_graphics_opengl_GL.LINE_LOOP = 2;
lime_graphics_opengl_GL.LINE_STRIP = 3;
lime_graphics_opengl_GL.TRIANGLES = 4;
lime_graphics_opengl_GL.TRIANGLE_STRIP = 5;
lime_graphics_opengl_GL.TRIANGLE_FAN = 6;
lime_graphics_opengl_GL.ZERO = 0;
lime_graphics_opengl_GL.ONE = 1;
lime_graphics_opengl_GL.SRC_COLOR = 768;
lime_graphics_opengl_GL.ONE_MINUS_SRC_COLOR = 769;
lime_graphics_opengl_GL.SRC_ALPHA = 770;
lime_graphics_opengl_GL.ONE_MINUS_SRC_ALPHA = 771;
lime_graphics_opengl_GL.DST_ALPHA = 772;
lime_graphics_opengl_GL.ONE_MINUS_DST_ALPHA = 773;
lime_graphics_opengl_GL.DST_COLOR = 774;
lime_graphics_opengl_GL.ONE_MINUS_DST_COLOR = 775;
lime_graphics_opengl_GL.SRC_ALPHA_SATURATE = 776;
lime_graphics_opengl_GL.FUNC_ADD = 32774;
lime_graphics_opengl_GL.BLEND_EQUATION = 32777;
lime_graphics_opengl_GL.BLEND_EQUATION_RGB = 32777;
lime_graphics_opengl_GL.BLEND_EQUATION_ALPHA = 34877;
lime_graphics_opengl_GL.FUNC_SUBTRACT = 32778;
lime_graphics_opengl_GL.FUNC_REVERSE_SUBTRACT = 32779;
lime_graphics_opengl_GL.BLEND_DST_RGB = 32968;
lime_graphics_opengl_GL.BLEND_SRC_RGB = 32969;
lime_graphics_opengl_GL.BLEND_DST_ALPHA = 32970;
lime_graphics_opengl_GL.BLEND_SRC_ALPHA = 32971;
lime_graphics_opengl_GL.CONSTANT_COLOR = 32769;
lime_graphics_opengl_GL.ONE_MINUS_CONSTANT_COLOR = 32770;
lime_graphics_opengl_GL.CONSTANT_ALPHA = 32771;
lime_graphics_opengl_GL.ONE_MINUS_CONSTANT_ALPHA = 32772;
lime_graphics_opengl_GL.BLEND_COLOR = 32773;
lime_graphics_opengl_GL.ARRAY_BUFFER = 34962;
lime_graphics_opengl_GL.ELEMENT_ARRAY_BUFFER = 34963;
lime_graphics_opengl_GL.ARRAY_BUFFER_BINDING = 34964;
lime_graphics_opengl_GL.ELEMENT_ARRAY_BUFFER_BINDING = 34965;
lime_graphics_opengl_GL.STREAM_DRAW = 35040;
lime_graphics_opengl_GL.STATIC_DRAW = 35044;
lime_graphics_opengl_GL.DYNAMIC_DRAW = 35048;
lime_graphics_opengl_GL.BUFFER_SIZE = 34660;
lime_graphics_opengl_GL.BUFFER_USAGE = 34661;
lime_graphics_opengl_GL.CURRENT_VERTEX_ATTRIB = 34342;
lime_graphics_opengl_GL.FRONT = 1028;
lime_graphics_opengl_GL.BACK = 1029;
lime_graphics_opengl_GL.FRONT_AND_BACK = 1032;
lime_graphics_opengl_GL.CULL_FACE = 2884;
lime_graphics_opengl_GL.BLEND = 3042;
lime_graphics_opengl_GL.DITHER = 3024;
lime_graphics_opengl_GL.STENCIL_TEST = 2960;
lime_graphics_opengl_GL.DEPTH_TEST = 2929;
lime_graphics_opengl_GL.SCISSOR_TEST = 3089;
lime_graphics_opengl_GL.POLYGON_OFFSET_FILL = 32823;
lime_graphics_opengl_GL.SAMPLE_ALPHA_TO_COVERAGE = 32926;
lime_graphics_opengl_GL.SAMPLE_COVERAGE = 32928;
lime_graphics_opengl_GL.NO_ERROR = 0;
lime_graphics_opengl_GL.INVALID_ENUM = 1280;
lime_graphics_opengl_GL.INVALID_VALUE = 1281;
lime_graphics_opengl_GL.INVALID_OPERATION = 1282;
lime_graphics_opengl_GL.OUT_OF_MEMORY = 1285;
lime_graphics_opengl_GL.CW = 2304;
lime_graphics_opengl_GL.CCW = 2305;
lime_graphics_opengl_GL.LINE_WIDTH = 2849;
lime_graphics_opengl_GL.ALIASED_POINT_SIZE_RANGE = 33901;
lime_graphics_opengl_GL.ALIASED_LINE_WIDTH_RANGE = 33902;
lime_graphics_opengl_GL.CULL_FACE_MODE = 2885;
lime_graphics_opengl_GL.FRONT_FACE = 2886;
lime_graphics_opengl_GL.DEPTH_RANGE = 2928;
lime_graphics_opengl_GL.DEPTH_WRITEMASK = 2930;
lime_graphics_opengl_GL.DEPTH_CLEAR_VALUE = 2931;
lime_graphics_opengl_GL.DEPTH_FUNC = 2932;
lime_graphics_opengl_GL.STENCIL_CLEAR_VALUE = 2961;
lime_graphics_opengl_GL.STENCIL_FUNC = 2962;
lime_graphics_opengl_GL.STENCIL_FAIL = 2964;
lime_graphics_opengl_GL.STENCIL_PASS_DEPTH_FAIL = 2965;
lime_graphics_opengl_GL.STENCIL_PASS_DEPTH_PASS = 2966;
lime_graphics_opengl_GL.STENCIL_REF = 2967;
lime_graphics_opengl_GL.STENCIL_VALUE_MASK = 2963;
lime_graphics_opengl_GL.STENCIL_WRITEMASK = 2968;
lime_graphics_opengl_GL.STENCIL_BACK_FUNC = 34816;
lime_graphics_opengl_GL.STENCIL_BACK_FAIL = 34817;
lime_graphics_opengl_GL.STENCIL_BACK_PASS_DEPTH_FAIL = 34818;
lime_graphics_opengl_GL.STENCIL_BACK_PASS_DEPTH_PASS = 34819;
lime_graphics_opengl_GL.STENCIL_BACK_REF = 36003;
lime_graphics_opengl_GL.STENCIL_BACK_VALUE_MASK = 36004;
lime_graphics_opengl_GL.STENCIL_BACK_WRITEMASK = 36005;
lime_graphics_opengl_GL.VIEWPORT = 2978;
lime_graphics_opengl_GL.SCISSOR_BOX = 3088;
lime_graphics_opengl_GL.COLOR_CLEAR_VALUE = 3106;
lime_graphics_opengl_GL.COLOR_WRITEMASK = 3107;
lime_graphics_opengl_GL.UNPACK_ALIGNMENT = 3317;
lime_graphics_opengl_GL.PACK_ALIGNMENT = 3333;
lime_graphics_opengl_GL.MAX_TEXTURE_SIZE = 3379;
lime_graphics_opengl_GL.MAX_VIEWPORT_DIMS = 3386;
lime_graphics_opengl_GL.SUBPIXEL_BITS = 3408;
lime_graphics_opengl_GL.RED_BITS = 3410;
lime_graphics_opengl_GL.GREEN_BITS = 3411;
lime_graphics_opengl_GL.BLUE_BITS = 3412;
lime_graphics_opengl_GL.ALPHA_BITS = 3413;
lime_graphics_opengl_GL.DEPTH_BITS = 3414;
lime_graphics_opengl_GL.STENCIL_BITS = 3415;
lime_graphics_opengl_GL.POLYGON_OFFSET_UNITS = 10752;
lime_graphics_opengl_GL.POLYGON_OFFSET_FACTOR = 32824;
lime_graphics_opengl_GL.TEXTURE_BINDING_2D = 32873;
lime_graphics_opengl_GL.SAMPLE_BUFFERS = 32936;
lime_graphics_opengl_GL.SAMPLES = 32937;
lime_graphics_opengl_GL.SAMPLE_COVERAGE_VALUE = 32938;
lime_graphics_opengl_GL.SAMPLE_COVERAGE_INVERT = 32939;
lime_graphics_opengl_GL.COMPRESSED_TEXTURE_FORMATS = 34467;
lime_graphics_opengl_GL.DONT_CARE = 4352;
lime_graphics_opengl_GL.FASTEST = 4353;
lime_graphics_opengl_GL.NICEST = 4354;
lime_graphics_opengl_GL.GENERATE_MIPMAP_HINT = 33170;
lime_graphics_opengl_GL.BYTE = 5120;
lime_graphics_opengl_GL.UNSIGNED_BYTE = 5121;
lime_graphics_opengl_GL.SHORT = 5122;
lime_graphics_opengl_GL.UNSIGNED_SHORT = 5123;
lime_graphics_opengl_GL.INT = 5124;
lime_graphics_opengl_GL.UNSIGNED_INT = 5125;
lime_graphics_opengl_GL.FLOAT = 5126;
lime_graphics_opengl_GL.DEPTH_COMPONENT = 6402;
lime_graphics_opengl_GL.ALPHA = 6406;
lime_graphics_opengl_GL.RGB = 6407;
lime_graphics_opengl_GL.RGBA = 6408;
lime_graphics_opengl_GL.BGR_EXT = 32992;
lime_graphics_opengl_GL.BGRA_EXT = 32993;
lime_graphics_opengl_GL.LUMINANCE = 6409;
lime_graphics_opengl_GL.LUMINANCE_ALPHA = 6410;
lime_graphics_opengl_GL.UNSIGNED_SHORT_4_4_4_4 = 32819;
lime_graphics_opengl_GL.UNSIGNED_SHORT_5_5_5_1 = 32820;
lime_graphics_opengl_GL.UNSIGNED_SHORT_5_6_5 = 33635;
lime_graphics_opengl_GL.FRAGMENT_SHADER = 35632;
lime_graphics_opengl_GL.VERTEX_SHADER = 35633;
lime_graphics_opengl_GL.MAX_VERTEX_ATTRIBS = 34921;
lime_graphics_opengl_GL.MAX_VERTEX_UNIFORM_VECTORS = 36347;
lime_graphics_opengl_GL.MAX_VARYING_VECTORS = 36348;
lime_graphics_opengl_GL.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661;
lime_graphics_opengl_GL.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660;
lime_graphics_opengl_GL.MAX_TEXTURE_IMAGE_UNITS = 34930;
lime_graphics_opengl_GL.MAX_FRAGMENT_UNIFORM_VECTORS = 36349;
lime_graphics_opengl_GL.SHADER_TYPE = 35663;
lime_graphics_opengl_GL.DELETE_STATUS = 35712;
lime_graphics_opengl_GL.LINK_STATUS = 35714;
lime_graphics_opengl_GL.VALIDATE_STATUS = 35715;
lime_graphics_opengl_GL.ATTACHED_SHADERS = 35717;
lime_graphics_opengl_GL.ACTIVE_UNIFORMS = 35718;
lime_graphics_opengl_GL.ACTIVE_ATTRIBUTES = 35721;
lime_graphics_opengl_GL.SHADING_LANGUAGE_VERSION = 35724;
lime_graphics_opengl_GL.CURRENT_PROGRAM = 35725;
lime_graphics_opengl_GL.NEVER = 512;
lime_graphics_opengl_GL.LESS = 513;
lime_graphics_opengl_GL.EQUAL = 514;
lime_graphics_opengl_GL.LEQUAL = 515;
lime_graphics_opengl_GL.GREATER = 516;
lime_graphics_opengl_GL.NOTEQUAL = 517;
lime_graphics_opengl_GL.GEQUAL = 518;
lime_graphics_opengl_GL.ALWAYS = 519;
lime_graphics_opengl_GL.KEEP = 7680;
lime_graphics_opengl_GL.REPLACE = 7681;
lime_graphics_opengl_GL.INCR = 7682;
lime_graphics_opengl_GL.DECR = 7683;
lime_graphics_opengl_GL.INVERT = 5386;
lime_graphics_opengl_GL.INCR_WRAP = 34055;
lime_graphics_opengl_GL.DECR_WRAP = 34056;
lime_graphics_opengl_GL.VENDOR = 7936;
lime_graphics_opengl_GL.RENDERER = 7937;
lime_graphics_opengl_GL.VERSION = 7938;
lime_graphics_opengl_GL.NEAREST = 9728;
lime_graphics_opengl_GL.LINEAR = 9729;
lime_graphics_opengl_GL.NEAREST_MIPMAP_NEAREST = 9984;
lime_graphics_opengl_GL.LINEAR_MIPMAP_NEAREST = 9985;
lime_graphics_opengl_GL.NEAREST_MIPMAP_LINEAR = 9986;
lime_graphics_opengl_GL.LINEAR_MIPMAP_LINEAR = 9987;
lime_graphics_opengl_GL.TEXTURE_MAG_FILTER = 10240;
lime_graphics_opengl_GL.TEXTURE_MIN_FILTER = 10241;
lime_graphics_opengl_GL.TEXTURE_WRAP_S = 10242;
lime_graphics_opengl_GL.TEXTURE_WRAP_T = 10243;
lime_graphics_opengl_GL.TEXTURE_2D = 3553;
lime_graphics_opengl_GL.TEXTURE = 5890;
lime_graphics_opengl_GL.TEXTURE_CUBE_MAP = 34067;
lime_graphics_opengl_GL.TEXTURE_BINDING_CUBE_MAP = 34068;
lime_graphics_opengl_GL.TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
lime_graphics_opengl_GL.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
lime_graphics_opengl_GL.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
lime_graphics_opengl_GL.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
lime_graphics_opengl_GL.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
lime_graphics_opengl_GL.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
lime_graphics_opengl_GL.MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
lime_graphics_opengl_GL.TEXTURE0 = 33984;
lime_graphics_opengl_GL.TEXTURE1 = 33985;
lime_graphics_opengl_GL.TEXTURE2 = 33986;
lime_graphics_opengl_GL.TEXTURE3 = 33987;
lime_graphics_opengl_GL.TEXTURE4 = 33988;
lime_graphics_opengl_GL.TEXTURE5 = 33989;
lime_graphics_opengl_GL.TEXTURE6 = 33990;
lime_graphics_opengl_GL.TEXTURE7 = 33991;
lime_graphics_opengl_GL.TEXTURE8 = 33992;
lime_graphics_opengl_GL.TEXTURE9 = 33993;
lime_graphics_opengl_GL.TEXTURE10 = 33994;
lime_graphics_opengl_GL.TEXTURE11 = 33995;
lime_graphics_opengl_GL.TEXTURE12 = 33996;
lime_graphics_opengl_GL.TEXTURE13 = 33997;
lime_graphics_opengl_GL.TEXTURE14 = 33998;
lime_graphics_opengl_GL.TEXTURE15 = 33999;
lime_graphics_opengl_GL.TEXTURE16 = 34000;
lime_graphics_opengl_GL.TEXTURE17 = 34001;
lime_graphics_opengl_GL.TEXTURE18 = 34002;
lime_graphics_opengl_GL.TEXTURE19 = 34003;
lime_graphics_opengl_GL.TEXTURE20 = 34004;
lime_graphics_opengl_GL.TEXTURE21 = 34005;
lime_graphics_opengl_GL.TEXTURE22 = 34006;
lime_graphics_opengl_GL.TEXTURE23 = 34007;
lime_graphics_opengl_GL.TEXTURE24 = 34008;
lime_graphics_opengl_GL.TEXTURE25 = 34009;
lime_graphics_opengl_GL.TEXTURE26 = 34010;
lime_graphics_opengl_GL.TEXTURE27 = 34011;
lime_graphics_opengl_GL.TEXTURE28 = 34012;
lime_graphics_opengl_GL.TEXTURE29 = 34013;
lime_graphics_opengl_GL.TEXTURE30 = 34014;
lime_graphics_opengl_GL.TEXTURE31 = 34015;
lime_graphics_opengl_GL.ACTIVE_TEXTURE = 34016;
lime_graphics_opengl_GL.REPEAT = 10497;
lime_graphics_opengl_GL.CLAMP_TO_EDGE = 33071;
lime_graphics_opengl_GL.MIRRORED_REPEAT = 33648;
lime_graphics_opengl_GL.FLOAT_VEC2 = 35664;
lime_graphics_opengl_GL.FLOAT_VEC3 = 35665;
lime_graphics_opengl_GL.FLOAT_VEC4 = 35666;
lime_graphics_opengl_GL.INT_VEC2 = 35667;
lime_graphics_opengl_GL.INT_VEC3 = 35668;
lime_graphics_opengl_GL.INT_VEC4 = 35669;
lime_graphics_opengl_GL.BOOL = 35670;
lime_graphics_opengl_GL.BOOL_VEC2 = 35671;
lime_graphics_opengl_GL.BOOL_VEC3 = 35672;
lime_graphics_opengl_GL.BOOL_VEC4 = 35673;
lime_graphics_opengl_GL.FLOAT_MAT2 = 35674;
lime_graphics_opengl_GL.FLOAT_MAT3 = 35675;
lime_graphics_opengl_GL.FLOAT_MAT4 = 35676;
lime_graphics_opengl_GL.SAMPLER_2D = 35678;
lime_graphics_opengl_GL.SAMPLER_CUBE = 35680;
lime_graphics_opengl_GL.VERTEX_ATTRIB_ARRAY_ENABLED = 34338;
lime_graphics_opengl_GL.VERTEX_ATTRIB_ARRAY_SIZE = 34339;
lime_graphics_opengl_GL.VERTEX_ATTRIB_ARRAY_STRIDE = 34340;
lime_graphics_opengl_GL.VERTEX_ATTRIB_ARRAY_TYPE = 34341;
lime_graphics_opengl_GL.VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922;
lime_graphics_opengl_GL.VERTEX_ATTRIB_ARRAY_POINTER = 34373;
lime_graphics_opengl_GL.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975;
lime_graphics_opengl_GL.VERTEX_PROGRAM_POINT_SIZE = 34370;
lime_graphics_opengl_GL.POINT_SPRITE = 34913;
lime_graphics_opengl_GL.COMPILE_STATUS = 35713;
lime_graphics_opengl_GL.LOW_FLOAT = 36336;
lime_graphics_opengl_GL.MEDIUM_FLOAT = 36337;
lime_graphics_opengl_GL.HIGH_FLOAT = 36338;
lime_graphics_opengl_GL.LOW_INT = 36339;
lime_graphics_opengl_GL.MEDIUM_INT = 36340;
lime_graphics_opengl_GL.HIGH_INT = 36341;
lime_graphics_opengl_GL.FRAMEBUFFER = 36160;
lime_graphics_opengl_GL.RENDERBUFFER = 36161;
lime_graphics_opengl_GL.RGBA4 = 32854;
lime_graphics_opengl_GL.RGB5_A1 = 32855;
lime_graphics_opengl_GL.RGB565 = 36194;
lime_graphics_opengl_GL.DEPTH_COMPONENT16 = 33189;
lime_graphics_opengl_GL.STENCIL_INDEX = 6401;
lime_graphics_opengl_GL.STENCIL_INDEX8 = 36168;
lime_graphics_opengl_GL.DEPTH_STENCIL = 34041;
lime_graphics_opengl_GL.RENDERBUFFER_WIDTH = 36162;
lime_graphics_opengl_GL.RENDERBUFFER_HEIGHT = 36163;
lime_graphics_opengl_GL.RENDERBUFFER_INTERNAL_FORMAT = 36164;
lime_graphics_opengl_GL.RENDERBUFFER_RED_SIZE = 36176;
lime_graphics_opengl_GL.RENDERBUFFER_GREEN_SIZE = 36177;
lime_graphics_opengl_GL.RENDERBUFFER_BLUE_SIZE = 36178;
lime_graphics_opengl_GL.RENDERBUFFER_ALPHA_SIZE = 36179;
lime_graphics_opengl_GL.RENDERBUFFER_DEPTH_SIZE = 36180;
lime_graphics_opengl_GL.RENDERBUFFER_STENCIL_SIZE = 36181;
lime_graphics_opengl_GL.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048;
lime_graphics_opengl_GL.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049;
lime_graphics_opengl_GL.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050;
lime_graphics_opengl_GL.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051;
lime_graphics_opengl_GL.COLOR_ATTACHMENT0 = 36064;
lime_graphics_opengl_GL.DEPTH_ATTACHMENT = 36096;
lime_graphics_opengl_GL.STENCIL_ATTACHMENT = 36128;
lime_graphics_opengl_GL.DEPTH_STENCIL_ATTACHMENT = 33306;
lime_graphics_opengl_GL.NONE = 0;
lime_graphics_opengl_GL.FRAMEBUFFER_COMPLETE = 36053;
lime_graphics_opengl_GL.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
lime_graphics_opengl_GL.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
lime_graphics_opengl_GL.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
lime_graphics_opengl_GL.FRAMEBUFFER_UNSUPPORTED = 36061;
lime_graphics_opengl_GL.FRAMEBUFFER_BINDING = 36006;
lime_graphics_opengl_GL.RENDERBUFFER_BINDING = 36007;
lime_graphics_opengl_GL.MAX_RENDERBUFFER_SIZE = 34024;
lime_graphics_opengl_GL.INVALID_FRAMEBUFFER_OPERATION = 1286;
lime_graphics_opengl_GL.UNPACK_FLIP_Y_WEBGL = 37440;
lime_graphics_opengl_GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
lime_graphics_opengl_GL.CONTEXT_LOST_WEBGL = 37442;
lime_graphics_opengl_GL.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
lime_graphics_opengl_GL.BROWSER_DEFAULT_WEBGL = 37444;
lime_math__$ColorMatrix_ColorMatrix_$Impl_$.__identity = [1.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0];
lime_math_Matrix3.__identity = new lime_math_Matrix3();
lime_net_curl__$CURL_CURL_$Impl_$.GLOBAL_SSL = 1;
lime_net_curl__$CURL_CURL_$Impl_$.GLOBAL_WIN32 = 2;
lime_net_curl__$CURL_CURL_$Impl_$.GLOBAL_ALL = 3;
lime_net_curl__$CURL_CURL_$Impl_$.GLOBAL_NOTHING = 0;
lime_net_curl__$CURL_CURL_$Impl_$.GLOBAL_DEFAULT = 3;
lime_net_curl__$CURL_CURL_$Impl_$.GLOBAL_ACK_EINTR = 4;
lime_system_BackgroundWorker.MESSAGE_COMPLETE = "__COMPLETE__";
lime_system_BackgroundWorker.MESSAGE_ERROR = "__ERROR__";
lime_ui_Gamepad.devices = new haxe_ds_IntMap();
lime_ui_Gamepad.onConnect = new lime_app_Event_$lime_$ui_$Gamepad_$Void();
lime_ui__$GamepadAxis_GamepadAxis_$Impl_$.LEFT_X = 0;
lime_ui__$GamepadAxis_GamepadAxis_$Impl_$.LEFT_Y = 1;
lime_ui__$GamepadAxis_GamepadAxis_$Impl_$.RIGHT_X = 2;
lime_ui__$GamepadAxis_GamepadAxis_$Impl_$.RIGHT_Y = 3;
lime_ui__$GamepadAxis_GamepadAxis_$Impl_$.TRIGGER_LEFT = 4;
lime_ui__$GamepadAxis_GamepadAxis_$Impl_$.TRIGGER_RIGHT = 5;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.A = 0;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.B = 1;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.X = 2;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.Y = 3;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.BACK = 4;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.GUIDE = 5;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.START = 6;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.LEFT_STICK = 7;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.RIGHT_STICK = 8;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.LEFT_SHOULDER = 9;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.RIGHT_SHOULDER = 10;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.DPAD_UP = 11;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.DPAD_DOWN = 12;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.DPAD_LEFT = 13;
lime_ui__$GamepadButton_GamepadButton_$Impl_$.DPAD_RIGHT = 14;
lime_ui_Joystick.devices = new haxe_ds_IntMap();
lime_ui_Joystick.onConnect = new lime_app_Event_$lime_$ui_$Joystick_$Void();
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.CENTER = 0;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.DOWN = 4;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.LEFT = 8;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.RIGHT = 2;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.UP = 1;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.DOWN_LEFT = 12;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.DOWN_RIGHT = 6;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.UP_LEFT = 9;
lime_ui__$JoystickHatPosition_JoystickHatPosition_$Impl_$.UP_RIGHT = 3;
lime_ui__$KeyCode_KeyCode_$Impl_$.UNKNOWN = 0;
lime_ui__$KeyCode_KeyCode_$Impl_$.BACKSPACE = 8;
lime_ui__$KeyCode_KeyCode_$Impl_$.TAB = 9;
lime_ui__$KeyCode_KeyCode_$Impl_$.RETURN = 13;
lime_ui__$KeyCode_KeyCode_$Impl_$.ESCAPE = 27;
lime_ui__$KeyCode_KeyCode_$Impl_$.SPACE = 32;
lime_ui__$KeyCode_KeyCode_$Impl_$.EXCLAMATION = 33;
lime_ui__$KeyCode_KeyCode_$Impl_$.QUOTE = 34;
lime_ui__$KeyCode_KeyCode_$Impl_$.HASH = 35;
lime_ui__$KeyCode_KeyCode_$Impl_$.DOLLAR = 36;
lime_ui__$KeyCode_KeyCode_$Impl_$.PERCENT = 37;
lime_ui__$KeyCode_KeyCode_$Impl_$.AMPERSAND = 38;
lime_ui__$KeyCode_KeyCode_$Impl_$.SINGLE_QUOTE = 39;
lime_ui__$KeyCode_KeyCode_$Impl_$.LEFT_PARENTHESIS = 40;
lime_ui__$KeyCode_KeyCode_$Impl_$.RIGHT_PARENTHESIS = 41;
lime_ui__$KeyCode_KeyCode_$Impl_$.ASTERISK = 42;
lime_ui__$KeyCode_KeyCode_$Impl_$.PLUS = 43;
lime_ui__$KeyCode_KeyCode_$Impl_$.COMMA = 44;
lime_ui__$KeyCode_KeyCode_$Impl_$.MINUS = 45;
lime_ui__$KeyCode_KeyCode_$Impl_$.PERIOD = 46;
lime_ui__$KeyCode_KeyCode_$Impl_$.SLASH = 47;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_0 = 48;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_1 = 49;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_2 = 50;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_3 = 51;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_4 = 52;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_5 = 53;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_6 = 54;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_7 = 55;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_8 = 56;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMBER_9 = 57;
lime_ui__$KeyCode_KeyCode_$Impl_$.COLON = 58;
lime_ui__$KeyCode_KeyCode_$Impl_$.SEMICOLON = 59;
lime_ui__$KeyCode_KeyCode_$Impl_$.LESS_THAN = 60;
lime_ui__$KeyCode_KeyCode_$Impl_$.EQUALS = 61;
lime_ui__$KeyCode_KeyCode_$Impl_$.GREATER_THAN = 62;
lime_ui__$KeyCode_KeyCode_$Impl_$.QUESTION = 63;
lime_ui__$KeyCode_KeyCode_$Impl_$.AT = 64;
lime_ui__$KeyCode_KeyCode_$Impl_$.LEFT_BRACKET = 91;
lime_ui__$KeyCode_KeyCode_$Impl_$.BACKSLASH = 92;
lime_ui__$KeyCode_KeyCode_$Impl_$.RIGHT_BRACKET = 93;
lime_ui__$KeyCode_KeyCode_$Impl_$.CARET = 94;
lime_ui__$KeyCode_KeyCode_$Impl_$.UNDERSCORE = 95;
lime_ui__$KeyCode_KeyCode_$Impl_$.GRAVE = 96;
lime_ui__$KeyCode_KeyCode_$Impl_$.A = 97;
lime_ui__$KeyCode_KeyCode_$Impl_$.B = 98;
lime_ui__$KeyCode_KeyCode_$Impl_$.C = 99;
lime_ui__$KeyCode_KeyCode_$Impl_$.D = 100;
lime_ui__$KeyCode_KeyCode_$Impl_$.E = 101;
lime_ui__$KeyCode_KeyCode_$Impl_$.F = 102;
lime_ui__$KeyCode_KeyCode_$Impl_$.G = 103;
lime_ui__$KeyCode_KeyCode_$Impl_$.H = 104;
lime_ui__$KeyCode_KeyCode_$Impl_$.I = 105;
lime_ui__$KeyCode_KeyCode_$Impl_$.J = 106;
lime_ui__$KeyCode_KeyCode_$Impl_$.K = 107;
lime_ui__$KeyCode_KeyCode_$Impl_$.L = 108;
lime_ui__$KeyCode_KeyCode_$Impl_$.M = 109;
lime_ui__$KeyCode_KeyCode_$Impl_$.N = 110;
lime_ui__$KeyCode_KeyCode_$Impl_$.O = 111;
lime_ui__$KeyCode_KeyCode_$Impl_$.P = 112;
lime_ui__$KeyCode_KeyCode_$Impl_$.Q = 113;
lime_ui__$KeyCode_KeyCode_$Impl_$.R = 114;
lime_ui__$KeyCode_KeyCode_$Impl_$.S = 115;
lime_ui__$KeyCode_KeyCode_$Impl_$.T = 116;
lime_ui__$KeyCode_KeyCode_$Impl_$.U = 117;
lime_ui__$KeyCode_KeyCode_$Impl_$.V = 118;
lime_ui__$KeyCode_KeyCode_$Impl_$.W = 119;
lime_ui__$KeyCode_KeyCode_$Impl_$.X = 120;
lime_ui__$KeyCode_KeyCode_$Impl_$.Y = 121;
lime_ui__$KeyCode_KeyCode_$Impl_$.Z = 122;
lime_ui__$KeyCode_KeyCode_$Impl_$.DELETE = 127;
lime_ui__$KeyCode_KeyCode_$Impl_$.CAPS_LOCK = 1073741881;
lime_ui__$KeyCode_KeyCode_$Impl_$.F1 = 1073741882;
lime_ui__$KeyCode_KeyCode_$Impl_$.F2 = 1073741883;
lime_ui__$KeyCode_KeyCode_$Impl_$.F3 = 1073741884;
lime_ui__$KeyCode_KeyCode_$Impl_$.F4 = 1073741885;
lime_ui__$KeyCode_KeyCode_$Impl_$.F5 = 1073741886;
lime_ui__$KeyCode_KeyCode_$Impl_$.F6 = 1073741887;
lime_ui__$KeyCode_KeyCode_$Impl_$.F7 = 1073741888;
lime_ui__$KeyCode_KeyCode_$Impl_$.F8 = 1073741889;
lime_ui__$KeyCode_KeyCode_$Impl_$.F9 = 1073741890;
lime_ui__$KeyCode_KeyCode_$Impl_$.F10 = 1073741891;
lime_ui__$KeyCode_KeyCode_$Impl_$.F11 = 1073741892;
lime_ui__$KeyCode_KeyCode_$Impl_$.F12 = 1073741893;
lime_ui__$KeyCode_KeyCode_$Impl_$.PRINT_SCREEN = 1073741894;
lime_ui__$KeyCode_KeyCode_$Impl_$.SCROLL_LOCK = 1073741895;
lime_ui__$KeyCode_KeyCode_$Impl_$.PAUSE = 1073741896;
lime_ui__$KeyCode_KeyCode_$Impl_$.INSERT = 1073741897;
lime_ui__$KeyCode_KeyCode_$Impl_$.HOME = 1073741898;
lime_ui__$KeyCode_KeyCode_$Impl_$.PAGE_UP = 1073741899;
lime_ui__$KeyCode_KeyCode_$Impl_$.END = 1073741901;
lime_ui__$KeyCode_KeyCode_$Impl_$.PAGE_DOWN = 1073741902;
lime_ui__$KeyCode_KeyCode_$Impl_$.RIGHT = 1073741903;
lime_ui__$KeyCode_KeyCode_$Impl_$.LEFT = 1073741904;
lime_ui__$KeyCode_KeyCode_$Impl_$.DOWN = 1073741905;
lime_ui__$KeyCode_KeyCode_$Impl_$.UP = 1073741906;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUM_LOCK = 1073741907;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_DIVIDE = 1073741908;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MULTIPLY = 1073741909;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MINUS = 1073741910;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_PLUS = 1073741911;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_ENTER = 1073741912;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_1 = 1073741913;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_2 = 1073741914;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_3 = 1073741915;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_4 = 1073741916;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_5 = 1073741917;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_6 = 1073741918;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_7 = 1073741919;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_8 = 1073741920;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_9 = 1073741921;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_0 = 1073741922;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_PERIOD = 1073741923;
lime_ui__$KeyCode_KeyCode_$Impl_$.APPLICATION = 1073741925;
lime_ui__$KeyCode_KeyCode_$Impl_$.POWER = 1073741926;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_EQUALS = 1073741927;
lime_ui__$KeyCode_KeyCode_$Impl_$.F13 = 1073741928;
lime_ui__$KeyCode_KeyCode_$Impl_$.F14 = 1073741929;
lime_ui__$KeyCode_KeyCode_$Impl_$.F15 = 1073741930;
lime_ui__$KeyCode_KeyCode_$Impl_$.F16 = 1073741931;
lime_ui__$KeyCode_KeyCode_$Impl_$.F17 = 1073741932;
lime_ui__$KeyCode_KeyCode_$Impl_$.F18 = 1073741933;
lime_ui__$KeyCode_KeyCode_$Impl_$.F19 = 1073741934;
lime_ui__$KeyCode_KeyCode_$Impl_$.F20 = 1073741935;
lime_ui__$KeyCode_KeyCode_$Impl_$.F21 = 1073741936;
lime_ui__$KeyCode_KeyCode_$Impl_$.F22 = 1073741937;
lime_ui__$KeyCode_KeyCode_$Impl_$.F23 = 1073741938;
lime_ui__$KeyCode_KeyCode_$Impl_$.F24 = 1073741939;
lime_ui__$KeyCode_KeyCode_$Impl_$.EXECUTE = 1073741940;
lime_ui__$KeyCode_KeyCode_$Impl_$.HELP = 1073741941;
lime_ui__$KeyCode_KeyCode_$Impl_$.MENU = 1073741942;
lime_ui__$KeyCode_KeyCode_$Impl_$.SELECT = 1073741943;
lime_ui__$KeyCode_KeyCode_$Impl_$.STOP = 1073741944;
lime_ui__$KeyCode_KeyCode_$Impl_$.AGAIN = 1073741945;
lime_ui__$KeyCode_KeyCode_$Impl_$.UNDO = 1073741946;
lime_ui__$KeyCode_KeyCode_$Impl_$.CUT = 1073741947;
lime_ui__$KeyCode_KeyCode_$Impl_$.COPY = 1073741948;
lime_ui__$KeyCode_KeyCode_$Impl_$.PASTE = 1073741949;
lime_ui__$KeyCode_KeyCode_$Impl_$.FIND = 1073741950;
lime_ui__$KeyCode_KeyCode_$Impl_$.MUTE = 1073741951;
lime_ui__$KeyCode_KeyCode_$Impl_$.VOLUME_UP = 1073741952;
lime_ui__$KeyCode_KeyCode_$Impl_$.VOLUME_DOWN = 1073741953;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_COMMA = 1073741957;
lime_ui__$KeyCode_KeyCode_$Impl_$.ALT_ERASE = 1073741977;
lime_ui__$KeyCode_KeyCode_$Impl_$.SYSTEM_REQUEST = 1073741978;
lime_ui__$KeyCode_KeyCode_$Impl_$.CANCEL = 1073741979;
lime_ui__$KeyCode_KeyCode_$Impl_$.CLEAR = 1073741980;
lime_ui__$KeyCode_KeyCode_$Impl_$.PRIOR = 1073741981;
lime_ui__$KeyCode_KeyCode_$Impl_$.RETURN2 = 1073741982;
lime_ui__$KeyCode_KeyCode_$Impl_$.SEPARATOR = 1073741983;
lime_ui__$KeyCode_KeyCode_$Impl_$.OUT = 1073741984;
lime_ui__$KeyCode_KeyCode_$Impl_$.OPER = 1073741985;
lime_ui__$KeyCode_KeyCode_$Impl_$.CLEAR_AGAIN = 1073741986;
lime_ui__$KeyCode_KeyCode_$Impl_$.CRSEL = 1073741987;
lime_ui__$KeyCode_KeyCode_$Impl_$.EXSEL = 1073741988;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_00 = 1073742000;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_000 = 1073742001;
lime_ui__$KeyCode_KeyCode_$Impl_$.THOUSAND_SEPARATOR = 1073742002;
lime_ui__$KeyCode_KeyCode_$Impl_$.DECIMAL_SEPARATOR = 1073742003;
lime_ui__$KeyCode_KeyCode_$Impl_$.CURRENCY_UNIT = 1073742004;
lime_ui__$KeyCode_KeyCode_$Impl_$.CURRENCY_SUBUNIT = 1073742005;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_LEFT_PARENTHESIS = 1073742006;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_RIGHT_PARENTHESIS = 1073742007;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_LEFT_BRACE = 1073742008;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_RIGHT_BRACE = 1073742009;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_TAB = 1073742010;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_BACKSPACE = 1073742011;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_A = 1073742012;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_B = 1073742013;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_C = 1073742014;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_D = 1073742015;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_E = 1073742016;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_F = 1073742017;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_XOR = 1073742018;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_POWER = 1073742019;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_PERCENT = 1073742020;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_LESS_THAN = 1073742021;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_GREATER_THAN = 1073742022;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_AMPERSAND = 1073742023;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_DOUBLE_AMPERSAND = 1073742024;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_VERTICAL_BAR = 1073742025;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_DOUBLE_VERTICAL_BAR = 1073742026;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_COLON = 1073742027;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_HASH = 1073742028;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_SPACE = 1073742029;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_AT = 1073742030;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_EXCLAMATION = 1073742031;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MEM_STORE = 1073742032;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MEM_RECALL = 1073742033;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MEM_CLEAR = 1073742034;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MEM_ADD = 1073742035;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MEM_SUBTRACT = 1073742036;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MEM_MULTIPLY = 1073742037;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_MEM_DIVIDE = 1073742038;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_PLUS_MINUS = 1073742039;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_CLEAR = 1073742040;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_CLEAR_ENTRY = 1073742041;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_BINARY = 1073742042;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_OCTAL = 1073742043;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_DECIMAL = 1073742044;
lime_ui__$KeyCode_KeyCode_$Impl_$.NUMPAD_HEXADECIMAL = 1073742045;
lime_ui__$KeyCode_KeyCode_$Impl_$.LEFT_CTRL = 1073742048;
lime_ui__$KeyCode_KeyCode_$Impl_$.LEFT_SHIFT = 1073742049;
lime_ui__$KeyCode_KeyCode_$Impl_$.LEFT_ALT = 1073742050;
lime_ui__$KeyCode_KeyCode_$Impl_$.LEFT_META = 1073742051;
lime_ui__$KeyCode_KeyCode_$Impl_$.RIGHT_CTRL = 1073742052;
lime_ui__$KeyCode_KeyCode_$Impl_$.RIGHT_SHIFT = 1073742053;
lime_ui__$KeyCode_KeyCode_$Impl_$.RIGHT_ALT = 1073742054;
lime_ui__$KeyCode_KeyCode_$Impl_$.RIGHT_META = 1073742055;
lime_ui__$KeyCode_KeyCode_$Impl_$.MODE = 1073742081;
lime_ui__$KeyCode_KeyCode_$Impl_$.AUDIO_NEXT = 1073742082;
lime_ui__$KeyCode_KeyCode_$Impl_$.AUDIO_PREVIOUS = 1073742083;
lime_ui__$KeyCode_KeyCode_$Impl_$.AUDIO_STOP = 1073742084;
lime_ui__$KeyCode_KeyCode_$Impl_$.AUDIO_PLAY = 1073742085;
lime_ui__$KeyCode_KeyCode_$Impl_$.AUDIO_MUTE = 1073742086;
lime_ui__$KeyCode_KeyCode_$Impl_$.MEDIA_SELECT = 1073742087;
lime_ui__$KeyCode_KeyCode_$Impl_$.WWW = 1073742088;
lime_ui__$KeyCode_KeyCode_$Impl_$.MAIL = 1073742089;
lime_ui__$KeyCode_KeyCode_$Impl_$.CALCULATOR = 1073742090;
lime_ui__$KeyCode_KeyCode_$Impl_$.COMPUTER = 1073742091;
lime_ui__$KeyCode_KeyCode_$Impl_$.APP_CONTROL_SEARCH = 1073742092;
lime_ui__$KeyCode_KeyCode_$Impl_$.APP_CONTROL_HOME = 1073742093;
lime_ui__$KeyCode_KeyCode_$Impl_$.APP_CONTROL_BACK = 1073742094;
lime_ui__$KeyCode_KeyCode_$Impl_$.APP_CONTROL_FORWARD = 1073742095;
lime_ui__$KeyCode_KeyCode_$Impl_$.APP_CONTROL_STOP = 1073742096;
lime_ui__$KeyCode_KeyCode_$Impl_$.APP_CONTROL_REFRESH = 1073742097;
lime_ui__$KeyCode_KeyCode_$Impl_$.APP_CONTROL_BOOKMARKS = 1073742098;
lime_ui__$KeyCode_KeyCode_$Impl_$.BRIGHTNESS_DOWN = 1073742099;
lime_ui__$KeyCode_KeyCode_$Impl_$.BRIGHTNESS_UP = 1073742100;
lime_ui__$KeyCode_KeyCode_$Impl_$.DISPLAY_SWITCH = 1073742101;
lime_ui__$KeyCode_KeyCode_$Impl_$.BACKLIGHT_TOGGLE = 1073742102;
lime_ui__$KeyCode_KeyCode_$Impl_$.BACKLIGHT_DOWN = 1073742103;
lime_ui__$KeyCode_KeyCode_$Impl_$.BACKLIGHT_UP = 1073742104;
lime_ui__$KeyCode_KeyCode_$Impl_$.EJECT = 1073742105;
lime_ui__$KeyCode_KeyCode_$Impl_$.SLEEP = 1073742106;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.NONE = 0;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.LEFT_SHIFT = 1;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.RIGHT_SHIFT = 2;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.LEFT_CTRL = 64;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.RIGHT_CTRL = 128;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.LEFT_ALT = 256;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.RIGHT_ALT = 512;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.LEFT_META = 1024;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.RIGHT_META = 2048;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.NUM_LOCK = 4096;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.CAPS_LOCK = 8192;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.MODE = 16384;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.CTRL = 192;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.SHIFT = 3;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.ALT = 768;
lime_ui__$KeyModifier_KeyModifier_$Impl_$.META = 3072;
lime_ui_Touch.onEnd = new lime_app_Event_$lime_$ui_$Touch_$Void();
lime_ui_Touch.onMove = new lime_app_Event_$lime_$ui_$Touch_$Void();
lime_ui_Touch.onStart = new lime_app_Event_$lime_$ui_$Touch_$Void();
lime_utils_Bytes.cffi_lime_bytes_from_data_pointer = (function($this) {
	var $r;
	var inValue = lime_system_CFFI.load("lime","lime_bytes_from_data_pointer",2,false);
	$r = inValue;
	return $r;
}(this));
lime_utils_Bytes.cffi_lime_bytes_get_data_pointer = (function($this) {
	var $r;
	var inValue = lime_system_CFFI.load("lime","lime_bytes_get_data_pointer",1,false);
	$r = inValue;
	return $r;
}(this));
lime_utils_Bytes.cffi_lime_bytes_read_file = (function($this) {
	var $r;
	var inValue = lime_system_CFFI.load("lime","lime_bytes_read_file",1,false);
	$r = inValue;
	return $r;
}(this));
lime_utils__$Float32Array_Float32Array_$Impl_$.BYTES_PER_ELEMENT = 4;
lime_utils__$Int32Array_Int32Array_$Impl_$.BYTES_PER_ELEMENT = 4;
lime_utils__$UInt32Array_UInt32Array_$Impl_$.BYTES_PER_ELEMENT = 4;
lime_utils__$UInt8Array_UInt8Array_$Impl_$.BYTES_PER_ELEMENT = 1;
ApplicationMain.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
