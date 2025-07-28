"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.addSettings = exports.getSettings = void 0;
const restaurantSettings_service_1 = require("./restaurantSettings.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const getSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield restaurantSettings_service_1.RestaurantSettingsService.getSettings();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "All data retrived Successfully",
            data: settings,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getSettings = getSettings;
const addSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield restaurantSettings_service_1.RestaurantSettingsService.createRestaurantSettings(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "Settings created Successfully",
            data: settings,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.addSettings = addSettings;
const updateSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield restaurantSettings_service_1.RestaurantSettingsService.updateSettings(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Data updated Successfully",
            data: updated,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateSettings = updateSettings;
