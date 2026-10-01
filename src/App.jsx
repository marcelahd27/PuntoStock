import React, { useState, useEffect } from 'react';
import { getProducts, saveProducts, getSales, saveSales } from './utils/storage';
import { StatsCards } from './components/StatsCards';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';
import { NewSaleModal } from './components/NewSaleModal';
import { Caja3ReportModal } from './components/Caja3ReportModal';

export default function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  
  // Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isCaja3ReportOpen, setIsCaja3ReportOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    setProducts(getProducts());
    setSales(getSales());
  }, []);

  // Guardar o Editar Repuesto en Inventario
  const handleSaveProduct = (productData) => {
    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? { ...p, ...productData, fechaActualizacion: new Date().toISOString() }
          : p
      );
    } else {
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

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este repuesto del sistema?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

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

  // Procesar una Nueva Venta (Facturación Caja 3 + Descuento automático de Bodega)
  const handleCompleteSale = (saleRecord) => {
    // 1. Descontar las cantidades de stock de los productos involucrados
    let updatedProducts = [...products];

    saleRecord.items.forEach((item) => {
      updatedProducts = updatedProducts.map((p) => {
        if (p.id === item.id) {
          const remainingStock = Math.max(0, p.stock - item.cantidad);
          return { ...p, stock: remainingStock, fechaActualizacion: new Date().toISOString() };
        }
        return p;
      });
    });

    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    // 2. Registrar la venta en la Caja 3
    const updatedSales = [saleRecord, ...sales];
    setSales(updatedSales);
    saveSales(updatedSales);

    alert(`✅ Venta registrada exitosamente en Caja 3.\nFacturado a: ${saleRecord.clienteNombre}\nTotal: $${saleRecord.total.toFixed(2)}\nStock en bodega actualizado.`);
  };

  return (
    <div className="app-layout">
      {/* Encabezado Principal */}
      <header className="main-header">
        <div className="header-brand">
          <span className="brand-logo">📱</span>
          <div>
            <h1>PuntoStock Repuestos</h1>
            <p className="brand-tagline">Control de Inventario Multibodega y Caja 3</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setIsCaja3ReportOpen(true)}>
            📊 Cierre de Caja 3
          </button>
          <button className="btn btn-success" onClick={() => setIsSaleModalOpen(true)}>
            ⚡ Facturar y Despachar (Caja 3)
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}>
            ➕ Nuevo Repuesto
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Tarjetas de Métricas */}
        <StatsCards products={products} />

        {/* Tabla de Inventario de Bodega */}
        <ProductTable
          products={products}
          onEdit={(prod) => { setEditingProduct(prod); setIsProductModalOpen(true); }}
          onDelete={handleDeleteProduct}
          onUpdateStock={handleUpdateStock}
        />
      </main>

      {/* Modales */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      <NewSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        products={products}
        onCompleteSale={handleCompleteSale}
      />

      <Caja3ReportModal
        isOpen={isCaja3ReportOpen}
        onClose={() => setIsCaja3ReportOpen(false)}
        sales={sales}
      />
    </div>
  );
}
