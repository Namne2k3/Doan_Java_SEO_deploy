import React from 'react'
import { Outlet } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import "./Admin.css"
import SideBar from '../../components/SideBar/SideBar';
const Admin = () => {

    return (
        <div>

            <div className='admin-content'>
                <SideBar />
                <Outlet />
            </div>
        </div>
    )
}

export default Admin