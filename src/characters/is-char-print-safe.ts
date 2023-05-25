export default function isCharPrintSafe(input: string): boolean {
	if (input.length === 1) {
		return (input.charCodeAt(0) >= 32) && (input.charCodeAt(0) <= 126);
	}
	return false;
}
