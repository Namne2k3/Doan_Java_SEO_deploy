import React, { useContext, useState } from 'react'
import "./UserInformation.css"
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { StoreContext } from '../../context/StoreContext';

const UserInformation = ({ user, close, handleCloseAfterDelete, handleLockUser }) => {

    const { profileInfo } = useContext(StoreContext)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [allowDelete, setAllowDelete] = useState(false)
    const token = localStorage.getItem('token')

    const handleChangeRole = async (e) => {

        const role = e.target.value

        try {
            const res = await axios.put(`http://localhost:8080/auth/update/${user.id}/changeRole?role=${role}`, {})
            if (res.data.statusCode === 200) {
                toast.success(res.data.message)
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    const preventCopyPaste = (event) => {

        event.preventDefault();
    }

    const handleDeleteUser = async (e) => {

        try {
            const res = await axios.delete(`http://localhost:8080/admin/users/${user?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.statusCode === 200) {
                toast.success(res.data.message)
                handleCloseAfterDelete(close, user?.id)
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        <>
            <div className='user-info-container'>
                <div className='user-info-head'>
                    <div>
                        <h1>Thông tin tài khoản</h1>
                    </div>
                    <div className="user-info-head-actions">
                        {
                            profileInfo?.id !== user?.id && user?.role !== "ADMIN" ?
                                <>
                                    <button onClick={() => {
                                        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
                                            setShowConfirmDialog(true)
                                        }
                                    }} className='bg-danger'>
                                        Xóa tài khoản
                                    </button>
                                    <Popup
                                        open={showConfirmDialog}
                                        modal
                                        nested
                                        onClose={() => {
                                            setShowConfirmDialog(false)
                                            setAllowDelete(false)
                                        }}
                                    >
                                        <div className='confirm-delete-form-modal'>
                                            <div className="modal_header"> Xóa tài khoản </div>

                                            <div className="content">
                                                <span>
                                                    Tên tài khoản và mã tài khoản: <b>{user.username + "_" + user.id}</b>
                                                </span>
                                                <input
                                                    onChange={(e) => {
                                                        if (e.target.value === `${user.username}_${user.id}`) {
                                                            setAllowDelete(prev => true)
                                                        }
                                                    }}
                                                    onPaste={preventCopyPaste}
                                                    onCopy={preventCopyPaste}
                                                    onCut={preventCopyPaste}
                                                    type='text'
                                                    placeholder='Vui lòng nhập tên tài khoản và mã người dùng để xác nhận xóa tài khoản'
                                                />
                                            </div>
                                            {
                                                allowDelete === true ?
                                                    <div className="actions">
                                                        <button onClick={handleDeleteUser}>Xác nhận</button>
                                                    </div>
                                                    :
                                                    <div className="actions">
                                                        <button style={{ opacity: "0.5" }} disabled >Xác nhận</button>
                                                    </div>
                                            }
                                        </div>
                                    </Popup>
                                    {
                                        user?.enabled === true ?
                                            profileInfo?.id === user?.id || user?.role === "ADMIN" ?
                                                <button disabled style={{ opacity: "0.5" }} className="bg-warning">Khóa tài khoản</button>
                                                :
                                                <button onClick={() => {
                                                    if (window.confirm("Bạn có chắc chắn muốn khóa tài khoản này?")) {
                                                        handleLockUser(user?.id, true)
                                                    }
                                                }} className="bg-warning">Khóa tài khoản</button>
                                            :
                                            <button onClick={() => {
                                                if (window.confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")) {
                                                    handleLockUser(user?.id, false)
                                                }
                                            }} className="bg-warning">Mở khóa</button>
                                    }
                                </>
                                :
                                <></>
                        }
                    </div>
                </div>
                <table className='user-info-table'>
                    <tbody>
                        <tr>
                            <td>Mã người dùng:</td>
                            <td>{user.id}</td>
                        </tr>
                        <tr>
                            <td>Hình đại diện:</td>
                            <td className='text-center'><img src={`/images/${user.image}`} alt="User Image" height="100" /></td>
                        </tr>
                        <tr>
                            <td>Tên tài khoản:</td>
                            <td>{user.username}</td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <td>Tình trạng khóa:</td>
                            <td>{user.enabled === true ? 'Không khóa' : 'Đang khóa'}</td>
                        </tr>
                        <tr>
                            <td>Đã xác thực email:</td>
                            <td>{user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}</td>
                        </tr>
                        <tr>
                            <td>Số điện thoại:</td>
                            <td>{user.phone}</td>
                        </tr>
                        <tr>
                            <td>Địa chỉ:</td>
                            <td>{user.address}</td>
                        </tr>
                        <tr>
                            <td>Ngày tạo tài khoản:</td>
                            <td>{moment(user.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                        </tr>
                        <tr>
                            <td>Đã cập nhật vào:</td>
                            <td>{moment(user.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                        </tr>
                        <tr>
                            <td>Quyền:</td>
                            <td>
                                {

                                    profileInfo?.id === user?.id || user?.role === "ADMIN" ?
                                        <select disabled value={user.role}>
                                            <option value={"USER"}>USER</option>
                                            <option value={"ADMIN"}>ADMIN</option>
                                        </select>
                                        :
                                        <select onChange={(e) => {
                                            if (window.confirm("Bạn có chắc chắn thay đổi quyền cho người dùng này?")) {
                                                handleChangeRole(e)
                                            }
                                        }} value={user.role}>
                                            <option value={"USER"}>USER</option>
                                            <option value={"ADMIN"}>ADMIN</option>
                                        </select>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ToastContainer draggable stacked autoClose={2000} hideProgressBar />
        </>
    );
};

export default UserInformation