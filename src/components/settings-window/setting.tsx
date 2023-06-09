import React from "react";

export type settingProps = {
	id: string,
	label: string,
	type: React.HTMLInputTypeAttribute,
	min?: number,
	max?: number,
	placeholder?: string,
}

function Setting(props: settingProps): React.ReactElement {
	return (
		<div className="Setting" id={"setting-" + props.id}>
			<label
				className="SettingLabel"
				id={"label-" + props.id}
			>
				{props.label}:
			</label>
			<input
				className="SettingInput"
				id={props.id}
				type={props.type}
				min={props.min}
				max={props.max}
				placeholder={props.placeholder}
			/>
		</div>
	);
}

export default React.memo(
	Setting,
	(prevProps, nextProps) => {
		return true;
	},
);