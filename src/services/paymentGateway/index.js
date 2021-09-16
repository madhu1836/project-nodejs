'use strict';
const config = require('../../config/environments');
const stripe = require('stripe')(config.stripe.secretKey);

module.exports = {
	createSession : async (data) => {
		let item = {
			name: data.name,
			description: data.description,
			images: [data.images],
			amount: data.amount,
			currency: data.currency,
			quantity: data.quantity
		};
		let cartItems = {
			payment_method_types: ['card'],
			line_items: [item],
			success_url: config.artProvenBaseUrl + '/payment/success',
			cancel_url: config.artProvenBaseUrl + '/payment/failed',
		};
		const session = await stripe.checkout.sessions.create(cartItems);
		return session;
	},
	createplanSession : async (data) => {
		let item = {
			name: data.name,
			amount: data.amount,
			currency: data.currency,
			quantity: data.quantity
		};
		let cartItems = {
			payment_method_types: ['card'],
			line_items: [item],
			success_url: config.artProvenBaseUrl + '/payment/success',
			cancel_url: config.artProvenBaseUrl + '/payment/failed',
		};
		const session = await stripe.checkout.sessions.create(cartItems);
		return session;
	}
};
