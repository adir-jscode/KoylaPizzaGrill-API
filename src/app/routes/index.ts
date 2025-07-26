import { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CouponRoutes } from "../modules/coupons/coupons.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/coupon",
    route: CouponRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
