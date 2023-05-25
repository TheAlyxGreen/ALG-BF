import {textEditorState} from "../text-editor/text-editor-state";
import {outputViewState} from "./output-view-state";
import OutputViewToggle from "./output-view-toggle";
import {compilerState} from "../../compiler/compiler-state";
import MemoryViewer from "./memory-viewer";

type OutputViewProps = {
	editorState: textEditorState,
	outputViewState: outputViewState,
	vmState: compilerState
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
					<OutputViewToggle collapsed={false}></OutputViewToggle>
				</div>
				<div id="OutputViewContent">
					<MemoryViewer
						memory={props.vmState.vm.memory}
						maxCells={props.vmState.highestMemoryAddress}
					></MemoryViewer>
					<div id="OutputViewConsole">
						{props.vmState.vm.output}
					</div>
				</div>
			</div>
		);
	}
}

export default OutputView;
