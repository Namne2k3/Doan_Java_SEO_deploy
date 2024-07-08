
import React, { useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import "./CheckoutListButton.css"
const stripePromise = loadStripe('pk_test_51PInmwP62Hmtd4hNYGpoY9QKGvRboVF0io0RKtIb7uipwLkaIKTgg88vAKIUS3vp9hYALO0H76MHPdHX4QZQTIAE00drpUcrZT'); // Public key từ Stripe Dashboard

const CheckoutListButton = ({ carts, text = "Thanh toán giỏ hàng", voucher }) => {

    // const { carts } = useContext(StoreContext)
    const BASE_URL = "http://localhost:8080"
    const { profileInfo } = useContext(StoreContext)
    const cartItems = carts && carts.map(item => {
        const productWithQuantity = { ...item.product };
        productWithQuantity.quantity = item.quantity;
        return productWithQuantity;
    });
    const handleCheckout = async () => {
        try {
            // Tạo session với server

            const response = await axios.post(`${BASE_URL}/create-checkout-list-session?voucher=${voucher}`, {
                profileInfo,
                cartItems
            });
            const sessionId = response.data.sessionId;

            // Chuyển hướng tới trang thanh toán của Stripe
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId,
            });


            if (error) {
                console.log("Stripe error:", error);
            }
            // else {
            //     if (userProfile != null) {
            //         let profileInfo = userProfile;
            //         const response = await axios.post(`${BASE_URL}/create-checkout-list-session`, {
            //             profileInfo,
            //             cartItems
            //         });
            //         const sessionId = response.data.sessionId;

            //         // Chuyển hướng tới trang thanh toán của Stripe
            //         const stripe = await stripePromise;
            //         const { error } = await stripe.redirectToCheckout({
            //             sessionId,
            //         });


            //         if (error) {
            //             console.log("Stripe error:", error);
            //         }
            //     }
            // }

        } catch (error) {
            console.log("Checkout error:", error);
        }
    };

    return (
        <button className='checkout_btn' onClick={handleCheckout}>
            {text}
        </button>
    );
};

export default CheckoutListButton;
