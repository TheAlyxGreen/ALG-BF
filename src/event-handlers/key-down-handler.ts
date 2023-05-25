import App, {appState} from "../app";
import {isCharPrintSafe} from "../characters";
import {
	getCursorEndPosition,
	getCursorStartPosition,
	getLineEndIndex,
	getLineStartIndex,
	textEditorInsertText,
	textEditorState,
} from "../components/text-editor";
import parseCharacterInfo from "../compiler/parse-character-info";
import compileCode from "../compiler/compile-code";


export default function handleKeyDown(this: App, e: KeyboardEvent) {
	const nextState: appState          = this.state;
	const editorState: textEditorState = this.state.textEditor;
	let startCursorInfo                = getCursorStartPosition(nextState.textEditor);
	let endCursorInfo                  = getCursorEndPosition(nextState.textEditor);
	let firstCursor                    = Math.min(
		this.state.textEditor.cursorStart,
		this.state.textEditor.cursorEnd,
	);
	let lastCursor                     = Math.max(
		this.state.textEditor.cursorStart,
		this.state.textEditor.cursorEnd,
	);
	if (isCharPrintSafe(e.key) && !e.ctrlKey && !e.altKey) {
		if (this.state.textEditor.focused) {
			nextState.textEditor = textEditorInsertText(nextState.textEditor, e.key);
		}
	} else {
		if (this.state.textEditor.focused) {
			switch (e.key) {
				case "Alt":
					break;
				case "Control":
					e.preventDefault();
					break;
				case "Shift":
					break;
				case "Tab":
					e.preventDefault();
					if (startCursorInfo.index === endCursorInfo.index) {
						nextState.textEditor           = textEditorInsertText(nextState.textEditor, "    ");
						nextState.textEditor.cursorStart += 3;
						nextState.textEditor.cursorEnd = nextState.textEditor.cursorStart;
					} else {
						let oldStop                    = nextState.textEditor.cursorEnd;
						nextState.textEditor.cursorEnd = nextState.textEditor.cursorStart;
						nextState.textEditor           = textEditorInsertText(nextState.textEditor, "    ");
						nextState.textEditor.cursorStart += 3;
						nextState.textEditor.cursorEnd = oldStop + 4;
					}
					break;
				case "Enter":
					nextState.textEditor = textEditorInsertText(nextState.textEditor, "\n");
					break;
				case "Backspace":
					if (firstCursor === lastCursor) {
						firstCursor = Math.max(firstCursor - 1, 0);
					}
					nextState.textEditor.text        = this.state.textEditor.text.slice(0, firstCursor) +
					                                   this.state.textEditor.text.slice(
						                                   lastCursor,
						                                   this.state.textEditor.text.length,
					                                   );
					nextState.textEditor.cursorStart = firstCursor;
					nextState.textEditor.cursorEnd   = firstCursor;
					break;
				case "Delete":
					if (firstCursor === lastCursor) {
						lastCursor = Math.min(firstCursor + 1, nextState.textEditor.text.length);
					}
					nextState.textEditor.text        = this.state.textEditor.text.slice(0, firstCursor) +
					                                   this.state.textEditor.text.slice(
						                                   lastCursor,
						                                   this.state.textEditor.text.length,
					                                   );
					nextState.textEditor.cursorStart = firstCursor;
					nextState.textEditor.cursorEnd   = firstCursor;
					break;
				case "Home":
					nextState.textEditor.cursorStart = getLineStartIndex(nextState.textEditor, startCursorInfo.lineNumber);
					if (!e.shiftKey) {
						nextState.textEditor.cursorEnd = nextState.textEditor.cursorStart;
					}
					break;
				case "End":
					nextState.textEditor.cursorStart = getLineEndIndex(nextState.textEditor, startCursorInfo.lineNumber);
					if (!e.shiftKey) {
						nextState.textEditor.cursorEnd = nextState.textEditor.cursorStart;
					}
					break;
				case "ArrowLeft":
					if (e.shiftKey) {
						nextState.textEditor.cursorStart = nextState.textEditor.cursorStart - 1;
					} else {
						if (nextState.textEditor.cursorStart === nextState.textEditor.cursorEnd) {
							nextState.textEditor.cursorStart = Math.max(0, editorState.cursorStart - 1);
							nextState.textEditor.cursorEnd   = nextState.textEditor.cursorStart;
						} else {
							nextState.textEditor.cursorEnd   = firstCursor;
							nextState.textEditor.cursorStart = firstCursor;
						}
					}
					break;
				case "ArrowRight":
					if (e.shiftKey) {
						nextState.textEditor.cursorStart = nextState.textEditor.cursorStart + 1;
					} else {
						if (nextState.textEditor.cursorStart === nextState.textEditor.cursorEnd) {
							nextState.textEditor.cursorStart = nextState.textEditor.cursorStart + 1;
							nextState.textEditor.cursorEnd   = nextState.textEditor.cursorStart;
						} else {
							nextState.textEditor.cursorStart = lastCursor;
							nextState.textEditor.cursorEnd   = lastCursor;
						}
					}
					break;
				case "ArrowUp":
					e.preventDefault();
					if (e.key === "ArrowUp") {
						let linebreakCount       = 0;
						let firstLinebreakIndex  = -1;
						let secondLinebreakIndex = -1;
						for (let i = nextState.textEditor.cursorStart; i > 0; i--) {
							if (nextState.textEditor.text[i] === "\n" && i !== nextState.textEditor.cursorStart) {
								linebreakCount++;
								if (linebreakCount === 1) {
									firstLinebreakIndex = i;
								} else if (linebreakCount === 2) {
									secondLinebreakIndex = i;
									break;
								}
							}
						}
						if (linebreakCount === 0) {
							nextState.textEditor.cursorStart = 0;
						} else if (secondLinebreakIndex + nextState.textEditor.cursorOffset >= firstLinebreakIndex) {
							if (nextState.textEditor.cursorStart === firstLinebreakIndex) {
								nextState.textEditor.cursorStart = Math.min(
									secondLinebreakIndex +
									nextState.textEditor.cursorOffset,
									firstLinebreakIndex,
								);
							} else {
								nextState.textEditor.cursorStart = firstLinebreakIndex;
							}
						} else {
							nextState.textEditor.cursorStart = secondLinebreakIndex + nextState.textEditor.cursorOffset;
						}
						if (!e.shiftKey) {
							nextState.textEditor.cursorEnd = nextState.textEditor.cursorStart;
						}
					}
					break;
				case "ArrowDown":
					e.preventDefault();
					if (e.key === "ArrowDown") {
						let linebreakCount       = 0;
						let firstLinebreakIndex  = nextState.textEditor.text.length + 1;
						let secondLinebreakIndex = nextState.textEditor.text.length + 1;
						for (let i = nextState.textEditor.cursorStart; i < nextState.textEditor.text.length; i++) {
							if (nextState.textEditor.text[i] === "\n") {
								linebreakCount++;
								if (linebreakCount === 1) {
									firstLinebreakIndex = i;
								} else if (linebreakCount === 2) {
									secondLinebreakIndex = i;
									break;
								}
							}
						}
						if (linebreakCount === 0) {
							nextState.textEditor.cursorStart = nextState.textEditor.text.length;
						} else if (firstLinebreakIndex + nextState.textEditor.cursorOffset >= secondLinebreakIndex) {
							nextState.textEditor.cursorStart = secondLinebreakIndex;
						} else {
							nextState.textEditor.cursorStart = firstLinebreakIndex + nextState.textEditor.cursorOffset;
						}
						if (!e.shiftKey) {
							nextState.textEditor.cursorEnd = nextState.textEditor.cursorStart;
						}
					}
					break;
				case "A":
				case "a":
					if (e.ctrlKey &&
					    !e.shiftKey &&
					    !e.altKey) {
						e.preventDefault();
						nextState.textEditor.cursorStart = 0;
						nextState.textEditor.cursorEnd   = nextState.textEditor.text.length;
					}
					break;
				default:
					break;
			}
		}
	}

	if (this.state.textEditor.focused) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
			let cursorPosition                = getCursorStartPosition(nextState.textEditor);
			nextState.textEditor.cursorOffset = cursorPosition.indexInLine + 1;
		}

		if (nextState.textEditor.cursorStart > nextState.textEditor.text.length) {
			nextState.textEditor.cursorStart = nextState.textEditor.text.length;
		} else if (nextState.textEditor.cursorStart < 0) {
			nextState.textEditor.cursorStart = 0;
		}
		if (nextState.textEditor.cursorEnd > nextState.textEditor.text.length) {
			nextState.textEditor.cursorEnd = nextState.textEditor.text.length;
		} else if (nextState.textEditor.cursorEnd < 0) {
			nextState.textEditor.cursorEnd = 0;
		}
		if (Date.now() - nextState.compiler.lastCompiled > 50) {
			nextState.compiler              = compileCode(parseCharacterInfo(nextState.textEditor.text));
			nextState.textEditor.characters = nextState.compiler.characters;
		} else {
			nextState.textEditor.characters = parseCharacterInfo(nextState.textEditor.text);
		}

		let r: HTMLElement = document.querySelector(":root") as HTMLElement;
		let lineCount      = nextState.textEditor.text.split("\n").length;
		r.style.setProperty("--line-count-length", `${("" + (lineCount - 1)).length}ch`);
	}

	this.setState(nextState);
	this.state.textEditor.cursorRef.current?.scrollIntoView(
		{
			behavior: "auto",
			block:    "nearest",
		} as ScrollIntoViewOptions,
	);
}
