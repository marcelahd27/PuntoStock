// Claves de almacenamiento local
const PRODUCTS_KEY = 'puntostock_products_v3';
const SALES_KEY = 'puntostock_sales_v1';

// Repuestos iniciales organizados por Marca, Modelo, Calidad, Precio, Stock y Bodega
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    codigo: 'PAN-SAM-A54',
    marca: 'Samsung',
    modelo: 'Galaxy A54 5G',
    calidad: 'OLED',
    bodega: 'Bodega 1 (Pantallas)',
    precio: 45.00,
    stock: 12,
    minStock: 3,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '2',
    codigo: 'PAN-IPH-11',
    marca: 'Apple / iPhone',
    modelo: 'iPhone 11',
    calidad: 'Incell',
    bodega: 'Bodega 1 (Pantallas)',
    precio: 35.00,
    stock: 2, // Stock crítico
    minStock: 4,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '3',
    codigo: 'PAN-XIA-RED10',
    marca: 'Xiaomi',
    modelo: 'Redmi Note 10',
    calidad: 'AMOLED Original',
    bodega: 'Bodega 1 (Pantallas)',
    precio: 52.00,
    stock: 8,
    minStock: 3,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '4',
    codigo: 'PIN-MOT-G8',
    marca: 'Motorola',
    modelo: 'Moto G8 Power',
    calidad: 'Original',
    bodega: 'Bodega 2 (Escritorio)',
    precio: 5.00,
    stock: 20,
    minStock: 5,
    fechaActualizacion: new Date().toISOString()
  }
];

export const getProducts = () => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer productos:', error);
    return DEFAULT_PRODUCTS;
  }
};

export const saveProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error al guardar productos:', error);
  }
};

export const getSales = () => {
  try {
    const data = localStorage.getItem(SALES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al leer ventas:', error);
    return [];
  }
};

export const saveSales = (sales) => {
  try {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  } catch (error) {
    console.error('Error al guardar ventas:', error);
  }
};
