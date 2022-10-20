import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const NAME = process.env.S3_BUCKET_NAME as string;
const REGION = process.env.S3_BUCKET_REGION as string;
const ACCESS_KEY = process.env.S3_ACCESS_KEY as string;
const SECRET_KEY = process.env.S3_SECRET_KEY as string;

const URL_EXPIRY = 120; // 2 minutes

export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

type Command =
  | typeof PutObjectCommand
  | typeof GetObjectCommand
  | typeof DeleteObjectCommand;

export async function generateSignedURL(key: string, command: Command) {
  const bucketParams = {
    Bucket: NAME,
    Key: key,
  };
  const signedUrl = await getSignedUrl(s3Client, new command(bucketParams), {
    expiresIn: URL_EXPIRY,
  });
  return signedUrl;
}
