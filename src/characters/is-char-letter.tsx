export default function isCharLetter(input: string): boolean {
	if (input.length === 1) {
		return (
			(input.charCodeAt(0) >= 65 && input.charCodeAt(0) <= 90) ||
			(input.charCodeAt(0) > 97 && input.charCodeAt(0) <= 122)
		);
	}
	return false;
}
