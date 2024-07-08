import React, { useContext, useEffect, useState } from 'react'
import "./placeoneorder.css"
import { StoreContext } from '../../context/StoreContext'
import CheckoutListButton from '../../components/CheckoutListButton/CheckoutListButton'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const PlaceOneOrder = () => {

    const { getTotalCartAmount, fetchAllCartByUser, profileInfo, oneProductOrder, fetchProfileData } = useContext(StoreContext)
    const [paymentMethod, setPaymentMethod] = useState("stripe")
    const token = localStorage.getItem('token')
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [voucher, setVoucher] = useState(null)
    const navigate = useNavigate()
    const [phone, setPhone] = useState("")
    const BASE_URL = "http://localhost:8080"

    if (oneProductOrder == null) {
        navigate('/cart')
    } else {
        console.log("ko null");
    }
    useEffect(() => {
        fetchAllCartByUser()
    }, [profileInfo, voucher, profileInfo?.amount]);

    const VNDONG = (number) => {
        return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }

    const handleSubmitOrder = async (e) => {
        const resOrder = await axios.get(`${BASE_URL}/api/v1/orders/createOrder`)
        const order = resOrder.data;
        order.details = oneProductOrder
        order.paymentMethod = "COD"
        order.shippingAddress = address
        order.email = email
        order.phone = phone

        if (profileInfo.id) {
            order.shippingAddress = profileInfo.address
            order.email = profileInfo.email
            order.phone = profileInfo.phone
            order.voucher = voucher
            order.user = {
                id: profileInfo.id,
                email: profileInfo.email,
                phone: profileInfo.phone,
                username: profileInfo.username,
            };
        }
        order.status = "PENDING"

        if (voucher !== null) {
            order.totalAmount = getTotalCartAmount(oneProductOrder, voucher) + 30000

        } else {
            order.totalAmount = getTotalCartAmount(oneProductOrder) + 30000
        }

        console.log("Check new order >>> ", order);
        await axios.post(`${BASE_URL}/api/v1/orders`, order)
        const response = await axios.post(`${BASE_URL}/api/v1/orders`, order)
        if (response.data) {
            fetchProfileData()
            if (response.data.statusCode === 200) {
                navigate('/success')
            }
        }

    }

    return (
        <div className='place-order'>
            {
                token == null
                &&
                <div className="place-order-left">
                    <div className="title">Thông tin vận chuyển</div>
                    <div className="multi-fields">
                        <input value={username} onInput={(e) => setUsername(e.target.value)} type="text" placeholder='Họ và tên' />
                    </div>
                    <input value={email} onInput={(e) => setEmail(e.target.value)} type="email" placeholder='Email' />
                    <div className="multi-fields">
                        <input value={phone} onInput={(e) => setPhone(e.target.value)} type="tel" placeholder='Số điện thoại' />
                    </div>
                    <input value={address} onInput={(e) => setAddress(e.target.value)} type="text" placeholder='Địa chỉ' />
                </div>
            }
            {
                oneProductOrder !== null &&
                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Chi phí giỏ hàng</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>Giá</p>
                                {
                                    oneProductOrder ?
                                        <p>{VNDONG(getTotalCartAmount(oneProductOrder))}</p>
                                        :
                                        "0 VND"
                                }
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Phí vận chuyển</p>

                                {
                                    oneProductOrder ?
                                        <p>{getTotalCartAmount(oneProductOrder) === 0 ? 0 : VNDONG(30000)}</p>

                                        :
                                        "0 VND"
                                }
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <b>Tổng tiền</b>

                                {
                                    oneProductOrder ?
                                        voucher !== null ?
                                            <b>{getTotalCartAmount(oneProductOrder) === 0 ? 0 : VNDONG(getTotalCartAmount(oneProductOrder, voucher) + 30000)}</b>
                                            :
                                            <b>{getTotalCartAmount(oneProductOrder) === 0 ? 0 : VNDONG(getTotalCartAmount(oneProductOrder) + 30000)}</b>
                                        :
                                        "0 VND"
                                }
                            </div>
                        </div>
                        <div className='payment_container'>
                            <h2>Chọn phương thức thanh toán</h2>
                            <hr />
                            <div className='payment_selection'>
                                {
                                    profileInfo.id &&
                                    <>
                                        <div className='payment_select'>
                                            <label htmlFor="stripe">Visa</label>
                                            <input onInput={() => setPaymentMethod("stripe")} id='stripe' type="radio" name='payment_method' />
                                        </div>

                                        {/* <div className="payment_select">
                                            <label htmlFor="momo">Momo</label>
                                            <input onInput={() => setPaymentMethod("momo")} type="radio" id='momo' name='payment_method' />
                                        </div> */}
                                    </>
                                }
                                <div className="payment_select">
                                    <label htmlFor="cod">COD</label>
                                    {
                                        profileInfo.id
                                            ?
                                            <input onInput={() => setPaymentMethod("cod")} type="radio" id='cod' name='payment_method' />
                                            :
                                            <input onInput={() => setPaymentMethod("cod")} type="radio" id='cod' name='payment_method' />
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            profileInfo.id ?
                                paymentMethod === "stripe"
                                    ?
                                    <CheckoutListButton voucher={voucher} carts={oneProductOrder} text='Thanh toán quốc tế' />
                                    :
                                    paymentMethod === "momo"
                                        ?
                                        <button onClick={() => console.log("momo")}>Thanh toán với Momo</button>
                                        :
                                        <button onClick={(e) => {
                                            // setOneProductOrder([item])
                                            console.log("1");
                                            handleSubmitOrder(e)
                                        }}>Thanh toán khi nhận hàng</button>
                                :
                                <button onClick={() => toast.promise(
                                    handleSubmitOrder(),
                                    {
                                        success: "Đang gửi hóa đơn",
                                        pending: "Hóa đơn đã được gửi",
                                        error: "Có lỗi khi gửi đơn"
                                    }
                                )}
                                >
                                    Thanh toán khi nhận hàng
                                </button>
                        }
                    </div>
                </div>
            }
            <div className="voucher_section">
                {
                    profileInfo?.id &&
                    <>
                        <h2>Áp dụng phiếu giảm giá</h2>
                        <div className='voucher_check_container'>
                            {
                                profileInfo?.amount >= 10000000 &&
                                <div className="voucher_item">
                                    <input onChange={(e) => setVoucher(prev => e.target.value)} name='voucher' value={10} type="radio" id='voucher_10' />
                                    <label htmlFor="voucher_10">Giảm <b>10%</b></label>
                                </div>
                            }
                            {
                                profileInfo?.amount >= 20000000 &&
                                <div className="voucher_item">

                                    <input onChange={(e) => setVoucher(prev => e.target.value)} name='voucher' value={15} type="radio" id='voucher_15' />
                                    <label htmlFor="voucher_15">Giảm <b>15%</b></label>
                                </div>
                            }
                            {
                                profileInfo?.amount >= 50000000 &&
                                <div className="voucher_item">

                                    <input onChange={(e) => setVoucher(prev => e.target.value)} value={25} name='voucher' type="radio" id='voucher_25' />
                                    <label htmlFor="voucher_25">Giảm <b>25%</b></label>
                                </div>
                            }
                        </div>
                    </>
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default PlaceOneOrder