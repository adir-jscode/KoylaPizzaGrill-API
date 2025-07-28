"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_METHOD = exports.OrderType = void 0;
var OrderType;
(function (OrderType) {
    OrderType["PICKUP"] = "PICKUP";
    OrderType["DELIVERY"] = "DELIVERY";
})(OrderType || (exports.OrderType = OrderType = {}));
var PAYMENT_METHOD;
(function (PAYMENT_METHOD) {
    PAYMENT_METHOD["CARD"] = "CARD";
    PAYMENT_METHOD["CASH"] = "CASH";
})(PAYMENT_METHOD || (exports.PAYMENT_METHOD = PAYMENT_METHOD = {}));
