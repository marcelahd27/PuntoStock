import React, { useState, useEffect } from 'react';

export const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Pantallas',
    bodega: 'Bodega 1 (Pantallas)',
    precio: '',
    stock: '',
    minStock: 3
  });

  const categories = ['Pantallas', 'Flex y Pinos', 'Baterías', 'Cristales / Glass', 'Cámaras', 'General'];
  const bodegas = ['Bodega 1 (Pantallas)', 'Bodega 2 (Escritorio)'];

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        codigo: productToEdit.codigo || '',
        nombre: productToEdit.nombre || '',
        categoria: productToEdit.categoria || 'Pantallas',
        bodega: productToEdit.bodega || 'Bodega 1 (Pantallas)',
        precio: productToEdit.precio || '',
        stock: productToEdit.stock || '',
        minStock: productToEdit.minStock || 3
      });
    } else {
      setFormData({
        codigo: `REP-${Math.floor(100 + Math.random() * 900)}`,
        nombre: '',
        categoria: 'Pantallas',
        bodega: 'Bodega 1 (Pantallas)',
        precio: '',
        stock: '',
        minStock: 3
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || formData.precio === '' || formData.stock === '') {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    onSave({
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      minStock: parseInt(formData.minStock, 10)
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{productToEdit ? '✏️ Editar Repuesto' : '✨ Nuevo Repuesto'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Código / Referencia</label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Ej: PAN-SAM-A54"
                required
              />
            </div>

            <div className="form-group">
              <label>Ubicación de Bodega</label>
              <select
                value={formData.bodega}
                onChange={(e) => setFormData({ ...formData, bodega: e.target.value })}
              >
                {bodegas.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre del Repuesto</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Pantalla Samsung A54 OLED"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio Unitario ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Inicial</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Mínimo (Alerta)</label>
              <input
                type="number"
                min="1"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="3"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {productToEdit ? 'Guardar Cambios' : 'Guardar Repuesto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
