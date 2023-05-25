import App from "../app";
import {getLineEndIndex, getLineStartIndex} from "../components/text-editor";

export default function handleMouseOver(this: App, e: MouseEvent) {
	if (this.state.mouse.clickedElementID.toLowerCase().startsWith("texteditor")) {
		if (this.state.mouse.leftClicked || this.state.mouse.rightClicked) {
			let nextState     = this.state;
			let id            = (e.target as HTMLElement).id;
			let targetClasses = (e.target as HTMLElement).classList;
			if (targetClasses.contains("textEditorChar")) {
				let pattern: RegExp = /textEditorChar-(\d+)-(\d+)/g;
				let info            = pattern.exec(id);
				if (info !== undefined && info != null) {
					let lineNumber    = parseInt(info[1]);
					let charNumber    = parseInt(info[2]);
					let absoluteIndex = getLineStartIndex(nextState.textEditor, lineNumber) + charNumber;
					if (absoluteIndex > nextState.textEditor.cursorEnd) {
						absoluteIndex++;
					}
					nextState.textEditor.cursorStart = absoluteIndex;
				}
			} else if (targetClasses.contains("textEditorLine") || targetClasses.contains("textEditorLineNumber")) {
				let pattern: RegExp = /\w+-(\d+)-(\d+)/g;
				let info            = pattern.exec(id);
				if (info !== undefined && info != null) {
					let lineNumber                   = parseInt(info[1]);
					nextState.textEditor.cursorStart = getLineStartIndex(nextState.textEditor, lineNumber);
				}
			} else if (targetClasses.contains("textEditorLineContent")) {
				let pattern: RegExp = /textEditorLineContent-(\d+)-(\d+)/g;
				let info            = pattern.exec(id);
				if (info !== undefined && info != null) {
					let lineNumber                   = parseInt(info[1]);
					nextState.textEditor.cursorStart = getLineEndIndex(nextState.textEditor, lineNumber);
				}
			} else if ((e.target as HTMLElement).id === "TextEditor") {
				nextState.textEditor.cursorStart = nextState.textEditor.text.length;
			}
			this.setState(nextState);
		}
	}
}
