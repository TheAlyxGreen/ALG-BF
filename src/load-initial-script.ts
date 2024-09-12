import App from "./app";
import {parseCode} from "./compiler";

export default function loadInitialScript(this: App) {
	let nextState = this.state;

	nextState.textEditor.text =
		"[ALG:BF] is a Brainfuck IDE\n" +
		"By Alyx Green\n" +
		"Use # for breakpoints\n" +
		"More features coming soon\n" +
		">++++++++[<+++++++++>-]<.\n" +
		">++++[<+++++++>-]<+.\n" +
		"+++++++..\n" +
		"+++.\n" +
		">>++++++[<+++++++>-]<++.\n" +
		"------------.\n" +
		">++++++[<+++++++++>-]<+.\n" +
		"<.\n" +
		"+++.\n" +
		"------.\n" +
		"--------.\n" +
		">>>++++[<++++++++>-]<+.";

	nextState.compiler.characters = parseCode(nextState.textEditor.text);
	let r: HTMLElement = document.querySelector(":root") as HTMLElement;
	let lineCount      = nextState.textEditor.text.split("\n").length;
	r.style.setProperty("--line-count-length", `${("" + (lineCount - 1)).length}ch`);
	this.setState(nextState);
}