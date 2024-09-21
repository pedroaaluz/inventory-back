const serverlessConfiguration = {
  service: "${env:service, 'inventory-back'}",
  org: 'inventory',
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    versionFunctions: false,
    region: "${opt:region, 'sa-east-1'}",
    stage: "${opt:stage, 'dev'}",
    memorySize: 256,
    architecture: 'arm64',
    logRetentionInDays: 30,
    logs: {
      websocket: true,
    },
    environment: {
      DATABASE_URL: '${env:DATABASE_URL}',
      REGION: '${self:provider.region}',
      STAGE: '${self:provider.stage}',
    },
  },
  esbuild: {
    bundle: true,
    minify: false,
    sourcemap: true,
    target: 'node18',
  },
  package: {
    individually: true,
    exclude: ['.git/**', '.gitignore', '.github/**', '.vscode/**'],
    patterns: [
      '!node_modules/.prisma/client/libquery_engine-*',
      'node_modules/.prisma/client/libquery_engine-linux-arm64-*',
      '!node_modules/prisma/libquery_engine-*',
      '!node_modules/@prisma/engines/**',
    ],
  },
  functions: {
    CreateProduct: {
      handler: 'src/lambdas/createProduct/index.bootstrap',
      name: 'create-product-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'product',
            method: 'post',
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['s3:PutObject', 's3:PutObjectAcl', 's3:PutObjectTagging'],
          Resource: {
            'Fn::Join': [
              '/',
              [{'Fn::GetAtt': ['InformationBucket', 'Arn']}, '*'],
            ],
          },
        },
      ],
    },
    GetProduct: {
      handler: 'src/lambdas/getProduct/index.bootstrap',
      name: 'get-product-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'product/{id}',
            method: 'get',
          },
        },
      ],
    },
    ListProducts: {
      handler: 'src/lambdas/listProducts/index.bootstrap',
      name: 'list-products-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'product',
            method: 'get',
          },
        },
      ],
    },
    PrismaSeed: {
      handler: 'scripts/prismaSeed/index.bootstrap',
      name: 'prisma-seed-${self:provider.stage}',
    },
  },
  resources: {
    Resources: {
      ProductsImagesBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'products-images-bucket-${self:provider.stage}',
        },
      },
    },
  },
  plugins: [
    'serverless-esbuild',
    'serverless-iam-roles-per-function',
    'serverless-offline',
  ],
};

module.exports = serverlessConfiguration;
