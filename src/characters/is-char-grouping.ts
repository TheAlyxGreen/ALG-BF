export function isCharGroupCloser(input: string): boolean {
	if (input.length === 1) {
		return (
			(input.charCodeAt(0) === 34) ||
			(input.charCodeAt(0) === 39) ||
			(input.charCodeAt(0) === 41) ||
			(input.charCodeAt(0) === 62) ||
			(input.charCodeAt(0) === 93) ||
			(input.charCodeAt(0) === 125)
		);
	}
	return false;
}

export function isCharGroupOpener(input: string): boolean {
	if (input.length === 1) {
		return (
			(input.charCodeAt(0) === 34) ||
			(input.charCodeAt(0) === 39) ||
			(input.charCodeAt(0) === 40) ||
			(input.charCodeAt(0) === 60) ||
			(input.charCodeAt(0) === 91) ||
			(input.charCodeAt(0) === 123)
		);
	}
	return false;
}

export function isCharGrouping(input: string): boolean {
	return isCharGroupOpener(input) || isCharGroupCloser(input);
}
