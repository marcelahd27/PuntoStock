// Claves únicas de almacenamiento en localStorage
const PRODUCTS_KEY = 'puntostock_products_v2';
const SALES_KEY = 'puntostock_sales_v1';

// Productos iniciales con Ubicación de Bodega especificada
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    codigo: 'PAN-SAM-A54',
    nombre: 'Pantalla Samsung Galaxy A54 5G OLED',
    categoria: 'Pantallas',
    bodega: 'Bodega 1 (Pantallas)',
    precio: 45.00,
    stock: 12,
    minStock: 3,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '2',
    codigo: 'PAN-IPH-11',
    nombre: 'Pantalla iPhone 11 Incell',
    categoria: 'Pantallas',
    bodega: 'Bodega 1 (Pantallas)',
    precio: 35.00,
    stock: 2, // Stock crítico
    minStock: 5,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '3',
    codigo: 'PIN-XIA-RED10',
    nombre: 'Pin de Carga Xiaomi Redmi Note 10',
    categoria: 'Flex y Pinos',
    bodega: 'Bodega 2 (Escritorio)',
    precio: 4.50,
    stock: 25,
    minStock: 8,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '4',
    codigo: 'BAT-SAM-S20',
    nombre: 'Batería Samsung S20 FE',
    categoria: 'Baterías',
    bodega: 'Bodega 2 (Escritorio)',
    precio: 15.00,
    stock: 8,
    minStock: 3,
    fechaActualizacion: new Date().toISOString()
  }
];

// --- PRODUCTOS ---
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

// --- VENTAS / CAJA 3 ---
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
