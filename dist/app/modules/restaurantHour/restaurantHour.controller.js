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
exports.updateHourByDay = exports.getHourByDay = exports.getAllHours = exports.createRestaurantHour = void 0;
const restaurantHour_service_1 = require("./restaurantHour.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const createRestaurantHour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hour = yield restaurantHour_service_1.RestaurantHourService.createRestaurantHour(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "All data retrived Successfully",
            data: hour,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createRestaurantHour = createRestaurantHour;
const getAllHours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hours = yield restaurantHour_service_1.RestaurantHourService.getAll();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "All data retrived Successfully",
            data: hours,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllHours = getAllHours;
const getHourByDay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hour = yield restaurantHour_service_1.RestaurantHourService.getByDay(Number(req.params.day));
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Data retrived Successfully",
            data: hour,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getHourByDay = getHourByDay;
const updateHourByDay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield restaurantHour_service_1.RestaurantHourService.updateByDay(Number(req.params.day), req.body);
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
exports.updateHourByDay = updateHourByDay;
