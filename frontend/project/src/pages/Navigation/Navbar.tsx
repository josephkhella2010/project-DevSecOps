import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../store/store";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { logoutUser } from "../../store/reduxSlice/UserSlice/UserSlice";
import type { ProductType } from "../../utilities/interfaces";

export interface NavbarUser {
  token: string;
  userInfo: {
    _id?: string | number;
    id?: string | number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    products?: ProductType[];
  };
}

interface NavbarProps {
  user: NavbarUser | null;
  onLogout: () => void;
  onDeleteUser: () => void;
  showCart: boolean;
  cartNumber: number | null;
}

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(
    (state: RootState) => state.userSlice.user,
  ) as NavbarUser | null;

  const deleteUser = () => {
    const id = user?.userInfo?.id ?? user?.userInfo?._id;

    if (!id || !user?.token) {
      console.error("Missing user ID or token", { id, user });
      return;
    }

    dispatch({
      type: "FETCH-DELETE-USER",
      payload: {
        id: String(id),
        token: user.token,
      },
    });
  };
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700);

  const cartProducts = useSelector(
    (state: RootState) => state.userSlice.user?.userInfo?.products,
  );

  const products = cartProducts ?? [];

  const showCart = products.length > 0;
  const cartNumber = products.length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    dispatch(logoutUser());
    navigate("/login");
  }

  const props: NavbarProps = {
    user: user?.token ? user : null,
    onLogout: handleLogout,
    onDeleteUser: deleteUser,
    showCart,
    cartNumber,
  };

  return isMobile ? <MobileNavbar {...props} /> : <DesktopNavbar {...props} />;
}
