import React, { useContext } from 'react'
import "./EmailSent.css"
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
const EmailSent = ({ setShowLogin }) => {

    const { title = "Mã xác minh đã được gửi đến địa chỉ email", emailSent } = useContext(StoreContext);
    const navigate = useNavigate()

    return (
        emailSent !== "" &&
        <div className='email_sent_form_section'>

            <div className='email_sent_form_container'>
                <div className='email_sent_form_header'>
                    <i className="fa-solid fa-arrow-left"></i>
                    <h3>Đặt lại mật khẩu</h3>
                    <h3></h3>
                </div>
                <div className="email_sent_form_body">
                    <div className='email_sent_form_info'>
                        <i className="fa-regular fa-envelope"></i>
                        <p>{title}</p>
                        <p style={{ color: "blue" }}>{emailSent}.</p>
                        <p>Vui lòng xác minh.</p>
                    </div>
                </div>
                <button onClick={() => {
                    navigate("/")
                    setShowLogin(true)
                }}>OK</button>
            </div>

        </div>
    )
}

export default EmailSent