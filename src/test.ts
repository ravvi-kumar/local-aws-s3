import { S3Client, CreateBucketCommand, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import * as fs from 'fs';

const s3Client = new S3Client({
    endpoint: 'http://localhost:4566',
    //   endpoint: 'http://s3.localhost.localstack.cloud:4566',
    forcePathStyle: true,
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test'
    }
});

async function createBucket(bucketName: string) {
    const bucketCreationResponse = await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log("bucket created:", bucketCreationResponse)
    return bucketCreationResponse;
}

async function runS3Test() {
    const bucketName = 'my-local-bucket';

    // Create bucket
    await createBucket(bucketName);

    // Upload file
    const fileContent = fs.readFileSync('./test-file.txt');
    const s3FileUploadResponse = await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: 'test-file.txt',
        Body: fileContent
    }));
    console.log("file uploaded:", s3FileUploadResponse)

    // List objects
    const result = await s3Client.send(new ListObjectsCommand({ Bucket: bucketName }));
    console.log('Uploaded files:', result.Contents);
}

runS3Test().catch(console.error);
