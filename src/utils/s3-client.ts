import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
    endpoint: 'http://localhost:4566',
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

export { s3Client, createBucket };
