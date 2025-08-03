"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const admin_route_1 = require("../modules/admin/admin.route");
const coupons_route_1 = require("../modules/coupons/coupons.route");
const auth_route_1 = require("../modules/auth/auth.route");
const categories_route_1 = require("../modules/categories/categories.route");
const menuItem_routes_1 = require("../modules/menuItem/menuItem.routes");
const restaurantSettings_route_1 = require("../modules/restaurantSettings/restaurantSettings.route");
const scheduledClosing_route_1 = require("../modules/scheduledClosing/scheduledClosing.route");
const restaurantHour_route_1 = require("../modules/restaurantHour/restaurantHour.route");
const order_routes_1 = require("../modules/order/order.routes");
const otp_route_1 = require("../modules/otp/otp.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/coupon",
        route: coupons_route_1.CouponRoutes,
    },
    {
        path: "/category",
        route: categories_route_1.CategoriesRoutes,
    },
    {
        path: "/menu-item",
        route: menuItem_routes_1.MenuItemsRoutes,
    },
    {
        path: "/restaurant-settings",
        route: restaurantSettings_route_1.RestaurantSettingsRoutes,
    },
    {
        path: "/scheduled-closing",
        route: scheduledClosing_route_1.ScheduledClosingRoutes,
    },
    {
        path: "/restaurant-hours",
        route: restaurantHour_route_1.RestaurantHourRoutes,
    },
    {
        path: "/order",
        route: order_routes_1.OrderRoutes,
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
