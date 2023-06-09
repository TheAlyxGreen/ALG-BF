import React from "react";
import AppHeader from "./components/app-header";
import TextEditor, {newTextEditorState, textEditorState} from "./components/text-editor";
import {
	handleCopy,
	handleCut,
	handleKeyDown,
	handleKeyUp,
	handleMouseDown,
	handleMouseOver,
	handleMouseUp,
	handlePaste,
	handleWindowBlur,
} from "./event-handlers";
import OutputView, {outputViewState} from "./components/output-view";
import {compilerState, newCompilerState, runNextInstruction} from "./compiler";
import loadInitialScript from "./load-initial-script";
import SettingsWindow, {newSettingsState, settingsState} from "./components/settings-window";

export type mouseState = {
	leftClicked: boolean,
	rightClicked: boolean,
	middleClicked: boolean,
	clickedElementID: string,
}

export type appState = {
	textEditor: textEditorState,
	outputView: outputViewState,
	mouse: mouseState,
	compiler: compilerState,
	settings: settingsState,
}

export default class App extends React.Component<any, appState> {
	hasLoaded: boolean = false;
	state: appState    =
		{
			textEditor: newTextEditorState(),
			outputView: {collapsed: false},
			mouse:      {
				leftClicked:      false,
				rightClicked:     false,
				middleClicked:    false,
				clickedElementID: "",
			},
			compiler:   newCompilerState(),
			settings:   newSettingsState(),
		};
	timer              = setTimeout(() => {
	}, 1000);

	CompilerStepperLoop(this: App) {
		this.timer = setTimeout(this.CompilerStepperLoop.bind(this), this.state.compiler.stepTime);
		if (this.state.compiler.running) {
			const nextState    = this.state;
			nextState.compiler = runNextInstruction(nextState.compiler);
			this.setState(nextState);
		}
	}

	componentDidMount(): void {
		if (!this.hasLoaded) {
			this.hasLoaded = true;
			clearTimeout(this.timer);
			this.timer = setTimeout(this.CompilerStepperLoop.bind(this), 1000);
			document.addEventListener("keydown", handleKeyDown.bind(this));
			document.addEventListener("keyup", handleKeyUp.bind(this));
			document.addEventListener("mousedown", handleMouseDown.bind(this));
			document.addEventListener("mouseup", handleMouseUp.bind(this));
			document.addEventListener("mouseover", handleMouseOver.bind(this));
			document.addEventListener("paste", handlePaste.bind(this));
			document.addEventListener("copy", handleCopy.bind(this));
			document.addEventListener("cut", handleCut.bind(this));
			window.addEventListener("blur", handleWindowBlur.bind(this));
		}
		loadInitialScript.bind((this))();
	}

	getSetState(this: App) {
		return this.setState;
	}

	render(): React.ReactNode {
		return (
			<div id="App">
				<AppHeader
					isRunning={this.state.compiler.running}
					isStarted={this.state.compiler.started}
				/>
				<TextEditor
					editorState={this.state.textEditor}
					outputViewState={this.state.outputView}
					compilerState={this.state.compiler}
				/>
				<OutputView
					outputViewState={this.state.outputView}
					highestMemoryAddress={this.state.compiler.highestMemoryAddress}
					vmState={this.state.compiler.vm}
					isRunning={this.state.compiler.running}
				/>
				<SettingsWindow
					settingsState={this.state.settings}
					compilerState={this.state.compiler}
				/>
			</div>
		);
	}
}
