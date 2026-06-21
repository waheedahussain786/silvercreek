export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[];
  has_sizes: boolean;
  sizes: string[];
  quantity: number;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  size_inventory?: ProductSizeInventory[];
  tags?: Tag[];
};

export type ProductSizeInventory = {
  id: string;
  product_id: string;
  size: string;
  quantity: number;
};

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type Order = {
  id: string;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  shipping_rate: number;
  subtotal: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  size: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type StoreSettings = {
  id: number;
  shipping_rate: number;
  free_shipping_threshold: number | null;
  store_announcement: string | null;
  updated_at: string;
};

export type CartItem = {
  product: Product;
  size: string | null;
  quantity: number;
};
