To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

To list s3 buckets:
```sh
awslocal s3 ls s3://{BUCKET_NAME}
```

To presign a file:
```sh
awslocal s3 presign s3://{BUCKET_NAME}/{FILE_NAME}
```

Zip the function
```sh
zip function.zip ./lambda/index.js
```

Create Lambda function
```sh
awslocal lambda create-function \
  --function-name s3-trigger-function \
  --runtime nodejs18.x \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip
```
Get Lambda function
```sh
awslocal lambda get-function \
  --function-name s3-trigger-function
```

Add bucket notification
```sh
awslocal s3api put-bucket-notification-configuration \
  --bucket my-local-bucket \
  --notification-configuration file://notification.json
```