import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUseStyles } from "react-jss";

import { registerInputs } from "../../../utilities/arrays";
import type { RegisterUserType } from "../../../utilities/interfaces";
import type { RootState } from "../../../store/store";

type RegisterForm = RegisterUserType & {
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const useStyles = createUseStyles({
  container: {
    width: "100%",
    maxWidth: "430px",
    margin: "40px auto",
    padding: "28px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
  },
  title: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#222",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: 600,
    color: "#333",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    "&:focus": {
      outline: "none",
      borderColor: "#2563eb",
    },
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  error: {
    color: "#b91c1c",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  success: {
    color: "#166534",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
  },
});

const RegisterPage: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const loading = useSelector(
    (state: RootState) => state.loadingSlice.isLoading,
  );

  const reduxError = useSelector(
    (state: RootState) => state.loadingSlice.error,
  );

  const isSuccess = useSelector(
    (state: RootState) => state.loadingSlice.isSuccess,
  );

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [validationError, setValidationError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setValidationError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 4) {
      setValidationError("Password must be at least 4 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    const { confirmPassword, ...payload } = form;
    void confirmPassword;

    dispatch({
      type: "FETCH-REGISTER-USER",
      payload,
    });
  };

  const fields = [
    ...registerInputs.filter((input) => input.name !== "confirmPassword"),
  ];

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Create an Account</h2>

      <form onSubmit={handleSubmit} noValidate>
        {validationError && (
          <div className={classes.error} role="alert">
            {validationError}
          </div>
        )}

        {reduxError && (
          <div className={classes.error} role="alert">
            {reduxError}
          </div>
        )}

        {isSuccess && !reduxError && (
          <div className={classes.success} role="status">
            Registration successful!
          </div>
        )}

        {fields.map((input) => (
          <div className={classes.field} key={input.name}>
            <label className={classes.label} htmlFor={input.name}>
              {input.label}
            </label>

            <input
              className={classes.input}
              id={input.name}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder}
              value={form[input.name]}
              onChange={handleChange}
              autoComplete={
                input.name === "password"
                  ? "new-password"
                  : input.name === "email"
                    ? "email"
                    : input.name === "username"
                      ? "username"
                      : "off"
              }
              required
              aria-invalid={Boolean(validationError || reduxError)}
            />
          </div>
        ))}

        <div className={classes.field}>
          <label className={classes.label} htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            className={classes.input}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Please confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
            aria-invalid={Boolean(validationError)}
          />
        </div>

        <button className={classes.button} type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
