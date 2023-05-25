import App, {appState} from "../app";
import {textEditorInsertText} from "../components/text-editor";

export default function handlePaste(this: App, e: ClipboardEvent) {
	const nextState: appState = this.state;
	let text                  = e.clipboardData?.getData("text/plain") ?? "";
	if (text !== "") {
		nextState.textEditor           = textEditorInsertText(nextState.textEditor, text);
		nextState.textEditor.cursorStart += text.length - 1;
		nextState.textEditor.cursorEnd = nextState.textEditor.cursorStart;
	}
	this.setState(nextState);
}
