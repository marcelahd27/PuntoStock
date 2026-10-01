import React, { useState, useEffect } from 'react';

export const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: 'General',
    precio: '',
    stock: '',
    minStock: 5
  });

  const categories = ['Abarrotes', 'Limpieza', 'Lácteos', 'Bebidas', 'Snacks', 'General'];

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        codigo: productToEdit.codigo || '',
        nombre: productToEdit.nombre || '',
        categoria: productToEdit.categoria || 'General',
        precio: productToEdit.precio || '',
        stock: productToEdit.stock || '',
        minStock: productToEdit.minStock || 5
      });
    } else {
      setFormData({
        codigo: `PROD-${Math.floor(100 + Math.random() * 900)}`,
        nombre: '',
        categoria: 'General',
        precio: '',
        stock: '',
        minStock: 5
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
          <h2>{productToEdit ? '✏️ Editar Producto' : '✨ Nuevo Producto'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Código del Producto</label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Ej: PROD-101"
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

          <div className="form-group">
            <label>Nombre del Producto</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Cafe Soluble 200g"
              required
            />
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
              <label>Stock Actual</label>
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
                placeholder="5"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
