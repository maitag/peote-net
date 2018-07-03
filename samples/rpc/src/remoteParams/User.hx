package remoteParams;

#if hxbit
	class User implements hxbit.Serializable {
		@:s public var name: String; // serialized
		@:s public var age: Int;     // serialized
		public var other:String;     // NOT serialized
#else
	class User {
		public var name: String; // serialized
		public var age: Int;     // serialized
		public var other:String;     // serialized
#end    

		public function new(n:String, a:Int, o:String) {
			name = n;
			age = a;
			other = o;
		}
}

