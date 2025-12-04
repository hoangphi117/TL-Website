import { createBrowserRouter } from "react-router-dom";
import React from "react";

import MainLayout from "@/components/layouts/MainLayout";
import HomePage from "@/pages/home/HomePage";
import ProductDetailPage from "@/pages/product/ProductDetail";
import AdminLayout from "@/components/layouts/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import UsersPage from "@/pages/admin/UsersPage";
import ProductsPage from "@/pages/admin/ProductsPage";

const ShowroomPage = React.lazy(() => import("@/pages/showRoom"));
const ErrorPage = React.lazy(() => import("@/pages/errorPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:category/:id", element: <ProductDetailPage /> },
      { path: "showroom", element: <ShowroomPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      {index: true, element: <DashboardPage/>},
      {path: "customers", element: <UsersPage/>},
      {path: "products", element: <ProductsPage/>},
    ]
  }
]);

export default router;
