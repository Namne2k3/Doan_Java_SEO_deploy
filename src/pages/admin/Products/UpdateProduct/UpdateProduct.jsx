import React, { useEffect, useState } from 'react'
import "./UpdateProduct.css"
import { toast, ToastContainer } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { assets } from '../../../../admin_assets/assets'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
import NotFound from '../../../../components/NotFound/NotFound'

const UpdateProduct = () => {

    const { id } = useParams()
    const [product, setProduct] = useState({})
    const BASE_URL = "http://localhost:8080"
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditImage, setIsEditImage] = useState(false)
    const [isEditImages, setIsEditImages] = useState(false)
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(false)
    const [images, setImages] = useState([]);
    const token = localStorage.getItem('token')

    const handleUpload = async () => {
        if (!image && images.length === 0) {
            toast("Please select a file.");
            return;
        }

        const formData = new FormData();
        if (image) formData.append("image", image);
        images.forEach((img, index) => {
            formData.append(`images`, img); // Sử dụng cùng tên 'images' cho các file nhiều ảnh
        });

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/upload`, formData, {
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

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                console.log("fetching...");
                const res = await axios.get(`http://localhost:8080/api/v1/products/${id}`)
                if (res.data) {
                    if (res.data.statusCode === 200) {
                        console.log("Check res product >>> ", res.data.data);
                        const data = res.data.data
                        setProduct(prev => data)
                    } else {
                        throw new Error(res.data.message)
                    }
                }

            } catch (e) {
                console.log(e.message);
            }
        }



        const fetchBrands = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/brands`);
                if (response.data) {
                    setBrands(response.data.dataList);
                }

            } catch (err) {
                console.error("Error get brands data:", err);
            }
        }

        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/categories`);
                if (response.data) {
                    setCategories(response.data.dataList);
                }

            } catch (err) {
                console.error("Error get categories data:", err);
            }
        }


        fetchProductById()
        fetchCategory()
        fetchBrands()
        setIsLoading(false); // Đánh dấu đã tải xong dữ liệu

    }, [])

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setProduct(data => ({ ...data, [name]: value }))
        // console.log(e.target.name + ": " + e.target.value);
    }

    const handleUpdateProduct = async (e) => {
        e.preventDefault()
        try {
            // product.image = product.image.name
            // product.images = Array(...product.images).map((imageItem) => {
            //     return (
            //         imageItem?.name
            //     )
            // })
            console.log(product);
            const res = await axios.put(`http://localhost:8080/admin/products/${id}`, product, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.statusCode === 200) {
                await handleUpload();
                toast.success("Cập nhật sản phẩm thành công")
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <>
            {
                !isLoading ?
                    <>
                        <div className='add'>
                            <form onSubmit={handleUpdateProduct} className="flex-col">

                                <div className="add-img-upload flex-col">
                                    <p>Thêm ảnh sản phẩm</p>
                                    <label htmlFor="image">
                                        {
                                            !isEditImage ?
                                                < img src={`/images/${product.image}`} alt="upload_area_img" />
                                                :
                                                <img src={URL.createObjectURL(image)} alt="upload_area_img" />
                                        }
                                    </label>
                                    <input name='image' accept='image/*' onChange={(e) => {
                                        setImage(e.target.files[0])
                                        setProduct(prev => ({ ...prev, image: e.target.files[0].name }))
                                        setIsEditImage(true)
                                    }} type="file" id='image' hidden />
                                </div>

                                <div className="add-img-upload flex-col">
                                    <p>Thêm nhiều hình ảnh sản phẩm</p>
                                    <label htmlFor="images">

                                        {
                                            !isEditImages ?
                                                product?.images?.length !== 0
                                                    ?
                                                    <div className="images-container">
                                                        {
                                                            product?.images?.map((item, index) =>
                                                                <div key={`img_${index}`} className="img-container">
                                                                    <img src={`/images/${item}`} alt="upload_area_img" />
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    :
                                                    <img src={assets.upload_area} alt="upload_area_img" />
                                                :
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
                                    <input multiple name='images' accept='image/*' onChange={
                                        (e) => {
                                            setImages(Array(...e.target.files))
                                            setProduct(prev => ({
                                                ...prev, images: Array(...e.target.files).map((imageItem) => {
                                                    return (
                                                        imageItem.name
                                                    )
                                                })
                                            }))
                                            setIsEditImages(true)
                                        }
                                    } type="file" id='images' hidden />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Tên sản phẩm</p>
                                    <input required onInput={onChangeHandler} value={product.name} type="text" name='name' placeholder='Nhập tên sản phẩm' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Mô tả phẩm</p>
                                    <input required onInput={onChangeHandler} value={product.description} type="text" name='description' placeholder='Nhập mô tả sản phẩm' />
                                </div>

                                <div className="add-product-description flex-col">
                                    <p>Nội dung sản phẩm</p>
                                    {/* <textarea onInput={onChangeHandler} value={data.content} name="content" rows="6" placeholder='Thêm nội dung sản phẩm'></textarea> */}
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={{
                                            ckfinder: {
                                                // Upload the images to the server using the CKFinder QuickUpload command.
                                                uploadUrl: `${BASE_URL}/api/v1/ckeditor/upload`
                                            }
                                        }}
                                        data={product.content || ''}
                                        onChange={() => {
                                            // console.log(document.getElementsByClassName("ck-content")[0].innerHTML)
                                            setProduct(data => ({ ...data, content: document.getElementsByClassName("ck-content")[0].innerHTML }));
                                        }}
                                        onReady={editor => {
                                            // console.log('Editor is ready to use!', editor);
                                        }}
                                    />
                                </div>

                                <div className="add-category-price">

                                    <div className="add-category flex-col">
                                        <p>Danh mục sản phẩm</p>
                                        <select required onInput={(e) => {
                                            console.log(e.target.value);
                                            setProduct(prev => ({ ...prev, category: { id: e.target.value } }))
                                        }} value={product?.category?.id} name="category">
                                            {
                                                categories.map((cate, index) =>
                                                    <option value={cate.id} key={`cate_${index}`}>{cate.name}</option>
                                                )
                                            }

                                        </select>
                                    </div>

                                    <div className="add-price flex-col">
                                        <p>Giá bán sản phẩm</p>
                                        <input required onInput={onChangeHandler} value={product.price} type="number" name='price' placeholder='Giá bán sản phẩm' />
                                    </div>

                                    <div className="add-price flex-col">
                                        <p>Số lượng sản phẩm</p>
                                        <input required onInput={onChangeHandler} value={product.stock_quantity} type="number" name='quantity' placeholder='Số lượng sản phẩm' />
                                    </div>


                                </div>

                                <div className="add-category-price">

                                    <div className="add-category flex-col">
                                        <p>Thương hiệu</p>
                                        <select required onChange={(e) => setProduct(prev => ({ ...prev, brand: { id: e.target.value } }))} value={product?.brand?.id} name="brand">
                                            {
                                                brands?.map((brand, index) =>
                                                    <option value={brand?.id} key={`brand_${index}`}>{brand?.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>

                                    <div hidden>
                                        <p>Số lượt xem</p>
                                        <input onInput={onChangeHandler} value={product?.watchCount} type="number" name='watchCount' placeholder='Số lượt xem' />
                                    </div>
                                </div>

                                <p>Thuộc tính sản phẩm</p>
                                {
                                    product?.category?.id === "665eee91d176ea3961e606c0" // laptop
                                    &&
                                    <div className="add-category-price">
                                        <div className="add-product-name flex-col">
                                            <p>Card đồ họa</p>
                                            <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, graphic: e.target.value } }))} value={product?.product_attributes?.graphic} type="text" name='graphic' placeholder='RX 5500M | GTX 1650 | RTX 3060' />
                                        </div>

                                        <div className="add-product-name flex-col">
                                            <p>Vi xử lý</p>
                                            <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, cpu: e.target.value } }))} value={product?.product_attributes?.cpu} type="text" name='cpu' placeholder='Ryzen 5 5600H | Intel Core i5 12500H' />
                                        </div>

                                        <div className="add-product-name flex-col">
                                            <p>Dung lượng RAM</p>
                                            <select required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, ram: e.target.value } }))} value={product?.product_attributes?.ram} name='ram'>
                                                <option value="4">4GB</option>
                                                <option value="8">8GB</option>
                                                <option value="16">16GB</option>
                                                <option value="32">32GB</option>
                                                <option value="64">64GB</option>
                                                <option value="128">128GB</option>
                                            </select>

                                        </div>

                                        <div className="add-product-name flex-col">
                                            <p>Dung lượng SSD</p>

                                            <select required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, ssd: e.target.value } }))} value={product?.product_attributes?.ssd} name='ssd'>
                                                <option value="64">64GB</option>
                                                <option value="128">128GB</option>
                                                <option value="256">256GB</option>
                                                <option value="512">512GB</option>
                                                <option value="1024">1TB</option>
                                                <option value="2048">2TB</option>
                                                <option value="4096">4TB</option>
                                            </select>
                                        </div>

                                        <div className="add-product-name flex-col">
                                            <p>Tấm nền màn hình</p>
                                            <select required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, panel: e.target.value } }))} value={product?.product_attributes?.panel} name='panel'>
                                                <option value="IPS">IPS</option>
                                                <option value="OLED">OLED</option>
                                                <option value="VA">VA</option>
                                            </select>
                                        </div>

                                        <div className="add-product-name flex-col">
                                            <p>Kích thước màn hình</p>
                                            <select required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, screen_size: e.target.value } }))} value={product?.product_attributes?.screen_size} name='screen_size'>
                                                <option value="15">15 inch</option>
                                                <option value="13">13 inch</option>
                                                <option value="14">14 inch</option>
                                                <option value="16">16 inch</option>
                                                <option value="17">17 inch</option>
                                            </select>
                                        </div>

                                        <div className="add-product-name flex-col">
                                            <p>Độ sáng màn hình</p>
                                            <input onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, brightness: e.target.value } }))} value={product?.product_attributes?.brightness} type="number" name='brightness' placeholder='500nit | 600nit | 700nit' />
                                        </div>

                                        <div className="add-product-name flex-col">
                                            <p>Độ phân giải</p>
                                            <select required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, resolution: e.target.value } }))} value={product?.product_attributes?.resolution} name='resolution'>
                                                <option value="1920 x 1080">Full HD</option>
                                                <option value="2160 x 1440">2k</option>
                                                <option value="2880 x 1620">3k</option>
                                                <option value="3840 x 2160">4K</option>
                                            </select>
                                        </div>

                                        <div className="add-product-name flex-col">
                                            <p>Trọng lượng</p>
                                            <input onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, weight: e.target.value } }))} value={product?.product_attributes?.weight} type="number" name='weight' placeholder='1.8 Kb | 2.3 Kg | 2.5 Kg' />
                                        </div>
                                    </div>
                                }
                                {
                                    product?.category?.id === "665eee7ad176ea3961e606bf" // mobile phone
                                    &&
                                    <>
                                        <div className="add-category-price">
                                            <div className="add-product-name flex-col">
                                                <p>Chipset</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, chipset: e.target.value } }))} value={product?.product_attributes?.chipset} type="text" name='chipset' placeholder='Snapdragon 865 | Apple M2 | Exynos 1380' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Loại CPU</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, cpu: e.target.value } }))} value={product?.product_attributes?.cpu} type="text" name='cpu' placeholder='1 nhân 3.36 GHz, 4 nhân 2.8 GHz & 3 nhân 2 GHz' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Graphics</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, graphic: e.target.value } }))} value={product?.product_attributes?.graphic} type="text" name='graphic' placeholder='Adreno 740' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Dung lượng Pin</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, battery: e.target.value } }))} value={product?.product_attributes?.battery} type="text" name='battery' placeholder='4000 mA | 5000mA | 6000mA' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Camera sau</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, back_camera: e.target.value } }))} value={product?.product_attributes?.back_camera} type="text" name='back_camera' placeholder='Thông tin camera sau' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Camera trước</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, front_camera: e.target.value } }))} value={product?.product_attributes?.front_camera} type="text" name='front_camera' placeholder='Thông tin camera trước' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Tính năng camera sau</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, video_feature_back: e.target.value } }))} value={product?.product_attributes?.video_feature_back} type="text" name='video_feature_back' placeholder='Thông tin tính năng camera sau' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Tính năng camera trước</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, video_feature_front: e.target.value } }))} value={product?.product_attributes?.video_feature_front} type="text" name='video_feature_front' placeholder='Thông tin tính năng camera trước' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Khả năng quay video</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, video_record: e.target.value } }))} value={product?.product_attributes?.video_record} type="text" name='video_record' placeholder='Thông tin khả năng quay video' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Dung lượng RAM</p>
                                                <select required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, ram: e.target.value } }))} value={product?.product_attributes?.ram} name='ram'>
                                                    <option value="4">4GB</option>
                                                    <option value="8">8GB</option>
                                                    <option value="16">16GB</option>
                                                    <option value="32">32GB</option>
                                                    <option value="64">64GB</option>
                                                    <option value="128">128GB</option>
                                                </select>
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Dung lượng SSD</p>

                                                <select required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, ssd: e.target.value } }))} value={product?.product_attributes?.ssd} name='ssd'>
                                                    <option value="64">64GB</option>
                                                    <option value="128">128GB</option>
                                                    <option value="256">256GB</option>
                                                    <option value="512">512GB</option>
                                                    <option value="1024">1TB</option>
                                                    <option value="2048">2TB</option>
                                                    <option value="4096">4TB</option>
                                                </select>
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Công nghệ màn hình</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, screen_tech: e.target.value } }))} value={product?.product_attributes?.screen_tech} type="text" name='screen_tech' placeholder='Thông tin công nghệ màn hình' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Kích thước màn hình</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, screen_size: e.target.value } }))} type='text' value={product?.product_attributes?.screen_size} name='screen_size' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Độ sáng màn hình</p>
                                                <input onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, brightness: e.target.value } }))} value={product?.product_attributes?.brightness} type="number" name='brightness' placeholder='500nit | 600nit | 700nit' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Độ phân giải</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, resolution: e.target.value } }))} value={product?.product_attributes?.resolution} type='text' name='resolution' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Trọng lượng</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, weight: e.target.value } }))} value={product?.product_attributes?.weight} type="number" name='weight' placeholder='1.8 Kb | 2.3 Kg | 2.5 Kg' />
                                            </div>
                                        </div>
                                    </>
                                }

                                {
                                    product?.category?.id === "66615ffbc875cc7d60827534" // watch
                                    &&
                                    <>
                                        <div className="add-category-price">
                                            <div className="add-product-name flex-col">
                                                <p>Công nghệ màn hình</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, screen_tech: e.target.value } }))} value={product?.product_attributes?.screen_tech} type="text" name='screen_tech' placeholder='Thông tin công nghệ màn hình' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Kích thước màn hình</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, screen_size: e.target.value } }))} type='text' value={product?.product_attributes?.screen_size} name='screen_size' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Độ phân giải</p>
                                                <input required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, resolution: e.target.value } }))} value={product?.product_attributes?.resolution} type='text' name='resolution' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Đường kính mặt</p>
                                                <input placeholder='Đường kính' required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, diameter: e.target.value } }))} value={product?.product_attributes?.diameter} type='number' name='diameter' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Thiết kế</p>
                                                <input placeholder='Mặt vuông | Mặt tròn' required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, design: e.target.value } }))} value={product?.product_attributes?.design} type='text' name='design' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Thời gian sạc</p>
                                                <input placeholder='Mất bao lâu để sạc đầy' required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, time_charge: e.target.value } }))} value={product?.product_attributes?.time_charge} type='number' name='time_charge' />
                                            </div>

                                            <div className="add-product-name flex-col">
                                                <p>Thời lượng Pin</p>
                                                <input placeholder='Thời lượng sử dụng trong bao lâu' required onChange={(e) => setProduct(prev => ({ ...prev, product_attributes: { ...prev.product_attributes, battery_life: e.target.value } }))} value={product?.product_attributes?.battery_life} type='number' name='battery_life' />
                                            </div>
                                        </div>
                                    </>
                                }

                                <button className='add-btn' type='submit'>Cập nhật sản phẩm</button>
                            </form>
                        </div>
                        <ToastContainer
                            stacked
                            draggable
                            hideProgressBar
                        />
                    </>
                    :
                    <NotFound />
            }
        </>
        // <div>
        //     UpdateProduct
        // </div>
    )
}

export default UpdateProduct