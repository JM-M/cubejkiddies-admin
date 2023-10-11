import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Product } from '../constants/schemas/product';

export const createRandomProduct = () => {
  const name = faker.commerce.productName();
  const id = uuidv4();
  const category = faker.helpers.arrayElement([
    '00f6dc99-6b54-4498-b92a-cc91f7d6f819',
    '38561d9d-e8eb-4edb-bf68-42844278bb81',
    '567889fe-ec79-451b-be82-ef781506ca41',
    '735cfaf7-2f47-4e99-962b-1511ebaf4512',
    '8d56d2a2-a733-4f7d-9a2f-30c834a9544b',
    'a8b73107-6dd9-452c-b4a4-ef3f21869eb9',
    'b67f09b2-d977-4e63-afa4-7d3a17b8f86b',
    'dd97386f-1d9f-4c3d-9b8f-2e4ec375b5c5',
  ]);
  const description = faker.commerce.productDescription();
  const weight = faker.helpers.arrayElement(
    [...Array(10)].map((_, i) => (i + 1) * 100)
  );
  const price = faker.helpers.arrayElement(
    [...Array(20)].map((_, i) => (i + 1) * 1000)
  );
  const discount = faker.helpers.maybe(
    () => faker.helpers.arrayElement([...Array(5)].map((_, i) => (i + 1) * 10)),
    {
      probability: 0.5,
    }
  );

  const variations: { [key: string]: any } = JSON.parse(
    JSON.stringify({
      colors: faker.helpers.maybe(
        () =>
          faker.helpers.uniqueArray(
            () => ({
              name: faker.color.human(),
              hex: faker.color.rgb({ format: 'hex', casing: 'lower' }),
            }),
            faker.number.int({ min: 1, max: 10 })
          ),
        {
          probability: 0.9,
        }
      ),
      sizes: faker.helpers.maybe(
        () =>
          faker.helpers.uniqueArray(
            () => ({
              name: faker.helpers.arrayElement(
                [...Array(10)].map((_, i) => String(40 + i))
              ),
            }),
            faker.number.int({ min: 1, max: 10 })
          ),
        {
          probability: 0.8,
        }
      ),
      materials: faker.helpers.maybe(
        () =>
          faker.helpers.uniqueArray(
            () => ({
              name: faker.commerce.productMaterial(),
            }),
            faker.number.int({ min: 1, max: 4 })
          ),
        {
          probability: 0.5,
        }
      ),
    })
  );

  const variationKeys = Object.keys(variations);
  const variationValues = Object.values(variations);

  // maximum number of variation combinations
  const variationCombinations = variationValues
    .map((valuesArr: any[]) => valuesArr.length)
    .reduce((maxVar, currLength) => maxVar * currLength, 1);

  const maxVariationCombinations =
    variationCombinations > 10 ? 10 : variationCombinations;

  const stocks = faker.helpers.uniqueArray(
    () => ({
      variationCombination: variationKeys.reduce(
        (combination, currKey) => ({
          ...combination,
          [currKey]: faker.helpers.arrayElement(variations[currKey] as any[])
            ?.name,
        }),
        {}
      ),
    }),
    faker.number.int({
      min: 1,
      max: maxVariationCombinations,
    })
  );
  for (let i = 0; i < stocks.length; i++) {
    const stock: any = stocks[i];
    stock.quantity = faker.number.int(50);
    stock.images = faker.helpers.uniqueArray(
      () => faker.image.urlLoremFlickr({ category: 'nature' }),
      faker.number.int(5)
    );
  }

  const product: Product = JSON.parse(
    JSON.stringify({
      id,
      name,
      category,
      description,
      weight,
      price,
      discount,
      variations,
      stocks,
    })
  );
  return product;
};
