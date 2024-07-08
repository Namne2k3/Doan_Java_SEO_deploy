import React, { useContext, useState } from 'react'
import "./RecoveryPassword.css"
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
const RecoveryPassword = ({ setShowLogin }) => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [isSending, setIsSending] = useState(false)
    const { setEmailSent } = useContext(StoreContext)

    const handleSubmitRecoveryPassword = async (e) => {
        e.preventDefault()
        try {
            setIsSending(true);
            const formData = new FormData();
            formData.append('email', email);
            const res = await axios.post(`http://localhost:8080/api/v1/emails/recovery_password`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            )
            if (res.data.statusCode === 200) {
                console.log(res.data);
                setEmailSent(email)
                setIsSending(false);
                navigate('/email_sent')
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        <div className='email_recovery_form_section'>

            <div className='email_recovery_form_container'>
                <div className='email_recovery_form_header'>
                    <i onClick={() => {
                        navigate("/")
                        setShowLogin(true)
                    }} className="fa-solid fa-arrow-left"></i>
                    <h3>Đặt lại mật khẩu</h3>
                    <h3></h3>
                </div>
                <div className="email_recovery_form_body">
                    <form
                        onSubmit={(e) => {
                            toast.promise(handleSubmitRecoveryPassword(e), {
                                pending: "Email đang được gửi đi",
                                error: "Có lỗi khi gửi email. Vui lòng thử lại sau"
                            })
                        }}
                    >
                        <input value={email} onChange={(e) => setEmail(prev => e.target.value)} type="email" placeholder='Email' name='email' id='email' />
                        {
                            isSending === false ?
                                <button type='submit'>Tiếp theo</button>
                                :
                                <button disabled style={{ opacity: "0.7" }} type='submit'>Đang gửi</button>

                        }
                    </form>
                </div>
            </div>
            <ToastContainer draggable stacked autoClose={2000} />
        </div>
    )
}

export default RecoveryPassword