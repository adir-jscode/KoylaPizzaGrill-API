import crypto from "crypto";
import { redisClient } from "../../config/radis.config";
import { sendEmail } from "../../utils/sendMail";

const OTP_EXPIRATION = 2 * 60;

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};
const sendOtp = async (email: string, name: string) => {
  const otp = generateOtp();
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: { type: "EX", value: OTP_EXPIRATION },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: { name: name, otp: otp },
  });
};
const verifyOtp = async () => {};

export const OtpServices = { sendOtp, verifyOtp };
