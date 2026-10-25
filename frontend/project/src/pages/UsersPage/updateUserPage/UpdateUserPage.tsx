import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";

import type { AppDispatch, RootState } from "../../../store/store";
import type { NavbarUser } from "../../Navigation/Navbar";

const useStyles = createUseStyles({
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "#f3f4f6",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    padding: 32,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
    "@media (max-width: 500px)": {
      padding: 22,
    },
  },
  title: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: 26,
  },
  subtitle: {
    margin: "0 0 24px",
    color: "#6b7280",
    fontSize: 14,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    marginBottom: 17,
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 15,
    boxSizing: "border-box",
    "&:focus": {
      outline: "2px solid #93c5fd",
      borderColor: "#2563eb",
    },
  },
  hint: {
    color: "#6b7280",
    fontSize: 12,
  },
  error: {
    color: "#b91c1c",
    background: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  success: {
    color: "#166534",
    background: "#dcfce7",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 13,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
  },
  save: {
    background: "#2563eb",
    color: "#fff",
    "&:hover": {
      background: "#1d4ed8",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  cancel: {
    background: "#e5e7eb",
    color: "#111827",
  },
});

interface UpdateForm {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function UpdateUserPage() {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(
    (state: RootState) => state.userSlice.user,
  ) as NavbarUser | null;

  const { isLoading, error, isSuccess } = useSelector(
    (state: RootState) => state.loadingSlice,
  );

  const [form, setForm] = useState<UpdateForm>({
    username: user?.userInfo.username ?? "",
    firstName: user?.userInfo.firstName ?? "",
    lastName: user?.userInfo.lastName ?? "",
    email: user?.userInfo.email ?? "",
    password: "",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!user?.token) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/", { replace: true });
    }
  }, [isSuccess, navigate]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (!user?.token) {
      navigate("/login");
      return;
    }

    const id = user.userInfo.id ?? user.userInfo._id;

    if (!id) {
      setValidationError("Your user ID is missing. Please log in again.");
      return;
    }

    if (form.username.trim().length < 3 || form.username.trim().length > 30) {
      setValidationError("Username must be between 3 and 30 characters.");
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setValidationError("First name and last name are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (form.password && form.password.length < 4) {
      setValidationError("Password must be at least 4 characters.");
      return;
    }

    // Only send fields that the user wants to update.
    const userPayload: {
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    } = {
      username: form.username.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
    };

    if (form.password) {
      userPayload.password = form.password;
    }

    dispatch({
      type: "FETCH-UPDATE-USER",
      payload: {
        id: String(id),
        token: user.token,
        userPayload,
      },
    });
  }

  return (
    <main className={classes.page}>
      <section className={classes.card}>
        <h1 className={classes.title}>Update your profile</h1>
        <p className={classes.subtitle}>Change your account details below.</p>

        {validationError && (
          <div className={classes.error} role="alert">
            {validationError}
          </div>
        )}

        {error && (
          <div className={classes.error} role="alert">
            {String(error)}
          </div>
        )}

        {isSuccess && (
          <div className={classes.success} role="status">
            Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={classes.field}>
            <label className={classes.label} htmlFor="username">
              Username
            </label>
            <input
              className={classes.input}
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              minLength={3}
              maxLength={30}
              required
            />
          </div>

          <div className={classes.field}>
            <label className={classes.label} htmlFor="firstName">
              First name
            </label>
            <input
              className={classes.input}
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={classes.field}>
            <label className={classes.label} htmlFor="lastName">
              Last name
            </label>
            <input
              className={classes.input}
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={classes.field}>
            <label className={classes.label} htmlFor="email">
              Email
            </label>
            <input
              className={classes.input}
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={classes.field}>
            <label className={classes.label} htmlFor="password">
              New password
            </label>
            <input
              className={classes.input}
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={4}
              autoComplete="new-password"
            />
            <span className={classes.hint}>
              Leave blank to keep your current password.
            </span>
          </div>

          <div className={classes.actions}>
            <button
              type="button"
              className={`${classes.button} ${classes.cancel}`}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`${classes.button} ${classes.save}`}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
