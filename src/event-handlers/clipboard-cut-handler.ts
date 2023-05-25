import {
	getCursorEndPosition,
	getCursorStartPosition,
	getLineEndIndex,
	getLineStartIndex,
	getSelectedText,
} from "../components/text-editor";
import App, {appState} from "../app";

export default function handleCut(this: App, e: ClipboardEvent) {
	const nextState: appState = this.state;
	let cursorStart           = getCursorStartPosition(nextState.textEditor);
	let cursorEnd             = getCursorEndPosition((nextState.textEditor));
	let text                  = getSelectedText(this.state.textEditor);
	if (text === "") {
		nextState.textEditor.cursorStart = getLineStartIndex(nextState.textEditor, cursorStart.lineNumber);
		nextState.textEditor.cursorEnd   = getLineEndIndex(nextState.textEditor, cursorEnd.lineNumber);
		text                             = getSelectedText(this.state.textEditor);
	}
	if (text !== "") {
		navigator.clipboard.writeText(text).then();
	}
	let firstCursor                  = Math.min(
		cursorStart.index,
		cursorEnd.index,
	);
	let lastCursor                   = Math.max(
		cursorStart.index,
		cursorEnd.index,
	);
	nextState.textEditor.text        =
		this.state.textEditor.text.slice(0, firstCursor) +
		this.state.textEditor.text.slice(lastCursor, this.state.textEditor.text.length);
	nextState.textEditor.cursorStart = firstCursor;
	nextState.textEditor.cursorEnd   = firstCursor;

	this.setState(nextState);
}
