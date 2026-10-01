import React, { useState } from 'react';

export const ProductTable = ({ products, onEdit, onDelete, onUpdateStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedBodega, setSelectedBodega] = useState('Todas');

  const categories = ['Todas', ...new Set(products.map((p) => p.categoria || 'General'))];
  const bodegas = ['Todas', 'Bodega 1 (Pantallas)', 'Bodega 2 (Escritorio)'];

  // Filtrado dinámico por búsqueda, categoría y bodega
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todas' || product.categoria === selectedCategory;

    const matchesBodega =
      selectedBodega === 'Todas' || product.bodega === selectedBodega;

    return matchesSearch && matchesCategory && matchesBodega;
  });

  return (
    <div className="table-container-card">
      <div className="table-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por código o repuesto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-box">
            <label>Ubicación:</label>
            <select
              value={selectedBodega}
              onChange={(e) => setSelectedBodega(e.target.value)}
            >
              {bodegas.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="filter-box">
            <label>Categoría:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Repuesto</th>
              <th>Ubicación Bodega</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock Bodega</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No se encontraron repuestos en bodega que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isLowStock = Number(product.stock) <= Number(product.minStock || 3);
                const isCriticalStock = Number(product.stock) <= 1;

                return (
                  <tr key={product.id}>
                    <td>
                      <span className="code-badge">{product.codigo}</span>
                    </td>
                    <td>
                      <strong className="product-name">{product.nombre}</strong>
                    </td>
                    <td>
                      <span className="location-tag">{product.bodega || 'Bodega 1 (Pantallas)'}</span>
                    </td>
                    <td>
                      <span className="category-pill">{product.categoria}</span>
                    </td>
                    <td className="price-cell">
                      ${Number(product.precio).toFixed(2)}
                    </td>
                    <td>
                      <div className="stock-control">
                        <button
                          className="btn-stock-quick"
                          onClick={() => onUpdateStock(product.id, -1)}
                          title="Descontar 1 unidad"
                        >
                          -
                        </button>
                        <span className="stock-number">{product.stock}</span>
                        <button
                          className="btn-stock-quick"
                          onClick={() => onUpdateStock(product.id, 1)}
                          title="Sumar 1 unidad"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      {product.stock <= 0 ? (
                        <span className="badge badge-danger">❌ Agotado</span>
                      ) : isCriticalStock ? (
                        <span className="badge badge-danger">⚠️ Última Unidad</span>
                      ) : isLowStock ? (
                        <span className="badge badge-warning">⚡ Stock Bajo</span>
                      ) : (
                        <span className="badge badge-success">✓ En Bodega</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => onEdit(product)}
                          title="Editar Repuesto"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => onDelete(product.id)}
                          title="Eliminar Repuesto"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
