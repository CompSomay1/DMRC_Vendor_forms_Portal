import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { LoginPage } from "./components/LoginPage";
import { RegistrationPage } from "./components/RegistrationPage";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LoginPage },
      { path: "register", Component: RegistrationPage },
      { path: "*", Component: NotFound },
    ],
  },
]);
