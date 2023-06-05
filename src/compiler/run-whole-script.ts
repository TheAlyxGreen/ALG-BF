import newCompilerState, {compilerState} from "./compiler-state";
import runNextInstruction from "./run-next-instruction";

export default function runWholeScript(initialState: compilerState): compilerState {
	let nextState        = newCompilerState();
	nextState.characters = initialState.characters;

	nextState.running = true;
	while (nextState.running) {
		nextState = runNextInstruction(nextState);
	}

	return nextState;
}
