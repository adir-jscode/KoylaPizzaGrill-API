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
exports.RestaurantSettingsService = void 0;
const restaurantSettings_model_1 = require("./restaurantSettings.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createRestaurantSettings = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield restaurantSettings_model_1.RestaurantSettings.create(payload);
    return created;
});
const getSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield restaurantSettings_model_1.RestaurantSettings.find({});
    return settings;
});
const updateSettings = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield restaurantSettings_model_1.RestaurantSettings.findOneAndUpdate({}, data, {
        upsert: true,
        new: true,
    });
    if (!updated) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Settings Not Found");
    }
    return updated;
});
exports.RestaurantSettingsService = {
    createRestaurantSettings,
    getSettings,
    updateSettings,
};
