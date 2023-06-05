import React from "react";
import MemoryCell from "./memory-cell";

export type MemoryViewerProps = {
	memory: number[],
	maxCells: number,
	currentCell: number,
}

export default function MemoryViewer(props: MemoryViewerProps): React.ReactElement {

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