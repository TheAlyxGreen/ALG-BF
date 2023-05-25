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
import {compilerState, newCompilerState} from "./compiler/compiler-state";
import loadInitialScript from "./load-initial-script";

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
		};


	componentDidMount(): void {
		if (!this.hasLoaded) {
			this.hasLoaded = true;

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

	render(): React.ReactNode {
		return (
			<div id="App">
				<AppHeader/>
				<TextEditor
					editorState={this.state.textEditor}
					outputViewState={this.state.outputView}
				/>
				<OutputView
					editorState={this.state.textEditor}
					outputViewState={this.state.outputView}
					vmState={this.state.compiler}
				/>
			</div>
		);
	}
}
