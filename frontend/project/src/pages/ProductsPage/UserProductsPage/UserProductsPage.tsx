import { useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import type { ProductsType } from "../../../utilities/interfaces.js";
import { setUserProducts } from "../../../store/reduxSlice/ProductSlice/ProductSlice.js";

interface User {
  _id?: string;
  id?: string;
  username?: string;
  products?: ProductsType[];
}

const useStyles = createUseStyles({
  page: {
    maxWidth: 1200,
    minHeight: "100vh",
    margin: "0 auto",
    padding: "48px 24px",
    color: "#252538",
    fontFamily: "Inter, system-ui, sans-serif",
    "@media (max-width: 600px)": {
      padding: "28px 16px",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 36,
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: "0 0 10px",
    color: "#7565e8",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
  },
  title: {
    margin: 0,
    fontSize: 42,
    fontWeight: 800,
    letterSpacing: "-1.5px",
    "@media (max-width: 600px)": {
      fontSize: 32,
    },
  },
  subtitle: {
    margin: "12px 0 0",
    color: "#818397",
    fontSize: 15,
    lineHeight: 1.6,
  },
  count: {
    padding: "10px 16px",
    border: "1px solid #e9e9f2",
    borderRadius: 30,
    background: "#fff",
    color: "#55566b",
    fontSize: 13,
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 24,
  },
  card: {
    overflow: "hidden",
    border: "1px solid #ececf4",
    borderRadius: 20,
    background: "#fff",
    boxShadow: "0 5px 22px rgba(32, 35, 56, 0.04)",
    transition: "transform 180ms ease, box-shadow 180ms ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 14px 32px rgba(32, 35, 56, 0.1)",
    },
  },
  imageWrap: {
    height: 220,
    position: "relative" as const,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    background: "#f0f1f8",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    transition: "transform 250ms ease",
    "$card:hover &": {
      transform: "scale(1.04)",
    },
  },
  placeholder: {
    color: "#9295a8",
    fontSize: 13,
  },
  quantityBadge: {
    position: "absolute" as const,
    top: 14,
    right: 14,
    padding: "8px 11px",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: 30,
    background: "rgba(255,255,255,0.95)",
    color: "#39354f",
    fontSize: 12,
    fontWeight: 700,
  },
  info: {
    padding: 20,
  },
  productName: {
    margin: 0,
    fontSize: 18,
    fontWeight: 750,
    letterSpacing: "-0.4px",
  },
  description: {
    display: "-webkit-box",
    minHeight: 42,
    margin: "10px 0 20px",
    overflow: "hidden",
    color: "#85889b",
    fontSize: 13,
    lineHeight: 1.6,
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": 2,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 16,
    borderTop: "1px solid #f0f0f5",
  },
  price: {
    color: "#6558dc",
    fontSize: 21,
    fontWeight: 800,
  },
  deleteButton: {
    padding: "9px 14px",
    border: "none",
    borderRadius: 10,
    background: "#fff0f1",
    color: "#c03950",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    "&:hover": {
      background: "#ffe0e3",
    },
  },
  empty: {
    padding: "80px 20px",
    border: "1px dashed #dcddec",
    borderRadius: 24,
    background: "#fff",
    textAlign: "center" as const,
  },
  emptyIcon: {
    display: "grid",
    width: 58,
    height: 58,
    margin: "0 auto 18px",
    placeItems: "center",
    borderRadius: 18,
    background: "#f0edff",
    color: "#7165e8",
    fontSize: 28,
  },
  emptyTitle: {
    margin: "0 0 10px",
    fontSize: 20,
  },
  emptyText: {
    color: "#777b90",
    fontSize: 14,
    lineHeight: 1.6,
  },
  message: {
    padding: 24,
    color: "#777b90",
    textAlign: "center" as const,
  },
  error: {
    color: "#c03950",
  },
});

export default function UserProductsPage() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const users = useSelector((state: RootState) => state.userSlice.users) as
    | User[]
    | undefined;

  const products = useSelector(
    (state: RootState) => state.productSlice.userProducts,
  );

  useEffect(() => {
    dispatch({ type: "Fetch-USERS" });
  }, [dispatch]);

  let userId: string | undefined;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      userId = parsedUser.userInfo?.id ?? parsedUser.userInfo?._id;
    }
  } catch {
    userId = undefined;
  }

  const currentUser = users?.find(
    (user) => String(user._id ?? user.id) === String(userId),
  );

  useEffect(() => {
    if (currentUser?.products) {
      dispatch(setUserProducts(currentUser.products));
    }
  }, [currentUser, dispatch]);

  const handleDelete = (productId: string) => {
    dispatch({
      type: "DELETE-USER-PRODUCT",
      payload: productId,
    });
  };

  if (!userId) {
    return (
      <main className={classes.page}>
        <p className={`${classes.message} ${classes.error}`}>
          Please log in to view your products.
        </p>
      </main>
    );
  }

  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <div>
          <p className={classes.eyebrow}>YOUR COLLECTION</p>
          <h1 className={classes.title}>My Products</h1>
          <p className={classes.subtitle}>
            Everything you&apos;ve added, all in one place.
          </p>
        </div>

        <div className={classes.count}>
          {products.length} {products.length === 1 ? "product" : "products"}
        </div>
      </header>

      {!users || !currentUser ? (
        <p className={classes.message}>Loading your products...</p>
      ) : products.length === 0 ? (
        <section className={classes.empty}>
          <div className={classes.emptyIcon}>✦</div>
          <h2 className={classes.emptyTitle}>Your collection is empty</h2>
          <p className={classes.emptyText}>
            Explore our products and add something you love.
          </p>
        </section>
      ) : (
        <section className={classes.grid}>
          {products.map((product: ProductsType) => (
            <article className={classes.card} key={product._id}>
              <div className={classes.imageWrap}>
                {product.imgs?.[0] ? (
                  <img
                    src={product.imgs[0]}
                    alt={product.name}
                    className={classes.image}
                  />
                ) : (
                  <div className={classes.placeholder}>No image available</div>
                )}

                <span className={classes.quantityBadge}>
                  Quantity: {product.quantity ?? 1}
                </span>
              </div>

              <div className={classes.info}>
                <h2 className={classes.productName}>{product.name}</h2>

                <p className={classes.description}>
                  {product.description || "No description available."}
                </p>

                <div className={classes.footer}>
                  <span className={classes.price}>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.price * (product.quantity ?? 1))}
                  </span>

                  <button
                    type="button"
                    className={classes.deleteButton}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
