import React from "react";

function CardHeader({ productId, price }) {
	return (
		<div className="card-head">
			<p className="card-head-id">{productId.replace(/(-)/, "/")}</p>
			<p className="card-head-volume">{price}</p>
		</div>
	);
}

export default CardHeader;
