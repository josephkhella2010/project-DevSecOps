import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUseStyles } from "react-jss";

import type { AppDispatch, RootState } from "../../../store/store";
import { Link } from "react-router-dom";

const useStyles = createUseStyles({
  productsPage: {
    "--ink": "#20231f",
    "--muted": "#777b72",
    "--accent": "#65765b",
    "--paper": "#f8f8f4",
    "--border": "#e8e9e1",
    minHeight: "100vh",
    background: "var(--paper)",
    color: "var(--ink)",
    fontFamily: 'Inter, "Segoe UI", sans-serif',
    "& *": {
      boxSizing: "border-box",
    },
  },

  productsHero: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 32,
    minHeight: 390,
    padding: "64px clamp(24px, 7vw, 100px)",
    overflow: "hidden",
    background: "#e9ede2",
    borderRadius: "0 0 28px 28px",
  },

  productsHeroContent: {
    position: "relative",
    zIndex: 1,
    maxWidth: 570,
  },

  productsEyebrow: {
    display: "inline-block",
    color: "var(--accent)",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 2.3,
  },

  productsHeroTitle: {
    margin: "22px 0 18px",
    fontSize: "clamp(42px, 6vw, 76px)",
    lineHeight: 1.03,
    letterSpacing: -3.5,
    fontWeight: 750,
    "& span": {
      color: "var(--accent)",
    },
  },

  productsHeroDescription: {
    maxWidth: 410,
    margin: 0,
    color: "#676d61",
    fontSize: 15,
    lineHeight: 1.8,
  },

  productsHeroButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 24,
    marginTop: 28,
    padding: "14px 20px",
    borderRadius: 8,
    background: "var(--ink)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 650,
    textDecoration: "none",
    transition: "transform 180ms ease, background 180ms ease",
    "&:hover": {
      transform: "translateY(-2px)",
      background: "var(--accent)",
    },
  },

  productsHeroDecoration: {
    position: "relative",
    flex: "0 1 350px",
    alignSelf: "stretch",
    minHeight: 240,
  },

  decorationCircle: {
    position: "absolute",
    display: "block",
    border: "1px solid rgba(101, 118, 91, 0.3)",
    borderRadius: "50%",
  },

  circleOne: {
    width: 290,
    height: 290,
    top: "50%",
    right: 0,
    transform: "translateY(-50%)",
    background: "rgba(255, 255, 255, 0.23)",
  },

  circleTwo: {
    width: 210,
    height: 210,
    top: "50%",
    right: 40,
    transform: "translateY(-50%)",
    background: "rgba(101, 118, 91, 0.08)",
  },

  decorationLabel: {
    position: "absolute",
    right: 0,
    bottom: 10,
    color: "#65765b",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 2,
    whiteSpace: "nowrap",
  },

  productsCatalog: {
    maxWidth: 1440,
    margin: "0 auto",
    padding: "76px clamp(24px, 7vw, 100px) 88px",
  },

  productsHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 24,
    marginBottom: 32,
    "& h2": {
      margin: "10px 0 6px",
      fontSize: "clamp(30px, 4vw, 42px)",
      letterSpacing: -1.6,
    },
    "& p": {
      margin: 0,
      color: "var(--muted)",
      fontSize: 14,
    },
  },

  productsSearch: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "min(100%, 300px)",
    padding: "0 15px",
    border: "1px solid var(--border)",
    borderRadius: 10,
    background: "#fff",
    color: "var(--muted)",
    "& > span": {
      fontSize: 25,
    },
    "& input": {
      width: "100%",
      minWidth: 0,
      padding: "14px 0",
      border: "none",
      outline: "none",
      background: "transparent",
      color: "var(--ink)",
      font: "inherit",
      fontSize: 13,
    },
    "&:focus-within": {
      borderColor: "var(--accent)",
      boxShadow: "0 0 0 3px rgba(101, 118, 91, 0.1)",
    },
  },

  productsResults: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    color: "var(--muted)",
    fontSize: 12,
  },

  productsClearSearch: {
    border: "none",
    background: "transparent",
    color: "var(--accent)",
    font: "inherit",
    fontWeight: 700,
    cursor: "pointer",
  },

  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 24,
    scrollMarginTop: 24,
  },

  productCard: {
    minWidth: 0,
    overflow: "hidden",
    border: "1px solid var(--border)",
    borderRadius: 14,
    background: "#fff",
    transition: "transform 200ms ease, box-shadow 200ms ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 16px 35px rgba(32, 35, 31, 0.08)",
    },
    "&:hover $productImage": {
      transform: "scale(1.045)",
    },
  },

  productImageWrap: {
    position: "relative",
    display: "grid",
    aspectRatio: "4 / 3",
    overflow: "hidden",
    placeItems: "center",
    background: "#eeefe9",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 350ms ease",
  },

  productImageTag: {
    position: "absolute",
    top: 14,
    left: 14,
    padding: "7px 10px",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    borderRadius: 5,
    background: "rgba(255, 255, 255, 0.9)",
    color: "var(--ink)",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 1.2,
  },

  productNoImage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    color: "var(--muted)",
    fontSize: 12,
    "& span:first-child": {
      fontSize: 48,
    },
  },

  productCardContent: {
    padding: 20,
  },

  productCardTop: {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    gap: 12,
    "& h3": {
      margin: 0,
      fontSize: 17,
      lineHeight: 1.45,
      overflowWrap: "anywhere",
    },
  },

  productPrice: {
    flexShrink: 0,
    color: "var(--accent)",
    fontSize: 15,
    fontWeight: 800,
  },

  productDescription: {
    display: "-webkit-box",
    minHeight: 42,
    margin: "12px 0 18px",
    overflow: "hidden",
    color: "var(--muted)",
    fontSize: 13,
    lineHeight: 1.65,
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },

  productDetailsButton: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "13px 0 0",
    border: "none",
    borderTop: "1px solid var(--border)",
    background: "transparent",
    color: "var(--ink)",
    font: "inherit",
    fontSize: 12,
    fontWeight: 750,
    cursor: "pointer",
    "& span": {
      fontSize: 18,
      transition: "transform 180ms ease",
    },
    "&:hover": {
      color: "var(--accent)",
    },
    "&:hover span": {
      transform: "translate(3px, -3px)",
    },
  },

  productsMessage: {
    display: "flex",
    minHeight: 240,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    "& p": {
      color: "var(--muted)",
      fontSize: 14,
      lineHeight: 1.7,
    },
  },

  productsErrorTitle: {
    marginBottom: 0,
  },

  productsActionButton: {
    marginTop: 10,
    padding: "11px 16px",
    border: "none",
    borderRadius: 7,
    background: "var(--ink)",
    color: "#fff",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
    "&:hover": {
      background: "var(--accent)",
    },
  },

  productsEmptyIcon: {
    color: "var(--accent)",
    fontSize: 42,
  },

  productsSpinner: {
    width: 34,
    height: 34,
    border: "3px solid #e1e5db",
    borderTopColor: "var(--accent)",
    borderRadius: "50%",
    animation: "$spin 750ms linear infinite",
  },

  "@keyframes spin": {
    to: {
      transform: "rotate(360deg)",
    },
  },

  productsFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "24px clamp(24px, 7vw, 100px)",
    borderTop: "1px solid var(--border)",
    color: "var(--muted)",
    fontSize: 10,
    letterSpacing: 0.7,
    "& span:first-child": {
      color: "var(--ink)",
      fontWeight: 800,
      letterSpacing: 1.5,
    },
  },

  "@media (max-width: 1000px)": {
    productsGrid: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    productsHeroDecoration: {
      flexBasis: 240,
    },
    circleOne: {
      width: 230,
      height: 230,
    },
    circleTwo: {
      width: 160,
      height: 160,
      right: 35,
    },
  },

  "@media (max-width: 650px)": {
    productsHero: {
      minHeight: "auto",
      padding: "55px 24px",
    },
    productsHeroTitle: {
      letterSpacing: -2,
    },
    productsHeroDecoration: {
      display: "none",
    },
    productsCatalog: {
      padding: "52px 20px 60px",
    },
    productsHeading: {
      alignItems: "stretch",
      flexDirection: "column",
    },
    productsSearch: {
      width: "100%",
    },
    productsGrid: {
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: 18,
    },
    productImageWrap: {
      aspectRatio: "5 / 3",
    },
    productsFooter: {
      alignItems: "start",
      flexDirection: "column",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    productsPage: {
      "& *": {
        animationDuration: "0.01ms !important",
        transitionDuration: "0.01ms !important",
      },
    },
  },
});

