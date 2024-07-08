// OAuth2Callback.js
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '.';

const OAuth2Callback = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Gửi token lên backend để xác thực và lấy thông tin user
            userService.authenticateWithOAuth2(token)
                .then(response => {
                    // Lưu token và thông tin user vào localStorage
                    localStorage.setItem('token', response.data.token);
                    // ... (lưu các thông tin khác)

                    navigate('/');
                })
                .catch(error => {
                    console.log('Error authenticating with OAuth2:', error);
                    navigate('/login');
                });
        } else {
            navigate('/login?redirectUri=/oauth2/callback');
        }
    }, [navigate, searchParams]);

    return <div>Loading...</div>;
};

export default OAuth2Callback;

// You will also need to define `authenticateUser` function to handle the token processing and user authentication.
