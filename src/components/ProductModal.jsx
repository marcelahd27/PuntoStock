import React, { useState, useEffect } from 'react';

export const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [formData, setFormData] = useState({
    marca: 'Samsung',
    modelo: '',
    calidad: 'OLED',
    bodega: 'Bodega 1 (Pantallas)',
    precio: '',
    stock: '',
    minStock: 3
  });

  const marcasComunes = ['Samsung', 'Apple / iPhone', 'Xiaomi', 'Motorola', 'Huawei', 'Honor', 'ZTE', 'Oppo', 'Infinix', 'Otra'];
  const calidadesComunes = ['OLED', 'Incell', 'AMOLED Original', 'TFT', 'AAA', 'Original Desarmada', 'OEM'];
  const bodegas = ['Bodega 1 (Pantallas)', 'Bodega 2 (Escritorio)'];

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        marca: productToEdit.marca || 'Samsung',
        modelo: productToEdit.modelo || '',
        calidad: productToEdit.calidad || 'OLED',
        bodega: productToEdit.bodega || 'Bodega 1 (Pantallas)',
        precio: productToEdit.precio || '',
        stock: productToEdit.stock || '',
        minStock: productToEdit.minStock || 3
      });
    } else {
      setFormData({
        marca: 'Samsung',
        modelo: '',
        calidad: 'OLED',
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
    if (!formData.modelo.trim() || formData.precio === '' || formData.stock === '') {
      alert('Por favor ingresa el Modelo, Precio y Stock.');
      return;
    }

    const codigoGenerado = `REP-${formData.marca.substring(0, 3).toUpperCase()}-${formData.modelo.replace(/\s+/g, '').substring(0, 5).toUpperCase()}`;

    onSave({
      ...formData,
      codigo: productToEdit?.codigo || codigoGenerado,
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
          <h2>{productToEdit ? '✏️ Editar Repuesto' : '✨ Registrar Nuevo Repuesto'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            {/* Campo 1: MARCA */}
            <div className="form-group">
              <label>1. Marca</label>
              <select
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              >
                {marcasComunes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Campo 2: MODELO */}
            <div className="form-group">
              <label>2. Modelo</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                placeholder="Ej: Galaxy A54 5G / iPhone 11"
                required
              />
            </div>
          </div>

          <div className="form-row">
            {/* Campo 3: CALIDAD */}
            <div className="form-group">
              <label>3. Calidad del Repuesto</label>
              <select
                value={formData.calidad}
                onChange={(e) => setFormData({ ...formData, calidad: e.target.value })}
              >
                {calidadesComunes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Ubicación de Bodega */}
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
            {/* Campo 4: PRECIO */}
            <div className="form-group">
              <label>4. Precio Unitario ($)</label>
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

            {/* Stock */}
            <div className="form-group">
              <label>Cantidad en Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {productToEdit ? 'Guardar Cambios' : 'Guardar en Inventario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
