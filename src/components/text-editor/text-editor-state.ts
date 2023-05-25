import {createRef, RefObject} from "react";
import {characterInfo} from "../../compiler/character-info";
import parseCharacterInfo from "../../compiler/parse-character-info";

export type textEditorState = {
	cursorEnd: number,
	cursorOffset: number,
	cursorRef: RefObject<HTMLDivElement>
	cursorStart: number,
	text: string,
	characters: characterInfo[],
	focused: boolean,
}

export function newTextEditorState(options?: {
	startText?: string,
	cursorStart?: number,
	cursorEnd?: number
}): textEditorState {
	return {
		text:        options?.startText ?? "",
		cursorStart: options?.cursorStart ?? 0,
		cursorEnd:   options?.cursorEnd ?? 0,
		cursorRef:   createRef<HTMLDivElement>(),
		characters:  parseCharacterInfo(options?.startText ?? ""),
		focused:     true,
	} as textEditorState;
}

export function textEditorInsertText(state: textEditorState, text: string) {
	const newState       = state;
	let firstCursor      = Math.min(state.cursorStart, state.cursorEnd);
	let lastCursor       = Math.max(state.cursorStart, state.cursorEnd);
	newState.text        = state.text.slice(0, firstCursor) +
	                       text +
	                       state.text.slice(
		                       lastCursor,
		                       state.text.length,
	                       );
	newState.cursorStart = state.cursorStart + 1;
	newState.cursorEnd   = newState.cursorStart;
	return newState;
}

export type cursorPosition = {
	index: number,
	indexInLine: number,
	lineNumber: number,
}

export function getCursorStartPosition(state: textEditorState): cursorPosition {
	let lineNumber  = 0;
	let indexInLine = 0;
	for (let i = 0; i < state.cursorStart; i++) {
		indexInLine++;
		if (state.text[i] === "\n") {
			lineNumber++;
			indexInLine = 0;
		}
	}
	return {
		index:       state.cursorStart,
		indexInLine: indexInLine,
		lineNumber:  lineNumber,
	};
}

export function getCursorEndPosition(state: textEditorState): cursorPosition {
	let lineNumber  = 0;
	let indexInLine = 0;
	for (let i = 0; i < state.cursorEnd; i++) {
		indexInLine++;
		if (state.text[i] === "\n") {
			lineNumber++;
			indexInLine = 0;
		}
	}
	return {
		index:       state.cursorEnd,
		indexInLine: indexInLine,
		lineNumber:  lineNumber,
	};
}

export function getLineStartIndex(state: textEditorState, lineNumber: number): number {
	for (let i = 0; i <= state.text.length; i++) {
		if (lineNumber > 0) {
			if (state.text[i] === "\n") {
				lineNumber--;
			}
		} else {
			return i;
		}
	}
	return -1;
}

export function getLineEndIndex(state: textEditorState, lineNumber: number): number {
	let startIndex = getLineStartIndex(state, lineNumber);
	if (startIndex < 0 || startIndex > state.text.length) {
		return -1;
	}
	for (let i = startIndex; i < state.text.length; i++) {
		if (state.text[i] === "\n") {
			return i;
		}
	}
	return state.text.length;
}

export function getSelectedText(state: textEditorState): string {
	let firstCursor = Math.min(state.cursorStart, state.cursorEnd);
	let lastCursor  = Math.max(state.cursorStart, state.cursorEnd);
	return state.text.slice(firstCursor, lastCursor);
}
