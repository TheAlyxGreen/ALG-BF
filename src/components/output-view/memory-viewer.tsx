import React from "react";
import MemoryCell from "./memory-cell";

export type MemoryViewerProps = {
	memory: number[],
	maxCells: number,
	currentCell: number,
	lastIncrement: number,
}

function MemoryViewer(props: MemoryViewerProps): React.ReactElement {

	let elements: JSX.Element[] = new Array(props.maxCells);
	for (let i = 0; i < props.maxCells + 1; i++) {
		let className = "memCell";
		if (i === props.currentCell) {
			className = className + " currentCell";
		}
		let isCurrentCell = i === props.currentCell;
		elements[i]       =
			<MemoryCell key={"memCell-" + i} isCurrentCell={isCurrentCell} index={i} value={props.memory[i]}/>;
	}

	return (
		<div id="OutputViewMemory">
			{elements}
		</div>
	);
}

export default React.memo(
	MemoryViewer,
	(prevProps, nextProps) => {
		if (prevProps.maxCells !== nextProps.maxCells) {
			return false;
		} else if (prevProps.currentCell !== nextProps.currentCell) {
			return false;
		}
		if (prevProps.lastIncrement !== nextProps.lastIncrement) {
			return false;
		}
		return true;
	},
);