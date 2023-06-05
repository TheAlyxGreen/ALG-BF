import React from "react";
import {characterInfo, charactersAreEqual} from "../../compiler/character-info";
import {isCharBfOperator} from "../../characters";

type TextEditorCharProps = {
	characterInfo: characterInfo,
	isSelected: boolean,
	isCompiling: boolean,
	isCurrentInstruction: boolean,
	cursorPosition: number,
}

function TextEditorCharElement(props: TextEditorCharProps) {
	let charClassName = `textEditorChar`;

	switch (props.characterInfo.character) {
		case "+":
			charClassName = charClassName + " charPlus";
			break;
		case "-":
			charClassName = charClassName + " charMinus";
			break;
		case ",":
			charClassName = charClassName + " charComma";
			break;
		case ".":
			charClassName = charClassName + " charPeriod";
			break;
		case "[":
		case "]":
			charClassName = charClassName + " charBracket";
			break;
		case "<":
		case ">":
			charClassName = charClassName + " charArrow";
			break;
	}

	let value = props.characterInfo.character;
	if (value === "-") {
		value = "–"; // switch for enDash for #aesthetics
	}

	if (props.characterInfo.syntaxWarning === "warning") {
		charClassName = charClassName + " syntaxWarning";
	} else if (props.characterInfo.syntaxWarning === "error") {
		charClassName = charClassName + " syntaxError";
	}

	if (/\s/.test(props.characterInfo.character)) {
		charClassName = charClassName + " charWhitespace";
	}

	if (props.isSelected) {
		charClassName = charClassName + " selected";
	}

	if (props.characterInfo.loopDepth > 0) {
		charClassName = charClassName + " inLoop inLoop" + ((props.characterInfo.loopDepth % 4));
	}

	if (props.isCompiling && props.isCurrentInstruction) {
		charClassName = charClassName + " currentInstruction";
	}

	if (props.characterInfo.linkedInstruction !== -1) {
		if (
			props.cursorPosition === props.characterInfo.linkedInstruction ||
			props.cursorPosition === props.characterInfo.linkedInstruction + 1
		) {
			charClassName = charClassName + " linkedInstruction";
		} else if (
			props.cursorPosition === props.characterInfo.absoluteIndex ||
			props.cursorPosition === props.characterInfo.absoluteIndex + 1
		) {
			charClassName = charClassName + " linkedInstruction";
		}
	}

	return <div
		className={charClassName}
		id={`textEditorChar-${props.characterInfo.lineNumber}-${props.characterInfo.lineIndex}`}
		char-index={props.characterInfo.absoluteIndex}
	>
		<span>{value}</span>
		{ // show a subscript if there needs to be one
			isCharBfOperator(props.characterInfo.character) && props.characterInfo.lastRepetition && props.characterInfo.repetitions > 1 ?
			<span className="textEditorCharSub">{props.characterInfo.repetitions}</span> :
			null
		}
	</div>;
}


export default React.memo(
	TextEditorCharElement,
	(prevProps, nextProps) => {
		if (prevProps.isSelected !== nextProps.isSelected) {
			return false;
		} else if (prevProps.isCompiling !== nextProps.isCompiling) {
			return false;
		}
		let hadLinkedInstruction = prevProps.characterInfo.linkedInstruction !== -1;
		let hasLinkedInstruction = nextProps.characterInfo.linkedInstruction !== -1;
		if (hadLinkedInstruction || hasLinkedInstruction) {
			let wasLinkedInstruction = prevProps.cursorPosition === prevProps.characterInfo.linkedInstruction;
			wasLinkedInstruction     = wasLinkedInstruction || prevProps.cursorPosition === prevProps.characterInfo.linkedInstruction + 1;
			wasLinkedInstruction     = wasLinkedInstruction || prevProps.cursorPosition === prevProps.characterInfo.absoluteIndex;
			wasLinkedInstruction     = wasLinkedInstruction || prevProps.cursorPosition === prevProps.characterInfo.absoluteIndex + 1;
			let isLinkedInstruction  = nextProps.cursorPosition === nextProps.characterInfo.linkedInstruction;
			isLinkedInstruction      = isLinkedInstruction || nextProps.cursorPosition === nextProps.characterInfo.linkedInstruction + 1;
			isLinkedInstruction      = isLinkedInstruction || nextProps.cursorPosition === nextProps.characterInfo.absoluteIndex;
			isLinkedInstruction      = isLinkedInstruction || nextProps.cursorPosition === nextProps.characterInfo.absoluteIndex + 1;
			if (wasLinkedInstruction !== isLinkedInstruction) {
				return false;
			}
		}
		if (prevProps.isCurrentInstruction !== nextProps.isCurrentInstruction) {
			return false;
		}
		return charactersAreEqual(prevProps.characterInfo, nextProps.characterInfo);
	},
);
