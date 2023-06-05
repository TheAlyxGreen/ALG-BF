import {outputViewState} from "./output-view-state";
import OutputViewToggle from "./output-view-toggle";
import MemoryViewer from "./memory-viewer";
import React from "react";
import {machineState} from "../../compiler";

type OutputViewProps = {
	outputViewState: outputViewState,
	highestMemoryAddress: number,
	vmState: machineState
	isRunning: boolean,
}

function OutputView(props: OutputViewProps) {
	if (props.outputViewState.collapsed) {
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
						{props.vmState.output}
					</div>
				</div>
			</div>
		);
	}
}

export default React.memo(
	OutputView,
	(prevProps, nextProps) => {
		return false;
	});
