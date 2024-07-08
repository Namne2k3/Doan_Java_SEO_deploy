import React, { useEffect, useState } from 'react'
import "./Feedbacks.css"
import NotFound from '../../../components/NotFound/NotFound'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Feedbacks = () => {

    const [comments, setComments] = useState([])
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const handleChangeFeedback = async (e) => {
        try {
            const res = await axios.get(`http://localhost:8080/admin/comments?verify=${e.target.value}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.statusCode === 200) {
                setComments(res.data.dataList)
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    const verifyComment = async (id, value) => {

        console.log(id + " " + value);

        try {
            const res = await axios.put(`http://localhost:8080/api/v1/comments/${id}?verify=${value}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.statusCode === 200) {
                toast.success(res.data.message)

                setComments(prevComments => {
                    return prevComments.map(comment => {
                        if (comment.id === id) {
                            return { ...comment, verify: value };
                        } else {
                            return comment;
                        }
                    });
                });
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    useEffect(() => {
        const fetchAllCommemts = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/admin/comments`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.data.statusCode === 200) {
                    setComments(res.data.dataList)
                } else {
                    throw new Error(res.data.message)
                }
            } catch (e) {
                toast.error(e.message)
            }
        }

        fetchAllCommemts()
    }, [])

    return (
        <>
            <div className='list add flex-col'>
                <h2>Phản hồi từ khách hàng</h2>
                <select className='p-2' onChange={handleChangeFeedback}>
                    <option value="">-- Tất cả phản hồi --</option>
                    <option value="true">Đã duyệt</option>
                    <option value="false">Chưa duyệt</option>
                </select>
                <div className="list-table-feedback">
                    <div className="list-table-feedback-format title">
                        <b>Sản phẩm</b>
                        <b>Hình ảnh</b>
                        <b>Nội dung</b>
                        <b>Tình trạng</b>
                    </div>
                    {
                        comments?.length > 0
                            ?
                            comments?.map((item, index) => {

                                return (
                                    <div className="list-table-feedback-format" key={index}>
                                        <button onClick={() => navigate(`/products/${item.productId}`)}>Đi đến</button>
                                        <div className='d-flex flex-wrap gap-2'>
                                            {
                                                item?.images?.map((img, index) => {

                                                    return (
                                                        <img src={`/images/${img}`} alt='image_product' key={index} height={100} />
                                                    );
                                                })
                                            }
                                        </div>
                                        <p>{item.text}</p>
                                        {
                                            <select onChange={(e) => verifyComment(item.id, e.target.value)} className='p-2' value={item?.verify}>
                                                <option value="true">Đã duyệt</option>
                                                <option value="false">Chưa duyệt</option>
                                            </select>
                                        }
                                    </div>
                                )
                            })
                            :
                            <NotFound />
                    }
                </div>
            </div>
            <ToastContainer draggable stacked autoClose={2000} hideProgressBar />
        </>
    )
}

export default Feedbacks