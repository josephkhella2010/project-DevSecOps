import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUseStyles } from "react-jss";
import type { AppDispatch,RootState } from "../../../store/store";

interface LoginFormType {
  login: string;
  password: string;
}

const useStyles = createUseStyles({
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #eef2ff 0%, #f8fafc 55%, #e0f2fe 100%)",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: 430,
    padding: 40,
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.09)",
  },

  heading: {
    textAlign: "center",
    marginBottom: 32,
    "& h1": {
      margin: "0 0 10px",
      color: "#111827",
      fontSize: 28,
      letterSpacing: "-0.8px",
    },
    "& p": {
      margin: 0,
      color: "#6b7280",
      fontSize: 14,
      lineHeight: 1.6,
    },
  },

  logo: {
    display: "grid",
    placeItems: "center",
    width: 54,
    height: 54,
    margin: "0 auto 20px",
    borderRadius: 16,
    background: "#4f46e5",
    color: "#fff",
    fontSize: 28,
    fontWeight: 800,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    "& label": {
      color: "#374151",
      fontSize: 14,
      fontWeight: 600,
    },
    "& input": {
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      padding: "13px 14px",
      border: "1px solid #d1d5db",
      borderRadius: 10,
      outline: "none",
      background: "#fff",
      color: "#111827",
      font: "inherit",
      fontSize: 14,
      transition: "border-color 0.2s, box-shadow 0.2s",
      "&::placeholder": {
        color: "#9ca3af",
      },
      "&:focus": {
        borderColor: "#6366f1",
        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
      },
    },
  },

  passwordWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingRight: 12,
    border: "1px solid #d1d5db",
    borderRadius: 10,
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:focus-within": {
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
    },
    "& input": {
      flex: 1,
      minWidth: 0,
      border: "none",
      boxShadow: "none",
      "&:focus": {
        border: "none",
        boxShadow: "none",
      },
    },
  },

  passwordToggle: {
    flexShrink: 0,
    padding: "6px 0",
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  },

  error: {
    margin: "-4px 0 0",
    color: "#dc2626",
    fontSize: 13,
    lineHeight: 1.5,
  },

  submit: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 10,
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 700,
    transition: "background 0.2s, transform 0.2s",
    "&:hover:not(:disabled)": {
      background: "#4338ca",
      transform: "translateY(-1px)",
    },
    "&:focus-visible": {
      outline: "3px solid #a5b4fc",
      outlineOffset: 3,
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.65,
    },
  },

  registerPrompt: {
    margin: "26px 0 0",
    textAlign: "center",
    color: "#6b7280",
    fontSize: 13,
    "& a": {
      color: "#4f46e5",
      fontWeight: 700,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },

  "@media (max-width: 480px)": {
    page: {
      padding: 16,
    },
    card: {
      padding: "28px 22px",
      borderRadius: 16,
    },
    heading: {
      "& h1": {
        fontSize: 25,
      },
    },
  },
});

export default function LoginPage() {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, error, isSuccess } = useSelector(
    (state: RootState) => state.loadingSlice,
  );

  const [form, setForm] = useState<LoginFormType>({
    login: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.login.trim() || !form.password) {
      setValidationError("Please enter your username/email and password.");
      return;
    }

    setValidationError("");

    dispatch({
      type: "FETCH-LOGIN-USER",
      payload: {
        login: form.login.trim(),
        password: form.password,
      },
    });
  }

  return (
    <main className={classes.page}>
      <section className={classes.card}>
        <div className={classes.heading}>
          <div className={classes.logo} aria-hidden="true">
            L
          </div>

          <h1>Welcome back</h1>
          <p>Sign in to continue to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.field}>
            <label htmlFor="login">Username or email</label>
            <input
              id="login"
              name="login"
              type="text"
              placeholder="Enter your username or email"
              value={form.login}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className={classes.field}>
            <label htmlFor="password">Password</label>

            <div className={classes.passwordWrapper}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                className={classes.passwordToggle}
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {(validationError || error) && (
            <p className={classes.error} role="alert">
              {validationError || error}
            </p>
          )}

          <button className={classes.submit} type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={classes.registerPrompt}>
          Don&apos;t have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
