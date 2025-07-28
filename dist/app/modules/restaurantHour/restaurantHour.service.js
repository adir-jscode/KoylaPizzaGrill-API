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
exports.RestaurantHourService = void 0;
const restaurantHour_model_1 = require("./restaurantHour.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createRestaurantHour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newHour = yield restaurantHour_model_1.RestaurantHour.create(payload);
    return newHour;
});
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantHour = yield restaurantHour_model_1.RestaurantHour.find();
    return restaurantHour;
});
const getByDay = (day) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantHourByDay = yield restaurantHour_model_1.RestaurantHour.findOne({ day });
    if (!restaurantHourByDay) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Restaurant Hour Not Found");
    }
    return restaurantHourByDay;
});
const updateByDay = (day, data) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantHourByDay = yield restaurantHour_model_1.RestaurantHour.findOne({ day });
    if (!restaurantHourByDay) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Restaurant Hour Not Found");
    }
    const updated = yield restaurantHour_model_1.RestaurantHour.findOneAndUpdate({ day }, data, {
        upsert: true,
        new: true,
    });
    return updated;
});
exports.RestaurantHourService = {
    createRestaurantHour,
    getAll,
    getByDay,
    updateByDay,
};
