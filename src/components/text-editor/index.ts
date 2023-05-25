import TextEditor from "./text-editor";
import {
	getCursorEndPosition,
	getCursorStartPosition,
	getLineEndIndex,
	getLineStartIndex,
	getSelectedText,
	newTextEditorState,
	textEditorInsertText,
	textEditorState as TextEditorState,
} from "./text-editor-state";

export default TextEditor;
export {
	getLineStartIndex,
	TextEditor,
	getLineEndIndex,
	newTextEditorState,
	textEditorInsertText,
	getCursorStartPosition,
	getCursorEndPosition,
	getSelectedText,
};

export type textEditorState = TextEditorState
