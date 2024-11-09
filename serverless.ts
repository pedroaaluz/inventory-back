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
      handler: 'src/lambdas/products/createProduct/index.bootstrap',
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
              [{'Fn::GetAtt': ['ProductsImagesBucket', 'Arn']}, '*'],
            ],
          },
        },
      ],
    },
    GetProduct: {
      handler: 'src/lambdas/products/getProduct/index.bootstrap',
      name: 'get-product-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'product/{id}',
            method: 'get',
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['s3:GetObject'],
          Resource: {
            'Fn::Join': [
              '/',
              [{'Fn::GetAtt': ['ProductsImagesBucket', 'Arn']}, '*'],
            ],
          },
        },
      ],
    },
    ListProducts: {
      handler: 'src/lambdas/products/listProducts/index.bootstrap',
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
    UpdateProduct: {
      handler: 'src/lambdas/products/updateProduct/index.bootstrap',
      name: 'update-product-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'product/{id}',
            method: 'put',
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
              [{'Fn::GetAtt': ['ProductsImagesBucket', 'Arn']}, '*'],
            ],
          },
        },
      ],
    },
    DeleteProduct: {
      handler: 'src/lambdas/products/deleteProduct/index.bootstrap',
      name: 'delete-product-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'product/{id}',
            method: 'delete',
          },
        },
      ],
    },
    CreateMovements: {
      handler: 'src/lambdas/movements/createMovements/index.bootstrap',
      name: 'create-movements-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'movement/{userId}',
            method: 'post',
          },
        },
      ],
    },
    ListMovements: {
      handler: 'src/lambdas/movements/listMovements/index.bootstrap',
      name: 'list-movements-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'movement/{userId}',
            method: 'get',
          },
        },
      ],
    },
    CreateSupplier: {
      handler: 'src/lambdas/suppliers/createSupplier/index.bootstrap',
      name: 'create-supplier-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'supplier',
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
              [{'Fn::GetAtt': ['SuppliersImagesBucket', 'Arn']}, '*'],
            ],
          },
        },
      ],
    },
    UpdateSupplier: {
      handler: 'src/lambdas/suppliers/updateSupplier/index.bootstrap',
      name: 'update-supplier-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'supplier/{id}',
            method: 'put',
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
              [{'Fn::GetAtt': ['SuppliersImagesBucket', 'Arn']}, '*'],
            ],
          },
        },
      ],
    },
    ListSuppliers: {
      handler: 'src/lambdas/suppliers/listSuppliers/index.bootstrap',
      name: 'list-suppliers-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'supplier',
            method: 'get',
          },
        },
      ],
    },
    GetSupplier: {
      handler: 'src/lambdas/suppliers/getSupplier/index.bootstrap',
      name: 'get-supplier-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'supplier/{id}',
            method: 'get',
          },
        },
      ],
    },
    ListCategories: {
      handler: 'src/lambdas/categories/listCategories/index.bootstrap',
      name: 'list-categories-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'category',
            method: 'get',
          },
        },
      ],
    },
    TotalStockCostCalculator: {
      handler: 'src/lambdas/metrics/totalStockCostCalculator/index.bootstrap',
      name: 'total-stock-cost-calculator-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'metrics/{userId}/total-stock-cost',
            method: 'get',
          },
        },
      ],
    },
    PaymentMethodUsed: {
      handler: 'src/lambdas/metrics/paymentMethodUsed/index.bootstrap',
      name: 'payment-method-used-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'metrics/{userId}/payment-method-used',
            method: 'get',
          },
        },
      ],
    },
    GetTopSellingProducts: {
      handler: 'src/lambdas/metrics/getTopSellingProducts/index.bootstrap',
      name: 'get-top-selling-products-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'metrics/{userId}/top-selling-products',
            method: 'get',
          },
        },
      ],
    },
    GetStockMetrics: {
      handler: 'src/lambdas/metrics/getStockMetrics/index.bootstrap',
      name: 'get-stock-metrics-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'metrics/{userId}/stock-metrics',
            method: 'get',
          },
        },
      ],
    },
    GetProductsNearIdealStock: {
      handler: 'src/lambdas/metrics/getProductsNearIdealStock/index.bootstrap',
      name: 'get-products-near-ideal-stock-${self:provider.stage}',
      events: [
        {
          http: {
            path: 'metrics/{userId}/products-near-ideal-stock',
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
      SuppliersImagesBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'suppliers-images-bucket-${self:provider.stage}',
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
