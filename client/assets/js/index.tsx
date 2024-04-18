import App from "./app.js";
import Login from "./login.js";
import Admin from "./admin.js";

import {UserProvider} from "./services/user-context.js";

import ReactDOM from "react-dom/client";
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <Admin />
  },
  {
    path: '/admin/:id',
    element: <Admin />
  }
]);

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);
//root.render(<App />);
root.render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
  );