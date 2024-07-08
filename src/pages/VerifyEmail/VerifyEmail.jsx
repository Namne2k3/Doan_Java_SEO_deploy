import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { userService } from '../../services'
import { ToastContainer, toast } from 'react-toastify'
import "./VerifyEmail.css"
import axios from 'axios'
const VerifyEmail = () => {

    const { token } = useParams()
    const navigate = useNavigate()
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        const verifyEmail = async () => {
            const profileData = await userService.getUserProfile(token)
            try {
                const res = await axios.put(`http://localhost:8080/auth/verifyEmail/${profileData.data.id}`)
                if (res.data.statusCode === 200) {

                    setIsVerified(prev => true)

                } else {
                    throw new Error(res.data.message)
                }
            } catch (e) {
                toast.error(e.message)
            }
        }

        verifyEmail()
    }, [])

    return (
        isVerified == true ?
            <div className='verify_email_form_section'>

                <div className='verify_email_form_container'>
                    <div className='verify_email_form_header'>

                        <h3>Xác thực email hoàn tất</h3>

                    </div>
                    <div className="verify_email_form_body">
                        <div className='verify_email_form_info'>
                            <i className="fa-solid fa-circle-check"></i>
                            <p className='mt-4'>Vui lòng quay trở lại trang chủ</p>
                        </div>
                    </div>
                    <button onClick={() => {
                        navigate("/")
                    }}>Trở về trang chủ</button>
                </div>
            </div>
            :
            <div className='verify_email_form_section'>

                <div className='verify_email_form_container'>
                    <div className='verify_email_form_header'>

                        <h3>Email chưa được xác thực</h3>

                    </div>
                    <div className="verify_email_form_body">
                        <div className='verify_email_form_info'>
                            <i className="fa-solid fa-circle-xmark"></i>
                            <p className='mt-4'>Vui lòng xác thực lại email</p>
                        </div>
                    </div>
                    <button onClick={() => {
                        navigate("/")
                    }}>Trở về trang chủ</button>
                </div>
                <ToastContainer draggable stacked autoClose={2000} hideProgressBar />
            </div>
    )
}

export default VerifyEmail