import App from "./app";
import compileCode from "./compiler/compile-code";
import parseCharacterInfo from "./compiler/parse-character-info";

export default function loadInitialScript(this: App) {
	let nextState = this.state;

	nextState.textEditor.text =
		"[ALG:BF] is a Brainfuck IDE\n" +
		"by Alyx L Green\n" +
		"Desktop computers only for now\n" +
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

	nextState.compiler              = compileCode(parseCharacterInfo(nextState.textEditor.text));
	nextState.textEditor.characters = nextState.compiler.characters;

	let r: HTMLElement = document.querySelector(":root") as HTMLElement;
	let lineCount      = nextState.textEditor.text.split("\n").length;
	r.style.setProperty("--line-count-length", `${("" + (lineCount - 1)).length}ch`);
	this.setState(nextState);
}