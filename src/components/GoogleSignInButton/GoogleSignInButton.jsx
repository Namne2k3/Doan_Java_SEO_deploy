import React, { useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const GoogleSignInButton = ({ setShowLogin }) => {
    const { fetchProfileData } = useContext(StoreContext);
    const clientId = '1094118264922-622e85rqng6kd6pc93o29cjs88cd8qn4.apps.googleusercontent.com'; // Thay thế bằng Client ID của bạn
    const navigate = useNavigate()
    const onSuccess = async (res) => {
        fetch('http://localhost:8080/api/v1/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: res.credential }),
        })
            .then((response) => response.json())
            .then(async (data) => {

                // console.log('Đăng nhập thành công:', data);
                localStorage.setItem('token', data.token)
                localStorage.setItem('role', "USER")
                await fetchProfileData()
                setShowLogin(false)
                navigate('/')
            })
            .catch((error) => {
                console.error('Login error:', error);
            });
    };

    const onFailure = (err) => {
        console.log('Login failed:', err);
    };


    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onFailure}>
            </GoogleLogin >
        </GoogleOAuthProvider >
    );
};

export default GoogleSignInButton;