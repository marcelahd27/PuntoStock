import React, { useState } from 'react';

export const NewSaleModal = ({ isOpen, onClose, products, onCompleteSale }) => {
  const [tipoComprobante, setTipoComprobante] = useState('Consumidor Final');
  const [clienteNombre, setClienteNombre] = useState('Consumidor Final');
  const [nrcNit, setNrcNit] = useState('');
  
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    if (prod.stock <= 0) {
      alert(`⚠️ El repuesto "${prod.marca} ${prod.modelo}" no tiene stock en ${prod.bodega}.`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.id === prod.id);
    if (existingIndex >= 0) {
      const currentQty = cart[existingIndex].cantidad;
      if (currentQty + cantidad > prod.stock) {
        alert(`⚠️ No puedes agregar más de ${prod.stock} unidades disponibles.`);
        return;
      }
      const updatedCart = [...cart];
      updatedCart[existingIndex].cantidad += cantidad;
      setCart(updatedCart);
    } else {
      if (cantidad > prod.stock) {
        alert(`⚠️ Solo hay ${prod.stock} unidades disponibles en bodega.`);
        return;
      }
      setCart([
        ...cart,
        {
          id: prod.id,
          codigo: prod.codigo,
          marca: prod.marca,
          modelo: prod.modelo,
          calidad: prod.calidad,
          bodega: prod.bodega,
          precio: prod.precio,
          cantidad: cantidad
        }
      ]);
    }

    setSelectedProductId('');
    setCantidad(1);
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalVenta = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleSubmitVenta = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('⚠️ Por favor agrega al menos un repuesto a la venta.');
      return;
    }

    const saleRecord = {
      id: `FAC-${Date.now()}`,
      fecha: new Date().toISOString(),
      tipoComprobante,
      clienteNombre: tipoComprobante === 'Consumidor Final' && !clienteNombre.trim() 
        ? 'Consumidor Final' 
        : clienteNombre,
      nrcNit: tipoComprobante === 'Crédito Fiscal' ? nrcNit : '',
      items: cart,
      total: totalVenta
    };

    onCompleteSale(saleRecord);
    setCart([]);
    setClienteNombre('Consumidor Final');
    setNrcNit('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-large">
        <div className="modal-header">
          <h2>🛒 Facturar y Despachar Repuesto (Caja 3)</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmitVenta} className="modal-form">
          <div className="form-row card-sub-bg">
            <div className="form-group">
              <label><strong>Tipo de Comprobante / Factura:</strong></label>
              <div className="radio-group">
                <label className={`radio-pill ${tipoComprobante === 'Consumidor Final' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="tipoDoc"
                    value="Consumidor Final"
                    checked={tipoComprobante === 'Consumidor Final'}
                    onChange={(e) => setTipoComprobante(e.target.value)}
                  />
                  🧾 Consumidor Final (Varios)
                </label>

                <label className={`radio-pill ${tipoComprobante === 'Crédito Fiscal' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="tipoDoc"
                    value="Crédito Fiscal"
                    checked={tipoComprobante === 'Crédito Fiscal'}
                    onChange={(e) => setTipoComprobante(e.target.value)}
                  />
                  🏢 Crédito Fiscal (CCF)
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre del Cliente / Empresa</label>
              <input
                type="text"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                placeholder={tipoComprobante === 'Crédito Fiscal' ? 'Razón Social' : 'Consumidor Final'}
                required
              />
            </div>

            {tipoComprobante === 'Crédito Fiscal' && (
              <div className="form-group">
                <label>NRC / NIT (Requerido para CCF)</label>
                <input
                  type="text"
                  value={nrcNit}
                  onChange={(e) => setNrcNit(e.target.value)}
                  placeholder="Ej: 123456-7"
                  required
                />
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Selector con formato Marca + Modelo + Calidad */}
          <div className="form-row align-end">
            <div className="form-group flex-2">
              <label>Seleccionar Repuesto por Marca / Modelo / Calidad:</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">-- Elige repuesto de bodega --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    [{p.marca}] {p.modelo} ({p.calidad}) | {p.bodega} | Stock: {p.stock} | ${Number(p.precio).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Cant.</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value || 1, 10))}
              />
            </div>

            <button type="button" className="btn btn-secondary" onClick={handleAddItem}>
              ➕ Agregar
            </button>
          </div>

          <div className="cart-summary-table">
            <h4>Detalle del Repuesto a Despachar:</h4>
            {cart.length === 0 ? (
              <p className="empty-cart-msg">No has seleccionado ningún repuesto aún.</p>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Calidad</th>
                    <th>Bodega</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.marca}</strong></td>
                      <td>{item.modelo}</td>
                      <td><span className="quality-badge">{item.calidad}</span></td>
                      <td><span className="location-tag">{item.bodega}</span></td>
                      <td>{item.cantidad}</td>
                      <td>${item.precio.toFixed(2)}</td>
                      <td><strong>${(item.precio * item.cantidad).toFixed(2)}</strong></td>
                      <td>
                        <button
                          type="button"
                          className="action-btn delete-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="sale-total-banner">
            <span>Total a Registrar (Caja 3):</span>
            <strong className="total-amount">${totalVenta.toFixed(2)}</strong>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              ⚡ Despachar y Facturar a Caja 3
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
