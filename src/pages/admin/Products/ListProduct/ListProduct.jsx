import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "./ListProduct.css"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ToastContainer, toast } from 'react-toastify'
import NotFound from '../../../../components/NotFound/NotFound'
import { StoreContext } from '../../../../context/StoreContext'
import { fetchALlCategories } from '../../../../services/CategoryService'
import ProductInformation from '../../../../components/ProductInformation/ProductInformation';
import { NavLink } from 'react-router-dom';
import { assets } from '../../../../admin_assets/assets';
const ListProduct = () => {

    const BASE_URL = "http://localhost:8080"
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [categories, setCategories] = useState([])
    const { setAdminProducts, adminProducts, fetchAdminProductsByCategory } = useContext(StoreContext)

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const dataCategories = await fetchALlCategories();
                if (dataCategories) {
                    setCategories(dataCategories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchAdminProductsByCategory()
        fetchCategories()


    }, [])

    const hidingProduct = async (e, id, isHide) => {
        // alert(`Deleted >>> ${id}`)
        const response = await axios.put(`${BASE_URL}/admin/products/setHide/${id}?isHide=${isHide}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.statusCode === 200) {
            // toast(response.data.message);
            await fetchAdminProductsByCategory()
            // setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        } else if (response.data.statusCode === 404) {
            toast(response.data.message)
        } else {
            toast(response.data.message)
        }
    }

    const handleChangeCategory = async (e) => {

        const cateName = e.target.value

        try {
            const res = await axios.get(`http://localhost:8080/api/v1/products?category=${cateName}`)
            if (res.data.statusCode === 200) {

                setAdminProducts(res.data.dataList)

            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    const handleSearchProduct = async (e) => {
        let search = e.target.value
        try {

            const res = await axios.get(`http://localhost:8080/api/v1/products?search=${search}`)
            if (res.data.statusCode === 200) {

                setAdminProducts(res.data.dataList)

            } else {
                throw new Error(res.data.message)
            }

        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        <>
            <div className='list add flex-col'>
                <button onClick={() => navigate("/admin/products/add")} className="sidebar-option rounded d-inline">
                    <img src={assets.add_icon} alt="add_icon" />
                </button>
                <form className='product_filter_form'>
                    {/* <label htmlFor="name">Tìm kiếm</label> */}
                    <input onInput={handleSearchProduct} id='name' className='p-1' name='name' type="text" placeholder='Tìm tên sản phẩm' />

                    <select className='p-2' onChange={handleChangeCategory} required name="category">
                        <option selected>-- Chọn danh mục --</option>
                        {
                            categories?.map((cate, index) =>
                                <option value={cate.name} key={`cate_${index}`}>{cate.name}</option>
                            )
                        }

                    </select>
                </form>
                <div className="list-table">
                    <div className="list-table-format title">
                        <b>Hình ảnh</b>
                        <b>Tên sản phẩm</b>
                        <b>Số lượng kho</b>
                        <b>Đã bán</b>
                        <b>Danh mục</b>
                        <b>Giá</b>
                        <b></b>
                    </div>
                    {
                        adminProducts?.length > 0
                            ?
                            adminProducts?.map((item, index) => {

                                return (
                                    <div className="list-table-format" key={index}>
                                        <img src={`/images/${item.image}`} alt="product_image" />
                                        <p>{item.name}</p>
                                        <p>{item.category.name}</p>
                                        <p>{item.stock_quantity}</p>
                                        <p>{item.sold}</p>
                                        <p>{item.price}</p>

                                        {
                                            item.hide === false ?
                                                <button className='cursor'
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        if (window.confirm("Bạn chắc chắn muốn ẩn sản phẩm này?")) {
                                                            toast.promise(
                                                                hidingProduct(e, item.id, true),
                                                                {
                                                                    pending: 'Đang xử lý',
                                                                    success: 'Đã xử lý thành công 👌',
                                                                    error: 'Có lỗi khi xử lý 🤯'
                                                                },
                                                                { containerId: 'B' }
                                                            )
                                                        }
                                                    }}>Ẩn</button>
                                                :
                                                <button className='cursor'
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        if (window.confirm("Delete this product?")) {
                                                            toast.promise(
                                                                hidingProduct(e, item.id, false),
                                                                {
                                                                    pending: 'Đang xử lý',
                                                                    success: 'Đã xử lý thành công 👌',
                                                                    error: 'Có lỗi khi xử lý 🤯'
                                                                },
                                                                { containerId: 'B' }
                                                            )
                                                        }
                                                    }}>Hủy ẩn</button>
                                        }
                                        <Popup
                                            trigger={
                                                <button onClick={() => navigate(`/products/${item.id}`)}>
                                                    Chi tiết
                                                </button>
                                            }
                                            modal
                                            nested
                                        >
                                            {
                                                close => <ProductInformation product={item} close={close} />
                                            }
                                        </Popup>
                                        {/* <button onClick={() => navigate(`/products/${item.id}`)}>
                                            Chi tiết
                                        </button> */}

                                        <button className='cursor' onClick={() => navigate(`/admin/products/edit/${item.id}`)}>
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                )
                            })
                            :
                            <NotFound />
                    }
                </div>
            </div >
            <ToastContainer position="top-center" containerId="A" stacked draggable hideProgressBar />
            <ToastContainer containerId="B" stacked draggable hideProgressBar />
        </>
    )
}

export default ListProduct