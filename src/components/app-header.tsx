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
	let stepToolbarClass = "toolbar";
	if (props.isStarted) {
		stepToolbarClass = stepToolbarClass + " isStepping";
	}

	return (
		<header id="AppHeader">
			<span id="AppLogo" className="code">[ALG:BF]</span>
			<div id="HeaderToolbarContainer">
				<div id="CompileToolbar" className="toolbar">
					<span id="CompileButton" className={headerClasses} title="Run code">play_arrow</span>
					<span id="StepThroughButton" className={headerClasses} title="Step through code">
					<span>slow_motion_video</span>
				</span>
				</div>
				<div id="StepToolbar" className={stepToolbarClass}>
					<span id="StepStopButton" className={headerClasses} title="Stop stepping through code">stop</span>
					{pauseButton}
					<span id="StepForwardButton" className={headerClasses} title="Run next instruction">step</span>
				</div>
				<div id="SettingsToolbar" className="toolbar">
					<span id="SettingsButton" className={headerClasses} title="Settings"><span>settings</span></span>
				</div>
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
