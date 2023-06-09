import React from "react";

export type settingsGroupProps = {
	title: string,
	children: any
}

function SettingsGroup(props: settingsGroupProps): React.ReactElement {
	return (
		<div className="SettingsGroup">
			<div className="SettingsGroupTitle">{props.title}</div>
			<div className="SettingsGroupContent">{props.children}</div>
		</div>
	);
}

export default React.memo(
	SettingsGroup,
	(prevProps, nextProps) => {
		return true;
	},
);