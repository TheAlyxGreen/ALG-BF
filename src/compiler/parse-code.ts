import {
	characterInfo,
	newCharacterInfo,
	setCharacterError,
	setCharacterWarning,
	syntaxHighlightLevel,
} from "./character-info";

export default function parseCode(text: string): characterInfo[] {
	let out: characterInfo[] = [];
	out.length               = text.length;
	let lineNumber           = 0;
	let lineIndex            = 0;
	let lastChar             = "";
	let nextChar             = "";
	let repetitions          = 0;
	for (let i = 0; i < text.length; i++) {
		let char                                = text[i];
		let syntaxWarning: syntaxHighlightLevel = "none";
		if (i < text.length - 1) {
			nextChar = text[i + 1];
		} else {
			nextChar = "";
		}
		if (i > 0) {
			lastChar = text[i - 1];
		} else {
			lastChar = "";
		}
		if (lastChar === char) {
			repetitions++;
		} else {
			repetitions = 1;
		}
		out[i] = newCharacterInfo(
			char, i, lineNumber, lineIndex, syntaxWarning,
			repetitions, (char !== nextChar),
		);
		if (char === "\n") {
			lineNumber++;
			lineIndex = 0;
		} else {
			lineIndex++;
		}
	}
	lastChar       = "";
	nextChar       = "";
	let loopDepth  = 0;
	let loopDepth2 = 0;
	for (let i = 0; i < out.length; i++) {
		let charInfo       = out[i];
		charInfo.loopDepth = loopDepth;
		let char           = out[i].character;
		if (i > 0) {
			lastChar = out[i - 1].character;
		}
		if (i < out.length - 1) {
			nextChar = out[i + 1].character;
		} else {
			nextChar = "";
		}
		if (char === "[") {
			loopDepth++;
			if (nextChar === "]") {
				setCharacterWarning(charInfo);
			}
			loopDepth2 = 0;
			for (let li = i; li < out.length; li++) {
				let childChar = out[li].character;
				if (childChar === "[") {
					loopDepth2++;
				} else if (childChar === "]") {
					loopDepth2--;
				}
				if (loopDepth2 === 0) {
					charInfo.linkedInstruction = li;
					break;
				}
			}
			if (charInfo.linkedInstruction !== -1) {
				out[charInfo.linkedInstruction].linkedInstruction = i;
			}
		} else if (char === "]") {
			if (loopDepth > 0) {
				loopDepth--;
				charInfo.loopDepth = loopDepth;
			} else {
				setCharacterError(charInfo);
			}
			if (lastChar === "[") {
				setCharacterWarning(charInfo);
			}
		}
		if ((char === "+" && nextChar === "-") || (lastChar === "+" && char === "-")) {
			setCharacterWarning(charInfo);
		} else if ((char === "-" && nextChar === "+") || (lastChar === "-" && char === "+")) {
			setCharacterWarning(charInfo);
		} else if ((char === ">" && nextChar === "<") || (lastChar === ">" && char === "<")) {
			setCharacterWarning(charInfo);
		} else if ((char === "<" && nextChar === ">") || (lastChar === "<" && char === ">")) {
			setCharacterWarning(charInfo);
		}

		out[i] = charInfo;
	}
	return out;
}
