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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantHourService = void 0;
const restaurantHour_model_1 = require("./restaurantHour.model");
const createRestaurantHour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newHour = yield restaurantHour_model_1.RestaurantHour.create(payload);
    return newHour;
});
const getAll = () => __awaiter(void 0, void 0, void 0, function* () { return restaurantHour_model_1.RestaurantHour.find(); });
const getByDay = (day) => __awaiter(void 0, void 0, void 0, function* () { return restaurantHour_model_1.RestaurantHour.findOne({ day }); });
const updateByDay = (day, data) => __awaiter(void 0, void 0, void 0, function* () { return restaurantHour_model_1.RestaurantHour.findOneAndUpdate({ day }, data, { upsert: true, new: true }); });
const create = (data) => __awaiter(void 0, void 0, void 0, function* () { return restaurantHour_model_1.RestaurantHour.create(data); });
exports.RestaurantHourService = {
    createRestaurantHour,
    getAll,
    getByDay,
    updateByDay,
    create,
};
