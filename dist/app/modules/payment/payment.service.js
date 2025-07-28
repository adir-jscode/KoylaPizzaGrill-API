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
exports.paymentIntent = void 0;
const stripe_1 = require("../../config/stripe");
const paymentIntent = (amount, transactionId, customerEmail) => __awaiter(void 0, void 0, void 0, function* () {
    yield stripe_1.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // in cents
        currency: "usd", // change if needed
        metadata: { transactionId },
        receipt_email: customerEmail || undefined,
    });
});
exports.paymentIntent = paymentIntent;
