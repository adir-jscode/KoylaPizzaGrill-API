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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantHourRoutes = void 0;
const express_1 = require("express");
const ctrl = __importStar(require("./restaurantHour.controller"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const restaurantHour_validation_1 = require("./restaurantHour.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = (0, express_1.Router)();
router.post("/add-hours", checkAuth_1.checkAuth, (0, validateRequest_1.validateRequest)(restaurantHour_validation_1.restaurantHourZodSchema), ctrl.createRestaurantHour);
router.get("/", ctrl.getAllHours);
router.get("/:day", ctrl.getHourByDay);
router.put("/:day", checkAuth_1.checkAuth, (0, validateRequest_1.validateRequest)(restaurantHour_validation_1.restaurantHourZodSchema), ctrl.updateHourByDay);
exports.RestaurantHourRoutes = router;
