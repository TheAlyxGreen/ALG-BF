import React from "react";

type OutputViewToggleProps = {
	collapsed: boolean
}

export default function OutputViewToggle(props: OutputViewToggleProps): React.ReactElement {
	return (
		<span id={"OutputViewToggle"}>
            {props.collapsed ? "🗖" : "__"}
        </span>
	);
}