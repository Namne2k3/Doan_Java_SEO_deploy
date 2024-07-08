/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from 'react'
import CheckoutListButton from '../../components/CheckoutListButton/CheckoutListButton';
import "./Product.css"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../admin_assets/assets';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
const Product = () => {

    const params = useParams();
    const { productId } = params;
    const navigate = useNavigate()
    const [data, setData] = useState({});
    const [images, setImages] = useState([])
    const [comments, setComments] = useState([])
    const [popular, setPopular] = useState([])

    const { addToCart, profileInfo, setOneProductOrder } = useContext(StoreContext);

    const [comment, setComment] = useState({
        text: "",
        rate: 0,
        productId: productId,
        user: {},
        images: null
    })

    const [cart, setCart] = useState({
        id: "",
        user: "",
        product: {},
        createdAt: "",
        quantity: 1
    })

    const getProductData = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/products/${productId}?watchCount=1`)
            if (res.data.statusCode === 200) {
                setData(res.data.data)
                setCart(prev => ({ ...prev, product: res.data.data }));
                getPopularProducts(res.data.data.category.name)
            } else {
                throw new Error(res.data.message)
            }

        } catch (e) {
            toast.error(e.message)
        }
    }

    const getPopularProducts = async (category) => {
        const res = await axios.get(`http://localhost:8080/api/v1/products/populars?category=${category}`)
        if (res.data) {
            // console.log(res.data.dataList);
            setPopular(res.data.dataList)
        }
    }

    const setRate = async (value) => {
        setComment(prev => ({ ...prev, rate: value }))
    }

    const VNDONG = (number) => {
        return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
    }

    const handleChangeQuantity = (number) => {
        const value = parseInt(number, 10);

        if (value >= 1 && value <= 50) {
            setCart(prev => ({ ...prev, quantity: value }));
        }
    }

    const handleUpload = async () => {
        if (images.length === 0) {
            return;
        }

        const formData = new FormData();
        images.forEach((img) => {
            formData.append(`images`, img); // Sử dụng cùng tên 'images' cho các file nhiều ảnh
        });

        try {
            const response = await axios.post(`http://localhost:8080/api/v1/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });



            if (response.status !== 200) {
                toast("Error uploading files. Please try again.");
            }

        } catch (error) {
            console.error("Error uploading file:", error);
            toast("Error uploading file. Please try again.");
        }
    }

    const fetchAllCommentsByProductId = async (e) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/products/${data?.id}/comments`)
            if (res.data.statusCode === 200) {
                setComments(res.data.dataList)

            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            // toast.error(e.message)
        }
    }

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        comment.images = Array(...images).map(item => item.name)
        comment.user = {
            id: profileInfo.id
        }
        // console.log(comment);

        try {
            const res = await axios.post(`http://localhost:8080/api/v1/comments`, comment)
            if (res.data.statusCode === 200) {
                await handleUpload()
                // fetchAllCommentsByProductId()
                toast.success(res.data.message)
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }

    }

    useEffect(() => {
        // console.log(data);
        getProductData()

        data?.id &&
            fetchAllCommentsByProductId()
    }, [data?.id])

    return (
        data?.id &&
        <>
            <Helmet>
                <title>{data?.name}</title>
                <meta name='description' content={data?.description} />
                <link rel="canonical" href={`https://justtechshop.netlify.app/products/${data?.id}`} />
            </Helmet>
            <section className="py-5">
                <div className="container">
                    <div className="row gx-5">
                        <aside className="col-lg-6">
                            <div className="border rounded-4 mb-3 d-flex justify-content-center">
                                <a data-fslightbox="mygalley" className="rounded-4" target="_blank" data-type="image" href={`${data.image}`} rel="noreferrer">
                                    <img alt='product_image' style={{ maxWidth: '100%', maxHeight: '100vh', margin: 'auto' }}
                                        className="rounded-4 fit" src={`/images/${data.image}`} />
                                </a>
                            </div>
                            <div className="d-flex justify-content-center mb-3 flex-wrap gap-4">
                                {
                                    data.images.map((image, index) => (
                                        <a key={index} data-fslightbox="mygalley" className="border mx-1 rounded-2 item-thumb" target="_blank" data-type="image" href={`/images/${image}`} rel="noreferrer">
                                            <img alt='product_image' height="100" className="rounded-2" src={`/images/${image}`} />
                                        </a>
                                    ))
                                }
                            </div>
                        </aside>
                        <main className="col-lg-6">
                            <div className="ps-lg-3">
                                <h4 className="title text-dark">
                                    {
                                        data.name
                                    }
                                </h4>
                                <div className="d-flex flex-row my-3">
                                    <span className="text-success">
                                        {
                                            data.stock_quantity > 0 ?
                                                'Còn hàng'
                                                :
                                                'Hết hàng'
                                        }
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <span className="h5">
                                        {
                                            VNDONG(data.price)
                                        }
                                    </span>
                                </div>

                                <p>
                                    {data.description}
                                </p>

                                <div className="row">
                                    <dt className="col-3">Thương hiệu</dt>
                                    <dd className="col-9">{data.brand.name}</dd>
                                </div>

                                <hr />

                                <div className="row mb-4">
                                    <div className="col-md-4 col-6 mb-3">
                                        <label className="mb-2 d-block">Số lượng</label>
                                        <div className="input-group mb-3">
                                            <input value={cart.quantity} onChange={(e) => handleChangeQuantity(e.target.value)} min={1} max={50} type="number" className="form-control text-center border border-secondary" placeholder="1" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    {/* <CheckoutListButton carts={[cart]} text='Mua ngay' /> */}
                                    <button className='p-2 rounded' onClick={() => {
                                        setOneProductOrder([cart])
                                        navigate('/place_product_order')
                                    }}>
                                        Thanh toán
                                    </button>
                                    <button onClick={() => addToCart(productId)} href="#" className="btn btn-success shadow-0"> <i className="me-1 fa fa-shopping-basket"></i> Thêm giỏ hàng </button>
                                    {/* <a href="#" className="btn btn-light border border-secondary py-2 icon-hover px-3"> <i className="me-1 fa fa-heart fa-lg"></i> Lưu </a> */}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </section>
            <section className="bg-light border-top py-4">
                <div className="container">
                    <div className="row gx-4">
                        <div className="col-lg-8 mb-4">
                            <div className="border rounded-2 px-3 py-2 bg-white">

                                <div className="tab-content" id="ex1-content">
                                    <div className="tab-pane fade show active" id="ex1-pills-1" role="tabpanel" aria-labelledby="ex1-tab-1">
                                        {
                                            data.category.name === "Laptop" &&
                                            <table className="table border mt-3 mb-2">
                                                <tr>
                                                    <th className="py-2 px-2">Display:</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.screen_size + `-inch ` + data.product_attributes.resolution + ` ` + data.product_attributes.panel
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Processor capacity:</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.cpu
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">SSD:</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.ssd + `GB`
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Memory</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.ram + `GB`
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Graphics</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.graphic
                                                        }
                                                    </td>
                                                </tr>
                                            </table>
                                        }
                                        {
                                            data.category.name === "Mobile Phone" &&
                                            <table className="table border mt-3 mb-2">
                                                <tr>
                                                    <th className="py-2 px-2">Display</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.screen_size + `-inch ` + data.product_attributes.resolution
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Công nghệ màn hình</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.screen_tech
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Processor capacity</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.cpu
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">SSD</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.ssd + `GB`
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Memory</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.ram + `GB`
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Chipset</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.chipset
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Pin</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.battery
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Camera sau</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.back_camera
                                                        }
                                                        < br />
                                                        {
                                                            data.product_attributes.video_feature_back
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Camera trước</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.front_camera
                                                        }
                                                        <br />
                                                        {
                                                            data.product_attributes.video_feature_front
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Khả năng quay video</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.video_record
                                                        }
                                                    </td>
                                                </tr>
                                            </table>
                                        }
                                        {
                                            data.category.name === "Watch" &&
                                            <table className="table border mt-3 mb-2">
                                                <tr>
                                                    <th className="py-2 px-2">Độ phân giải</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.screen_size + `-inch ` + data.product_attributes.resolution
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Công nghệ màn hình:</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.screen_tech
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Đường kính:</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.diameter + ' cm'
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Thời gian sạc</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.time_charge + ' giờ'
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-2 px-2">Thời lượng sử dụng</th>
                                                    <td className="py-2 px-2">
                                                        {
                                                            data.product_attributes.battery_life + ' giờ'
                                                        }
                                                    </td>
                                                </tr>
                                            </table>
                                        }
                                        <div className='py-4' dangerouslySetInnerHTML={{ __html: data.content }}></div>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="px-0 border rounded-2 shadow-0">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Sản phẩm nổi bật</h5>
                                        {
                                            popular.map((item, index) => {

                                                return (
                                                    <div key={index} className="d-flex mb-3">
                                                        <a href="#" className="me-3">
                                                            <img src={`/images/${item.image}`} style={{ minWidth: '96px', height: '96px' }} className="img-md img-thumbnail" />
                                                        </a>
                                                        <div className="info">
                                                            <a href="#" className="nav-link mb-1">
                                                                Rucksack Backpack Large <br />
                                                                Line Mounts
                                                            </a>
                                                            <strong className="text-dark"> $38.90</strong>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    profileInfo?.id &&
                    <div className="comment-section bg-light">
                        <div className="comment-container">
                            <div className="comment-user">
                                <img src={`/images/${profileInfo.image}`} alt="profile_image" />
                            </div>
                            <div className="comment-input">
                                <form onSubmit={handleSubmitComment} className='comment-input-form' >
                                    <input value={comment.text} onChange={(e) => setComment(prev => ({ ...prev, text: e.target.value }))} type="text" name='text' placeholder='Nội dung đánh giá sản phẩm' />
                                    <button type="submit">Gửi đánh giá</button>
                                </form>
                                <div className="rating-section">
                                    <span>Đánh giá</span>
                                    {
                                        comment?.rate >= 1 ?
                                            <i onClick={() => setRate(1)} className="fa-solid fa-star rate_icon"></i>
                                            :
                                            <i onClick={() => setRate(1)} className="fa-regular fa-star rate_icon"></i>

                                    }
                                    {
                                        comment?.rate >= 2 ?
                                            <i onClick={() => setRate(2)} className="fa-solid fa-star rate_icon"></i>
                                            :
                                            <i onClick={() => setRate(2)} className="fa-regular fa-star rate_icon"></i>

                                    }
                                    {
                                        comment?.rate >= 3 ?
                                            <i onClick={() => setRate(3)} className="fa-solid fa-star rate_icon"></i>
                                            :
                                            <i onClick={() => setRate(3)} className="fa-regular fa-star rate_icon"></i>

                                    }
                                    {
                                        comment?.rate >= 4 ?
                                            <i onClick={() => setRate(4)} className="fa-solid fa-star rate_icon"></i>
                                            :
                                            <i onClick={() => setRate(4)} className="fa-regular fa-star rate_icon"></i>

                                    }
                                    {
                                        comment?.rate >= 5 ?
                                            <i onClick={() => setRate(5)} className="fa-solid fa-star rate_icon"></i>
                                            :
                                            <i onClick={() => setRate(5)} className="fa-regular fa-star rate_icon"></i>

                                    }
                                </div>

                                <div className='images-section'>
                                    <div className="add-img-upload flex-col">
                                        <label htmlFor="images">
                                            {
                                                Array(...images).length !== 0
                                                    ?
                                                    <div className="images-container">
                                                        {
                                                            Array(...images).map((item, index) =>
                                                                <div key={`img_${index}`} className="img-container">
                                                                    <img src={URL.createObjectURL(item)} alt="upload_area_img" />
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    :
                                                    <img src={assets.upload_area} alt="upload_area_img" />
                                            }

                                        </label>
                                        <input multiple name='images' accept='image/*' onChange={(e) => {
                                            if (e.target.files.length <= 5) {

                                                setImages(Array(...e.target.files))
                                            } else {
                                                toast.error("Đạt giới hạn gửi ảnh đánh giá. Giới hạn 5 ảnh!")
                                            }
                                        }} type="file" id='images' hidden />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                }
            </section>

            <div className="list-comment-section bg-light">
                <h3>Đánh giá sản phẩm</h3>
                <div className='list-comment-container'>
                    {
                        comments?.length > 0 ?
                            comments.map((cmt, index) => {
                                console.log(cmt);
                                if (cmt.verify === true)
                                    return (
                                        <div key={index}>
                                            <div className='comment-detail-user'>
                                                <img src={`/images/${cmt.user.image}`} alt="user_image" />
                                                <b>{cmt.user.username}</b>
                                                <div className="rating-section">

                                                    {
                                                        cmt?.rate >= 1 ?
                                                            <i style={{ color: "#FFD43B" }} className="fa-solid fa-star rate_icon"></i>
                                                            :
                                                            <i style={{ color: "#FFD43B" }} className="fa-regular fa-star rate_icon"></i>

                                                    }
                                                    {
                                                        cmt?.rate >= 2 ?
                                                            <i style={{ color: "#FFD43B" }} className="fa-solid fa-star rate_icon"></i>
                                                            :
                                                            <i style={{ color: "#FFD43B" }} className="fa-regular fa-star rate_icon"></i>

                                                    }
                                                    {
                                                        cmt?.rate >= 3 ?
                                                            <i style={{ color: "#FFD43B" }} className="fa-solid fa-star rate_icon"></i>
                                                            :
                                                            <i style={{ color: "#FFD43B" }} className="fa-regular fa-star rate_icon"></i>

                                                    }
                                                    {
                                                        cmt?.rate >= 4 ?
                                                            <i style={{ color: "#FFD43B" }} className="fa-solid fa-star rate_icon"></i>
                                                            :
                                                            <i style={{ color: "#FFD43B" }} className="fa-regular fa-star rate_icon"></i>

                                                    }
                                                    {
                                                        cmt?.rate >= 5 ?
                                                            <i style={{ color: "#FFD43B" }} className="fa-solid fa-star rate_icon"></i>
                                                            :
                                                            <i style={{ color: "#FFD43B" }} className="fa-regular fa-star rate_icon"></i>

                                                    }
                                                </div>
                                            </div>

                                            <p>{cmt.text}</p>

                                            <div className='comment-detail-images'>
                                                {
                                                    cmt?.images.map((item, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <img src={`/images/${item}`} alt='feedback_image' />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>

                                    )
                            })
                            :
                            <h4>Chưa có đánh giá cho sản phẩm này</h4>
                    }
                </div>
            </div>
            <ToastContainer draggable stacked autoClose={2000} />
        </>
    )
}

export default Product