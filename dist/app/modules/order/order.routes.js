"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const orderController = __importStar(require("./order.controller"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const order_validation_1 = require("./order.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const express_2 = __importDefault(require("express"));
const router = (0, express_1.Router)();
router.post("/", (0, validateRequest_1.validateRequest)(order_validation_1.createOrderZodSchema), orderController.createOrderController);
router.get("/", checkAuth_1.checkAuth, orderController.getAllOrders);
router.post("/stripe/webhook", express_2.default.raw({ type: "application/json" }), orderController.stripeWebhookHandler);
router.get("/history/:orderNumber", checkAuth_1.checkAuth, orderController.getOrderHistory);
router.put("/:id", checkAuth_1.checkAuth, orderController.toggleOrderStatus);
router.get("/filter", checkAuth_1.checkAuth, orderController.getFilteredOrders);
router.post("/payment-intent", orderController.createPaymentIntent);
exports.OrderRoutes = router;
