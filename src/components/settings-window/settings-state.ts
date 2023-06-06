export type settingsState = {
	visible: boolean,
}

export default function newSettingsState(): settingsState {
	return {
		visible: false,
	};
}