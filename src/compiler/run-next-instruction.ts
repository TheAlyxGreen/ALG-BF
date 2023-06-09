import {compilerState} from "./compiler-state";
import {
	decrementMachineMemory,
	getCellAsChar,
	getCellAsInt,
	incrementMachineMemory,
	setMachineMemory,
} from "./machine-state";
import {isCharBfOperator} from "../characters";

export default function runNextInstruction(initialState: compilerState): compilerState {
	let instructions                     = initialState.characters;
	const nextState                      = initialState;
	nextState.vm.lastInstructionPosition = nextState.vm.instructionPosition;

	let i = initialState.vm.instructionPosition;

	if (i >= instructions.length) {
		nextState.running = false;
		nextState.started = false;
	} else if (i < 0) {
		nextState.running                     = false;
		nextState.started                     = false;
		nextState.vm.errorCode                = "INSTRUCTION_FAULT";
		nextState.vm.errorChar                = instructions[i];
		nextState.characters[i].syntaxWarning = "error";
	} else {
		let c = instructions[i];
		while (!isCharBfOperator(c.character)) {
			i++;
			if (i >= instructions.length) {
				nextState.running = false;
				nextState.started = false;
				return nextState;
			}
			c = instructions[i];
		}
		switch (c.character) {
			case ">":
				nextState.vm.cursorPosition++;
				nextState.highestMemoryAddress = Math.max(nextState.highestMemoryAddress, nextState.vm.cursorPosition);
				break;
			case "<":
				if (nextState.vm.cursorPosition === 0) {
					nextState.running                     = false;
					nextState.started                     = false;
					nextState.vm.errorCode                = "MEMORY_FAULT";
					nextState.vm.errorChar                = instructions[i];
					nextState.characters[i].syntaxWarning = "error";
				} else {
					nextState.vm.cursorPosition--;
				}
				break;
			case "+":
				incrementMachineMemory(nextState.vm);
				break;
			case "-":
				decrementMachineMemory(nextState.vm);
				break;
			case ".":
				nextState.vm.output = nextState.vm.output + getCellAsChar(nextState.vm);
				break;
			case ",":
				let input = prompt("input char:") || "";
				if (input.length > 0) {
					setMachineMemory(nextState.vm, input.charCodeAt(0));
				} else {
					setMachineMemory(nextState.vm, 0);
				}
				break;
			case "[":
				if (getCellAsInt(nextState.vm) === 0) {
					let c2        = instructions[i].character;
					let loopDepth = 1;
					while (c2 !== "]" || loopDepth > 0) {
						if (i + 1 < instructions.length) {
							i++;
							c2 = instructions[i].character;
							if (c2 === "[") {
								loopDepth++;
							} else if (c2 === "]") {
								loopDepth--;
							}
						} else {
							break;
						}
					}
				} else if (nextState.vm.loopCount > 1000) {
					nextState.running                     = false;
					nextState.started                     = false;
					nextState.vm.errorCode                = "LOOP_FAULT";
					nextState.vm.errorChar                = instructions[i];
					nextState.characters[i].syntaxWarning = "error";
					break;
				} else {
					nextState.vm.loopCount++;
				}
				break;
			case "]":
				let c2        = instructions[i].character;
				let oldIndex  = i;
				let loopDepth = 1;
				while (c2 !== "[" || loopDepth > 0) {
					if (i > 0) {
						i--;
						c2 = instructions[i].character;
						if (c2 === "]") {
							loopDepth++;
						} else if (c2 === "[") {
							loopDepth--;
						}
					} else {
						nextState.running                            = false;
						nextState.started                            = false;
						nextState.vm.errorCode                       = "INSTRUCTION_FAULT";
						nextState.vm.errorChar                       = instructions[oldIndex];
						nextState.characters[oldIndex].syntaxWarning = "error";
						break;
					}
				}
				i--;
				break;
			default:
				break;
		}
		if (nextState.vm.cursorPosition >= nextState.vm.memory.length) {
			nextState.running                     = false;
			nextState.started                     = false;
			nextState.vm.errorCode                = "MEMORY_FAULT";
			nextState.vm.errorChar                = instructions[i];
			nextState.characters[i].syntaxWarning = "error";
		}

		nextState.vm.instructionPosition = i + 1;

	}

	return nextState;
}
