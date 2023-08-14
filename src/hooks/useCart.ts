export type CheckoutAddress = {
  additionalDetails?: string | undefined;
  country: string;
  state: string;
  city: string;
  streetAddress: string;
  zipCode: string;
};

export type CheckoutContact = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type CheckoutDelivery = {
  id: string;
  price: number;
  carrier: string;
  estimatedDeliveryTime: string;
  logo: string;
};

export type Checkout = {
  address: CheckoutAddress;
  contact: CheckoutContact;
  delivery: CheckoutDelivery;
};

export type ProductWithCartOptions = Product & {
  id: string;
  qty: number;
  variant: any;
};

type Product = {
  id?: string | undefined;
  name: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  variations: {};
  stocks: {
    images: (any | undefined)[];
    quantity: number;
    variationCombination: {};
  }[];
};

export interface Cart {
  uid: string;
  products: ProductWithCartOptions[];
  checkout?: Checkout;
}

export const measureCart = (cartProducts: ProductWithCartOptions[]) => {
  return cartProducts?.length
    ? cartProducts.reduce(
        (
          prev: { cartSize: number; totalCartValue: number },
          curr: ProductWithCartOptions
        ) => ({
          cartSize: curr.qty + prev.cartSize,
          totalCartValue: curr.qty * curr.price + prev.totalCartValue,
        }),
        { cartSize: 0, totalCartValue: 0 }
      )
    : { cartSize: 0, totalCartValue: 0 };
};
