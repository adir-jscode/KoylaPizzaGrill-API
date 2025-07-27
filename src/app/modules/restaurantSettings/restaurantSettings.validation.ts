import { z } from "zod";

export const restaurantSettingsZodSchema = z.object({
  isAcceptingPickup: z.boolean(),
  isAcceptingDelivery: z.boolean(),
  restaurantName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  deliveryFee: z.number().min(0),
  taxRate: z.number().min(0),
  minDeliveryAmount: z.number().min(0).optional(),
});