export default function ProductsPage() {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");

  const { products } = useSelector((state: RootState) => state.productSlice);

  const loading = useSelector(
    (state: RootState) => state.loadingSlice.isLoading,
  );

  const error = useSelector((state: RootState) => state.loadingSlice.error);

  useEffect(() => {
    dispatch({ type: "FETCH-PRODUCTS" });
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }, [products, search]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  return (
    <main className={classes.productsPage}>
      <section className={classes.productsHero}>
        <div className={classes.productsHeroContent}>
          <span className={classes.productsEyebrow}>OUR COLLECTION</span>

          <h1 className={classes.productsHeroTitle}>
            Find something
            <br />
            <span>you'll love.</span>
          </h1>

          <p className={classes.productsHeroDescription}>
            Explore our collection of products, thoughtfully selected for your
            everyday life.
          </p>

          <a className={classes.productsHeroButton} href="#product-grid">
            Explore products <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className={classes.productsHeroDecoration} aria-hidden="true">
          <span
            className={`${classes.decorationCircle} ${classes.circleOne}`}
          />
          <span
            className={`${classes.decorationCircle} ${classes.circleTwo}`}
          />
          <span className={classes.decorationLabel}>
            DISCOVER YOUR NEXT FAVORITE
          </span>
        </div>
      </section>

      <section className={classes.productsCatalog}>
        <div className={classes.productsHeading}>
          <div>
            <span className={classes.productsEyebrow}>THE CATALOG</span>
            <h2>All products</h2>
            <p>Discover something new.</p>
          </div>

          <label className={classes.productsSearch}>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />
          </label>
        </div>

        <div className={classes.productsResults}>
          <span>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </span>

          {search && (
            <button
              className={classes.productsClearSearch}
              onClick={() => setSearch("")}
              type="button"
            >
              Clear search ×
            </button>
          )}
        </div>

        {loading && (
          <div className={classes.productsMessage} role="status">
            <span className={classes.productsSpinner} />
            <p>Finding your favorites...</p>
          </div>
        )}

        {!loading && error && (
          <div className={classes.productsMessage} role="alert">
            <h3 className={classes.productsErrorTitle}>
              We couldn't load the products.
            </h3>
            <p>{error}</p>
            <button
              className={classes.productsActionButton}
              type="button"
              onClick={() => dispatch({ type: "FETCH-PRODUCTS" })}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className={classes.productsGrid} id="product-grid">
            {filteredProducts.map((product) => (
              <article className={classes.productCard} key={product._id}>
                <div className={classes.productImageWrap}>
                  {product.imgs?.[0] ? (
                    <img
                      className={classes.productImage}
                      src={product.imgs[0]}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className={classes.productNoImage}>
                      <span aria-hidden="true">◇</span>
                      <span>No image available</span>
                    </div>
                  )}

                  <span className={classes.productImageTag}>DISCOVER</span>
                </div>

                <div className={classes.productCardContent}>
                  <div className={classes.productCardTop}>
                    <h3>{product.name}</h3>
                    <span className={classes.productPrice}>
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <p className={classes.productDescription}>
                    {product.description ||
                      "A great addition to your collection."}
                  </p>

                  <Link
                    className={classes.productDetailsButton}
                    to={`/product/${product._id}`}
                  >
                    View product <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className={classes.productsMessage}>
            <span className={classes.productsEmptyIcon} aria-hidden="true">
              ⌕
            </span>
            <h3>No products found</h3>
            <p>
              {search
                ? "Try another search term."
                : "There are no products available yet."}
            </p>
            {search && (
              <button
                className={classes.productsActionButton}
                type="button"
                onClick={() => setSearch("")}
              >
                Show all products
              </button>
            )}
          </div>
        )}
      </section>

      <footer className={classes.productsFooter}>
        <span>GOOD FINDS. EVERY DAY.</span>
        <span>Made for discovering something new.</span>
      </footer>
    </main>
  );
}
