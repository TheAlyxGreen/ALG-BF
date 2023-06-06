import React from "react";
import {settingsState} from "./settings-state";

type SettingsWindowProps = {
	state: settingsState
}
export default function SettingsWindow(props: SettingsWindowProps): React.ReactElement {
	if (!props.state.visible) {
		return <div id="SettingsWindow" style={{display: "none"}}></div>;
	}
	return <div id="SettingsBackdrop">
		<div id="SettingsWindow">
			<div id="SettingsWindowHeader">
				<span id="SettingsWindowTitle">Settings</span>
				<span id="SettingsWindowCloseButton" className="material-symbols-outlined"><span>close</span></span>
			</div>
			<div id="SettingsWindowBody">
				<div id="SettingsWindowContent">Coming Soon</div>
			</div>
		</div>
	</div>;
}