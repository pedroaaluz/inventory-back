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
  plugins: ['serverless-esbuild', 'serverless-offline'],
};

module.exports = serverlessConfiguration;
