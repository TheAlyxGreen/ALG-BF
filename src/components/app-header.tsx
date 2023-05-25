import React from "react";

function AppHeader() {
	return (
		<header id="AppHeader">
			<span id="AppLogo" className="code">{`[ALG:BF]`}</span>
		</header>
	);
}

export default React.memo(AppHeader, () => true);
