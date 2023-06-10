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
import parseCode from "../compiler/parse-code";
import {newCompilerState, runWholeScript} from "../compiler";


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

	if (this.state.textEditor.focused) {
		if (isCharPrintSafe(e.key) && !e.ctrlKey && !e.altKey) {
			nextState.compiler.running = false;
			nextState.compiler.started = false;
			nextState.textEditor       = textEditorInsertText(nextState.textEditor, e.key);
		} else {
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
					nextState.compiler.running = false;
					nextState.compiler.started = false;
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
					if (!e.ctrlKey) {
						nextState.textEditor       = textEditorInsertText(nextState.textEditor, "\n");
						nextState.compiler.running = false;
						nextState.compiler.started = false;
					}
					break;
				case "Backspace":
					nextState.compiler.running = false;
					nextState.compiler.started = false;
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
					nextState.compiler.running = false;
					nextState.compiler.started = false;
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
	} else {
		switch (e.key) {
			case " ":
				if (nextState.compiler.started) {
					nextState.compiler.running = !nextState.compiler.running;
				}
				break;
		}
	}
	switch (e.key) {
		case "Enter":
			if (e.ctrlKey && !e.shiftKey) {
				nextState.compiler.characters = parseCode(nextState.textEditor.text);
				nextState.compiler            = runWholeScript(nextState.compiler);
				nextState.compiler.started    = false;
				nextState.compiler.running    = false;
			} else if (e.ctrlKey && e.shiftKey) {
				nextState.compiler            = newCompilerState(nextState.compiler.maxLoopCount, nextState.compiler.stepTime);
				nextState.compiler.characters = parseCode(nextState.textEditor.text);
				nextState.compiler.started    = true;
				nextState.compiler.running    = true;
				nextState.textEditor.focused  = false;
			}
			break;
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

		nextState.compiler.characters = parseCode(nextState.textEditor.text);

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
