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
exports.ScheduledClosingService = void 0;
const scheduledClosing_model_1 = require("./scheduledClosing.model");
const getAll = () => __awaiter(void 0, void 0, void 0, function* () { return scheduledClosing_model_1.ScheduledClosing.find(); });
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () { return scheduledClosing_model_1.ScheduledClosing.findById(id); });
const create = (data) => __awaiter(void 0, void 0, void 0, function* () { return scheduledClosing_model_1.ScheduledClosing.create(data); });
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () { return scheduledClosing_model_1.ScheduledClosing.findByIdAndUpdate(id, data, { new: true }); });
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () { return scheduledClosing_model_1.ScheduledClosing.findByIdAndDelete(id); });
exports.ScheduledClosingService = {
    getAll,
    getById,
    create,
    update,
    remove,
};
