import App, {appState} from "../app";
import {getLineEndIndex, getLineStartIndex} from "../components/text-editor";
import {newCompilerState, parseCode, runNextInstruction, runWholeScript} from "../compiler";

export default function handleMouseDown(this: App, e: MouseEvent) {
	let nextState: appState = this.state;
	switch (e.button) {
		case 0:
			nextState.mouse.leftClicked = true;
			break;
		case 1:
			nextState.mouse.middleClicked = true;
			break;
		case 2:
			nextState.mouse.rightClicked = true;
			break;
	}
	nextState.mouse.clickedElementID = (e.target as HTMLElement).id;

	nextState.textEditor.focused = this.state.mouse.clickedElementID.toLowerCase().startsWith("texteditor");
	let targetClasses            = (e.target as HTMLElement).classList;
	let id                       = (e.target as HTMLElement).id;
	if (targetClasses.contains("textEditorChar")) {
		let pattern: RegExp = /textEditorChar-(\d+)-(\d+)/g;
		let info            = pattern.exec(id);
		if (info !== undefined && info != null) {
			let lineNumber    = parseInt(info[1]);
			let charNumber    = parseInt(info[2]);
			let absoluteIndex = getLineStartIndex(nextState.textEditor, lineNumber) + charNumber;

			if (e.offsetX > (e.target as HTMLElement).offsetWidth / 2) {
				absoluteIndex++;
			}
			nextState.textEditor.cursorStart = absoluteIndex;
			nextState.textEditor.cursorEnd   = absoluteIndex;
		}
	} else if (targetClasses.contains("textEditorLine") || targetClasses.contains("textEditorLineNumber")) {
		let pattern: RegExp = /\w+-(\d+)-(\d+)/g;
		let info            = pattern.exec(id);
		if (info !== undefined && info != null) {
			let lineNumber                   = parseInt(info[1]);
			nextState.textEditor.cursorStart = getLineStartIndex(nextState.textEditor, lineNumber);
			nextState.textEditor.cursorEnd   = nextState.textEditor.cursorStart;
		}
	} else if (targetClasses.contains("textEditorLineContent")) {
		let pattern: RegExp = /textEditorLineContent-(\d+)-(\d+)/g;
		let info            = pattern.exec(id);
		if (info !== undefined && info != null) {
			let lineNumber                   = parseInt(info[1]);
			nextState.textEditor.cursorStart = getLineEndIndex(nextState.textEditor, lineNumber);
			nextState.textEditor.cursorEnd   = nextState.textEditor.cursorStart;
		}
	} else if (id === "TextEditor") {
		nextState.textEditor.cursorStart = nextState.textEditor.text.length;
		nextState.textEditor.cursorEnd   = nextState.textEditor.text.length;
	} else if (id === "OutputViewToggle") {
		nextState.outputView.collapsed = !this.state.outputView.collapsed;
	} else if (id === "CompileButton") {
		nextState.compiler.characters = parseCode(nextState.textEditor.text);
		nextState.compiler            = runWholeScript(nextState.compiler);
		nextState.compiler.started    = false;
		nextState.compiler.running    = false;
	} else if (id === "StepStopButton") {
		nextState.compiler.running = false;
		nextState.compiler.started = false;
	} else if (id === "StepForwardButton") {
		nextState.compiler = runNextInstruction(this.state.compiler);
	} else if (id === "StepPauseButton") {
		nextState.compiler.running = false;
	} else if (id === "StepResumeButton") {
		nextState.compiler.running = true;
	} else if (id === "StepThroughButton") {
		nextState.compiler            = newCompilerState();
		nextState.compiler.characters = parseCode(nextState.textEditor.text);
		nextState.compiler.started    = true;
		nextState.compiler.running    = true;
	}

	this.setState(nextState);
}
