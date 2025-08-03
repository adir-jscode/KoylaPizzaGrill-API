import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const secure = Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465;

    await nodemailer
      .createTransport({
        host: envVars.EMAIL_SENDER.SMTP_HOST,
        port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
        secure,
        auth: {
          user: envVars.EMAIL_SENDER.SMTP_USER,
          pass: envVars.EMAIL_SENDER.SMTP_PASS,
        },
      })
      .sendMail({
        from: envVars.EMAIL_SENDER.SMTP_FROM,
        to,
        subject,
        html,
        attachments: attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
        })),
      });

    console.log(`✉️ Email sent to ${to}`);
  } catch (error: any) {
    console.error("email sending error", error.message);
    throw new AppError(401, "Email error");
  }
};
