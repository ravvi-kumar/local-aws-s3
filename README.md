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