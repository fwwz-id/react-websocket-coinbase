import React from "react";

function CardContent({ className, children }) {
	return (
		<div className={`card-content ${className ? className : ""}`}>
			{children}
		</div>
	);
}

export default CardContent;
