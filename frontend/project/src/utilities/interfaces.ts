export interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  imgs?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserType {
  _id?: string;
  id?: string | number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  products?: ProductType[];
}

export interface RegisterUserType {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginUserType {
  username: string;
  password: string;
}

export interface RegisterInputType {
  name: keyof RegisterUserType;
  type: "text" | "email" | "password";
  label: string;
  placeholder: string;
}

export interface LoginInputType {
  name: keyof LoginUserType;
  type: "text" | "email" | "password";
  label: string;
  placeholder: string;
}

export interface UpdaterUserType {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserInputType {
  name: keyof UpdaterUserType;
  type: "text" | "email" | "password";
  label: string;
  placeholder?: string;
}

export interface ProductsType {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imgs: string[];
}
