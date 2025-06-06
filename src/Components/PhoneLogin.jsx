// Filename - App.js

import React from "react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";
import Mainpage from "./main";

function App() {
	const [user] = useAuthState(auth);
	return usr ? <Mainpage /> : <Login />;
}

export default App;
