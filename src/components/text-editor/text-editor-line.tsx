import TextEditorCharElement from "./text-editor-char";
import React, {LegacyRef} from "react";
import {characterInfo} from "../../compiler";

type TextEditorLineProps = {
	// absolute position of the start of the cursor
	cursorPosition: number,
	// relative position of the start of the cursor in line or 0
	cursorStartIndex: number,
	// line where cursor selection starts
	cursorStartLine: number,
	// relative position in line where highlight ends
	highlightEnd: number,
	// line where highlight ends
	highlightEndLine: number,
	// position in line where highlight starts
	highlightStart: number,
	// line where highlight starts
	highlightStartLine: number,
	// number of lines
	lineCount: number,
	// current line number
	lineNumber: number,
	// text of the line
	lineText: string,
	// character info for the line
	lineCharacters: characterInfo[],
	// absolute index of first character in line
	lineStartIndex: number,
	// cursor ref
	cursorRef: LegacyRef<HTMLDivElement>
	// index of instruction being compiled in step-through compiler
	currentInstructionIndex: number,
	// whether step-through compiler has begun
	compilerStarted: boolean,
	// if there is a linked loop symbol
	hasLinkedChar: boolean,
}

function TextEditorLineElement(props: TextEditorLineProps) {
	let lineClasses       = "textEditorLine";
	let lineNumberClasses = "textEditorLineNumber";

	let lineSelected =
		    (props.lineNumber >= props.highlightStartLine) &&
		    (props.lineNumber <= props.highlightEndLine);

	if (lineSelected) {
		lineNumberClasses = lineNumberClasses + " selected";
		lineClasses       = `${lineClasses} selected`;
	}
	const firstCursor           = Math.min(props.highlightStart, props.highlightEnd);
	const lastCursor            = Math.max(props.highlightStart, props.highlightEnd);
	let elements: JSX.Element[] = props.lineText
	                                   .split("")
	                                   .filter(
		                                   (char, charIndex) => {
			                                   return char !== "" &&
			                                          !/[\n\f\r]/.test(char);

		                                   },
	                                   ).map(
			(char, charIndex) => {

				let isSelected = false;
				if (charIndex >= firstCursor && charIndex < lastCursor) {
					isSelected = true;
				}
				let isCurrentInstruction = props.currentInstructionIndex === props.lineCharacters[charIndex].absoluteIndex;
				let isLinkedInstruction  = false;

				if (props.lineCharacters[charIndex].linkedInstruction !== -1) {
					if (
						props.cursorPosition === props.lineCharacters[charIndex].linkedInstruction
					) {
						isLinkedInstruction = true;
					} else if (
						props.cursorPosition === props.lineCharacters[charIndex].absoluteIndex
					) {
						isLinkedInstruction = true;
					}
				}

				return <TextEditorCharElement
					characterInfo={props.lineCharacters[charIndex]}
					isSelected={isSelected}
					key={`editor-line${
						props.lineNumber.toString(36)
					}-char${
						charIndex.toString(36)
					}-${
						char
					}`}
					isCompiling={props.compilerStarted}
					isCurrentInstruction={isCurrentInstruction}
					cursorPosition={props.cursorPosition}
					isLinkedInstruction={isLinkedInstruction}
				/>;
			});

	if (props.cursorStartLine === props.lineNumber) {
		let cursor: JSX.Element = <span className={"textEditorCursor"} key={"cursor"}> </span>;
		if (elements.length === 0) {
			elements.push(cursor);
		} else {
			let firstElements = elements.slice(0, props.cursorStartIndex);
			let lastElements  = elements.slice(props.cursorStartIndex, elements.length);
			elements          = [];
			elements.push(...firstElements, cursor, ...lastElements);
		}
	}

	return <div
		data-lineindex={props.lineNumber}
		className={lineClasses}
		id={`textEditorLine-${props.lineNumber}-0`}
		ref={props.cursorStartLine === props.lineNumber ? props.cursorRef : undefined}
		data-linked={props.hasLinkedChar}
		data-startIndex={props.lineStartIndex}
		data-endIndex={props.lineStartIndex}
		data-cursorIndex={props.cursorPosition}
	>
		<div
			key={`lineNumber-${props.lineNumber}`}
			className={lineNumberClasses}
			id={`textEditorLineNumber-${props.lineNumber}-0`}
		>
			{props.lineNumber}
		</div>
		<div
			className={"textEditorLineContent"}
			id={`textEditorLineContent-${props.lineNumber}-0`}
		>
			{elements}
		</div>
	</div>;
}

// export default TextEditorLineElement
export default React.memo(
	TextEditorLineElement,
	(prevProps, nextProps) => {
		if (prevProps.lineNumber !== nextProps.lineNumber) {
			return false;
		}
		if (prevProps.lineText !== nextProps.lineText) {
			return false;
		}
		let wasSelected =
			    (prevProps.lineNumber >= prevProps.highlightStartLine) &&
			    (prevProps.lineNumber <= prevProps.highlightEndLine);
		let isSelected  =
			    (nextProps.lineNumber >= nextProps.highlightStartLine) &&
			    (nextProps.lineNumber <= nextProps.highlightEndLine);
		if (wasSelected !== isSelected) {
			return false;
		}
		if (prevProps.highlightStart !== nextProps.highlightStart) {
			return false;
		}
		if (prevProps.highlightEnd !== nextProps.highlightEnd) {
			return false;
		}
		let wasStartLine = prevProps.cursorStartLine === prevProps.lineNumber;
		let isStartLine  = nextProps.cursorStartLine === nextProps.lineNumber;
		if (wasStartLine !== isStartLine) {
			return false;
		}
		if ((prevProps.lineCount + "").length !== (nextProps.lineCount + "").length) {
			return false;
		}
		if (prevProps.lineStartIndex !== nextProps.lineStartIndex) {
			return false;
		}
		let compilerOnLinePreviously = (prevProps.currentInstructionIndex > prevProps.lineStartIndex && prevProps.currentInstructionIndex <= prevProps.lineStartIndex + prevProps.lineCharacters.length);
		let compilerOnLineNext       = (nextProps.currentInstructionIndex > nextProps.lineStartIndex && nextProps.currentInstructionIndex <= prevProps.lineStartIndex + nextProps.lineCharacters.length);
		if (compilerOnLineNext !== compilerOnLinePreviously) {
			return false;
		}
		if (prevProps.compilerStarted !== nextProps.compilerStarted) {
			return false;
		}
		let wasCompilingLine = prevProps.currentInstructionIndex > prevProps.lineStartIndex - 1 && prevProps.currentInstructionIndex < prevProps.lineStartIndex + prevProps.lineCharacters.length + prevProps.lineNumber;
		let isCompilingLine  = nextProps.currentInstructionIndex > nextProps.lineStartIndex - 1 && nextProps.currentInstructionIndex < nextProps.lineStartIndex + nextProps.lineCharacters.length + nextProps.lineNumber;
		if (wasCompilingLine || isCompilingLine) {
			return false;
		}
		if (prevProps.hasLinkedChar || nextProps.hasLinkedChar) {
			return false;
		}
		return true;
	},
);
