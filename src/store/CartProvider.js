import React from "react";
import CartContext from "./cart-context";

const DEFAULT_CART_STATE = {
	items: [],
	totalAmount: 0,
};

const cartReducer = (state, action) => {
	if (action.type === "ADD_ITEM") {
		const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;

		const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);
		const existingCartItem = state.items[existingCartItemIndex];

		let updatedItems;

		if (existingCartItem) {
			updatedItems = [...state.items];

			updatedItems[existingCartItemIndex] = {
				...existingCartItem,
				amount: existingCartItem.amount + action.item.amount,
			};
		} else updatedItems = state.items.concat(action.item);

		return {
			items: updatedItems,
			totalAmount: updatedTotalAmount,
		};
	}

	if (action.type === "REMOVE_ITEM") {
		const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
		const existingCartItem = state.items[existingCartItemIndex];
		const updatedTotalAmount = state.totalAmount - existingCartItem.price;
		let updatedItems;
		if (existingCartItem.amount === 1) {
			updatedItems = state.items.filter((item) => item.id !== action.id);
		} else {
			const updatedItem = { ...existingCartItem, amount: existingCartItem.amount - 1 };
			updatedItems = [...state.items];
			updatedItems[existingCartItemIndex] = updatedItem;
		}

		return {
			items: updatedItems,
			totalAmount: updatedTotalAmount,
		};
	}

	if (action.type === "CLEAR_ALL") {
		return DEFAULT_CART_STATE;
	}

	return DEFAULT_CART_STATE;
};

const CartProvider = (props) => {
	const [cartState, cartDispatchAction] = React.useReducer(cartReducer, DEFAULT_CART_STATE);

	const addItemToCartHandler = (item) => {
		cartDispatchAction({ type: "ADD_ITEM", item: item });
	};

	const removeItemFromCartHandler = (id) => {
		cartDispatchAction({ type: "REMOVE_ITEM", id: id });
	};

	const clearCartHandler = () => {
		cartDispatchAction({ type: "CLEAR_ALL" });
	};

	const cartContext = {
		items: cartState.items,
		totalAmount: cartState.totalAmount,
		addItem: addItemToCartHandler,
		removeItem: removeItemFromCartHandler,
		clearCart: clearCartHandler,
	};

	return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>;
};
export default CartProvider;
