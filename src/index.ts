import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Hono } from 'hono';
import { BUCKET_NAME } from './utils/constants';
import { s3Client } from "./utils/s3-client";

const app = new Hono()

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/generate-upload-url', async (c) => {
  try {

    const body = await c.req.json()
    const fileName = body.fileName;
    const fileType = body.fileType;
    const fileSize = body.fileSize;


    // #NOTE : from file
    // const formData = await c.req.formData()
    // const file = formData.get('file') as File
    // const fileName = file.name;
    // const fileType = file.type;
    // const fileSize = file.size;

    // // Validate if file exists
    // if (!file) {
    //   return c.json({ error: 'No file provided' }, 400)
    // }

    if (!fileName || !fileType || !fileSize) {
      return c.json({ error: 'fileName, fileSize and fileType are required' }, 400)
    }

    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      return c.json({ error: `File size exceeds ${MAX_FILE_SIZE}MB limit` }, 400)
    }

    const fileKey = `${fileName}-${Math.random().toString(36).substring(2)}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
      ContentLength: fileSize,
      // ACL: 'public-read',
      // ACL: 'private',
      Metadata: {
        userId: '12345'
      }
    })

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return c.json({
      uploadUrl: presignedUrl,
      fileName: fileName,
      expiresIn: 60
    })

  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return c.json({ error: 'Failed to generate upload URL' }, 500)
  }
})

app.get("/file/:fileKey", async (c) => {
  const fileKey = c.req.param("fileKey")
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey
  })
  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  return c.json({
    url: url
  })
})

export default app
