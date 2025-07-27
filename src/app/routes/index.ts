import { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CouponRoutes } from "../modules/coupons/coupons.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoriesRoutes } from "../modules/categories/categories.route";
import { MenuItemsRoutes } from "../modules/menuItem/menuItem.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/coupon",
    route: CouponRoutes,
  },
  {
    path: "/category",
    route: CategoriesRoutes,
  },
  {
    path: "/menu-item",
    route: MenuItemsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
