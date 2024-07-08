import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./UpdateBrand.css"
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
const UpdateBrand = () => {

    const { id } = useParams();
    const token = localStorage.getItem('token')
    const [brand, setBrand] = useState({})
    const [isUpdating, setIsUpdating] = useState(false)

    const handleUpdateBrand = async (e) => {
        e.preventDefault()

        try {
            setIsUpdating(prev => true);
            const res = await axios.put(`http://localhost:8080/admin/brands/${id}`, brand, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.data.statusCode === 200) {
                toast.success('Cập nhật thương hiệu thành công')
                setIsUpdating(prev => false);
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message);
        }

    }

    useEffect(() => {
        const fetchDataBrand = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/brands/${id}`)
                if (res.data.statusCode === 200) {
                    setBrand(res.data.data)

                } else {
                    throw new Error(res.data.message)
                }


            } catch (e) {
                toast.error(e.message);
            }
        }

        fetchDataBrand()
    }, [])

    return (
        <div className='add'>
            <form onSubmit={handleUpdateBrand} className="flex-col">

                <div className="add-img-upload flex-col">
                    <label htmlFor="id">ID</label>
                    <input className='p-2' value={brand?.id} disabled id='id' name='id' type="text" placeholder='' />
                </div>
                <div className="add-img-upload flex-col">
                    <label htmlFor="name">Tên thương hiệu</label>
                    <input className='p-2' value={brand?.name} onChange={(e) => setBrand(prev => ({ ...prev, name: e.target.value }))} id='name' name='name' type="text" placeholder='' />
                </div>
                <div className="brand_desc add-img-upload flex-col">
                    <label htmlFor="description">Mô tả thương hiệu</label>
                    <textarea className='p-2' value={brand?.description} onChange={(e) => setBrand(prev => ({ ...prev, description: e.target.value }))} id='description' name='description' type="text" placeholder=''>
                    </textarea>
                </div>

                {
                    isUpdating === false ?
                        <button type='submit'>Cập nhật</button>
                        :
                        <button className='opacity-75' disabled type='submit'>Đang cập nhật</button>

                }
            </form>
            <ToastContainer autoClose={1000} hideProgressBar draggable stacked />
        </div>
    )
}

export default UpdateBrand