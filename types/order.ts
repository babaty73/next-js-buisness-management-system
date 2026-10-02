export interface OrderCustomer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface OrderProduct {
  _id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  product: string | OrderProduct;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customer: string | OrderCustomer;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}