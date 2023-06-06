import React from "react";
import ReactDOM from "react-dom";
import "./styles/app.css";
import "./styles/app-header.css";
import "./styles/text-editor.css";
import "./styles/output-view.css";
import "./styles/settings-window.css";
import "./styles/index.css";
import App from "./app";

ReactDOM.render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
	document.getElementById("root"),
);
