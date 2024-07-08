import React from 'react'
import "./footer.css"
import { images } from '../../assets/images'
const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img className='footer-logo' src={images.logo} alt="logo" />
                    <p>Chuyên cung cấp các sản phẩm công nghệ hàng đầu với đa dạng các danh mục như điện thoại thông minh, máy tính bảng, laptop và nhiều hơn nữa. Chúng tôi cam kết mang lại trải nghiệm mua sắm trực tuyến tuyệt vời và đáng tin cậy, đồng thời luôn cập nhật những xu hướng công nghệ mới nhất để đáp ứng nhu cầu của khách hàng.</p>
                    <div className="footer-social-icons">
                        <img src={images.facebook_icon} alt="facebook_icon" />
                        <img src={images.twitter_icon} alt="twitter_icon" />
                        <img src={images.linkedin_icon} alt="linkedin_icon" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Công ty</h2>
                    <ul>
                        <li>Trang chủ</li>
                        <li>Về chúng tôi</li>
                        <li>Vận chuyển</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>Liên Hệ</h2>
                    <ul>
                        <li>(+84) 0333012465</li>
                        <li>nhpn2003@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">
                Bản quyền 2024 © FourGuys.com
            </p>
        </div>
    )
}

export default Footer