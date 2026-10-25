import type {
  LoginInputType,
  RegisterInputType,
  UpdateUserInputType,
} from "./interfaces";

const registerFields = [
  { name: "firstName", type: "text", label: "First Name" },
  { name: "lastName", type: "text", label: "Last Name" },
  { name: "username", type: "text", label: "Username" },
  { name: "email", type: "email", label: "Email" },
  { name: "password", type: "password", label: "Password" },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
  },
] satisfies Omit<RegisterInputType, "placeholder">[];

export const registerInputs: RegisterInputType[] = registerFields.map(
  (input) => ({
    ...input,
    placeholder:
      input.name === "confirmPassword"
        ? "Please confirm your password"
        : `Please enter your ${input.label}`,
  }),
);

const loginFields = [
  { name: "username", type: "text", label: "Username" },
  { name: "password", type: "password", label: "Password" },
] satisfies Omit<LoginInputType, "placeholder">[];

export const logInputs: LoginInputType[] = loginFields.map((input) => ({
  ...input,
  placeholder: `Please enter your ${input.label}`,
}));

const updateUserFields = [
  { name: "firstName", type: "text", label: "First Name" },
  { name: "lastName", type: "text", label: "Last Name" },
  { name: "username", type: "text", label: "Username" },
  { name: "email", type: "email", label: "Email" },
  { name: "password", type: "password", label: "Password" },
] satisfies Omit<UpdateUserInputType, "placeholder">[];

export const updateUserInputs: UpdateUserInputType[] = updateUserFields.map(
  (input) => ({
    ...input,
    placeholder: `Please enter your ${input.label}`,
  }),
);
