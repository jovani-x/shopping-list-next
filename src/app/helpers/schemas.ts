import { z } from "zod";
import { Product } from "@/app/components/ProductItem/ProductItem";

export const FormAuthSchema = z.object({
  userName: z.string().min(2),
  password: z.string().min(5),
});

export const FormRegisterSchema = z
  .object({
    userName: z.string().min(2),
    email: z.string().min(6).email(),
    password: z.string().min(5),
    confirmPassword: z.string().min(5),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

const EmailScheme = z.object({
  email: z.string().min(6).email(),
});

export const FormForgetSchema = EmailScheme;

export const FormInviteSchema = z.object({
  email: z.string().min(6).email(),
  message: z.string(),
});

let ZProduct: z.ZodType<Product>;

const ProductScheme = z.object({
  id: z.string(),
  name: z.string(),
  photo: z.string().or(z.null()),
  note: z.string().or(z.null()),
  alternatives: z.lazy(() => z.optional(z.array(ZProduct))),
  got: z.boolean(),
});

export const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string().or(z.null()),
  products: z.optional(z.array(ProductScheme)),
  isDone: z.boolean(),
  status: z.optional(
    z.object({
      value: z.string(),
      userName: z.optional(z.string().or(z.undefined())),
    })
  ),
});
