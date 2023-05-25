export type TextEditorPosition = {
	lineNumber: number
	charNumber: number
}

export function newTextEditorPosition(options?: { lineNumber?: number, charNumber?: number }): TextEditorPosition {
	return {
		lineNumber: options?.lineNumber ?? 0,
		charNumber: options?.charNumber ?? 0,
	} as TextEditorPosition;
}
