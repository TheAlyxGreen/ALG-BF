import React from "react";

export type MemoryViewerProps = {
	memory: number[],
	maxCells: number,
}

export default function MemoryViewer(props: MemoryViewerProps): React.ReactElement {

	let elements: JSX.Element[] = new Array(props.maxCells);
	for (let i=0;i<props.maxCells;i++){
		elements[i] = <div id={"memCell-"+i} className={"memCell"}>
			<span id={"memCell-label-"+i} className={"memCell-content memCell-label"}>
				{i}
			</span>
			<span id={"memCell-int-"+i} className={"memCell-content memCell-int"}>
				{props.memory[i]}
			</span>
			<span id={"memCell-char-"+i} className={"memCell-content memCell-char"}>
				"{String.fromCharCode(props.memory[i])}"
			</span>
		</div>
	}

	return (
		<div id="OutputViewMemory">
			{elements}
		</div>
	);
}