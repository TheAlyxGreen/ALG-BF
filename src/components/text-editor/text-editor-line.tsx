import TextEditorCharElement from "./text-editor-char";
import React, {LegacyRef} from "react";
import {characterInfo} from "../../compiler/character-info";

type TextEditorLineProps = {
	cursorStartIndex: number,
	cursorStartLine: number,
	highlightEnd: number,
	highlightEndLine: number,
	highlightStart: number,
	highlightStartLine: number,
	lineCount: number,
	lineNumber: number,
	lineText: string,
	lineCharacters: characterInfo[],
	lineStartIndex: number,
	cursorRef: LegacyRef<HTMLDivElement>
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
	let repeatCount             = 0;
	let elements: JSX.Element[] = props.lineText
	                                   .split("")
	                                   .filter(
		                                   (char, charIndex) => {
			                                   return char !== "" &&
			                                          !/[\n\f\r]/.test(char);

		                                   },
	                                   ).map(
			(char, charIndex) => {
				let nextChar = "";
				if (charIndex < props.lineText.length - 1) {
					nextChar = props.lineText[charIndex + 1];
				}

				let lastChar = "";
				if (charIndex > 0) {
					lastChar = props.lineText[charIndex - 1];
				}
				if (char === lastChar) {
					repeatCount++;
				} else {
					repeatCount = 1;
				}

				let isSelected = false;
				if (charIndex >= firstCursor && charIndex < lastCursor) {
					isSelected = true;
				}

				let compilerInfo = props.lineCharacters[charIndex];

				let info: characterInfo = {
					syntaxWarning:  compilerInfo.syntaxWarning,
					character:      char,
					lineNumber:     props.lineNumber,
					lineIndex:      charIndex,
					absoluteIndex:  props.lineStartIndex + charIndex,
					lastRepetition: nextChar !== char,
					repetitions:    repeatCount,
				};

				return <TextEditorCharElement
					characterInfo={info}
					isSelected={isSelected}
					key={`editor-line${
						props.lineNumber.toString(36)
					}-char${
						charIndex.toString(36)
					}-${
						char
					}`}
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
		>{elements}</div>
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
		return true;
	},
);
