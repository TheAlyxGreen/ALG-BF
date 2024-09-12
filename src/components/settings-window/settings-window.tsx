import React from "react";
import {settingsState} from "./settings-state";
import SettingsGroup from "./settings-group";
import Setting from "./setting";
import {compilerState} from "../../compiler";

type SettingsWindowProps = {
	settingsState: settingsState
	compilerState: compilerState
}

function SettingsWindow(props: SettingsWindowProps): React.ReactElement {
	if (!props.settingsState.visible) {
		return <div id="SettingsWindow" style={{display: "none"}}></div>;
	}
	return <div id="SettingsBackdrop">
		<div id="SettingsWindow">
			<div id="SettingsWindowHeader">
				<span id="SettingsWindowTitle">Settings</span>
				<span id="SettingsWindowCloseButton" className="material-symbols-outlined"><span>close</span></span>
			</div>
			<div id="SettingsWindowBody">
				<div id="SettingsWindowContent">
					<SettingsGroup title={"Appearance"}>
						<Setting
							id={"text-editor-font-size"}
							label={"Editor Font Size"}
							type={"number"}
							min={6}
							max={64}
							placeholder={"" + props.settingsState.textEditorFontSize}
						/>
						<Setting
							id={"output-font-size"}
							label={"Output Font Size"}
							type={"number"}
							min={6}
							max={64}
							placeholder={"" + props.settingsState.outputFontSize}
						/>
					</SettingsGroup>
					<SettingsGroup title={"Performance"}>
						<Setting
							id={"step-speed"}
							label={"Time Between Steps (ms)"}
							type={"number"}
							min={50}
							max={1000}
							placeholder={"" + props.compilerState.stepTime}
						/>
						<Setting
							id={"max-loops"}
							label={"Maximum Loop Depth"}
							type={"number"}
							min={1000}
							max={999999999}
							placeholder={"" + props.compilerState.maxLoopCount}
						/>
					</SettingsGroup>
					<div id="SettingsWindowBottom">
						<input id="SettingsWindowApply" type="button" value="Apply"/>
					</div>
				</div>
			</div>
		</div>
	</div>;
}

export default React.memo(
	SettingsWindow,
	(prevProps, nextProps) => {
		if (prevProps.settingsState.visible !== nextProps.settingsState.visible) {
			return true;
		} else if (prevProps.compilerState.stepTime !== nextProps.compilerState.stepTime) {
			return false;
		} else if (prevProps.compilerState.maxLoopCount !== nextProps.compilerState.maxLoopCount) {
			return false;
		} else if (prevProps.settingsState.textEditorFontSize !== nextProps.settingsState.textEditorFontSize) {
			return false;
		}

		return false;
	},
);