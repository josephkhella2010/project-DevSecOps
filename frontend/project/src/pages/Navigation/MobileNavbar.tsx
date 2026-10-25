/* import { useState } from "react";
import { Link } from "react-router-dom";
import { createUseStyles } from "react-jss";

import type { NavbarUser } from "./Navbar";

const useStyles = createUseStyles({
  nav: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    position: "relative",
  },
  topBar: {
    minHeight: 62,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  brand: {
    color: "#4f46e5",
    fontSize: 21,
    fontWeight: 800,
    textDecoration: "none",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    border: 0,
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  hamburger: {
    width: 40,
    height: 40,
    border: "1px solid #e5e7eb",
    borderRadius: 9,
    background: "#fff",
    color: "#374151",
    fontSize: 23,
    cursor: "pointer",
  },
  menu: {
    padding: "8px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    borderTop: "1px solid #e5e7eb",
    height: "calc(100dvh - 60px)",
    position: "absolute",
    left: "0px",
    top: "60px",
    zIndex: "100",
    backgroundColor: "red",
    width: "100%",
  },
  link: {
    display: "block",
    padding: 12,
    borderRadius: 8,
    color: "#374151",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    "&:hover": {
      background: "#eef2ff",
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

  accountMenu: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    borderTop: "1px solid #e5e7eb",
    height: "calc(100dvh - 60px)",
    position: "absolute",
    left: "0px",
    top: "60px",
    zIndex: "100",
    backgroundColor: "green",
    width: "100%",
    alignItems: "center",
    paddingTop: "50px",
  },
  menuItem: {
    display: "block",
    padding: 11,
    border: 0,
    borderRadius: 8,
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
});

interface Props {
  user: NavbarUser | null;
  onLogout: () => void;
  onDeleteUser: () => void;
}

export default function MobileNavbar({ user, onLogout, onDeleteUser }: Props) {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  const info = user?.userInfo;
  const initials =
    `${info?.firstName?.trim()?.[0] ?? ""}${info?.lastName?.trim()?.[0] ?? ""}`.toUpperCase() ||
    info?.username?.[0]?.toUpperCase() ||
    "?";

  function closeMenus() {
    setMenuOpen(false);
  }

  return (
    <nav className={classes.nav} aria-label="Mobile navigation">
      <div className={classes.topBar}>
        <Link to="/" className={classes.brand} onClick={closeMenus}>
          MyApp
        </Link>

        <div className={classes.actions}>
          {user && (
            <button
              type="button"
              className={classes.avatar}
              onClick={() => {
                setMenuOpen(false);
              }}
              aria-label="Open user menu"
            >
              {initials}
            </button>
          )}

          <button
            type="button"
            className={classes.hamburger}
            onClick={() => {
              setMenuOpen((value) => !value);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={classes.menu}>
          <Link to="/" className={classes.link} onClick={closeMenus}>
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" className={classes.link} onClick={closeMenus}>
                Login
              </Link>
              <Link
                to="/register"
                className={`${classes.link} ${classes.register}`}
                onClick={closeMenus}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}

      {user && (
        <div className={classes.accountMenu}>
          <button type="button" className={classes.menuItem}>
            User info
          </button>

          <Link
            to="/update-user"
            className={classes.menuItem}
            onClick={closeMenus}
          >
            Update user
          </Link>

          <button
            className={`${classes.menuItem} ${classes.danger}`}
            onClick={() => {
              closeMenus();
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
    </nav>
  );
}
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createUseStyles } from "react-jss";

import type { NavbarUser } from "./Navbar";
import { FaShoppingCart } from "react-icons/fa";

const useStyles = createUseStyles({
  nav: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    position: "relative",
    zIndex: 100,
  },

  topBar: {
    minHeight: 64,
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  brand: {
    color: "#4f46e5",
    fontSize: 22,
    fontWeight: 800,
    textDecoration: "none",
    letterSpacing: "-0.5px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    border: "2px solid #e0e7ff",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },

  hamburger: {
    width: 42,
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fff",
    color: "#374151",
    fontSize: 24,
    cursor: "pointer",
    transition: "background 0.2s ease",
    "&:hover": {
      background: "#f3f4f6",
    },
  },

  dropdown: {
    position: "absolute",
    top: "65px",
    left: "0px",
    //width: "min(320px, calc(100vw - 24px))",
    width: "100%",
    height: "100dvh",
    overflowY: "auto",
    padding: 10,
    background: "#fff",
    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.14)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    boxSizing: "border-box",
  },

  sectionLabel: {
    padding: "10px 12px 6px",
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1px",
    textTransform: "uppercase",
    textAlign: "left",
  },

  divider: {
    height: 1,
    background: "#f0f1f5",
    margin: "6px 4px",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    minHeight: 44,
    padding: "11px 12px",
    border: 0,
    borderRadius: 10,
    background: "transparent",
    color: "#374151",
    textAlign: "left",
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "background 0.15s ease, color 0.15s ease",

    "&:hover": {
      background: "#f3f4f6",
      color: "#4f46e5",
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

  danger: {
    color: "#dc2626",
    "&:hover": {
      background: "#fef2f2",
      color: "#b91c1c",
    },
  },

  userCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 12,
    margin: "2px 0 6px",
    background: "#f8fafc",
    borderRadius: 12,
  },

  smallAvatar: {
    width: 40,
    height: 40,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#e0e7ff",
    color: "#4338ca",
    fontSize: 14,
    fontWeight: 800,
  },

  userName: {
    color: "#111827",
    fontSize: 14,
    fontWeight: 700,
    overflowWrap: "anywhere",
  },

  userEmail: {
    marginTop: 3,
    color: "#6b7280",
    fontSize: 12,
    overflowWrap: "anywhere",
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

export default function MobileNavbar({
  user,
  onLogout,
  onDeleteUser,
  showCart,
  cartNumber,
}: Props) {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  const info = user?.userInfo;

  const initials =
    `${info?.firstName?.trim()?.[0] ?? ""}${info?.lastName?.trim()?.[0] ?? ""}`.toUpperCase() ||
    info?.username?.[0]?.toUpperCase() ||
    "?";

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  function handleLogout() {
    closeMenu();
    onLogout();
  }

  function handleDeleteUser() {
    closeMenu();
    onDeleteUser();
  }
  useEffect(() => {
    const handleResize = () => {
      if (menuOpen && window.innerHeight > 100) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <nav className={classes.nav} aria-label="Mobile navigation">
      <div className={classes.topBar}>
        <Link to="/" className={classes.brand} onClick={closeMenu}>
          MyApp
        </Link>

        <div className={classes.actions}>
          {user && (
            <button
              type="button"
              className={classes.avatar}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {initials}
            </button>
          )}

          <button
            type="button"
            className={classes.hamburger}
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={classes.dropdown}>
          <div className={classes.sectionLabel}>Navigation</div>

          <Link to="/" className={classes.menuItem} onClick={closeMenu}>
            <span>⌂</span>
            <span>Home</span>
          </Link>
          <Link to="/products" className={classes.menuItem} onClick={closeMenu}>
            <span></span>
            <span>Products</span>
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

          {!user && (
            <>
              <Link
                to="/login"
                className={classes.menuItem}
                onClick={closeMenu}
              >
                <span>↪</span>
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className={`${classes.menuItem} ${classes.register}`}
                onClick={closeMenu}
              >
                <span>＋</span>
                <span>Register</span>
              </Link>
            </>
          )}

          {user && (
            <>
              <div className={classes.divider} />

              <div className={classes.sectionLabel}>Your account</div>

              <div className={classes.userCard}>
                <div className={classes.smallAvatar}>{initials}</div>

                <div>
                  <div className={classes.userName}>
                    {[info?.firstName, info?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                      info?.username ||
                      "User"}
                  </div>

                  <div className={classes.userEmail}>{info?.email || ""}</div>
                </div>
              </div>

              {user && (
                <Link
                  to={`/user/${user.userInfo._id ?? user.userInfo.id}`}
                  className={classes.menuItem}
                  onClick={closeMenu}
                >
                  <span>◉</span>
                  <span>User info</span>
                </Link>
              )}

              <Link
                to="/update-user"
                className={classes.menuItem}
                onClick={closeMenu}
              >
                <span>✎</span>
                <span>Update user</span>
              </Link>

              <div className={classes.divider} />

              <button
                type="button"
                className={`${classes.menuItem} ${classes.danger}`}
                onClick={handleDeleteUser}
              >
                <span>⌫</span>
                <span>Delete user</span>
              </button>

              <button
                type="button"
                className={`${classes.menuItem} ${classes.danger}`}
                onClick={handleLogout}
              >
                <span>⇥</span>
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
