// mailer.ts
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { Resend } from "resend";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

interface AttachmentIn {
  filename: string;
  content: Buffer | string;
  contentType: string;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: AttachmentIn[];
}

const resend = new Resend(envVars.RESEND_API_KEY);

const toArray = (v: string | string[]) => (Array.isArray(v) ? v : [v]);

const toResendAttachments = (attachments?: AttachmentIn[]) =>
  attachments?.map((a) => ({
    filename: a.filename,
    content: Buffer.isBuffer(a.content)
      ? a.content.toString("base64")
      : Buffer.from(a.content).toString("base64"),
    // Resend infers type; you can also pass "type" if needed
    // type: a.contentType
  }));

const toNodeMailerAttachments = (attachments?: AttachmentIn[]) =>
  attachments?.map((a) => ({
    filename: a.filename,
    content: a.content,
    contentType: a.contentType,
  }));

const createSmtpTransport = () => {
  const secure = Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465;
  return nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    secure,
    auth: {
      user: envVars.EMAIL_SENDER.SMTP_USER,
      pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
  });
};

// --- core ---
export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData = {},
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    // 1) Try Resend first
    try {
      const { data, error } = await resend.emails.send({
        from: envVars.RESEND_FROM, // e.g., "Your Brand <noreply@yourdomain.com>" (must be verified)
        to: toArray(to),
        subject,
        html,
        // You can also pass 'reply_to' if you want:
        // reply_to: envVars.RESEND_REPLY_TO,
        attachments: toResendAttachments(attachments),
      });

      if (error) {
        // Detect rate limit to trigger fallback
        const code =
          (error as any)?.name || (error as any)?.code || (error as any)?.type;
        const status = (error as any)?.statusCode || (error as any)?.status;

        const isRateLimited =
          status === 429 ||
          String((error as any)?.message || "")
            .toLowerCase()
            .includes("too many requests") ||
          code === "rate_limit_exceeded";

        if (isRateLimited) {
          console.warn(
            "Resend rate limit exceeded, falling back to Gmail SMTP..."
          );
          // Fall through to SMTP below
        } else {
          // Non-rate-limit error: surface it (or choose to fallback for *any* error)
          throw error;
        }
      } else {
        console.log(`✉️ Resend sent: ${data?.id ?? "(no id)"}`);
        return;
      }
    } catch (resendErr: any) {
      // If the SDK throws (network, etc.) we *optionally* fallback too
      const status = resendErr?.statusCode || resendErr?.status;
      const code =
        resendErr?.name || resendErr?.code || resendErr?.type || "unknown";

      const isRateLimited =
        status === 429 ||
        code === "rate_limit_exceeded" ||
        String(resendErr?.message || "")
          .toLowerCase()
          .includes("too many requests");

      if (!isRateLimited) {
        console.warn(
          `Resend error (non-rate limit): ${
            status ?? ""
          } ${code}. Falling back to SMTP anyway...`
        );
      } else {
        console.warn("Resend rate limit: falling back to SMTP...");
      }
      // continue to SMTP fallback
    }

    // 2) Fallback: Gmail SMTP (your existing Nodemailer config)
    const transporter = createSmtpTransport();
    await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: toNodeMailerAttachments(attachments),
    });
    console.log(`✉️ SMTP fallback sent to ${toArray(to).join(", ")}`);
  } catch (error: any) {
    console.error("email sending error", error?.message ?? error);
    throw new AppError(401, "Email error");
  }
};
