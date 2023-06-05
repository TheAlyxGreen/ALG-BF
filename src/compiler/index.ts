import {
	characterInfo,
	charactersAreEqual,
	newCharacterInfo,
	setCharacterError,
	setCharacterWarning,
	syntaxHighlightLevel,
} from "./character-info";
import newCompilerState, {compilerState} from "./compiler-state";
import newMachineState, {
	decrementMachineMemory,
	getCellAsChar,
	getCellAsInt,
	incrementMachineMemory,
	machineErrors,
	machineState,
	setMachineMemory,
} from "./machine-state";
import parseCode from "./parse-code";
import runNextInstruction from "./run-next-instruction";
import runWholeScript from "./run-whole-script";

export {
	setCharacterWarning,
	setCharacterError,
	newCharacterInfo,
	charactersAreEqual,
	newCompilerState,
	newMachineState,
	incrementMachineMemory,
	decrementMachineMemory,
	getCellAsInt,
	getCellAsChar,
	setMachineMemory,
	parseCode,
	runNextInstruction,
	runWholeScript,
};
export type {syntaxHighlightLevel, characterInfo, compilerState, machineErrors, machineState};