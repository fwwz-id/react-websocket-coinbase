import { useState, useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { BTC, ETH, DAI, SOL, SHIB } from "./constants/symbols";
import { ticker_batch } from "./constants/channels";

import Card from "./components/Card";
import CardHeader from "./components/CardHeader";
import CardContents from "./components/CardContents";
import CardContent from "./components/CardContent";

import "./App.css";

const initialState = {
	btc: {
		product_id: BTC,
		price: "0",
		volume_24h: "0",
		best_bid: "0",
		best_ask: "0",
	},
	eth: {
		product_id: ETH,
		price: "0",
		volume_24h: "0",
		best_bid: "0",
		best_ask: "0",
	},
	dai: {
		product_id: DAI,
		price: "0",
		volume_24h: "0",
		best_bid: "0",
		best_ask: "0",
	},
	sol: {
		product_id: SOL,
		price: "0",
		volume_24h: "0",
		best_bid: "0",
		best_ask: "0",
	},
	shib: {
		product_id: SHIB,
		price: "0",
		volume_24h: "0",
		best_bid: "0",
		best_ask: "0",
	},
};

const reducer = (state, action) => {
	const {
		type,
		payload: { product_id, price, volume_24h, best_bid, best_ask },
	} = action;

	switch (type) {
		case BTC:
			return {
				...state,
				btc: {
					...state.btc,
					product_id,
					price,
					volume_24h,
					best_bid,
					best_ask,
				},
			};
		case ETH:
			return {
				...state,
				eth: {
					...state.eth,
					product_id,
					price,
					volume_24h,
					best_bid,
					best_ask,
				},
			};
		case DAI:
			return {
				...state,
				dai: {
					...state.dai,
					product_id,
					price,
					volume_24h,
					best_bid,
					best_ask,
				},
			};
		case SOL:
			return {
				...state,
				sol: {
					...state.sol,
					product_id,
					price,
					volume_24h,
					best_bid,
					best_ask,
				},
			};
		case SHIB:
			return {
				...state,
				shib: {
					...state.shib,
					product_id,
					price,
					volume_24h,
					best_bid,
					best_ask,
				},
			};
		default:
			return state;
	}
};

function App() {
	const [productIds, setProductIds] = useState([BTC, ETH, DAI, SOL, SHIB]);
	const [channelType, setChannelType] = useState([ticker_batch]);

	const [currencies, dispatch] = useReducer(reducer, initialState);

	const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
		"wss://ws-feed.exchange.coinbase.com"
	);

	useEffect(() => {
		if (readyState === ReadyState.OPEN) {
			sendJsonMessage({
				type: "subscribe",
				product_ids: productIds,
				channels: channelType,
			});
		}
	}, [readyState]);

	useEffect(() => {
		if (lastJsonMessage) {
			const { channels, ...payload } = lastJsonMessage;
			const type = payload.product_id;

			dispatch({ type, payload });

			if (channels) {
				if (channels.length) {
					const [subscribedProducts] = channels.map(
						(channel) => channel.product_ids
					);
					setProductIds(subscribedProducts);
				} else {
					setProductIds([]);
				}
			}
		}
	}, [lastJsonMessage]);

	const toggleSubscription = (status, product_ids, channels) => {
		sendJsonMessage({
			type: status ? "unsubscribe" : "subscribe",
			product_ids: [product_ids],
			channels: [channels],
		});
	};

	return (
		<div className="App">
			<h1 className="title">Crypto List.</h1>
			{!productIds.length ? (
				<h2 className="no-subs">No Subscription.</h2>
			) : (
				<div className="cards">
					{Object.keys(currencies).map((currency, id) => {
						const {
							product_id,
							price,
							volume_24h,
							best_bid,
							best_ask,
						} = currencies[currency];
						const currProductIndex = productIds.indexOf(product_id);
						const isSubscribed =
							productIds.length && currProductIndex > -1;

						return (
							<Card
								key={id}
								isSubscribe={isSubscribed}
								toggleSubscription={() =>
									toggleSubscription(
										isSubscribed,
										product_id,
										...channelType
									)
								}>
								<CardHeader
									productId={product_id}
									price={price}
								/>
								<CardContents>
									<CardContent className="content-1">
										<span className="label label-volume">
											Volume 24h:
										</span>
										<span className="value value-volume">
											{volume_24h.substring(0, 5)}
										</span>
									</CardContent>
									<CardContent className="content-2">
										<div className="card-content-bid">
											<p className="label label-bid">
												Best Bid
											</p>
											<p className="value value-bid">
												{best_bid}
											</p>
										</div>
										<div className="card-content-ask">
											<p className="label label-ask">
												Best Ask:
											</p>
											<p className="value value-ask">
												{best_ask}
											</p>
										</div>
									</CardContent>
								</CardContents>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default App;
