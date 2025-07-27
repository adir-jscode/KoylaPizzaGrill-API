import { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CouponRoutes } from "../modules/coupons/coupons.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoriesRoutes } from "../modules/categories/categories.route";
import { MenuItemsRoutes } from "../modules/menuItem/menuItem.routes";
import { RestaurantSettingsRoutes } from "../modules/restaurantSettings/restaurantSettings.route";
import { ScheduledClosingRoutes } from "../modules/scheduledClosing/scheduledClosing.route";
import { RestaurantHourRoutes } from "../modules/restaurantHour/restaurantHour.route";
import { OrderRoutes } from "../modules/order/order.routes";

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
  {
    path: "/restaurant-settings",
    route: RestaurantSettingsRoutes,
  },
  {
    path: "/scheduled-closing",
    route: ScheduledClosingRoutes,
  },
  {
    path: "/restaurant-hours",
    route: RestaurantHourRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
