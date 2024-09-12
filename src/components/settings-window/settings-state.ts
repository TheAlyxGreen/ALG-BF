export type settingsState = {
	visible: boolean,
	textEditorFontSize: number,
	outputFontSize: number,
}

export default function newSettingsState(): settingsState {
	let textEditorFontSize: string = document.querySelector(":root")?.getAttribute("--text-editor-font-size") ?? "20pt";
	textEditorFontSize             = textEditorFontSize.slice(0, textEditorFontSize.length - 2);
	let outputFontSize: string     = document.querySelector(":root")?.getAttribute("--output-view-font-size") ?? "18pt";
	outputFontSize                 = outputFontSize.slice(0, outputFontSize.length - 2);
	return {
		visible: false,
		textEditorFontSize: parseInt(textEditorFontSize),
		outputFontSize:     parseInt(outputFontSize),
	};
}