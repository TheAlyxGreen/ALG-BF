import {characterInfo, newCharacterInfo} from "./character-info";

export type machineErrors = "NONE" | "LOOP_FAULT" | "MEMORY_FAULT" | "INSTRUCTION_FAULT"

export type machineState = {
	instructionPosition: number,
	lastInstructionPosition: number,
	cursorPosition: number,
	memory: number[],
	output: string,
	loopCount: number,
	errorCode: machineErrors,
	errorChar: characterInfo,
}

export default function newMachineState(): machineState {
	return {
		instructionPosition:     0,
		lastInstructionPosition: -1,
		cursorPosition:          0,
		memory:                  new Array(65536).fill(0),
		output:                  "",
		loopCount:               0,
		errorCode:               "NONE",
		errorChar:               newCharacterInfo("", -1, -1, -1),
	};
}

export function incrementMachineMemory(state: machineState, amount?: number) {
	state.memory[state.cursorPosition] = Math.abs((state.memory[state.cursorPosition] + (amount ?? 1)) % 256);
}

export function decrementMachineMemory(state: machineState, amount?: number) {
	let newVal = state.memory[state.cursorPosition] - (amount ?? 1);
	while (newVal < 0) {
		newVal = newVal + 256;
	}
	state.memory[state.cursorPosition] = newVal % 256;
}

export function setMachineMemory(state: machineState, value: number) {
	state.memory[state.cursorPosition] = Math.abs(value % 256);
}

export function getCellAsInt(state: machineState) {
	return state.memory[state.cursorPosition] % 256;
}

export function getCellAsChar(state: machineState) {
	return String.fromCharCode(state.memory[state.cursorPosition]);
}
