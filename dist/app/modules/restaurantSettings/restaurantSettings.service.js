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
exports.RestaurantSettingsService = void 0;
const restaurantSettings_model_1 = require("./restaurantSettings.model");
const createRestaurantSettings = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield restaurantSettings_model_1.RestaurantSettings.create(payload);
    return created;
});
const getSettings = () => __awaiter(void 0, void 0, void 0, function* () { return restaurantSettings_model_1.RestaurantSettings.findOne(); });
const updateSettings = (data) => __awaiter(void 0, void 0, void 0, function* () { return restaurantSettings_model_1.RestaurantSettings.findOneAndUpdate({}, data, { upsert: true, new: true }); });
exports.RestaurantSettingsService = {
    createRestaurantSettings,
    getSettings,
    updateSettings,
};
