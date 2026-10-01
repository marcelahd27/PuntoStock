// Clave única para identificar los datos de PuntoStock en el almacenamiento local del navegador
const STORAGE_KEY = 'puntostock_products_v1';

// Datos iniciales de demostración para que el sistema no empiece completamente vacío
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    codigo: 'PROD-001',
    nombre: 'Arroz Superior 1kg',
    categoria: 'Abarrotes',
    precio: 1.50,
    stock: 25,
    minStock: 5,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '2',
    codigo: 'PROD-002',
    nombre: 'Aceite Vegetal 1L',
    categoria: 'Abarrotes',
    precio: 3.20,
    stock: 4, // Stock bajo para alerta
    minStock: 10,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '3',
    codigo: 'PROD-003',
    nombre: 'Detergente Multiusos 500g',
    categoria: 'Limpieza',
    precio: 2.10,
    stock: 18,
    minStock: 8,
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: '4',
    codigo: 'PROD-004',
    nombre: 'Leche Entera 1L',
    categoria: 'Lácteos',
    precio: 1.25,
    stock: 2, // Stock crítico
    minStock: 6,
    fechaActualizacion: new Date().toISOString()
  }
];

/**
 * Obtener todos los productos guardados en el navegador.
 */
export const getProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Si es la primera vez que se abre la app, guardamos los datos de prueba
      saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer productos de localStorage:', error);
    return DEFAULT_PRODUCTS;
  }
};

/**
 * Guardar la lista completa de productos en el navegador.
 */
export const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error al guardar productos en localStorage:', error);
  }
};
