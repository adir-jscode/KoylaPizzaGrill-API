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
exports.deleteClosing = exports.updateClosing = exports.createClosing = exports.getClosingById = exports.getClosings = void 0;
const scheduledClosing_service_1 = require("./scheduledClosing.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const getClosings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const closings = yield scheduledClosing_service_1.ScheduledClosingService.getAll();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "All data retrived Successfully",
            data: closings,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getClosings = getClosings;
const getClosingById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const closing = yield scheduledClosing_service_1.ScheduledClosingService.getById(req.params.id);
        if (!closing)
            return res.status(404).json({ success: false, message: "Not found" });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Data retrived Successfully",
            data: closing,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getClosingById = getClosingById;
const createClosing = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const closing = yield scheduledClosing_service_1.ScheduledClosingService.create(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "Data created Successfully",
            data: closing,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createClosing = createClosing;
const updateClosing = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield scheduledClosing_service_1.ScheduledClosingService.update(req.params.id, req.body);
        if (!updated)
            return res.status(404).json({ success: false, message: "Not found" });
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
exports.updateClosing = updateClosing;
const deleteClosing = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removed = yield scheduledClosing_service_1.ScheduledClosingService.remove(req.params.id);
        if (!removed)
            return res.status(404).json({ success: false, message: "Not found" });
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
exports.deleteClosing = deleteClosing;
