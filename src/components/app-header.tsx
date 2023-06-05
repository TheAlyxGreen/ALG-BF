import React from "react";

type AppHeaderProps = {
	isStarted: boolean,
	isRunning: boolean,
}

function AppHeader(props: AppHeaderProps) {
	let headerClasses = "headerButton material-symbols-outlined";
	let pauseButton   = <span id="StepPauseButton" className={headerClasses} title="Pause running code">pause</span>;
	if (!props.isRunning) {
		pauseButton = <span id="StepResumeButton" className={headerClasses} title="Resume running code">resume</span>;
	}

	return (
		<header id="AppHeader">
			<span id="AppLogo" className="code">[ALG:BF]</span>
			<div id="CompileToolbar" className="toolbar">
				<span id="CompileButton" className={headerClasses} title="Run code">play_arrow</span>
				<span id="StepThroughButton" className={headerClasses} title="Step through code">
					<span>slow_motion_video</span>
				</span>
			</div>
			<div id="StepToolbar" className="toolbar" style={{display: props.isStarted ? "" : "none"}}>
				<span id="StepStopButton" className={headerClasses} title="Stop stepping through code">stop</span>
				{pauseButton}
				<span id="StepForwardButton" className={headerClasses} title="Run next instruction">step</span>
			</div>
		</header>
	);
}

export default React.memo(AppHeader, (prevProps, nextProps) => {
	if (prevProps.isRunning !== nextProps.isRunning) {
		return false;
	}
	if (prevProps.isStarted !== nextProps.isStarted) {
		return false;
	}
	return true;
});
