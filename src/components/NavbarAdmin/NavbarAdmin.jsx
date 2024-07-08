import React from 'react'
import "./NavbarAdmin.css"
import { assets } from '../../admin_assets/assets'
const NavbarAdmin = () => {
    return (
        <div className='navbar_admin'>
            <img className='logo' src={assets.logo} alt="admin_image" />
            <img className='profile' src={assets.profile_image} alt="profile_image" />
        </div>
    )
}

export default NavbarAdmin