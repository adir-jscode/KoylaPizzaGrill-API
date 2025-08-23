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
exports.sendEmail = void 0;
// mailer.ts
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const resend_1 = require("resend");
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const resend = new resend_1.Resend(env_1.envVars.RESEND_API_KEY);
const toArray = (v) => (Array.isArray(v) ? v : [v]);
const toResendAttachments = (attachments) => attachments === null || attachments === void 0 ? void 0 : attachments.map((a) => ({
    filename: a.filename,
    content: Buffer.isBuffer(a.content)
        ? a.content.toString("base64")
        : Buffer.from(a.content).toString("base64"),
    // Resend infers type; you can also pass "type" if needed
    // type: a.contentType
}));
const toNodeMailerAttachments = (attachments) => attachments === null || attachments === void 0 ? void 0 : attachments.map((a) => ({
    filename: a.filename,
    content: a.content,
    contentType: a.contentType,
}));
const createSmtpTransport = () => {
    const secure = Number(env_1.envVars.EMAIL_SENDER.SMTP_PORT) === 465;
    return nodemailer_1.default.createTransport({
        host: env_1.envVars.EMAIL_SENDER.SMTP_HOST,
        port: Number(env_1.envVars.EMAIL_SENDER.SMTP_PORT),
        secure,
        auth: {
            user: env_1.envVars.EMAIL_SENDER.SMTP_USER,
            pass: env_1.envVars.EMAIL_SENDER.SMTP_PASS,
        },
    });
};
// --- core ---
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, templateName, templateData = {}, attachments, }) {
    var _b, _c;
    try {
        const templatePath = path_1.default.join(__dirname, `templates/${templateName}.ejs`);
        const html = yield ejs_1.default.renderFile(templatePath, templateData);
        // 1) Try Resend first
        try {
            const { data, error } = yield resend.emails.send({
                from: env_1.envVars.RESEND_FROM, // e.g., "Your Brand <noreply@yourdomain.com>" (must be verified)
                to: toArray(to),
                subject,
                html,
                // You can also pass 'reply_to' if you want:
                // reply_to: envVars.RESEND_REPLY_TO,
                attachments: toResendAttachments(attachments),
            });
            if (error) {
                // Detect rate limit to trigger fallback
                const code = (error === null || error === void 0 ? void 0 : error.name) || (error === null || error === void 0 ? void 0 : error.code) || (error === null || error === void 0 ? void 0 : error.type);
                const status = (error === null || error === void 0 ? void 0 : error.statusCode) || (error === null || error === void 0 ? void 0 : error.status);
                const isRateLimited = status === 429 ||
                    String((error === null || error === void 0 ? void 0 : error.message) || "")
                        .toLowerCase()
                        .includes("too many requests") ||
                    code === "rate_limit_exceeded";
                if (isRateLimited) {
                    console.warn("Resend rate limit exceeded, falling back to Gmail SMTP...");
                    // Fall through to SMTP below
                }
                else {
                    // Non-rate-limit error: surface it (or choose to fallback for *any* error)
                    throw error;
                }
            }
            else {
                console.log(`✉️ Resend sent: ${(_b = data === null || data === void 0 ? void 0 : data.id) !== null && _b !== void 0 ? _b : "(no id)"}`);
                return;
            }
        }
        catch (resendErr) {
            // If the SDK throws (network, etc.) we *optionally* fallback too
            const status = (resendErr === null || resendErr === void 0 ? void 0 : resendErr.statusCode) || (resendErr === null || resendErr === void 0 ? void 0 : resendErr.status);
            const code = (resendErr === null || resendErr === void 0 ? void 0 : resendErr.name) || (resendErr === null || resendErr === void 0 ? void 0 : resendErr.code) || (resendErr === null || resendErr === void 0 ? void 0 : resendErr.type) || "unknown";
            const isRateLimited = status === 429 ||
                code === "rate_limit_exceeded" ||
                String((resendErr === null || resendErr === void 0 ? void 0 : resendErr.message) || "")
                    .toLowerCase()
                    .includes("too many requests");
            if (!isRateLimited) {
                console.warn(`Resend error (non-rate limit): ${status !== null && status !== void 0 ? status : ""} ${code}. Falling back to SMTP anyway...`);
            }
            else {
                console.warn("Resend rate limit: falling back to SMTP...");
            }
            // continue to SMTP fallback
        }
        // 2) Fallback: Gmail SMTP (your existing Nodemailer config)
        const transporter = createSmtpTransport();
        yield transporter.sendMail({
            from: env_1.envVars.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html,
            attachments: toNodeMailerAttachments(attachments),
        });
        console.log(`✉️ SMTP fallback sent to ${toArray(to).join(", ")}`);
    }
    catch (error) {
        console.error("email sending error", (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : error);
        throw new AppError_1.default(401, "Email error");
    }
});
exports.sendEmail = sendEmail;
