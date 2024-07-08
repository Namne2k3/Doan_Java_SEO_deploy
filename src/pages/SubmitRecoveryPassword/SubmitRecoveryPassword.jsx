import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import NotFound from '../../components/NotFound/NotFound';
import "./SubmitRecoveryPassword.css"
const SubmitRecoveryPassword = () => {

    const { token } = useParams();
    const [user, setUser] = useState({})
    const [isSetting, setIsSetting] = useState(false)

    const [passwordData, setPasswordData] = useState({
        password: "",
        re_password: ""
    })

    const navigate = useNavigate();
    useEffect(() => {

        const fetchProfileUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/adminuser/get-profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (res.data.statusCode === 200) {
                    setUser(res.data.data)
                } else {
                    throw new Error(res.data.message)
                }

            } catch (e) {
                toast.error(e.message)
            }

        }

        fetchProfileUser()
    }, [])

    const handleSubmitChangePassword = async (e) => {
        e.preventDefault()
        try {

            if (passwordData.password === passwordData.re_password) {
                setIsSetting(true)
                const res = await axios.put(`http://localhost:8080/auth/update`, {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: passwordData.password,
                    phone: user.phone,
                    address: user.address
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (res.data.statusCode === 200) {
                    setIsSetting(false)
                    toast.success("Thiết lập mật khẩu thành công")
                    setTimeout(() => {

                        navigate("/")
                    }, 1000)
                } else {
                    throw new Error(res.data.message)
                }

            } else {
                throw new Error("Mật khẩu không trùng khớp. Vui lòng thử lại sau!")
            }


        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        user?.id ?
            <div className='submit_password_section'>

                <div className='submit_password_section'>

                    <div className='submit_password_container'>
                        <div className='submit_password_header'>
                            <i className="fa-solid fa-arrow-left"></i>
                            <h3>Thiết lập lại mật khẩu</h3>
                            <h3></h3>
                        </div>
                        <div className="submit_password_body">
                            <form onSubmit={handleSubmitChangePassword} >
                                <input value={passwordData.password} onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))} type="password" placeholder='Mật khẩu mới' name='password' id='password' />
                                <input value={passwordData.re_password} onChange={(e) => setPasswordData(prev => ({ ...prev, re_password: e.target.value }))} type="password" placeholder='Nhập lại mật khẩu' name='password' id='re_password' />
                                {
                                    isSetting === false ?
                                        <button type='submit'>Xác nhận</button>
                                        :
                                        <button disabled style={{ opacity: "0.7" }} type='submit'>Đang xác nhận</button>
                                }
                            </form>
                        </div>
                    </div>

                </div>
                <ToastContainer stacked draggable autoClose={3000} />
            </div>
            :
            <NotFound />
    )
}

export default SubmitRecoveryPassword