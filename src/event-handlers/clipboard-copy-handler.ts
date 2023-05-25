import {
	getCursorEndPosition,
	getCursorStartPosition,
	getLineEndIndex,
	getLineStartIndex,
	getSelectedText,
} from "../components/text-editor";
import App from "../app";

export default function handleCopy(this: App, e: ClipboardEvent) {
	let text = getSelectedText(this.state.textEditor);
	if (text === "") {
		let nextState                    = this.state;
		let cursorStart                  = getCursorStartPosition(nextState.textEditor);
		let cursorEnd                    = getCursorEndPosition((nextState.textEditor));
		nextState.textEditor.cursorStart = getLineStartIndex(nextState.textEditor, cursorStart.lineNumber);
		nextState.textEditor.cursorEnd   = getLineEndIndex(nextState.textEditor, cursorEnd.lineNumber);
		text                             = getSelectedText(this.state.textEditor);
	}
	if (text !== "") {
		navigator.clipboard.writeText(text).then();
	}
}
