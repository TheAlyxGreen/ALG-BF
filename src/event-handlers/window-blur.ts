import App from "../app";

export default function handleWindowBlur(this: App, e: Event) {
	let nextState = this.state;

	nextState.textEditor.focused = false;

	this.setState(nextState);
}