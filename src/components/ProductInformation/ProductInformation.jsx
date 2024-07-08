import React, { useContext } from 'react'
import "./ProductInformation.css"
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import Popup from 'reactjs-popup';
import { StoreContext } from '../../context/StoreContext';

const ProductInformation = ({ product, close }) => {
    const { profileInfo } = useContext(StoreContext)
    return (
        <>
            {
                product?.id &&
                <>
                    <div className='product-info-container'>
                        <div className='product-info-head'>
                            <div>
                                <h1>Thông tin sản phẩm</h1>
                            </div>
                            <div className="product-info-head-actions">
                                {
                                    product?.id &&
                                    <>
                                        {
                                            profileInfo?.role === "ADMIN" &&
                                            <button className='bg-danger'>
                                                Xóa sản phẩm
                                            </button>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                        <table className='product-info-table'>
                            <tbody>
                                <tr>
                                    <td>Mã sản phẩm:</td>
                                    <td>{product.id}</td>
                                </tr>
                                <tr>
                                    <td>Hình ảnh:</td>
                                    <td className='text-center'>
                                        <img src={`/images/${product.image}`} alt="product" height={100} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tên sản phẩm:</td>
                                    <td>{product.name}</td>
                                </tr>
                                <tr>
                                    <td>Giá:</td>
                                    <td>{product.price}</td>
                                </tr>
                                <tr>
                                    <td>Danh mục:</td>
                                    <td>{product.category.name}</td>
                                </tr>
                                <tr>
                                    <td>Đã bán:</td>
                                    <td>{product.sold}</td>
                                </tr>
                                <tr>
                                    <td>Thương hiệu:</td>
                                    <td>{product.brand.name}</td>
                                </tr>
                                <tr>
                                    <td>Tình trạng ẩn:</td>
                                    <td>
                                        {
                                            product?.hide ? 'Đang ẩn' : 'Hiển thị'
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Hình ảnh khác:</td>
                                    <td>
                                        <div>
                                            {
                                                product?.images?.map((img, index) => {
                                                    return (
                                                        <img key={index} src={`/images/${img}`} alt='product_image' height={100} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Đã cập nhật vào:</td>
                                    <td>{moment(product.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <ToastContainer draggable stacked autoClose={2000} hideProgressBar />
                </>
            }
        </>
    )
}

export default ProductInformation