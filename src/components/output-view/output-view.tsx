import OutputViewToggle from "./output-view-toggle";
import MemoryViewer from "./memory-viewer";
import React from "react";
import {machineState} from "../../compiler";

type OutputViewProps = {
	highestMemoryAddress: number,
	vmState: machineState
	isRunning: boolean,
	collapsed: boolean,
	lastIncrement: number,
	consoleOutput: string,
}

function OutputView(props: OutputViewProps) {
	if (props.collapsed) {
		return (
			<div id="OutputView" className={"collapsed"}>
				<div id="OutputViewHeader" className={"collapsed"}>
					<span id="OutputViewHeaderTitle" className={"collapsed"}>Memory & Output</span>
					<OutputViewToggle collapsed={true}></OutputViewToggle>
				</div>
			</div>
		);
	} else {
		return (
			<div id="OutputView">
				<div id="OutputViewHeader">
					<span id="OutputViewHeaderTitle">Memory & Output</span>
					<OutputViewToggle collapsed={false}/>
				</div>
				<div id="OutputViewContent">
					<MemoryViewer
						memory={props.vmState.memory}
						maxCells={props.highestMemoryAddress}
						currentCell={props.vmState.cursorPosition}
						lastIncrement={props.vmState.lastIncrement}
					/>
					<div id="OutputViewConsole">
						<div id="OutputViewConsoleError"
						     style={props.vmState.errorCode === "NONE" ? {display: "none"} : {}}
						>
							<span id="OutputViewErrorText">
								{props.vmState.errorCode}<br/>
								{`Line: ${props.vmState.errorChar.lineNumber}`}<br/>
								{`Position: ${props.vmState.errorChar.lineIndex}`}
							</span>
						</div>
						<textarea
							value={props.vmState.output}
							disabled={true}
							className={props.vmState.errorCode === "NONE" ? "" : "error"}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default React.memo(
	OutputView,
	(prevProps, nextProps) => {
		if (prevProps.highestMemoryAddress !== nextProps.highestMemoryAddress) {
			return false;
		} else if (prevProps.collapsed !== nextProps.collapsed) {
			return false;
		} else if (prevProps.consoleOutput !== nextProps.consoleOutput) {
			return false;
		} else if (prevProps.lastIncrement !== nextProps.lastIncrement) {
			return false;
		} else if (prevProps.vmState.errorCode !== nextProps.vmState.errorCode) {
			return false;
		} else if (prevProps.vmState.cursorPosition !== nextProps.vmState.cursorPosition) {
			return false;
		} else if (prevProps.vmState.instructionPosition !== nextProps.vmState.instructionPosition) {
			return false;
		}
		return true;
	});
