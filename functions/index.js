const functions = require('firebase-functions');
const u2f = require('u2f');
const APP_ID = "hyperphase.app"
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Function to register new U2F key

exports.registrationChallengeHandler = functions.https.onRequest((request, response) => {
	// 1. Generate a registration request and save it in the server-side datastore.
	const registrationRequest = u2f.request(APP_ID);
	var db = admin.firestore();
	db.collection('authorized-keys').doc(request.query.docId).update({ registrationRequest: registrationRequest }).then(() => {
		// 2. Send the registration request to the client, who will use the Javascript U2F API to sign
		// the registration request, and send it back to the server for verification. The registration
		// request is a JSON object containing properties used by the client to sign the request.
		return response.send(registrationRequest);
	}).catch((error) => {
		return response.send(error);
	});
});

// Function to verify U2F key registration

exports.registrationVerificationHandler = functions.https.onRequest((request, response) => {
	// 3. Verify the registration response from the client against the registration request saved
	// in the server-side session.
	db.collection('authorized-keys').doc(request.query.docId).get().then((doc) => {
		const result = u2f.checkRegistration(doc.data().registrationRequest, request.query.registrationResponse);
		if (result.successful) {
			// Success!
			// Save result.publicKey and result.keyHandle to the server-side datastore, associated with
			// this user.
			db.collection('authorized-keys').doc(request.query.docId).update({ publicKey: result.publicKey, keyHandle: result.keyHandle }).then(() => {
				console.log('New key registered!');
				return true;
			}).catch((error) => {
				console.log(error);
			});
			return response.send('key-verified');
		}
		else {
			return response.send('key-unverified');
		}
	}).catch((error) => {
		// result.errorMessage is defined with an English-language description of the error.
		return response.send(error);
	});
});

// Function to authenticate using a U2F key

exports.authenticationChallengeHandler = funtions.https.onRequest((request, response) => {
	// 1. Fetch the user's key handle from the server-side datastore. This field should have been
	// saved after the registration procedure.
	db.collection('authorized-keys').doc(request.query.docId).get().then((doc) => {
		const keyHandle = doc.data().keyHandle;
		// 2. Generate an authentication request and save it in the server-side datastore. Use the same app ID that
		// was used in registration!
		const authRequest = u2f.request(APP_ID, keyHandle);
		db.collection('authorized-keys').doc(request.query.docId).update({ authRequest: authRequest }).then(() => {
			console.log('Auth request created!');
			// 3. Send the authentication request to the client, who will use the Javascript U2F API to sign
			// the authentication request, and send it back to the server for verification.
			return response.send(authRequest);
		}).catch((error) => {
			console.log(error);
		});
		return true;
	}).catch((error) => {
		response.send(error);
	});
});

exports.authenticationVerificationHandler = functions.https.onRequest((request, response) => {
	// 4. Fetch the user's public key from the server-side datastore. This field should have been
	// saved after the registration procedure.
	db.collection('authorized-keys').doc(request.query.docId).get().then((doc) => {
		const publicKey = doc.data().publicKey;
		const authRequest = doc.data().authRequest;
		// 5. Verify the authentication response from the client against the authentication request saved
		// in the server-side session.
		const result = u2f.checkSignature(authRequest, request.query.authResponse, publicKey);
		if (result.successful) {
			// Success!
			// User is authenticated.
			// result.errorMessage is defined with an English-language description of the error.
			return response.send({ result });
		}
		else {
			return response.send('user-unverified');
		}
	}).catch((error) => {
		return response.send(error);
	});
});