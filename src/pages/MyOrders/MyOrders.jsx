import React, { useContext, useEffect, useState } from 'react'
import "./MyOrders.css"
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { images } from '../../assets/images'
const MyOrders = () => {

    const BASE_URL = "http://localhost:8080"
    // const [data, setData] = useState([])
    const { profileInfo, userOrders, setUserOrders } = useContext(StoreContext)

    const page = 1;
    const size = 10;

    const fetchOrders = async () => {
        const orders = await axios.get(`${BASE_URL}/api/v1/my_orders/${profileInfo.id}`)
        if (orders.data) {
            // console.log("Check log data >>>> ", orders.data.dataList);
            setUserOrders(orders.data.dataList)
        }
    }

    const VNDONG = (number) => {
        return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    };

    const handleCancelOrder = async (id) => {
        try {
            const res = await axios.put(`http://localhost:8080/api/v1/orders/${id}?status=canceled`)
            if (res.data.statusCode === 200) {
                await fetchOrders()
            } else {
                throw new Error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    useEffect(() => {
        if (profileInfo.id) {
            if (userOrders.length === 0)
                toast.promise(
                    fetchOrders(),
                    {
                        error: "Error occuring while loading orders data",
                        success: "Loaded your orders",
                        pending: "Loading your orders data"
                    })
        }
    }, [profileInfo])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {
                    userOrders.map((order, index) => {
                        return (
                            <div key={index} className="my-orders-order">
                                <img src={images.parcel_icon} alt="parcel_icon" />
                                <b>Mã đơn hàng: {order.id}</b>
                                <p>
                                    {
                                        order.details.map((item, index) => {
                                            if (index === order.details.length - 1) {
                                                return item.product.name + ' x ' + item.quantity
                                            } else {
                                                return item.product.name + ' x ' + item.quantity + ", "
                                            }
                                        })
                                    }
                                </p>
                                <p>Tổng tiền: {VNDONG(order.totalAmount)}</p>
                                <p>Vật phẩm: {order.details.length}</p>
                                <p>
                                    <span>&#x25cf;</span>
                                    <b>
                                        {
                                            order.status === "pending" && "Đang xử lý"
                                        }
                                        {
                                            order.status === "processed" && "Đã xử lý"
                                        }
                                        {
                                            order.status === "paid" && "Đã thanh toán"
                                        }
                                        {
                                            order.status === "delivered" && "Đã giao"
                                        }
                                        {
                                            order.status === "canceled" && "Đã hủy"
                                        }
                                    </b>
                                </p>
                                <button onClick={() => fetchOrders()}>Làm mới</button>
                                {
                                    order.status === "processed" || order.status === "canceled" ?
                                        <button style={{ opacity: "0.7" }} disabled >Hủy</button>
                                        :
                                        <button onClick={() => handleCancelOrder(order.id)} >Hủy</button>
                                }
                            </div>
                        )
                    })
                }
            </div>
            <ToastContainer position="top-center" autoClose={1500} draggable stacked hideProgressBar />
        </div>
    )
}

export default MyOrders