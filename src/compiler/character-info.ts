export type syntaxWarningLevel = "none" | "warning" | "error"

export type characterInfo = {
	character: string,
	absoluteIndex: number,
	lineNumber: number,
	lineIndex: number,
	syntaxWarning: "none" | "warning" | "error",
	repetitions: number,
	lastRepetition: boolean,
}

export function newCharacterInfo(
	character: string, index: number, lineNumber: number, lineIndex: number,
	syntaxWarning?: "none" | "warning" | "error", repetitions?: number, lastRepetition?: boolean,
): characterInfo {
	return {
		character:      character,
		absoluteIndex:  index,
		lineNumber:     lineNumber,
		lineIndex:      lineIndex,
		syntaxWarning:  syntaxWarning ?? "none",
		repetitions:    repetitions ?? 0,
		lastRepetition: lastRepetition ?? true,
	};
}

export function charactersAreEqual(first: characterInfo, second: characterInfo): boolean {
	return Object.keys(first).map(value => {
		// @ts-ignore
		return first[value] === second[value];
	}).reduce((previousValue, currentValue) => previousValue && currentValue);
}

export function setCharacterWarning(c: characterInfo): characterInfo {
	let out = c;
	if (out.syntaxWarning === "none") {
		out.syntaxWarning = "warning";
	}
	return out;
}
export function setCharacterError(c: characterInfo): characterInfo {
	let out = c;
	out.syntaxWarning = "error"
	return out;
}
