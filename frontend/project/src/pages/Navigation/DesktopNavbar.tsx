import { useState } from "react";
import { Link } from "react-router-dom";
import { createUseStyles } from "react-jss";

import type { NavbarUser } from "./Navbar";
import { FaShoppingCart } from "react-icons/fa";

const useStyles = createUseStyles({
  nav: {
    minHeight: 72,
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },
  brand: {
    color: "#4f46e5",
    fontSize: 24,
    fontWeight: 800,
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  link: {
    padding: "10px 14px",
    borderRadius: 8,
    color: "#374151",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    "&:hover": {
      background: "#eef2ff",
      color: "#4338ca",
    },
  },
  register: {
    background: "#4f46e5",
    color: "#fff",
    "&:hover": {
      background: "#4338ca",
      color: "#fff",
    },
  },
  profile: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    border: 0,
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 12px)",
    width: 240,
    padding: 10,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
    zIndex: 1000,
  },
  userInfo: {
    padding: 10,
    borderBottom: "1px solid #e5e7eb",
    overflowWrap: "anywhere",
    "& p": {
      margin: "5px 0",
      color: "#6b7280",
      fontSize: 12,
    },
  },
  menuItem: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: 11,
    border: 0,
    borderRadius: 7,
    background: "transparent",
    color: "#374151",
    textAlign: "left",
    fontSize: 14,
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      background: "#f3f4f6",
    },
  },
  danger: {
    color: "#dc2626",
  },
  cartButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "12px 22px",
    background: "#6558dc",
    color: "#fff",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "fit-content",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#5144c5",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(101, 88, 220, 0.25)",
    },
  },
  cartIcon: {
    fontSize: 18,
  },
});

interface Props {
  user: NavbarUser | null;
  onLogout: () => void;
  onDeleteUser: () => void;
  showCart: boolean;
  cartNumber: number | null;
}

export default function DesktopNavbar({
  user,
  onLogout,
  onDeleteUser,
  showCart,
  cartNumber,
}: Props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const info = user?.userInfo;
  const initials =
    `${info?.firstName?.trim()?.[0] ?? ""}${info?.lastName?.trim()?.[0] ?? ""}`.toUpperCase() ||
    info?.username?.[0]?.toUpperCase() ||
    "?";

  return (
    <nav className={classes.nav} aria-label="Desktop navigation">
      <Link to="/" className={classes.brand}>
        MyApp
      </Link>

      <div className={classes.links}>
        <Link to="/" className={classes.link}>
          Home
        </Link>
        <Link to="/products" className={classes.link}>
          Products
        </Link>
        {showCart && (
          <div
            className={classes.cartButton}
            onClick={() => {
              window.location.href = "/cart";
            }}
          >
            <span> {cartNumber}</span>

            <FaShoppingCart className={classes.cartIcon} />
            <span>See Cart</span>
          </div>
        )}

        {!user ? (
          <>
            <Link to="/login" className={classes.link}>
              Login
            </Link>
            <Link
              to="/register"
              className={`${classes.link} ${classes.register}`}
            >
              Register
            </Link>
          </>
        ) : (
          <div className={classes.profile}>
            <button
              type="button"
              className={classes.avatar}
              onClick={() => setOpen((value) => !value)}
              aria-label="Open user menu"
              aria-expanded={open}
            >
              {initials}
            </button>

            {open && (
              <div className={classes.dropdown}>
                <div className={classes.userInfo}>
                  <strong>
                    {[info?.firstName, info?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                      info?.username ||
                      "User"}
                  </strong>
                  <p>{info?.email}</p>
                </div>

                {user && (
                  <Link
                    to={`/user/${user.userInfo._id ?? user.userInfo.id}`}
                    className={classes.menuItem}
                  >
                    User info
                  </Link>
                )}

                <Link
                  to="/update-user"
                  className={classes.menuItem}
                  onClick={() => setOpen(false)}
                >
                  Update user
                </Link>

                <button
                  className={`${classes.menuItem} ${classes.danger}`}
                  onClick={() => {
                    setOpen(false);
                    onDeleteUser();
                  }}
                >
                  Delete user
                </button>

                <button
                  type="button"
                  className={`${classes.menuItem} ${classes.danger}`}
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
