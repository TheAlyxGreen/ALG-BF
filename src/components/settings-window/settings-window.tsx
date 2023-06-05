import React from "react";
import {settingsState} from "./settings-state";

type SettingsWindowProps = {
	state: settingsState
}
export default function SettingsWindow(props: SettingsWindowProps): React.ReactElement {
	if (!props.state.visible) {
		return <div id="SettingsWindow" style={{display: "none"}}></div>;
	}
	return <div id="SettingsWindow">
		<div id="SettingsWindowHeader">
			<span id="SettingsWindowTitle">Settings</span>
			<span id="SettingsWindowCloseButton">X</span>
		</div>
		<div id="SettingsWindowBody">
			<div id="SettingsWindowLeftPane"></div>
			<div id="SettingsWindowContent"></div>
		</div>
	</div>;
}