/* import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUseStyles } from "react-jss";
import type { RootState } from "../../../store/store";

const useStyles = createUseStyles({
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "48px 24px",
    color: "#252525",
  },
  backLink: {
    display: "inline-block",
    marginBottom: 28,
    color: "#555",
    textDecoration: "none",
    "&:hover": { color: "#000" },
  },
  product: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: 48,
    alignItems: "start",
    "@media (max-width: 700px)": {
      gridTemplateColumns: "1fr",
      gap: 24,
    },
  },
  imageContainer: {
    minHeight: 320,
    background: "#f5f3ef",
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    maxHeight: 550,
    objectFit: "contain",
    display: "block",
  },
  noImage: {
    padding: 40,
    color: "#777",
    textAlign: "center",
  },
  details: { paddingTop: 12 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: 700,
    color: "#777",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "clamp(28px, 4vw, 42px)",
    lineHeight: 1.15,
    margin: "16px 0",
  },
  price: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#666",
    whiteSpace: "pre-wrap",
  },
  cartSection: {
    marginTop: 32,
    padding: 24,
    background: "#f8f7f4",
    borderRadius: 16,
  },
  cartHeading: {
    fontSize: 22,
    marginTop: 0,
    marginBottom: 24,
  },
  quantityRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  quantityButton: {
    width: 42,
    height: 42,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    fontSize: 24,
    cursor: "pointer",
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
  quantity: {
    fontSize: 20,
    fontWeight: 700,
    minWidth: 24,
    textAlign: "center",
  },
  cartButton: {
    width: "100%",
    padding: "16px 24px",
    background: "#252525",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    "&:hover": { background: "#444" },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
  },
  cartMessage: {
    marginTop: 16,
    color: "#267344",
    fontWeight: 600,
  },
  cartSummary: {
    borderTop: "1px solid #ddd",
    marginTop: 28,
    paddingTop: 24,
  },
  message: {
    textAlign: "center",
    padding: "80px 20px",
  },
  error: { color: "#b42318" },
});

export default function ProductByIdPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const { product } = useSelector((state: RootState) => state.productSlice);

  const loading = useSelector(
    (state: RootState) => state.loadingSlice.isLoading,
  );

  const { error } = useSelector((state: RootState) => state.loadingSlice);

  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    if (id) {
      dispatch({
        type: "FETCH-PRODUCT-BY-ID",
        payload: id,
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    setQuantity(1);
    setCartQuantity(0);
    setAddedToCart(false);
    setCartError("");
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const totalPrice = product ? product.price * quantity : 0;
  const cartTotal = product ? product.price * cartQuantity : 0;

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
    setAddedToCart(false);
    setCartError("");
  };

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
    setAddedToCart(false);
    setCartError("");
  };

  const handleAddToCart = () => {
    if (!product) {return;}

    setAddedToCart(false);
    setCartError("");

    dispatch({
      type: "ADD-USER-PRODUCT",
      payload: {
        productId: product._id,
        quantity,
      },
    });
  };

  if (loading && !product) {
    return (
      <main className={classes.page}>
        <div className={classes.message} role="status">
          Loading product...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={classes.page}>
        <div className={classes.message} role="alert">
          <h2>Product unavailable</h2>
          <p className={classes.error}>
            {error || "We couldn't find this product."}
          </p>
          <Link to="/products">Back to products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={classes.page}>
      <Link to="/products" className={classes.backLink}>
        ← Back to products
      </Link>

      <section className={classes.product}>
        <div className={classes.imageContainer}>
          {product.imgs?.[0] ? (
            <img
              className={classes.image}
              src={product.imgs[0]}
              alt={product.name}
            />
          ) : (
            <div className={classes.noImage}>No image available</div>
          )}
        </div>

        <div className={classes.details}>
          <span className={classes.eyebrow}>Product details</span>

          <h1 className={classes.title}>{product.name}</h1>

          <p className={classes.price}>{formatPrice(product.price)}</p>

          <p className={classes.description}>
            {product.description || "No description available."}
          </p>

          <div className={classes.cartSection}>
            <h2 className={classes.cartHeading}>Add to cart</h2>

            <div className={classes.quantityRow}>
              <button
                type="button"
                className={classes.quantityButton}
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className={classes.quantity} aria-live="polite">
                {quantity}
              </span>

              <button
                type="button"
                className={classes.quantityButton}
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className={classes.total}>
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <button
              type="button"
              className={classes.cartButton}
              onClick={handleAddToCart}
            >
              Add {quantity} to cart
            </button>

            {addedToCart && (
              <p className={classes.cartMessage} role="status">
                Added {quantity} {quantity === 1 ? "item" : "items"} to cart.
              </p>
            )}

            {cartError && (
              <p className={classes.error} role="alert">
                {cartError}
              </p>
            )}

            <div className={classes.cartSummary}>
              <div className={classes.total}>
                <span>Items in cart</span>
                <span>{cartQuantity}</span>
              </div>

              <div className={classes.total}>
                <span>Cart total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
 */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUseStyles } from "react-jss";
