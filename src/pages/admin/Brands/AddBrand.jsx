import axios from 'axios'
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
const AddBrand = () => {

    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")

    const token = localStorage.getItem('token')

    const handleAddBrand = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append('name', name)
        formData.append('description', desc)

        const res = await axios.post(`http://localhost:8080/api/v1/brands`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (res.data.statusCode === 200) {
            toast.success("Thêm thương hiệu thành công!")
        } else {
            console.log(res.data);
            toast.error(res.data.message)
        }
    }

    return (
        <>
            <div className='add'>
                <h2>Thêm thương hiệu</h2>
                <form onSubmit={handleAddBrand} className="flex-col" >

                    <div className="add-product-name flex-col">

                        <label htmlFor="name">Tên thương hiệu</label>
                        <input onInput={(e) => setName(e.target.value)} value={name} name='name' id='name' type="text" className='' placeholder='Tên thương hiệu' />
                    </div>

                    <div className="add-product-name flex-col">

                        <label htmlFor="description">Mô tả</label>
                        <input onInput={(e) => setDesc(e.target.value)} value={desc} name='description' id='description' type="text" className='' placeholder='Mô tả thương hiệu' />
                    </div>
                    <button type='submit'>Thêm</button>
                </form>
            </div>
            <ToastContainer stacked draggable />
        </>
    )
}

export default AddBrand