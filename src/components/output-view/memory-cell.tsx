import React from "react";

export type MemoryCellProps = {
	index: number
	value: number
	isCurrentCell: boolean
}

function MemoryCell(props: MemoryCellProps): React.ReactElement {
	let className = "memCell";
	if (props.isCurrentCell) {
		className = className + " currentCell";
	}
	return (
		<div key={"memCell-" + props.index} id={"memCell-" + props.index} className={className}>
			<span
				id={"memCell-label-" + props.index}
				key={"memCell-label-" + props.index}
				className={"memCell-content memCell-label"}
			>
				{props.index}
			</span>
			<span
				id={"memCell-int-" + props.index}
				key={"memCell-int-" + props.index}
				className={"memCell-content memCell-int"}
			>
				{props.value}
			</span>
			<span
				id={"memCell-char-" + props.index}
				key={"memCell-char-" + props.index}
				className={"memCell-content memCell-char"}
			>
				"{String.fromCharCode(props.value)}"
			</span>
		</div>
	);
}

export default React.memo(
	MemoryCell,
	(prevProps, nextProps) => {
		if (prevProps.isCurrentCell !== nextProps.isCurrentCell) {
			return false;
		} else if (prevProps.index !== nextProps.index) {
			return false;
		} else if (prevProps.value !== nextProps.value) {
			return false;
		}
		return true;
	});