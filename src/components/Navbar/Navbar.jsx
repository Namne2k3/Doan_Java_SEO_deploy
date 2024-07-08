import React, { useEffect } from 'react'
import "./Navbar.css"
import { images } from '../../assets/images'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { userService } from '../../services'

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("home")
    const [isSearching, setIsSearching] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false); // 
    const token = localStorage.getItem('token');
    const navigate = useNavigate()
    const logout = () => {
        userService.logout();
        window.location.href = "/"
    }

    useEffect(() => {
        const checkAdmin = async () => {
            if (token) { // Chỉ kiểm tra nếu có token
                const isAdmin = await userService.adminOnly();
                setIsAdmin(isAdmin);
            }
        };

        checkAdmin();
    }, [token]); // Kiểm tra lại khi token thay đổi


    return (
        <div className='navbar'>
            <Link to="/">
                <img src={images.logo} alt="logo" className='logo' />
            </Link>
            {
                isSearching === false
                    ?
                    <ul className="navbar-menu">
                        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Trang chủ</Link>
                        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Danh mục</a>
                        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Liên hệ</a>
                    </ul>
                    :
                    <div className='navbar-search'>
                        <input onChange={(e) => setTimeout(() => navigate(`/search/${e.target.value}`), 2000)} type='text' placeholder='Tìm kiếm sản phẩm' />
                    </div>
            }
            <div className="navbar-right">
                <img onClick={() => setIsSearching(!isSearching)} src={images.search_icon} alt="search_icon" />
                <div className="navbar-search-icon">
                    <Link to="/cart">
                        <img src={images.basket_icon} alt="basket_icon" />
                    </Link>
                </div>
                {
                    token != null
                        ?
                        <>
                            {/* <Link to="/profile">
                                <img src={images.profile_icon} alt="profile_icon" />
                            </Link>
                            <button onClick={logout} className='navbar-button'>
                                Đăng xuất
                            </button> */}
                            <div className="navbar-profile">
                                <Link to="/profile">
                                    <img src={images.profile_icon} alt='profile_image' />
                                </Link>
                                <ul className="nav-profile-dropdown">
                                    <li>
                                        <Link to="/myorder">
                                            <img src={images.bag_icon} alt="bag_icon" />
                                            <p>Đơn đặt hàng</p>
                                        </Link>
                                    </li>
                                    <hr />
                                    <li>
                                        <img onClick={logout} src={images.logout_icon} alt="logout_icon" />
                                        <p>Đăng xuất</p>
                                    </li>
                                </ul>
                            </div>
                        </>
                        :
                        <>
                            <button onClick={() => setShowLogin(true)} className='navbar-button'>
                                Đăng nhập
                            </button>
                        </>
                }
                {
                    isAdmin
                    &&
                    <Link to="/admin">
                        <img style={{ maxWidth: "34px" }} src={images.admin_icon} alt="admin_icon" />
                    </Link>
                }
            </div>
        </div>
    )
}

export default Navbar