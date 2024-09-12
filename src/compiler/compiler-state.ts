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
	canPause: boolean,
}

export default function newCompilerState(maxLoopCount?: number, stepTime?: number): compilerState {
	let newStepTime = stepTime ?? 50;
	if (newStepTime < 50) {
		newStepTime = 50;
	}
	if (newStepTime > 1000) {
		newStepTime = 1000;
	}
	let newLoopCount = maxLoopCount ?? 10000;
	if (newLoopCount < 1000) {
		newLoopCount = 1000;
	}
	if (newLoopCount > 999999999) {
		newLoopCount = 999999999;
	}
	return {
		characters:           new Array(0),
		vm:                   newMachineState(),
		highestMemoryAddress: 0,
		started:              false,
		running:              false,
		stepTime:             newStepTime,
		maxLoopCount:         newLoopCount,
		canPause: true,
	};
}
