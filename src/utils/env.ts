import z from "zod";

const prod = process.env.NODE_ENV === "production";
const dev = process.env.NODE_ENV === "development";

const baseSchema = z.object({
  prod: z.boolean(),
  dev: z.boolean(),
  DATABASE_URL: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_BUCKET_REGION: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  VERCEL_URL: z.optional(z.string()),
  PORT: z.optional(z.number()),
});

const prodSchema = z.object({
  VERCEL_URL: z.string(),
});

let schema;
if (prod) {
  schema = baseSchema.merge(prodSchema);
} else {
  schema = baseSchema.merge(prodSchema.partial());
}

export let env: z.infer<typeof schema>;
if (typeof window === "undefined") {
  env = schema.parse({
    ...process.env,
    prod,
    dev,
  });
}
