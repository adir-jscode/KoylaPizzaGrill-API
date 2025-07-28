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
exports.MenuItemService = void 0;
const menuItem_model_1 = require("./menuItem.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createMenuItem = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield menuItem_model_1.MenuItem.create(payload);
    return created;
});
const getMenuItems = () => __awaiter(void 0, void 0, void 0, function* () {
    return menuItem_model_1.MenuItem.find().populate("categoryId");
});
const getMenuItemById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return menuItem_model_1.MenuItem.findById(id).populate("categoryId");
});
const updateMenuItem = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingMenu = yield menuItem_model_1.MenuItem.findById(id);
    if (!existingMenu) {
        throw new Error("Menu not found.");
    }
    const updateMenu = yield menuItem_model_1.MenuItem.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (data.imageUrl && (updateMenu === null || updateMenu === void 0 ? void 0 : updateMenu.imageUrl)) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existingMenu.imageUrl);
    }
    return updateMenu;
});
const deleteMenuItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const menuItem = yield menuItem_model_1.MenuItem.findById(id);
    if (!menuItem) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Menu item not found");
    }
    if (menuItem.imageUrl) {
        try {
            yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(menuItem.imageUrl);
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cloudinary image deletion failed - proceeding with menu item delete:");
        }
    }
    const deleted = yield menuItem_model_1.MenuItem.findByIdAndDelete(id);
    return deleted;
});
exports.MenuItemService = {
    createMenuItem,
    getMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
};
