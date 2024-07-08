import React, { useContext, useEffect, useState } from 'react'
import { userService } from '../../services'
import "./ProfilePage.css"
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { Helmet } from 'react-helmet-async'

const ProfilePage = () => {

    const navigate = useNavigate();

    const { profileInfo } = useContext(StoreContext);
    const token = localStorage.getItem('token')
    const [currentPW, setCurrentPW] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPW, setRepeatPW] = useState("")
    const logout = () => {
        userService.logout();
        navigate("/")
    }

    const [infoData, setInfoData] = useState({
        // username: profileInfo.username,
        // email: profileInfo.email,
        // password: profileInfo.password,
        // phone: profileInfo.phone,
        // address: profileInfo.address
    })

    useEffect(() => {
        const fetchProfileData = async () => {
            try {

                if (token) {
                    const response = await userService.getUserProfile(token);
                    setInfoData(response.data);

                }

            } catch (err) {
                console.error('Error fetching profile information:', err);
            }
        }
        fetchProfileData()

    }, [profileInfo])

    const handleChangeProfile = async () => {
        try {


            const resdataPW = await axios.post(`http://localhost:8080/auth/verifyPasswordToken?token=${token}&password=${currentPW}`, {
                headers: {
                    'Content-Type': 'application/json' // Có thể bỏ header này vì bạn không gửi JSON body
                }
            });


            if (resdataPW.data.statusCode !== 200) {
                throw new Error(resdataPW.data.message)
            }

            if (password !== repeatPW) {
                throw new Error("Vui lòng nhập lại chính xác mật khẩu")
            }


            const response = await axios.put(`http://localhost:8080/auth/update?userId=${profileInfo.id}`, {
                id: infoData.id,
                username: infoData.username,
                email: infoData.email,
                password: password,
                phone: infoData.phone,
                address: infoData.address
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message)
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            throw error;
        }

    }
    const handleClickSave = async () => {
        try {
            // Gọi toast.promise và xử lý kết quả
            await toast.promise(handleChangeProfile(), {
                success: "Dữ liệu đã được cập nhật!",
                pending: "Đang kiểm duyệt thông tin ... ",
                error: "Xảy ra lôi khi kiểm duyệt!!!"
            });
        } catch (error) {
            // Xử lý lỗi từ handleChangeProfile
            console.error("Lỗi khi cập nhật thông tin:", error);
            // Có thể hiển thị toast error riêng ở đây nếu muốn
            toast.error(error.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>Thông tin cá nhân - {profileInfo?.username}</title>
                <meta name='description' content='Thông tin cá nhân' />
                <link rel="canonical" href="https://justtechshop.netlify.app/profile" />
            </Helmet>
            <div className="container light-style flex-grow-1 container-p-y">
                <h4 className="font-weight-bold py-3 mb-4">
                    Account settings
                </h4>
                <div className="card overflow-hidden">
                    <div className="row no-gutters row-bordered row-border-light">
                        <div className="col-md-3 pt-0">
                            <div className="list-group list-group-flush account-settings-links">
                                <a className="list-group-item list-group-item-action active" data-toggle="list" href="#account-general">General</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#account-info">Info</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#account-change-password">Change password</a>
                                {/* <a className="list-group-item list-group-item-action" data-toggle="list" href="#account-social-links">Social links</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#account-connections">Connections</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#account-notifications">Notifications</a> */}
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="tab-content">
                                <div className="tab-pane fade active show" id="account-general">
                                    {/* <div className="card-body media align-items-center">
                                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt className="d-block ui-w-80" />
                                    </div>
                                    <hr className="border-light m-0" /> */}
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label className="form-label">Username</label>
                                            <input onChange={(e) => setInfoData({ ...infoData, username: e.target.value })} type="text" className="form-control mb-1" value={infoData.username} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">E-mail</label>
                                            <input onChange={(e) => setInfoData({ ...infoData, email: e.target.value })} type="email" className="form-control mb-1" value={infoData.email} />
                                            {/* <div className="alert alert-warning mt-3">
                                                Your email is not confirmed. Please check your inbox.<br />
                                                <a href="javascript:void(0)">Resend confirmation</a>
                                            </div> */}
                                        </div>
                                        {/* <div className="form-group">
                                            <label className="form-label">Company</label>
                                            <input type="text" className="form-control" value="Company Ltd." />
                                        </div> */}
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="account-change-password">
                                    <div className="card-body pb-2">
                                        <div className="form-group">
                                            <label className="form-label">Current password</label>
                                            <input onChange={(e) => setCurrentPW(e.target.value)} value={currentPW} id='currentPW' name='currentPW' type="password" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">New password</label>
                                            <input onChange={(e) => setPassword(e.target.value)} value={password} id='newPW' name='newPW' type="password" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Repeat new password</label>
                                            <input onChange={(e) => setRepeatPW(e.target.value)} value={repeatPW} id='repeatPW' name='repeatPW' type="password" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="account-info">
                                    <div className="card-body pb-2">
                                        {/* <h6 className="mb-4">Contacts</h6> */}
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input onChange={(e) => setInfoData({ ...infoData, phone: e.target.value })} value={infoData.phone} type="tel" className="form-control" placeholder="+0 (123) 456 7891" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Address</label>
                                            <input onChange={(e) => setInfoData({ ...infoData, address: e.target.value })} value={infoData.address} type="text" className="form-control" placeholder="Your address" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-right mt-3">
                    <button onClick={handleClickSave} type="button" className="btn btn-primary">Save changes</button>&nbsp;
                    <button type="button" className="btn btn-default">Cancel</button>
                </div>
                <ToastContainer draggable stacked />
            </div>
        </>
    )
}

export default ProfilePage