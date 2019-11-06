var firebaseConfig = {
	apiKey: "AIzaSyAOMfEBPfTxZJfUJOLSwNZvRdnrNncyuH8",
	authDomain: "hyperphase.firebaseapp.com",
	databaseURL: "https://hyperphase.firebaseio.com",
	projectId: "hyperphase",
	storageBucket: "hyperphase.appspot.com",
	messagingSenderId: "1069304614624",
	appId: "1:1069304614624:web:475b75635de64133ed8a85",
	measurementId: "G-PLQBDX0YCY"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebaseConfig = null;