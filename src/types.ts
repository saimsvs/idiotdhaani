export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageBase64: string; // Stored as base64 or empty string for placeholder
}

export interface Analytics {
  visitors: number;
  cartClicks: Record<string, number>;
}
