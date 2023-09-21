import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Product } from '../constants/schemas/product';

export const createRandomProduct = () => {
  const name = faker.commerce.productName();
  const id = uuidv4();
  const category = faker.helpers.arrayElement([
    '/kids',
    '/kitchenware',
    '/adults',
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
