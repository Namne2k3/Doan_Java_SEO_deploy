import React from 'react'
import "./SideBar.css"
import { assets } from '../../admin_assets/assets'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to={"/admin/users"} className="sidebar-option">
                    <img src={assets.order_icon} alt='users_management_icon' />
                    <p>Người dùng</p>
                </NavLink>
                <NavLink to="/admin/brands" className="sidebar-option">
                    <img src={assets.order_icon} alt="add_icon" />
                    <p>Thương hiệu</p>
                </NavLink>
                {/* <NavLink to="/admin/products/add" className="sidebar-option">
                    <img src={assets.add_icon} alt="add_icon" />
                    <p>Thêm sản phẩm</p>
                </NavLink> */}
                <NavLink to="/admin/products" className="sidebar-option">
                    <img src={assets.order_icon} alt="add_icon" />
                    <p>Sản phẩm</p>
                </NavLink>
                <NavLink to="/admin/orders" className="sidebar-option">
                    <img src={assets.order_icon} alt="add_icon" />
                    <p>Đơn hàng</p>
                </NavLink>
                <NavLink to="/admin/support" className="sidebar-option">
                    <img src={assets.order_icon} alt="add_icon" />
                    <p>Hỗ trợ khách hàng</p>
                </NavLink>
                <NavLink to="/admin/statistics" className="sidebar-option">
                    <img src={assets.order_icon} alt="add_icon" />
                    <p>Thống kê</p>
                </NavLink>
                <NavLink to="/admin/feedbacks" className="sidebar-option">
                    <img src={assets.order_icon} alt="add_icon" />
                    <p>Phản hồi</p>
                </NavLink>
            </div>
        </div>
    )
}

export default SideBar