import React, { useState } from 'react';

export const ProductTable = ({ products, onEdit, onDelete, onUpdateStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('Todas');
  const [selectedCalidad, setSelectedCalidad] = useState('Todas');
  const [selectedBodega, setSelectedBodega] = useState('Todas');

  const marcas = ['Todas', ...new Set(products.map((p) => p.marca || 'Otra'))];
  const calidades = ['Todas', ...new Set(products.map((p) => p.calidad || 'Standard'))];
  const bodegas = ['Todas', 'Bodega 1 (Pantallas)', 'Bodega 2 (Escritorio)'];

  // Filtrado dinámico por búsqueda, Marca, Calidad y Bodega
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (product.modelo || '').toLowerCase().includes(search) ||
      (product.marca || '').toLowerCase().includes(search) ||
      (product.codigo || '').toLowerCase().includes(search);

    const matchesMarca = selectedMarca === 'Todas' || product.marca === selectedMarca;
    const matchesCalidad = selectedCalidad === 'Todas' || product.calidad === selectedCalidad;
    const matchesBodega = selectedBodega === 'Todas' || product.bodega === selectedBodega;

    return matchesSearch && matchesMarca && matchesCalidad && matchesBodega;
  });

  return (
    <div className="table-container-card">
      {/* Controles de Búsqueda y Filtros */}
      <div className="table-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por marca o modelo (ej: A54, iPhone, Samsung)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {/* Filtro Marca */}
          <div className="filter-box">
            <label>Marca:</label>
            <select value={selectedMarca} onChange={(e) => setSelectedMarca(e.target.value)}>
              {marcas.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Filtro Calidad */}
          <div className="filter-box">
            <label>Calidad:</label>
            <select value={selectedCalidad} onChange={(e) => setSelectedCalidad(e.target.value)}>
              {calidades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Filtro Bodega */}
          <div className="filter-box">
            <label>Ubicación:</label>
            <select value={selectedBodega} onChange={(e) => setSelectedBodega(e.target.value)}>
              {bodegas.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla limpia enfocada en los datos clave (Sin Estado ni Acciones) */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Calidad</th>
              <th>Ubicación Bodega</th>
              <th>Precio ($)</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No hay repuestos registrados que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                return (
                  <tr 
                    key={product.id}
                    className="table-row-clickable"
                    onClick={(e) => {
                      // Solo abrir modal de editar si no se hace clic en los botones de + o -
                      if (!e.target.classList.contains('btn-stock-quick')) {
                        onEdit(product);
                      }
                    }}
                    title="Haz clic en la fila para editar este repuesto"
                  >
                    <td>
                      <span className="brand-tag">{product.marca}</span>
                    </td>
                    <td>
                      <strong className="product-name">{product.modelo}</strong>
                    </td>
                    <td>
                      <span className="quality-badge">{product.calidad}</span>
                    </td>
                    <td>
                      <span className="location-tag">{product.bodega}</span>
                    </td>
                    <td className="price-cell">
                      ${Number(product.precio).toFixed(2)}
                    </td>
                    <td>
                      <div className="stock-control" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-stock-quick"
                          onClick={() => onUpdateStock(product.id, -1)}
                          title="Descontar 1 unidad"
                        >
                          -
                        </button>
                        <span className={`stock-number ${product.stock <= 0 ? 'text-red' : ''}`}>
                          {product.stock}
                        </span>
                        <button
                          className="btn-stock-quick"
                          onClick={() => onUpdateStock(product.id, 1)}
                          title="Sumar 1 unidad"
                        >
                          +
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
