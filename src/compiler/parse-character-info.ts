import {characterInfo, newCharacterInfo} from "./character-info";

export default function parseCharacterInfo(text: string): characterInfo[] {
	let out: characterInfo[] = [];
	out.length               = text.length;
	let lineNumber           = 0;
	let lineIndex            = 0;
	let lastChar             = "";
	let nextChar             = "";
	let repetitions          = 0;
	for (let i = 0; i < text.length; i++) {
		let char = text[i];
		if (i < text.length - 1) {
			nextChar = text[i + 1];
		} else {
			nextChar = "";
		}
		if (lastChar === char) {
			repetitions++;
		} else {
			repetitions = 0;
			lastChar    = char;
		}
		out[i] = newCharacterInfo(
			char, i, lineNumber, lineIndex, "none",
			repetitions, (char !== nextChar),
		);
		if (char === "\n") {
			lineNumber++;
			lineIndex = 0;
		} else {
			lineIndex++;
		}
	}
	return out;
}