import type { RootState } from "../../../store/store";

const useStyles = createUseStyles({
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "48px 24px",
    color: "#252525",
  },
  backLink: {
    display: "inline-block",
    marginBottom: 28,
    color: "#555",
    textDecoration: "none",
    "&:hover": { color: "#000" },
  },
  product: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: 48,
    alignItems: "start",
    "@media (max-width: 700px)": {
      gridTemplateColumns: "1fr",
      gap: 24,
    },
  },
  imageContainer: {
    minHeight: 320,
    background: "#f5f3ef",
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    maxHeight: 550,
    objectFit: "contain",
    display: "block",
  },
  noImage: {
    padding: 40,
    color: "#777",
    textAlign: "center",
  },
  details: { paddingTop: 12 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: 700,
    color: "#777",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "clamp(28px, 4vw, 42px)",
    lineHeight: 1.15,
    margin: "16px 0",
  },
  price: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#666",
    whiteSpace: "pre-wrap",
  },
  cartSection: {
    marginTop: 32,
    padding: 24,
    background: "#f8f7f4",
    borderRadius: 16,
  },
  cartHeading: {
    fontSize: 22,
    marginTop: 0,
    marginBottom: 24,
  },
  quantityRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  quantityButton: {
    width: 42,
    height: 42,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    fontSize: 24,
    cursor: "pointer",
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
  quantity: {
    fontSize: 20,
    fontWeight: 700,
    minWidth: 24,
    textAlign: "center",
  },
  cartButton: {
    width: "100%",
    padding: "16px 24px",
    background: "#252525",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    "&:hover": { background: "#444" },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
  },
  cartMessage: {
    marginTop: 16,
    color: "#267344",
    fontWeight: 600,
  },
  cartSummary: {
    borderTop: "1px solid #ddd",
    marginTop: 28,
    paddingTop: 24,
  },
  message: {
    textAlign: "center",
    padding: "80px 20px",
  },
  error: { color: "#b42318" },
});

export default function ProductByIdPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const { product } = useSelector((state: RootState) => state.productSlice);

  const loading = useSelector(
    (state: RootState) => state.loadingSlice.isLoading,
  );

  const { error } = useSelector((state: RootState) => state.loadingSlice);

  const [quantity, setQuantity] = useState(1);
  const [cartQuantity] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState("");

  // Fetch the product whenever its URL ID changes.
  useEffect(() => {
    if (id) {
      dispatch({
        type: "FETCH-PRODUCT-BY-ID",
        payload: id,
      });
    }
  }, [dispatch, id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const totalPrice = product ? product.price * quantity : 0;
  const cartTotal = product ? product.price * cartQuantity : 0;

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
    setAddedToCart(false);
    setCartError("");
  };

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
    setAddedToCart(false);
    setCartError("");
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    setAddedToCart(false);
    setCartError("");

    dispatch({
      type: "ADD-USER-PRODUCT",
      payload: {
        productId: product._id,
        quantity,
      },
    });
  };

  if (loading && !product) {
    return (
      <main className={classes.page}>
        <div className={classes.message} role="status">
          Loading product...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={classes.page}>
        <div className={classes.message} role="alert">
          <h2>Product unavailable</h2>
          <p className={classes.error}>
            {error || "We couldn't find this product."}
          </p>
          <Link to="/products">Back to products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={classes.page}>
      <Link to="/products" className={classes.backLink}>
        ← Back to products
      </Link>

      <section className={classes.product}>
        <div className={classes.imageContainer}>
          {product.imgs?.[0] ? (
            <img
              className={classes.image}
              src={product.imgs[0]}
              alt={product.name}
            />
          ) : (
            <div className={classes.noImage}>No image available</div>
          )}
        </div>

        <div className={classes.details}>
          <span className={classes.eyebrow}>Product details</span>

          <h1 className={classes.title}>{product.name}</h1>

          <p className={classes.price}>{formatPrice(product.price)}</p>

          <p className={classes.description}>
            {product.description || "No description available."}
          </p>

          <div className={classes.cartSection}>
            <h2 className={classes.cartHeading}>Add to cart</h2>

            <div className={classes.quantityRow}>
              <button
                type="button"
                className={classes.quantityButton}
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className={classes.quantity} aria-live="polite">
                {quantity}
              </span>

              <button
                type="button"
                className={classes.quantityButton}
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className={classes.total}>
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <button
              type="button"
              className={classes.cartButton}
              onClick={handleAddToCart}
            >
              Add {quantity} to cart
            </button>

            {addedToCart && (
              <p className={classes.cartMessage} role="status">
                Added {quantity} {quantity === 1 ? "item" : "items"} to cart.
              </p>
            )}

            {cartError && (
              <p className={classes.error} role="alert">
                {cartError}
              </p>
            )}

            <div className={classes.cartSummary}>
              <div className={classes.total}>
                <span>Items in cart</span>
                <span>{cartQuantity}</span>
              </div>

              <div className={classes.total}>
                <span>Cart total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
