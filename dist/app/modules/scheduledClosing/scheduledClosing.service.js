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
exports.ScheduledClosingService = void 0;
const scheduledClosing_model_1 = require("./scheduledClosing.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleClosing = yield scheduledClosing_model_1.ScheduledClosing.find();
    return scheduleClosing;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleClosing = yield scheduledClosing_model_1.ScheduledClosing.findById(id);
    if (!scheduleClosing) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Schedule closing hour not found");
    }
    return scheduleClosing;
});
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleClosing = yield scheduledClosing_model_1.ScheduledClosing.create(data);
    return scheduleClosing;
});
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield scheduledClosing_model_1.ScheduledClosing.findByIdAndUpdate(id, data, {
        new: true,
    });
    if (!updated) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Schedule closing hour not found");
    }
    return updated;
});
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield scheduledClosing_model_1.ScheduledClosing.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Schedule closing hour not found");
    }
    yield scheduledClosing_model_1.ScheduledClosing.findByIdAndDelete(id);
});
exports.ScheduledClosingService = {
    getAll,
    getById,
    create,
    update,
    remove,
};
