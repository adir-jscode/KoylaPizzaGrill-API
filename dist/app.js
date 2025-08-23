"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const env_1 = require("./app/config/env");
const stripe_1 = __importDefault(require("stripe"));
const order_controller_1 = require("./app/modules/order/order.controller");
const app = (0, express_1.default)();
exports.stripe = new stripe_1.default(env_1.envVars.STRIPE_SECRET_KEY);
app.post("/api/v1/order/webhook", express_1.default.raw({ type: "application/json" }), order_controller_1.OrderControllers.stripeWebhook);
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [env_1.envVars.URL],
    credentials: true,
}));
console.log();
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ success: true, message: "Welcome to KoylaPizzaGrill Server 🍕" });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
