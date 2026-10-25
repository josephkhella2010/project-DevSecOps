import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../Home/HomePage";
import RegisterPage from "../UsersPage/Register/RegisterPage";
import Navbar from "../Navigation/Navbar";
import UpdateUserPage from "../UsersPage/updateUserPage/UpdateUserPage";
import UserByIdPage from "../UsersPage/UserByIdPage/UserByIdPage";
import LoginPage from "../UsersPage/LoginPage/LoginPage";
import ProductsPage from "../ProductsPage/Products/ProductsPage";
import ProductByIdPage from "../ProductsPage/productByIdPage/ProductByIdPage";
import { ToastContainer } from "react-toastify";
import UserProductsPage from "../ProductsPage/UserProductsPage/UserProductsPage";

export default function RoutePage() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/update-user" element={<UpdateUserPage />} />
          <Route path="/user/:id" element={<UserByIdPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductByIdPage />} />
          <Route path="/cart" element={<UserProductsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
