import React, { useState, useEffect } from 'react';
import { getProducts, saveProducts } from './utils/storage';
import { StatsCards } from './components/StatsCards';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';

export default function App() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Cargar productos al iniciar la aplicación desde localStorage
  useEffect(() => {
    const data = getProducts();
    setProducts(data);
  }, []);

  // Guardar en localStorage cada vez que la lista de productos cambie
  const handleSaveProduct = (productData) => {
    let updatedProducts;
    if (editingProduct) {
      // Actualizar producto existente
      updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? { ...p, ...productData, fechaActualizacion: new Date().toISOString() }
          : p
      );
    } else {
      // Crear nuevo producto
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        fechaActualizacion: new Date().toISOString()
      };
      updatedProducts = [newProduct, ...products];
    }

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setEditingProduct(null);
  };

  // Eliminar un producto por ID
  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  // Ajuste rápido de stock (+1 o -1)
  const handleUpdateStock = (id, delta) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const newStock = Math.max(0, Number(p.stock) + delta);
        return { ...p, stock: newStock, fechaActualizacion: new Date().toISOString() };
      }
      return p;
    });
    setProducts(updated);
    saveProducts(updated);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="app-layout">
      {/* Encabezado Principal */}
      <header className="main-header">
        <div className="header-brand">
          <span className="brand-logo">📦</span>
          <div>
            <h1>PuntoStock</h1>
            <p className="brand-tagline">Sistema de Gestión de Inventario Local</p>
          </div>
        </div>

        <button className="btn btn-primary add-prod-btn" onClick={handleOpenAddModal}>
          <span>➕</span> Nuevo Producto
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Tarjetas de Métricas de Resumen */}
        <StatsCards products={products} />

        {/* Tabla Principal de Productos */}
        <ProductTable
          products={products}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteProduct}
          onUpdateStock={handleUpdateStock}
        />
      </main>

      {/* Modal para Crear/Editar Producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
}
