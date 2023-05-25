import {machineState, newMachineState} from "./machine-state";
import {characterInfo} from "./character-info";

export type compilerState = {
	characters: characterInfo[],
	vm: machineState,
	lastCompiled: number,
	highestMemoryAddress: number,
}

export function newCompilerState(): compilerState {
	return {
		characters:   [],
		vm:           newMachineState(),
		lastCompiled: 0,
		highestMemoryAddress: 0,
	};
}
