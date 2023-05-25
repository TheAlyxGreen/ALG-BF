import App from "../app";

export default function handleMouseUp(this: App, e: MouseEvent) {
	let nextState = this.state;
	switch (e.button) {
		case 0:
			nextState.mouse.leftClicked = false;
			break;
		case 1:
			nextState.mouse.middleClicked = false;
			break;
		case 2:
			nextState.mouse.rightClicked = false;
			break;
	}
	nextState.mouse.clickedElementID = "";

	this.setState(nextState);
}
