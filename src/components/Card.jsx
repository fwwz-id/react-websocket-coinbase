import React from "react";

function Card({ children, isSubscribe, toggleSubscription, ...props }) {
	return (
		<div className="card" {...props}>
			{children}
			<div className="card-layer">
				<p className="toggle-subscription">
					<span
						className="value"
						onClick={toggleSubscription}>
						{ isSubscribe ? "Unsubscribe" : "Subscribe"}
					</span>
				</p>
			</div>
		</div>
	);
}

export default Card;
