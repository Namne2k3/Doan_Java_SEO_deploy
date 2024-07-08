import React, { useContext, useEffect, useState } from 'react'
import "./AddProduct.css"

import { assets } from '../../../../admin_assets/assets'

import axios from 'axios'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { toast, ToastContainer } from 'react-toastify';
import { StoreContext } from '../../../../context/StoreContext';

const AddProduct = () => {

    const BASE_URL = "http://localhost:8080"

    const { setAdminProducts } = useContext(StoreContext)

    const [image, setImage] = useState(false)
    const [images, setImages] = useState([]);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);



    const [data, setData] = useState({
        name: "",
        content: "",
        description: "",
        price: "",
        category: "665eee91d176ea3961e606c0",
        brand: "665ed539fe581060c7aadd87",
        quantity: "",
        watchCount: "0",
        graphic: "",
        cpu: "",
        ram: "8",
        ssd: "512",
        panel: "IPS",
        screen_size: "15",
        brightness: "",
        resolution: "1920 x 1080",
        weight: "",
        chipset: "",
        gpu: "",
        battery: "",
        back_camera: "",
        front_camera: "",
        video_feature_back: "",
        video_feature_front: "",
        video_record: "",
        charge_tech: "",
        screen_tech: "",
        diameter: "",
        design: "",
        time_charge: "",
        battery_life: "",
        SIM: ""
    })
    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({ ...data, [name]: value }))
        // console.log(e.target.name + ": " + e.target.value);
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        await new Promise(resolve => setTimeout(resolve, 1000));

        const formData = new FormData();
        formData.append('name', data.name)
        formData.append('content', data.content)
        formData.append('description', data.description)
        formData.append('price', Number(data.price))
        formData.append('category', data.category)
        formData.append('brand', data.brand)
        formData.append('quantity', Number(data.quantity))
        formData.append('watchCount', Number(data.watchCount))
        formData.append('graphic', data.graphic)
        formData.append('cpu', data.cpu)
        formData.append('gpu', data.gpu)
        formData.append('ram', Number(data.ram))
        formData.append('ssd', Number(data.ssd))
        formData.append('panel', data.panel)
        formData.append('screen_size', data.screen_size)
        formData.append('brightness', Number(data.brightness))
        formData.append('weight', Number(data.weight))
        formData.append('screen_tech', data.screen_tech)
        formData.append('resolution', data.resolution)
        formData.append('SIM', data.SIM)
        formData.append('image', image.name)
        formData.append('battery', data.battery)
        formData.append('back_camera', data.back_camera)
        formData.append('front_camera', data.front_camera)
        formData.append('video_feature_back', data.video_feature_back)
        formData.append('video_feature_front', data.video_feature_front)
        formData.append('video_record', data.video_record)
        formData.append('charge_tech', data.charge_tech)
        formData.append('chipset', data.chipset)
        formData.append('diameter', data.diameter)
        formData.append('design', data.design)
        formData.append('time_charge', data.time_charge)
        formData.append('battery_life', data.battery_life)
        formData.append('images', images.map((item, index) => {
            return (
                item.name
            )
        }));

        await handleUpload();

        const response = await axios.post(`${BASE_URL}/api/v1/products`, formData)
        if (response.data.statusCode !== 200) {
            setImage(false);
            toast(response.data.message)
            setAdminProducts(prev => [...prev, response.data.data])
        }
        else {
            setData(
                {
                    name: "",
                    content: "",
                    description: "",
                    price: "",
                    category: "665eee91d176ea3961e606c0",
                    brand: "665ed539fe581060c7aadd87",
                    quantity: "",
                    watchCount: "0",
                    graphic: "",
                    cpu: "",
                    ram: "8",
                    ssd: "512",
                    panel: "IPS",
                    screen_size: "15",
                    brightness: "",
                    resolution: "1920 x 1080",
                    weight: "",
                    screen_tech: "",
                    SIM: ""
                }
            )
        }
    }

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


        // console.log(data);
        fetchCategory();
        fetchBrands();
    }, [data])

    return (
        <>
            <div className='add'>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    toast.promise(
                        onSubmitHandler(e),
                        {
                            pending: 'Add Product is pending',
                            success: 'Added Product Successfully 👌',
                            error: 'Error rejected adding product 🤯'
                        }
                    )
                }} className="flex-col">

                    <div className="add-img-upload flex-col">
                        <p>Thêm ảnh sản phẩm</p>
                        <label htmlFor="image">
                            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="upload_area_img" />
                        </label>
                        <input name='image' accept='image/*' onChange={(e) => {
                            setImage(e.target.files[0])
                        }} type="file" id='image' hidden required />
                    </div>

                    <div className="add-img-upload flex-col">
                        <p>Thêm nhiều hình ảnh sản phẩm</p>
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
                        <input multiple name='images' accept='image/*' onChange={(e) => setImages(Array(...e.target.files))} type="file" id='images' hidden />
                    </div>

                    <div className="add-product-name flex-col">
                        <p>Tên sản phẩm</p>
                        <input required onInput={onChangeHandler} value={data.name} type="text" name='name' placeholder='Nhập tên sản phẩm' />
                    </div>

                    <div className="add-product-name flex-col">
                        <p>Mô tả phẩm</p>
                        <input required onInput={onChangeHandler} value={data.description} type="text" name='description' placeholder='Nhập mô tả sản phẩm' />
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
                            data={"<p>Hello from CKEditor 5!</p>"}
                            onChange={() => {
                                // console.log(document.getElementsByClassName("ck-content")[0].innerHTML)
                                setData({ ...data, content: document.getElementsByClassName("ck-content")[0].innerHTML });
                            }}
                            onReady={editor => {
                                // console.log('Editor is ready to use!', editor);
                            }}
                        />
                    </div>

                    <div className="add-category-price">

                        <div className="add-category flex-col">
                            <p>Danh mục sản phẩm</p>
                            <select required onInput={onChangeHandler} value={data.category} name="category">
                                {
                                    categories.map((cate, index) =>
                                        <option value={cate.id} key={`cate_${index}`}>{cate.name}</option>
                                    )
                                }

                            </select>
                        </div>

                        <div className="add-price flex-col">
                            <p>Giá bán sản phẩm</p>
                            <input required onInput={onChangeHandler} value={data.price} type="number" name='price' placeholder='Giá bán sản phẩm' />
                        </div>

                        <div className="add-price flex-col">
                            <p>Số lượng sản phẩm</p>
                            <input required onInput={onChangeHandler} value={data.quantity} type="number" name='quantity' placeholder='Số lượng sản phẩm' />
                        </div>


                    </div>

                    <div className="add-category-price">

                        <div className="add-category flex-col">
                            <p>Thương hiệu</p>
                            <select required onInput={onChangeHandler} value={data.brand} name="brand">
                                {
                                    brands.map((brand, index) =>
                                        <option value={brand.id} key={`brand_${index}`}>{brand.name}</option>
                                    )
                                }
                            </select>
                        </div>

                        <div hidden>
                            <p>Số lượt xem</p>
                            <input onInput={onChangeHandler} value={data.watchCount} type="number" name='watchCount' placeholder='Số lượt xem' />
                        </div>
                    </div>

                    <p>Thuộc tính sản phẩm</p>
                    {
                        data.category === "665eee91d176ea3961e606c0" // laptop
                        &&
                        <div className="add-category-price">
                            <div className="add-product-name flex-col">
                                <p>Card đồ họa</p>
                                <input required onInput={onChangeHandler} value={data.graphic} type="text" name='graphic' placeholder='RX 5500M | GTX 1650 | RTX 3060' />
                            </div>

                            <div className="add-product-name flex-col">
                                <p>Vi xử lý</p>
                                <input required onInput={onChangeHandler} value={data.cpu} type="text" name='cpu' placeholder='Ryzen 5 5600H | Intel Core i5 12500H' />
                            </div>

                            <div className="add-product-name flex-col">
                                <p>Dung lượng RAM</p>
                                <select required onInput={onChangeHandler} value={data.ram} name='ram'>
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

                                <select required onInput={onChangeHandler} value={data.ssd} name='ssd'>
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
                                <select required onInput={onChangeHandler} value={data.panel} name='panel'>
                                    <option value="IPS">IPS</option>
                                    <option value="OLED">OLED</option>
                                    <option value="VA">VA</option>
                                </select>
                            </div>

                            <div className="add-product-name flex-col">
                                <p>Kích thước màn hình</p>
                                <select required onInput={onChangeHandler} value={data.screen_size} name='screen_size'>
                                    <option value="15">15 inch</option>
                                    <option value="13">13 inch</option>
                                    <option value="14">14 inch</option>
                                    <option value="16">16 inch</option>
                                    <option value="17">17 inch</option>
                                </select>
                            </div>

                            <div className="add-product-name flex-col">
                                <p>Độ sáng màn hình</p>
                                <input onInput={onChangeHandler} value={data.brightness} type="number" name='brightness' placeholder='500nit | 600nit | 700nit' />
                            </div>

                            <div className="add-product-name flex-col">
                                <p>Độ phân giải</p>
                                <select required onInput={onChangeHandler} value={data.resolution} name='resolution'>
                                    <option value="1920 x 1080">Full HD</option>
                                    <option value="2160 x 1440">2k</option>
                                    <option value="2880 x 1620">3k</option>
                                    <option value="3840 x 2160">4K</option>
                                </select>
                            </div>

                            <div className="add-product-name flex-col">
                                <p>Trọng lượng</p>
                                <input onInput={onChangeHandler} value={data.weight} type="number" name='weight' placeholder='1.8 Kb | 2.3 Kg | 2.5 Kg' />
                            </div>
                        </div>
                    }
                    {
                        data.category === "665eee7ad176ea3961e606bf" // mobile phone
                        &&
                        <>
                            <div className="add-category-price">
                                <div className="add-product-name flex-col">
                                    <p>Chipset</p>
                                    <input required onInput={onChangeHandler} value={data.chipset} type="text" name='chipset' placeholder='Snapdragon 865 | Apple M2 | Exynos 1380' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Loại CPU</p>
                                    <input required onInput={onChangeHandler} value={data.cpu} type="text" name='cpu' placeholder='1 nhân 3.36 GHz, 4 nhân 2.8 GHz & 3 nhân 2 GHz' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Graphics</p>
                                    <input required onInput={onChangeHandler} value={data.graphic} type="text" name='graphic' placeholder='Adreno 740' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Dung lượng Pin</p>
                                    <input required onInput={onChangeHandler} value={data.battery} type="text" name='battery' placeholder='4000 mA | 5000mA | 6000mA' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Camera sau</p>
                                    <input required onInput={onChangeHandler} value={data.back_camera} type="text" name='back_camera' placeholder='Thông tin camera sau' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Camera trước</p>
                                    <input required onInput={onChangeHandler} value={data.front_camera} type="text" name='front_camera' placeholder='Thông tin camera trước' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Tính năng camera sau</p>
                                    <input required onInput={onChangeHandler} value={data.video_feature_back} type="text" name='video_feature_back' placeholder='Thông tin tính năng camera sau' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Tính năng camera trước</p>
                                    <input required onInput={onChangeHandler} value={data.video_feature_front} type="text" name='video_feature_front' placeholder='Thông tin tính năng camera trước' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Khả năng quay video</p>
                                    <input required onInput={onChangeHandler} value={data.video_record} type="text" name='video_record' placeholder='Thông tin khả năng quay video' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Dung lượng RAM</p>
                                    <select required onInput={onChangeHandler} value={data.ram} name='ram'>
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

                                    <select required onInput={onChangeHandler} value={data.ssd} name='ssd'>
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
                                    <input required onInput={onChangeHandler} value={data.screen_tech} type="text" name='screen_tech' placeholder='Thông tin công nghệ màn hình' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Kích thước màn hình</p>
                                    <input required onInput={onChangeHandler} type='text' value={data.screen_size} name='screen_size' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Độ sáng màn hình</p>
                                    <input onInput={onChangeHandler} value={data.brightness} type="number" name='brightness' placeholder='500nit | 600nit | 700nit' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Độ phân giải</p>
                                    <input required onInput={onChangeHandler} value={data.resolution} type='text' name='resolution' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Trọng lượng</p>
                                    <input onInput={onChangeHandler} value={data.weight} type="number" name='weight' placeholder='1.8 Kb | 2.3 Kg | 2.5 Kg' />
                                </div>
                            </div>
                        </>
                    }

                    {
                        data.category === "66615ffbc875cc7d60827534" // watch
                        &&
                        <>
                            <div className="add-category-price">
                                <div className="add-product-name flex-col">
                                    <p>Công nghệ màn hình</p>
                                    <input required onInput={onChangeHandler} value={data.screen_tech} type="text" name='screen_tech' placeholder='Thông tin công nghệ màn hình' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Kích thước màn hình</p>
                                    <input required onInput={onChangeHandler} type='text' value={data.screen_size} name='screen_size' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Độ phân giải</p>
                                    <input required onInput={onChangeHandler} value={data.resolution} type='text' name='resolution' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Đường kính mặt</p>
                                    <input placeholder='Đường kính' required onInput={onChangeHandler} value={data.diameter} type='number' name='diameter' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Thiết kế</p>
                                    <input placeholder='Mặt vuông | Mặt tròn' required onInput={onChangeHandler} value={data.design} type='text' name='design' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Thời gian sạc</p>
                                    <input placeholder='Mất bao lâu để sạc đầy' required onInput={onChangeHandler} value={data.time_charge} type='number' name='time_charge' />
                                </div>

                                <div className="add-product-name flex-col">
                                    <p>Thời lượng Pin</p>
                                    <input placeholder='Thời lượng sử dụng trong bao lâu' required onInput={onChangeHandler} value={data.battery_life} type='number' name='battery_life' />
                                </div>
                            </div>
                        </>
                    }

                    <button className='add-btn' type='submit'>Thêm sản phẩm</button>
                </form>
            </div>
            <ToastContainer
                stacked
                draggable
                hideProgressBar
            />
        </>
    )
}

export default AddProduct