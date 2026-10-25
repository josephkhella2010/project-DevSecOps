import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUseStyles } from "react-jss";

import type { AppDispatch, RootState } from "../../../store/store";

const useStyles = createUseStyles({
  page: {
    minHeight: "100vh",
    padding: "48px 24px",
    background: "#f8fafc",
    boxSizing: "border-box",
    "@media (max-width: 480px)": {
      padding: "28px 14px",
    },
  },

  container: {
    width: "100%",
    maxWidth: 900,
    margin: "0 auto",
  },

  header: {
    marginBottom: 28,
  },

  title: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: 30,
    fontWeight: 800,
    lineHeight: 1.3,
    "@media (max-width: 480px)": {
      fontSize: 26,
    },
  },

  subtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 1.6,
  },

  card: {
    padding: 32,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
    "@media (max-width: 480px)": {
      padding: 20,
      borderRadius: 12,
    },
  },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 18,
    paddingBottom: 28,
    marginBottom: 28,
    borderBottom: "1px solid #e5e7eb",
    minWidth: 0,
  },

  avatar: {
    width: 72,
    height: 72,
    minWidth: 72,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e0e7ff",
    color: "#4338ca",
    fontSize: 24,
    fontWeight: 800,
    border: "3px solid #c7d2fe",
  },

  profileText: {
    minWidth: 0,
  },

  name: {
    margin: "0 0 6px",
    color: "#111827",
    fontSize: 23,
    fontWeight: 750,
    lineHeight: 1.4,
    overflowWrap: "anywhere",
    "@media (max-width: 480px)": {
      fontSize: 19,
    },
  },

  username: {
    margin: 0,
    color: "#6b7280",
    fontSize: 14,
    overflowWrap: "anywhere",
  },

  sectionTitle: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: 18,
    fontWeight: 750,
  },

  sectionDescription: {
    margin: "0 0 16px",
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 1.6,
  },

  details: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: 0,
    padding: "18px 0",
    borderBottom: "1px solid #f1f5f9",
    textTransform: "capitalize",
    "&:last-child": {
      borderBottom: "none",
    },
  },

  label: {
    display: "block",
    marginBottom: 8,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.6px",
    textTransform: "uppercase",
  },

  value: {
    margin: 0,
    color: "#111827",
    fontSize: 15,
    lineHeight: 1.7,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },

  idValue: {
    color: "#64748b",
    fontSize: 13,
    fontFamily: "monospace",
  },

  footer: {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: 28,
    paddingTop: 22,
    borderTop: "1px solid #e5e7eb",
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 18px",
    borderRadius: 9,
    background: "#4f46e5",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
    transition: "background 0.2s ease",
    "&:hover": {
      background: "#4338ca",
    },
    "&:focus-visible": {
      outline: "3px solid #a5b4fc",
      outlineOffset: 3,
    },
  },

  message: {
    padding: 24,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    color: "#4b5563",
    fontSize: 15,
    lineHeight: 1.7,
    textAlign: "left",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
  },

  error: {
    color: "#b91c1c",
    background: "#fef2f2",
    border: "1px solid #fecaca",
  },
});

export default function UserByIdPage() {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const loggedInUser = useSelector((state: RootState) => state.userSlice.user);

  const userById = useSelector((state: RootState) => state.userSlice.userById);

  const { isLoading, error } = useSelector(
    (state: RootState) => state.loadingSlice,
  );

  useEffect(() => {
    if (id && loggedInUser?.token) {
      dispatch({
        type: "FETCH-USER-BY-ID",
        payload: {
          id,
          token: loggedInUser.token,
        },
      });
    }
  }, [id, loggedInUser?.token, dispatch]);

  const fetchedUserId = userById
    ? String(userById._id ?? userById.id ?? "")
    : "";

  const isCorrectUser = Boolean(
    userById && fetchedUserId && fetchedUserId === id,
  );

  if (isLoading && !isCorrectUser) {
    return (
      <main className={classes.page}>
        <div className={classes.container}>
          <p className={classes.message}>Loading user information...</p>
        </div>
      </main>
    );
  }

  if (error && !isCorrectUser) {
    return (
      <main className={classes.page}>
        <div className={classes.container}>
          <header className={classes.header}>
            <h1 className={classes.title}>User information</h1>
            <p className={classes.subtitle}>
              We could not load your account details.
            </p>
          </header>

          <p className={`${classes.message} ${classes.error}`}>
            {String(error)}
          </p>

          <div className={classes.footer}>
            <Link to="/" className={classes.backLink}>
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!isCorrectUser) {
    return (
      <main className={classes.page}>
        <div className={classes.container}>
          <header className={classes.header}>
            <h1 className={classes.title}>User information</h1>
            <p className={classes.subtitle}>View your account details.</p>
          </header>

          <p className={classes.message}>User information not found.</p>

          <div className={classes.footer}>
            <Link to="/" className={classes.backLink}>
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Explicit null check: TypeScript now knows userById is not null.
  if (!userById) {
    return null;
  }

  const fullName =
    [userById.firstName, userById.lastName].filter(Boolean).join(" ") ||
    userById.username ||
    "User";

  const initials =
    `${userById.firstName?.[0] ?? ""}${userById.lastName?.[0] ?? ""}`.toUpperCase() ||
    userById.username?.[0]?.toUpperCase() ||
    "?";

  const fields = [
    { label: "First name", value: userById.firstName },
    { label: "Last name", value: userById.lastName },
    { label: "Username", value: userById.username },
    { label: "Email address", value: userById.email },
  ];

  return (
    <main className={classes.page}>
      <div className={classes.container}>
        <header className={classes.header}>
          <h1 className={classes.title}>User information</h1>
          <p className={classes.subtitle}>
            View your profile and account details.
          </p>
        </header>

        <section className={classes.card}>
          <div className={classes.profileHeader}>
            <div className={classes.avatar} aria-hidden="true">
              {initials}
            </div>

            <div className={classes.profileText}>
              <h2 className={classes.name}>{fullName}</h2>
            </div>
          </div>

          <section aria-labelledby="account-details-title">
            <h3 id="account-details-title" className={classes.sectionTitle}>
              Account details
            </h3>

            <p className={classes.sectionDescription}>
              Personal information associated with this account.
            </p>

            <div className={classes.details}>
              {fields.map((field) => (
                <div className={classes.field} key={field.label}>
                  <span className={classes.label}>{field.label}</span>

                  <p className={classes.value}>
                    {field.value || "Not provided"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className={classes.footer}>
            <Link to="/" className={classes.backLink}>
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
