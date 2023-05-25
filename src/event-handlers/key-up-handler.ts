import App, {appState} from "../app";
import compileCode from "../compiler/compile-code";
import parseCharacterInfo from "../compiler/parse-character-info";

export default function handleKeyUp(this: App, e: KeyboardEvent) {
	const nextState: appState = this.state;
	switch (e.key) {
		case "Alt":
			e.preventDefault();
			console.log();
			break;
		case "Control":
			e.preventDefault();
			break;
		case "Shift":
			e.preventDefault();
			break;
		case "Tab":
			if ((e.target as Element)?.id === "TextEditor") {
				e.preventDefault();
			}
			break;
		default:
			break;
	}
	if (Date.now() - nextState.compiler.lastCompiled > 10) {
		nextState.compiler              = compileCode(parseCharacterInfo(nextState.textEditor.text));
		nextState.textEditor.characters = nextState.compiler.characters;
	} else {
		nextState.textEditor.characters = parseCharacterInfo(nextState.textEditor.text);
	}
	this.setState(nextState);
	let r: HTMLElement = document.querySelector(":root") as HTMLElement;
	let lineCount      = nextState.textEditor.text.split("\n").length;
	r.style.setProperty("--line-count-length", `${("" + (lineCount - 1)).length}ch`);
}
