export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  images: string[];
  category: string;
  variants: {
    sizes: string[];
    colors: { name: string; hex: string }[];
  };
  stock: number;
  sku: string;
  isFeatured: boolean;
  isTrending: boolean;
  isNewCollection: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number;
  createdAt: any;
  updatedAt: any;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface StatusUpdate {
  status: string;
  timestamp: any;
  note?: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  statusHistory?: StatusUpdate[];
  trackingNumber?: string;
  paymentMethod: 'COD';
  createdAt: any;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: 'hero' | 'promo';
}

export interface Coupon {
  id: string;
  code: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
  expiryDate: any;
  isActive: boolean;
}
