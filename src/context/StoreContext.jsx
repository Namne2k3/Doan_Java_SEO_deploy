import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/images";
import { userService } from "../services";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const BASE_URL = "http://localhost:8080"
    const [cartItems, setCartItems] = useState({});
    const [profileInfo, setProfileInfo] = useState({})
    const [products, setProducts] = useState([]);
    const [carts, setCarts] = useState([])
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const [oneProductOrder, setOneProductOrder] = useState(null);
    const [userOrders, setUserOrders] = useState([])
    const [adminOrders, setAdminOrders] = useState([])
    const [cateAdminProducts, setCateAdminProducts] = useState("Laptop")
    const [adminProducts, setAdminProducts] = useState([])
    const [emailSent, setEmailSent] = useState("")

    const fetchAdminProductsByCategory = async () => {
        const response = await axios.get(`${BASE_URL}/admin/v1/products`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.statusCode === 200) {
            setAdminProducts(prev => response.data.dataList || [])
        } else if (response.data.statusCode = 404) {
            setAdminProducts(prev => response.data.dataList || [])
        } else {
            console.log(response.data.message)
        }
    }

    const fetchProductBySearching = async (search) => {
        console.log("Searching ... ");
        const response = await axios.get(`${BASE_URL}/api/v1/products?search=${search}`)
        if (response.data.statusCode === 200) {
            setProducts(prev => response.data.dataList || [])
        } else if (response.data.statusCode = 404) {
            setProducts(prev => response.data.dataList || [])
            console.log(response.data.message)
        } else {
            console.log(response.data.message)
        }
    }

    const fetchAllOrder = async () => {
        try {
            if (token) {
                const res = await axios.get(`${BASE_URL}/admin/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.data) {
                    setAdminOrders(res.data.dataList);
                }
            }

        } catch (e) {
            console.log(e.message);
        }
    }

    const fetchProfileData = async () => {
        try {

            if (token) {
                const response = await userService.getUserProfile(token);
                setProfileInfo(prev => ({ ...prev, ...response.data }));

            }

        } catch (err) {
            console.error('Error fetching profile information:', err);
        }
    }
    useEffect(() => {

        if (userService.adminOnly() === true) {
            fetchAllOrder()
        }

        fetchAllCartByUser()
    }, [])

    const fetchProductsByCategory = async (category) => {

        const response = await axios.get(`${BASE_URL}/api/v1/products?category=${category}`)
        if (response.data.statusCode === 200) {
            setProducts(prev => response.data.dataList || [])
        } else if (response.data.statusCode = 404) {
            setProducts(prev => response.data.dataList || [])
            console.log(response.data.message)
        } else {
            console.log(response.data.message)
        }
    }

    const fetchProductsByBrand = async (brand) => {
        const response = await axios.get(`${BASE_URL}/api/v1/products?brand=${brand}`)
        if (response.data.statusCode === 200) {
            setProducts(prev => response.data.dataList || [])
        } else if (response.data.statusCode = 404) {
            setProducts(prev => response.data.dataList || [])
            console.log(response.data.message)
        } else {
            console.log(response.data.message)
        }
    }

    const fetchAllCartByUser = async () => {
        if (token) {
            const response = await axios.get(`${BASE_URL}/api/v1/user/${profileInfo.id}/carts`)
            if (response.status === 200) {
                // console.log(response.data.dataList);
                setCarts(response.data.dataList);
                // return response.data.dataList;
            }
        } else {
            const carts = JSON.parse(localStorage.getItem('carts'))
            setCarts(carts)
        }
    }

    const addToCart = async (itemId) => {
        if (token) {

            try {

                const productResponse = await axios.get(`${BASE_URL}/api/v1/products/${itemId}`);
                if (productResponse.data.statusCode === 404) {
                    throw new Error("Product not found");
                }

                if (profileInfo != null) {

                    const addToCartResponse = await axios.post(`${BASE_URL}/api/v1/user/${profileInfo.id}/addCart`, productResponse.data.data);
                    if (addToCartResponse.data.statusCode !== 200) {
                        throw new Error(addToCartResponse.data.message);
                    }
                }

            } catch (error) {
                console.error("Failed to add item to cart:", error.message);
            }
        } else {
            const res = await axios.get(`${BASE_URL}/api/v1/products/${itemId}`)
            const carts = []
            if (res.data.data) {
                const product = res.data.data;
                if (localStorage.getItem('carts') == null) {

                    const resCart = await axios.get(`${BASE_URL}/api/v1/cart/createCart`)
                    const cart = resCart.data;
                    cart.product = product;
                    cart.quantity = 1;
                    carts.push(cart);
                    localStorage.setItem('carts', JSON.stringify(carts))
                }
                else {
                    const findCarts = JSON.parse(localStorage.getItem('carts'))
                    var findCart = findCarts.find(p => p.product.id === product.id)
                    if (findCart) {
                        findCart.quantity += 1;
                    } else {
                        const resCart = await axios.get(`${BASE_URL}/api/v1/cart/createCart`)
                        const cart = resCart.data;
                        cart.quantity = 1;
                        cart.product = product;
                        findCarts.push(cart);

                    }
                    localStorage.setItem('carts', JSON.stringify(findCarts))
                }
            }
        }
    };

    const removeFromCart = async (id) => {

        const previousCarts = [...carts];
        if (token) {
            try {
                const response = await axios.delete(`${BASE_URL}/api/v1/user/${profileInfo.id}/carts/${id}`);

                if (response.data.statusCode !== 200) {
                    throw new Error(response.data.message);
                }
                else {

                    setCarts(prevCart => prevCart.filter(item => item.id !== id));
                }
            } catch (error) {
                console.error("Error removing item from cart:", error.message);

                setCarts(previousCarts);
            }
        } else {
            try {
                var findCarts = JSON.parse(localStorage.getItem('carts'))

                var findCart = findCarts.find(p => p.product.id === id);
                if (findCart) {
                    findCarts = findCart.map(p => p.product.id !== findCart.product.id)
                }
                localStorage.setItem('carts', findCarts);
            } catch (error) {
                console.error("Error removing item from cart:", error.message);
            } finally {

            }
        }
    };

    const getTotalCartAmount = (cartList, voucher) => {
        const totalWithoutVoucher = cartList.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        if (voucher) {
            return totalWithoutVoucher * (100 - Number(voucher)) / 100;
        }

        return totalWithoutVoucher;
    };

    const contextValue = {
        cartItems,
        fetchProductsByBrand,
        setCartItems,
        addToCart,
        profileInfo,
        setProfileInfo,
        products,
        fetchProductsByCategory,
        fetchAllCartByUser,
        carts,
        setCarts,
        removeFromCart,
        getTotalCartAmount,
        oneProductOrder,
        setOneProductOrder,
        userOrders, setUserOrders,
        fetchAllOrder,
        adminOrders, setAdminOrders,
        fetchAdminProductsByCategory,
        setCateAdminProducts, cateAdminProducts,
        adminProducts,
        setAdminProducts,
        fetchProductBySearching,
        fetchProfileData,
        emailSent, setEmailSent
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;