export default function isCharNumber(input: string): boolean {
	if (input.length === 1) {
		return (input.charCodeAt(0) >= 48 && input.charCodeAt(0) <= 57);
	}
	return false;
}
