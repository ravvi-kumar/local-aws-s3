import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Context, Handler, S3Event } from 'aws-lambda';

const s3Client = new S3Client({
    endpoint: 'http://localhost:4566',
    forcePathStyle: true,
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test'
    }
});

export const handler: Handler = async (event: S3Event, context: Context) => {
    try {
        // Process each record in the S3 event
        for (const record of event.Records) {
            const bucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
            const size = record.s3.object.size;

            console.log(`File uploaded: ${key} (${size} bytes) in bucket ${bucket}`);

            // // Get the uploaded object
            // const getCommand = new GetObjectCommand({
            //     Bucket: bucket,
            //     Key: key
            // });

            // const response = await s3Client.send(getCommand);

            // console.log('File metadata:', response);

        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Successfully processed S3 event' })
        };
    } catch (error) {
        console.error('Error processing S3 event:', error);
        throw error;
    }
};