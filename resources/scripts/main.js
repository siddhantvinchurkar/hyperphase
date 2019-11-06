window.onload = function () {

	/* A function to lazy-load
	 javascript files */

	function loadJS(file) {

		// DOM: Create the script element

		var jsElm = document.createElement("script");

		// set the type attribute

		jsElm.type = "application/javascript";

		// make the script element load file

		jsElm.src = file;

		// finally insert the element to the body element in order to load the script

		document.body.appendChild(jsElm);
	}

	// Branching functions

	function doNotExecute() {

		// Deactivate web app

		this.document.getElementById('blocker').style.display = 'block';
		this.document.getElementById('lander').style.display = 'none';
	}

	function doExecute() {

		// Activate web app

		this.document.getElementById('blocker').style.display = 'none';
		this.document.getElementById('lander').style.display = 'block';

		// Load necessary scripts on demand

		document.getElementById('button_start').onclick = function () {
			document.getElementById('button_start').style.display = 'none';
			document.getElementById('progress_bar').style.display = 'block';
			loadJS('resources/scripts/firebase-app.js');
			setTimeout(function () {
				loadJS('resources/scripts/firebase-analytics.js');
				loadJS('resources/scripts/firebase-auth.js');
				loadJS('resources/scripts/firebase-firestore.js');
				setTimeout(function () {
					loadJS('resources/scripts/firebase-init.js');
				}, 3000);
			}, 3000);
			loadJS('resources/scripts/jquery.min.js');
			loadJS('resources/scripts/jquery-ui.min.js');
			loadJS('resources/scripts/materialize.min.js');
			loadJS('resources/scripts/sweetalert.js');
			setTimeout(function () {
				document.getElementById('button_start').style.display = 'inline-block';
				document.getElementById('progress_bar').style.display = 'none';
				/* TODO: Ready to load components. 
				Begin lazy-loading components. */
			}, 10000);
		}
	}

	/* Block mobile devices from 
	using the hyperphase web app */

	if (this.screen.width <= 600) {
		doNotExecute();
	}
	else {
		doExecute();
	}

	window.onresize = function () {
		if (this.screen.width <= 600) {
			doNotExecute();
		}
		else {
			doExecute();
		}
	}

}