import React, { useEffect, useState } from 'react'
import "./Statistics.css"
import moment from 'moment'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
const Statistics = () => {
    const token = localStorage.getItem('token')

    const [orders, setOrders] = useState([])

    const [day, setDay] = useState(new Date().toLocaleDateString())
    const [monthYear, setMonthYear] = useState(2024)
    const [year, setYear] = useState(2024)
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [popularProduct, setPopularProduct] = useState({})
    const [mostSoldProduct, setMostSoldProduct] = useState({})

    const VNDONG = (number) => {
        return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
    }

    const calculateRevenue = (startDate, endDate) => {
        return orders
            .filter((order) => {
                const orderDate = new Date(order.orderDate);
                return orderDate >= startDate && orderDate <= endDate;
            })
            .reduce((total, order) => total + order.totalAmount, 0);
    }

    const MonthRevenue = (year, month) => {

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return calculateRevenue(startDate, endDate);
    };

    const YearRevenue = (year) => {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        return calculateRevenue(startDate, endDate);
    };

    const DayRevenue = (date) => {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(startDate.getDate() + 1); // Kết thúc của ngày là đầu ngày hôm sau
        return calculateRevenue(startDate, endDate);
    };



    useEffect(() => {

        const fetchOrders = async () => {

            try {
                const res = await axios.get(`http://localhost:8080/admin/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.statusCode === 200) {

                    setOrders(res.data.dataList)
                } else {
                    throw new Error(res.data.message)
                }
            } catch (e) {
                toast.error(e.message)
            }
        }

        const fetchPopularProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/products?most=watchCount`)
                if (res.data.statusCode === 200) {
                    setPopularProduct(res.data.data)

                } else {
                    throw new Error(res.data.message)
                }
            } catch (e) {
                toast.error(e.message)
            }
        }

        const fetchMostSoldProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/products?most=sold`)
                if (res.data.statusCode === 200) {
                    setMostSoldProduct(res.data.data)

                } else {
                    throw new Error(res.data.message)
                }
            } catch (e) {
                toast.error(e.message)
            }
        }

        fetchOrders()
        fetchPopularProduct()
        fetchMostSoldProduct()
    }, [])

    return (
        <>
            <div className='list add flex-col'>
                <div className='revenue_section'>
                    <h1>Doanh thu</h1>
                    <div className='time_filter_section'>
                        <div className="time_section">
                            <input type="month" onChange={(e) => {
                                const date = new Date(e.target.value)
                                setMonthYear(date.getFullYear())
                                setMonth(date.getMonth() + 1)
                            }} />
                            <h4>
                                Doanh thu tháng <span>{`${month}/${monthYear}`}</span>: <b>{VNDONG(MonthRevenue(monthYear, month))}</b>
                            </h4>
                        </div>
                        <div className="time_section">
                            <input onChange={(e) => setYear(prev => e.target.value)} type="number" min="1900" max="2099" step="1" value={year} />
                            <h4>
                                Doanh thu năm <span>{year}</span>: <b>{VNDONG(YearRevenue(year))}</b>
                            </h4>
                        </div>
                        <div className="time_section">

                            <input type="date" onChange={(e) => {
                                const date = new Date(e.target.value)
                                setDay(prev => date)
                            }} value={day} />
                            <h4>
                                Doanh thu ngày <span>{moment(day).format('DD-MM-YYYY')}</span>: <b>
                                    {VNDONG(DayRevenue(day))}
                                </b>
                            </h4>
                        </div>
                    </div>
                </div>

                <div className='product_section'>
                    <h1>Sản phẩm</h1>
                    <div className='product_analyst_section'>
                        <div className="product_analyst_data">
                            <h4>Sản phẩm bán chạy nhất : <b>{mostSoldProduct.name}</b></h4>

                        </div>
                        <div className="product_analyst_data">
                            <h4>Sản phẩm quan tâm nhiều nhất : <b>{popularProduct.name}</b></h4>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer draggable stacked autoClose={2000} hideProgressBar />
        </>
    )
}

export default Statistics