import {compilerState, newCompilerState} from "./compiler-state";
import {
	decrementMachineMemory,
	getCellAsChar,
	getCellAsInt,
	incrementMachineMemory,
	setMachineMemory,
} from "./machine-state";
import {characterInfo, setCharacterWarning} from "./character-info";

export default function compileCode(instructions: characterInfo[]): compilerState {
	let nextState          = newCompilerState();
	nextState.characters   = instructions;
	nextState.lastCompiled = Date.now();
	nextState.vm.output    = "";
	let loopCount          = 0;

	let lastChar     = "";
	let skippingLoop = false;
	for (let i = 0; i < instructions.length; i++) {
		let c = instructions[i];
		if (c.character === "]" && lastChar === "[") {
			nextState.characters[i]     = setCharacterWarning(nextState.characters[i]);
			nextState.characters[i - 1] = setCharacterWarning(nextState.characters[i - 1]);
		}
		if (!skippingLoop) {
			switch (c.character) {
				case ">":
					nextState.vm.cursorPosition++;
					nextState.highestMemoryAddress = Math.max(nextState.highestMemoryAddress, nextState.vm.cursorPosition);
					break;
				case "<":
					if (nextState.vm.cursorPosition === 0) {
						nextState.vm.output                   = nextState.vm.output + "\nINSTRUCTION FAULT";
						nextState.characters[i].syntaxWarning = "error";
						return nextState;
					}
					nextState.vm.cursorPosition--;
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
								return nextState;
							}
						}
					} else if (loopCount > 1000) {
						nextState.vm.output                   = nextState.vm.output + "\nLOOP FAULT";
						nextState.characters[i].syntaxWarning = "error";
						return nextState;
					} else {
						loopCount++;
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
							nextState.vm.output                          = nextState.vm.output + "\nINSTRUCTION FAULT";
							nextState.characters[oldIndex].syntaxWarning = "error";
							return nextState;
						}
					}
					i--;
					break;
				default:
					break;
			}
			if (nextState.vm.cursorPosition >= nextState.vm.memory.length) {
				nextState.vm.output                   = nextState.vm.output + "\nMEMORY FAULT";
				nextState.characters[i].syntaxWarning = "error";
				return nextState;
			}
		} else if (c.character === "]") {
			skippingLoop = false;
		}
		lastChar = c.character;
	}
	return nextState;
}
