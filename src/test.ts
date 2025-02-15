import { ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from 'fs';
import { BUCKET_NAME } from "./utils/constants";
import { createBucket, s3Client } from "./utils/s3-client";

async function runS3Test() {

    // Create bucket
    await createBucket(BUCKET_NAME);

    // Upload file
    const fileContent = fs.readFileSync('./test-file.txt');
    const s3FileUploadResponse = await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'test-file.txt',
        Body: fileContent
    }));
    console.log("file uploaded:", s3FileUploadResponse)

    // List objects
    const result = await s3Client.send(new ListObjectsCommand({ Bucket: BUCKET_NAME }));
    console.log('Uploaded files:', result.Contents);
}

runS3Test().catch(console.error);
