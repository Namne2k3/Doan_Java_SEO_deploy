import React, { useContext, useEffect, useState } from 'react'
import "./placeorder.css"
import { StoreContext } from '../../context/StoreContext'
import CheckoutListButton from '../../components/CheckoutListButton/CheckoutListButton'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

    const { getTotalCartAmount, carts, fetchAllCartByUser, profileInfo, fetchProfileData } = useContext(StoreContext)
    const [paymentMethod, setPaymentMethod] = useState("stripe")
    const token = localStorage.getItem('token')
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [voucher, setVoucher] = useState(null)
    const navigate = useNavigate()
    const [phone, setPhone] = useState("")
    const BASE_URL = "http://localhost:8080"

    useEffect(() => {
        if (getTotalCartAmount(carts) === 0) {
            navigate('/cart')
        }
        fetchAllCartByUser()

    }, [profileInfo?.amount, voucher]);

    const VNDONG = (number) => {
        return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }

    const handleSubmitOrder = async (e) => {
        const resOrder = await axios.get(`${BASE_URL}/api/v1/orders/createOrder`)
        const order = resOrder.data;
        if (profileInfo?.id) {

            order.shippingAddress = profileInfo?.address
            order.email = profileInfo?.email
            order.phone = profileInfo?.phone
            order.voucher = voucher
            order.user = {
                id: profileInfo?.id,
                email: profileInfo?.email,
                phone: profileInfo?.phone,
                username: profileInfo?.username,
            };
        } else {
            order.shippingAddress = address
            order.email = email
            order.phone = phone
        }

        if (voucher !== null) {
            order.totalAmount = getTotalCartAmount(carts, voucher) + 30000

        } else {
            order.totalAmount = getTotalCartAmount(carts) + 30000
        }

        order.paymentMethod = "COD"
        order.details = carts

        const response = await axios.post(`${BASE_URL}/api/v1/orders`, order)
        if (response.data) {

            if (response.data.statusCode === 200) {
                navigate('/success')
            }
            fetchProfileData()
        } else {
            navigate('/error')
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
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Chi phí giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Giá</p>
                            {
                                carts ?
                                    <p>{VNDONG(getTotalCartAmount(carts))}</p>
                                    :
                                    "0 VND"
                            }
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí vận chuyển</p>

                            {
                                carts ?
                                    <p>{getTotalCartAmount(carts) === 0 ? 0 : VNDONG(30000)}</p>

                                    :
                                    "0 VND"
                            }
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng tiền</b>

                            {
                                carts ?
                                    voucher !== null ?
                                        <b>{getTotalCartAmount(carts) === 0 ? 0 : VNDONG(getTotalCartAmount(carts, voucher) + 30000)}</b>
                                        :
                                        <b>{getTotalCartAmount(carts) === 0 ? 0 : VNDONG(getTotalCartAmount(carts) + 30000)}</b>
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
                                <CheckoutListButton voucher={voucher} carts={carts} text='Thanh toán quốc tế' />
                                :
                                paymentMethod === "momo"
                                    ?
                                    <button onClick={() => console.log("momo")}>Thanh toán với Momo</button>
                                    :
                                    <button onClick={(e) => {
                                        handleSubmitOrder(e)
                                    }}>Thanh toán khi nhận hàng</button>
                            :
                            <button onClick={() => handleSubmitOrder()}>Thanh toán khi nhận hàng</button>
                    }
                </div>
            </div>
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
        </div>
    )
}

export default PlaceOrder