import React, { useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const stripePromise = loadStripe('pk_test_51PInmwP62Hmtd4hNYGpoY9QKGvRboVF0io0RKtIb7uipwLkaIKTgg88vAKIUS3vp9hYALO0H76MHPdHX4QZQTIAE00drpUcrZT'); // Public key từ Stripe Dashboard

const CheckoutButton = ({ cart, text }) => {

    const { profileInfo } = useContext(StoreContext);

    const handleCheckout = async () => {
        try {
            // Tạo session với server
            const response = await axios.post('http://localhost:8080/create-checkout-session', { profileInfo, ...cart });

            const sessionId = response.data.sessionId;

            // Chuyển hướng tới trang thanh toán của Stripe
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId,
            });

            if (error) {
                console.error("Stripe error:", error);
            }
        } catch (error) {
            console.error("Checkout error:", error);
        }
    };

    return (
        <button onClick={handleCheckout}>
            {text}
        </button>
    );
};

export default CheckoutButton;
