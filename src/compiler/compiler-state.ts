import newMachineState, {machineState} from "./machine-state";
import {characterInfo} from "./character-info";

export type compilerState = {
	characters: characterInfo[],
	vm: machineState,
	highestMemoryAddress: number,
	started: boolean,
	running: boolean,
	stepTime: number,
	maxLoopCount: number,
}

export default function newCompilerState(): compilerState {
	return {
		characters:           new Array(0),
		vm:                   newMachineState(),
		highestMemoryAddress: 0,
		started:              false,
		running:              false,
		stepTime:             50,
		maxLoopCount:         1000,
	};
}
