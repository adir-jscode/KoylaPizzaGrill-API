import crypto from "crypto";
import { redisClient } from "../../config/radis.config";
import { sendEmail } from "../../utils/sendMail";
import AppError from "../../errorHelpers/AppError";
import { Order } from "../order/order.model";

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
const verifyOtp = async (email: string, otp: string) => {
  try {
    console.log(email);
    console.log("from payload", otp);
    const redisKey = `otp:${email}`;
    const savedOtp = await redisClient.get(redisKey);
    console.log(savedOtp);
    if (!savedOtp) {
      throw new AppError(400, "Invalid otp");
    }
    if (savedOtp !== otp) {
      throw new AppError(400, "Invalid otp");
    }
    await redisClient.del(redisKey);
  } catch (error) {
    console.log(error);
    throw new AppError(400, "Fail to verify OTP");
  }
};

export const OtpServices = { sendOtp, verifyOtp };
