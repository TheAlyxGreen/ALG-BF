export default function isCharBfOperator(input: string): boolean {
	return (
		input === "+" ||
		input === "-" ||
		input === "<" ||
		input === ">" ||
		input === "[" ||
		input === "]" ||
		input === "." ||
		input === "," ||
		input === "#"
	);
}
