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
exports.menuItemController = exports.deleteMenuItem = exports.updateMenuItem = exports.getMenuItemById = exports.getMenuItems = exports.createMenuItem = void 0;
const menuItem_service_1 = require("./menuItem.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const createMenuItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payload = Object.assign(Object.assign({}, req.body), { imageUrl: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
        const menuItem = yield menuItem_service_1.MenuItemService.createMenuItem(payload);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "Menu Item created Successfully",
            data: menuItem,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createMenuItem = createMenuItem;
const getMenuItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menuItems = yield menuItem_service_1.MenuItemService.getMenuItems();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "All Data Retrived Successfully",
            data: menuItems,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getMenuItems = getMenuItems;
const getMenuItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menuItem = yield menuItem_service_1.MenuItemService.getMenuItemById(req.params.id);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Data Retrived Successfully",
            data: menuItem,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getMenuItemById = getMenuItemById;
const updateMenuItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payload = Object.assign(Object.assign({}, req.body), { imageUrl: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
        console.log(payload);
        const updated = yield menuItem_service_1.MenuItemService.updateMenuItem(req.params.id, payload);
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
exports.updateMenuItem = updateMenuItem;
const deleteMenuItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield menuItem_service_1.MenuItemService.deleteMenuItem(req.params.id);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Data deleted Successfully",
            data: null,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteMenuItem = deleteMenuItem;
exports.menuItemController = {
    createMenuItem: exports.createMenuItem,
    getMenuItems: exports.getMenuItems,
    getMenuItemById: exports.getMenuItemById,
    updateMenuItem: exports.updateMenuItem,
    deleteMenuItem: exports.deleteMenuItem,
};
