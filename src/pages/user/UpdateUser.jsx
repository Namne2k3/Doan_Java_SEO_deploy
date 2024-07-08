import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services';

function UpdateUser() {
    const navigate = useNavigate();
    const { userId } = useParams();


    const [userData, setUserData] = useState({
        username: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        fetchUserDataById(userId); // Pass the userId to fetchUserDataById
    }, [userId]); //wheen ever there is a chane in userId, run this

    const fetchUserDataById = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await userService.getUserById(userId, token); // Pass userId to getUserById

            console.log("Check userDetail >>> ", response.user);

            const { username, email, role } = response.user;
            setUserData({ username, email, role });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name);
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const confirmDelete = window.confirm('Are you sure you want to update this user?');
            if (confirmDelete) {
                const token = localStorage.getItem('token');
                const res = await userService.updateUser(userId, userData, token);
                console.log(res)
                // Redirect to profile page or display a success message
                navigate("/admin/user-management")
            }

        } catch (error) {
            console.error('Error updating user profile:', error);
            alert(error)
        }
    };

    return (
        <div className="auth-container">
            <h2>Update User</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="username" value={userData.username} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={userData.email} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Role:</label>
                    <input type="text" name="role" value={userData.role} onChange={handleInputChange} />
                </div>
                {/* <div className="form-group">
                    <label>City:</label>
                    <input type="text" name="city" value={userData.city} onChange={handleInputChange} />
                </div> */}
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UpdateUser;