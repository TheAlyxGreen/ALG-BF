export type machineState = {
	cursorPosition: number,
	memory: number[],
	output: string,
}

export function newMachineState(): machineState {
	return {
		cursorPosition: 0,
		memory:         new Array(65536).fill(0),
		output:         "",
	};
}

export function incrementMachineMemory(state: machineState, amount?: number) {
	state.memory[state.cursorPosition] = Math.abs((state.memory[state.cursorPosition] + (amount ?? 1)) % 256);
}

export function decrementMachineMemory(state: machineState, amount?: number) {
	state.memory[state.cursorPosition] = Math.abs((state.memory[state.cursorPosition] - (amount ?? 1)) % 256);
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
