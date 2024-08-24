import {faker} from '@faker-js/faker';
import {randomUUID} from 'crypto';
import {EnumMovementsType, Prisma} from '@prisma/client';
import {prisma} from '../../prisma/prismaClient';

function normalizeName(name: string) {
  // 1. Remove acentos
  const withoutAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 2. Remove caracteres especiais, números, letras estranhas e caracteres Unicode fora do alfabeto padrão
  const normalized = withoutAccents.replace(/[^a-zA-Z\s]/g, '');

  return normalized.trim().toUpperCase();
}

async function createProduct(
  count = 100,
  suppliers: {
    id: string;
    userId: string;
    name: string;
    address: string;
    email: string;
    phone: string;
  }[],
  categories: {id: string; name: string}[],
) {
  const products = [];

  const productsCategories = [];
  const productsSuppliers = [];

  const positions = ['Aisle 1', 'Aisle 2', 'Shelf 3', 'Shelf 4', 'Warehouse'];

  for (let i = 0; i <= count; i++) {
    const randomCategoryIndex = Math.floor(Math.random() * categories.length);
    const randomSupplierIndex = Math.floor(Math.random() * suppliers.length);

    const supplier = suppliers[randomSupplierIndex];
    const randomPosition =
      positions[Math.floor(Math.random() * positions.length)];
    const randomStock = Math.floor(Math.random() * 100) + 1;
    const randomPrice = (Math.random() * 100).toFixed(2);
    const randomYear = Math.floor(Math.random() * 16) + 2025; // Year between 2025 and 2030
    const name = faker.commerce.productName();

    products.push({
      id: randomUUID(),
      name,
      nameNormalized: normalizeName(name),
      image: 'https://dummyimage.com/600x400/000/fff',
      description: faker.commerce.productDescription(),
      userId: supplier.userId,
      stockQuantity: randomStock,
      unitPrice: new Prisma.Decimal(randomPrice),
      positionInStock: randomPosition,
      expirationDate: new Date(
        randomYear,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      ),
    });

    productsCategories.push({
      productId: products[i].id,
      categoryId: categories[randomCategoryIndex].id,
    });

    productsSuppliers.push({
      productId: products[i].id,
      supplierId: supplier.id,
    });
  }

  await prisma.product.createMany({
    data: products,
  });

  return {
    products,
    productsCategories,
    productsSuppliers,
  };
}

async function createCategory() {
  const categories = [
    {id: '2846f84f-01d6-4d0a-ac8f-b1ddc0f8b443', name: 'eletrônicos'},
    {id: '494e501d-d314-4c26-8760-ba3773d581e6', name: 'mobília'},
    {id: '400f040b-1974-46f0-bad2-f383504900e3', name: 'vestuário'},
    {id: '6f06f87b-cb89-416c-b027-aa89c71c9492', name: 'farmácia'},
    {id: '6434b173-603f-4d93-976d-a48356b1e458', name: 'livros'},
    {id: '36e22961-875c-4c7f-9249-75e5896378e1', name: 'brinquedos'},
    {id: 'c2877b72-8026-4b1c-883d-f82cbc99b184', name: 'papelaria/escritório'},
  ];

  const promises = categories.map(async category =>
    prisma.category.upsert({
      where: {id: category.id},
      update: {},
      create: category,
    }),
  );

  await Promise.all(promises);

  return categories;
}
async function createSupplier(count = 1, userIds: string[]) {
  const suppliers = [];

  for (let i = 0; i < count; i++) {
    const isCompany = Math.floor(Math.random() * 2) + 1 === 2 ? true : false;
    const userIdIndex = Math.floor(Math.random() * userIds.length);
    const name = isCompany ? faker.company.name() : faker.person.fullName();

    suppliers.push({
      id: randomUUID(),
      userId: userIds[userIdIndex],
      name,
      nameNormalized: normalizeName(name),
      address: faker.location.streetAddress(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    });
  }

  await prisma.supplier.createMany({
    data: suppliers,
  });

  return suppliers;
}

function createUsers(count = 10) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(randomUUID());
  }
  return users;
}

async function createMovements(
  products: {userId: string; id: string; name: string}[],
) {
  const movements = [];

  for (let i = 0; i < products.length; i++) {
    const movementByProductCount = Math.floor(Math.random() * 40) + 1;

    for (let i = 0; i < movementByProductCount; i++) {
      const randomQuantity = Math.floor(Math.random() * 10) + 1;

      const types = ['SALE', 'ADD_TO_STOCK', 'REMOVE_FROM_STOCK'];
      const randomType = types[Math.floor(Math.random() * types.length)];

      const randomDate = new Date(
        Math.floor(Math.random() * 1) + 2022,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      );

      movements.push({
        id: randomUUID(),
        movementType: randomType as EnumMovementsType,
        quantity: randomQuantity,
        productId: products[i].id,
        productName: products[i].name,
        productNameNormalized: normalizeName(products[i].name),
        userId: products[i].userId,
        createdAt: randomDate,
      });
    }
  }

  await prisma.movement.createMany({
    data: movements,
  });
}

export async function bootstrap() {
  const users = createUsers(10);
  const suppliers = await createSupplier(5, users);
  const categories = await createCategory();

  const {products, productsCategories, productsSuppliers} = await createProduct(
    50,
    suppliers,
    categories,
  );

  await prisma.productCategory.createMany({
    data: productsCategories,
  });

  await prisma.productSupplier.createMany({
    data: productsSuppliers,
  });

  await createMovements(products);
  console.log('Seed data created successfully!');
}
