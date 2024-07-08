
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import "./AdminBrands.css"
import axios from 'axios'
import NotFound from '../../../components/NotFound/NotFound'

const AdminBrands = () => {

    const [brands, setBrands] = useState([])
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const fetchDataBrands = async () => {
        const res = await axios.get(`http://localhost:8080/api/v1/brands`)
        if (res.data) {
            setBrands(res.data.dataList)
        }
    }

    const hideBrand = async (e, brandId, isHide) => {
        const response = await axios.put(`http://localhost:8080/admin/brands/setHide/${brandId}?isHide=${isHide}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.statusCode === 200) {
            // toast(response.data.message);
            await fetchDataBrands()
            // setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        } else if (response.data.statusCode === 404) {
            toast(response.data.message)
        } else {
            toast(response.data.message)
        }
    }

    useEffect(() => {
        fetchDataBrands()
    }, [])

    return (
        <>
            <div className='list add flex-col'>
                <h2>Thương hiệu</h2>

                <button onClick={() => navigate("/admin/brands/add")} className='p-3 rounded'>Thêm thương hiệu</button>

                <div className="list-table-brand">
                    <div className="list-table-brand-format title">
                        <b>Tên thương hiệu</b>
                        <b>Mô tả</b>
                        <b>Actions</b>
                    </div>
                    {
                        brands?.length > 0
                            ?
                            brands?.map((item, index) => {
                                return (
                                    <div className="list-table-brand-format" key={index}>
                                        <b>{item.name}</b>
                                        <p>{item.description}</p>
                                        {
                                            item.hide === false ?
                                                <button className='cursor'
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        if (window.confirm("Ẩn thương hiệu này?")) {
                                                            toast.promise(
                                                                hideBrand(e, item.id, true),
                                                                {
                                                                    pending: 'Đang xử lý',
                                                                    success: 'Đã xử lý thành công 👌',
                                                                    error: 'Có lỗi khi xử lý 🤯'
                                                                },
                                                            )
                                                        }
                                                    }} onContextMenu={(e) => e.preventDefault()}>
                                                    Ẩn
                                                </button>
                                                :
                                                <button className='cursor'
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        if (window.confirm("Hủy ẩn thương hiệu này")) {
                                                            toast.promise(
                                                                hideBrand(e, item.id, false),
                                                                {
                                                                    pending: 'Đang xử lý',
                                                                    success: 'Đã xử lý thành công 👌',
                                                                    error: 'Có lỗi khi xử lý 🤯'
                                                                },
                                                            )
                                                        }
                                                    }} onContextMenu={(e) => e.preventDefault()}>
                                                    Hủy ẩn
                                                </button>
                                        }
                                        <button className='cursor' onClick={() => navigate(`/admin/brands/edit/${item.id}`)}>
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                )
                            })
                            :
                            <NotFound />
                    }
                </div>
            </div>
            <ToastContainer draggable stacked autoClose={1500} />
        </>
    );
}

export default AdminBrands;