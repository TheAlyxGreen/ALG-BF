import React from "react";
import TextEditorLineElement from "./text-editor-line";
import {getCursorEndPosition, getCursorStartPosition, textEditorState} from "./text-editor-state";
import {outputViewState} from "../output-view";
import parseCode from "../../compiler/parse-code";
import {characterInfo, compilerState} from "../../compiler";

type TextEditorProps = {
	editorState: textEditorState,
	compilerState: compilerState,
	outputViewState: outputViewState,
}

function TextEditor(props: TextEditorProps) {
	let characters = props.compilerState.characters;
	if (props.editorState.text.length !== characters.length) {
		console.log("char data mismatch");
		characters = parseCode(props.editorState.text);
	}
	let lines = props.editorState.text.split("\n");

	let characterLines: characterInfo[][] = [];
	for (let i = 0; i < lines.length; i++) {
		let tmp: characterInfo[] = [];
		for (let ii = 0; ii < characters.length; ii++) {
			if (characters[ii].lineNumber === i && characters[ii].character !== "\n") {
				tmp.push(characters[ii]);
			}
		}
		characterLines[i] = tmp;
	}

	let cursorStartPosition = getCursorStartPosition(props.editorState);
	let cursorEndPosition   = getCursorEndPosition(props.editorState);
	let firstCursor         = cursorStartPosition;
	let lastCursor          = cursorEndPosition;
	if (
		(cursorStartPosition.lineNumber > cursorEndPosition.lineNumber) ||
		(cursorStartPosition.lineNumber === cursorEndPosition.lineNumber &&
		 cursorStartPosition.index > cursorEndPosition.index)
	) {
		firstCursor = cursorEndPosition;
		lastCursor  = cursorStartPosition;
	}

	let cursorChar = characters[cursorStartPosition.index];

	let index      = 0;
	let classNames = "";
	if (!props.outputViewState.collapsed) {
		classNames = "outputViewVisible";
	}
	if (!props.editorState.focused) {
		classNames = classNames + " unfocused";
	}
	if (props.compilerState.started) {
		classNames = classNames + " running";
	}
	return <div id="TextEditor" tabIndex={0} className={classNames}>
		{
			lines.map(
				(line, currentLineNumber) => {
					let inlineCursorStartPosition = 0;
					let inlineCursorEndPosition   = 0;
					if (currentLineNumber === firstCursor.lineNumber) {
						inlineCursorStartPosition = firstCursor.indexInLine;
					} else if (currentLineNumber > firstCursor.lineNumber) {
						inlineCursorStartPosition = 0;
					}
					let lineStartIndex = 0;
					if (currentLineNumber !== 0) {
						index += lines[currentLineNumber - 1].length;
						lineStartIndex = index;
					}

					if (currentLineNumber === lastCursor.lineNumber) {
						inlineCursorEndPosition = lastCursor.indexInLine;
					} else if (currentLineNumber >=
					           firstCursor.lineNumber &&
					           currentLineNumber <
					           lastCursor.lineNumber) {
						inlineCursorEndPosition = line.length;
					}

					let hasLinkedChar = false;
					if (characterLines[currentLineNumber]?.length > 0) {
						hasLinkedChar =
							lineStartIndex < cursorChar?.linkedInstruction &&
							(lineStartIndex + (characterLines[currentLineNumber]?.length ?? 0) + currentLineNumber) >
							cursorChar.linkedInstruction;
					}

					return <TextEditorLineElement
						cursorPosition={cursorStartPosition.index}
						cursorStartIndex={cursorStartPosition.indexInLine}
						cursorStartLine={cursorStartPosition.lineNumber}
						highlightEnd={inlineCursorEndPosition}
						highlightEndLine={lastCursor.lineNumber}
						highlightStart={inlineCursorStartPosition}
						highlightStartLine={firstCursor.lineNumber}
						key={`editor-line${currentLineNumber.toString(36)}`}
						lineCount={lines.length - 1}
						lineNumber={currentLineNumber}
						lineText={line}
						lineCharacters={characterLines[currentLineNumber]}
						lineStartIndex={lineStartIndex}
						cursorRef={props.editorState.cursorRef}
						currentInstructionIndex={props.compilerState.vm.instructionPosition}
						lastInstructionIndex={props.compilerState.vm.lastInstructionPosition}
						compilerStarted={props.compilerState.started}
						hasLinkedChar={hasLinkedChar}
					/>;
				},
			)
		}
	</div>;
}

export default TextEditor;
