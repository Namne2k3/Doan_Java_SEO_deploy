import React, { useContext, useEffect, useState } from 'react';
import "./cart.css";
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import NotFound from '../../components/NotFound/NotFound';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const Cart = () => {
    const BASE_URL = "http://localhost:8080";
    const { fetchAllCartByUser, carts, profileInfo, setCarts, getTotalCartAmount, setOneProductOrder } = useContext(StoreContext);
    const [removing, setRemoving] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    // console.log("token >>> ", token);


    const VNDONG = (number) => {
        return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    };

    const handleUpdateQuantity = async (item, quantity) => {

        if (profileInfo.id) {
            setCarts(prevCarts =>
                prevCarts.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: parseInt(quantity) } : cartItem
                )
            );

            try {
                const response = await axios.put(`${BASE_URL}/api/v1/carts/${item.id}`, {
                    ...item,
                    quantity: parseInt(quantity)
                });

                if (response.data.statusCode !== 200) {
                    throw new Error(response.data.message);
                }
            } catch (e) {
                console.log(e.message);
                fetchAllCartByUser();
            }
        } else {
            try {
                var findCarts = JSON.parse(localStorage.getItem('carts'))
                var findCart = findCarts.find(p => p.product.id === item.product.id);
                if (findCart) {
                    findCart.quantity = Number(quantity);
                }
                setCarts(prev => findCarts)
                localStorage.setItem('carts', JSON.stringify(findCarts))
            } catch (e) {


            }
        }
    };

    const removeCart = async (id) => {
        if (!removing) {
            toast.promise(
                removeFromCart(id),
                {
                    pending: 'Removing product from cart',
                    success: 'Removed Successfully👌',
                    error: 'Error rejected loading product 🤯'
                })
        }
    }

    const removeFromCart = async (id) => {

        if (profileInfo.id) {
            setRemoving(prev => true);
            try {
                const response = await axios.delete(`${BASE_URL}/api/v1/user/${profileInfo.id}/carts/${id}`);

                if (response.data.statusCode !== 200) {
                    throw new Error(response.data.message);
                } else {
                    setCarts(prevCart => prevCart.filter(item => item.id !== id));
                }
            } catch (error) {
                console.error("Error removing item from cart:", error.message);
            } finally {
                setRemoving(prev => false);
            }
        } else {
            try {
                var findCarts = JSON.parse(localStorage.getItem('carts'))
                console.log(findCarts);
                var findCart = findCarts.find(p => p.product.id === id);
                console.log(findCart);
                if (findCart) {
                    findCarts = findCarts.filter(p => p.product.id !== findCart.product.id)
                    setCarts(prev => findCarts)
                    console.log(findCarts);
                }
                localStorage.setItem('carts', JSON.stringify(findCarts));
            } catch (error) {
                console.error("Error removing item from cart:", error.message);
            } finally {

            }
        }
    };

    useEffect(() => {
        fetchAllCartByUser()
    }, [profileInfo])

    return (
        <>
            <Helmet>
                <title>Giỏ hàng - {profileInfo?.username}</title>
                <meta name='description' content="Giỏ hàng cá nhân" />
                <link rel="canonical" href={`https://justtechshop.netlify.app/cart`} />
            </Helmet>
            <div className='cart'>
                <div className="cart-items">
                    <div className="cart-items-title">
                        <p>Sản phẩm</p>
                        <p>Tiêu đề</p>
                        <p>Giá</p>
                        <p>Số lượng</p>
                        <p>Tổng tiền</p>
                        <p>Thanh toán</p>
                        <p>Xóa</p>
                    </div>
                    <br />
                    <hr />
                    {
                        carts
                            ?
                            carts.map((item, index) => {
                                return (
                                    <div className='cart-items-item-container' key={index}>
                                        <div className="cart-items-title cart-items-item">
                                            <img src={`/images/${item.product.image}`} alt="item_image" />
                                            <p>{item.product.name}</p>
                                            <p>{VNDONG(item.product.price)}</p>
                                            {
                                                <input
                                                    onChange={(e) => handleUpdateQuantity(item, e.target.value)}
                                                    value={item.quantity}
                                                    style={{ padding: 6, fontSize: 16, maxWidth: 100 }}
                                                    type="number"
                                                    min={1}
                                                />
                                            }
                                            <p>{VNDONG(item.product.price * item.quantity)}</p>
                                            {
                                                // profileInfo.id ?
                                                // <CheckoutListButton carts={[item]} text="Thanh toán" />
                                                // :
                                                <button onClick={() => {
                                                    setOneProductOrder([item])
                                                    navigate('/place_product_order')
                                                }}>
                                                    Thanh toán
                                                </button>
                                            }
                                            {
                                                token !== null
                                                    ?
                                                    <p onClick={() => removeCart(item.id)} className='cross'>X</p>
                                                    :
                                                    <p onClick={() => removeCart(item.product.id)} className='cross'>X</p>

                                            }
                                        </div>
                                        <hr />
                                    </div>
                                )
                            })
                            :
                            <NotFound />
                    }
                </div>
                <div className="cart-bottom">
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
                                <p>Giá</p>
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
                                <p>Giá</p>
                                {
                                    carts ?
                                        <b>{getTotalCartAmount(carts) === 0 ? 0 : VNDONG(getTotalCartAmount(carts) + 30000)}</b>

                                        :
                                        "0 VND"
                                }
                            </div>
                        </div>
                        <button onClick={() => navigate("/place_order")}>Tiến hành thanh toán</button>
                    </div>
                    <div className="cart-promocode">
                        <div>
                            <p>Nếu bạn có mã khuyến mãi, Nhập tại đây</p>
                            <div className="cart-promocode-input">
                                <input type="text" placeholder='Mã khuyến mãi' />
                                <button>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer draggable />
            </div>
        </>
    );
};

export default Cart;
