import { BrowserRouter, Routes, Route } from "react-router-dom";
import { userService } from './services';
import ProfilePage from './pages/user/ProfilePage';
import RegistrationPage from './pages/auth/Register';
import UserManagementPage from './pages/user/UserManagementPage';
import UpdateUser from './pages/user/UpdateUser';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/home/Home';
import Cart from './pages/cart/Cart';
import PlaceOrder from './pages/placeorder/PlaceOrder';
import Footer from "./components/Footer/Footer";
import { useState, useEffect, useContext } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Admin from "./pages/admin/Admin";
import AddProduct from "./pages/admin/Products/AddProduct/AddProduct";
import ListProduct from "./pages/admin/Products/ListProduct/ListProduct";
import ListOrder from "./pages/admin/Orders/ListOrder/ListOrder";
import UpdateProduct from "./pages/admin/Products/UpdateProduct/UpdateProduct";
import Success from "./components/Success/Success";
import PlaceOneOrder from "./pages/placeoneorder/PlaceOneOrder";
import MyOrders from "./pages/MyOrders/MyOrders";
import NotFound from "./components/NotFound/NotFound";
import Product from "./pages/product/Product";
import OAuth2Callback from "./services/OAuth2Callback";
import Search from "./pages/Search/Search";
import { StoreContext } from "./context/StoreContext";
import AdminBrands from "./pages/admin/Brands/AdminBrands";
import UpdateBrand from "./pages/admin/Brands/UpdateBrand";
import RecoveryPassword from "./pages/RecoveryPassword/RecoveryPassword";
import EmailSent from "./pages/EmailSent/EmailSent";
import SubmitRecoveryPassword from "./pages/SubmitRecoveryPassword/SubmitRecoveryPassword";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import AdminUsers from "./pages/admin/Users/AdminUsers";
import SupportAdmin from "./pages/SupportAdmin/SupportAdmin";
import SupportEngine from './components/SupportEngine/SupportEngine'
import Statistics from "./pages/admin/Statistics/Statistics";
import AddBrand from "./pages/admin/Brands/AddBrand";
import Feedbacks from "./pages/admin/Feedbacks/Feedbacks";
function App() {

  const { fetchProfileData } = useContext(StoreContext);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // 
  const token = localStorage.getItem('token');
  useEffect(() => {

    const checkAdmin = async () => {
      if (token) { // Chỉ kiểm tra nếu có token
        const isAdmin = await userService.adminOnly();
        setIsAdmin(isAdmin);
      }
    };

    checkAdmin();

    if (token) {
      fetchProfileData();
    }
  }, []); // Chạy một lần sau khi component được mount

  return (
    <BrowserRouter>
      <>
        {
          showLogin
            ?
            <LoginPopup setShowLogin={setShowLogin} />
            :
            <></>
        }
        <div className="app">
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/myorder" element={<MyOrders />} />
            <Route exact path="/place_order" element={<PlaceOrder />} />
            <Route exact path="/place_product_order" element={<PlaceOneOrder />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/search/:search" element={<Search />} />
            <Route path="/products/:productId" element={<Product />} />
            <Route path="/oauth2/callback" element={<OAuth2Callback />} />
            <Route path="/recovery" element={<RecoveryPassword setShowLogin={setShowLogin} />} />
            <Route path="/submit_recovery_password/:token" element={<SubmitRecoveryPassword />} />
            <Route path="/email_sent" element={<EmailSent setShowLogin={setShowLogin} />} />
            <Route path="/verifyEmail/:token" element={<VerifyEmail />} />
            {
              isAdmin
              &&
              <Route path="/admin" element={<Admin />}>
                <Route path="brands" element={<AdminBrands />} />
                <Route path="brands/edit/:id" element={<UpdateBrand />} />
                <Route path="brands/add" element={<AddBrand />} />
                <Route path="products" element={<ListProduct />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<UpdateProduct />} />
                <Route path="user-management" element={<UserManagementPage />} />
                <Route path="update-user/:userId" element={<UpdateUser />} />
                <Route path="orders" element={<ListOrder />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="support" element={<SupportAdmin />} />
                <Route path="feedbacks" element={<Feedbacks />} />
              </Route>
            }

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <SupportEngine />
      </>
    </BrowserRouter>
  );
}

export default App;
