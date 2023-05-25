import React from "react";
import {characterInfo, charactersAreEqual} from "../../compiler/character-info";
import {isCharBfOperator} from "../../characters";

type TextEditorCharProps = {
	characterInfo: characterInfo,
	isSelected: boolean
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

	return <div
		className={charClassName}
		id={`textEditorChar-${props.characterInfo.lineNumber}-${props.characterInfo.lineIndex}`}
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
		}
		return charactersAreEqual(prevProps.characterInfo, nextProps.characterInfo);
	},
);
