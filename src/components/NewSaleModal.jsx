import React, { useState } from 'react';

export const NewSaleModal = ({ isOpen, onClose, products, onCompleteSale }) => {
  const [tipoComprobante, setTipoComprobante] = useState('Consumidor Final'); // 'Consumidor Final' o 'Crédito Fiscal'
  const [clienteNombre, setClienteNombre] = useState('Cliente Vacio / Consumidor Final');
  const [nrcNit, setNrcNit] = useState('');
  
  // Lista de items agregados a la nota de venta
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    if (prod.stock <= 0) {
      alert(`⚠️ El repuesto "${prod.nombre}" no tiene stock disponible en ${prod.bodega}.`);
      return;
    }

    // Verificar si ya está en el carrito
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
          nombre: prod.nombre,
          bodega: prod.bodega,
          precio: prod.precio,
          cantidad: cantidad
        }
      ]);
    }

    // Reset selección rápida
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
    
    // Limpiar modal
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
          {/* Tipo de Documento Fiscal */}
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

          {/* Datos del Cliente */}
          <div className="form-row">
            <div className="form-group">
              <label>Nombre del Cliente / Empresa</label>
              <input
                type="text"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                placeholder={tipoComprobante === 'Crédito Fiscal' ? 'Razón Social o Nombre' : 'Nombre o Consumidor Final'}
                required
              />
            </div>

            {tipoComprobante === 'Crédito Fiscal' && (
              <div className="form-group">
                <label>NRC / NIT o DUI (Requerido para CCF)</label>
                <input
                  type="text"
                  value={nrcNit}
                  onChange={(e) => setNrcNit(e.target.value)}
                  placeholder="Ej: 123456-7 / 0614-000000-000-0"
                  required
                />
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Selector de Repuestos */}
          <div className="form-row align-end">
            <div className="form-group flex-2">
              <label>Seleccionar Repuesto disponible:</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">-- Elige repuesto de bodega --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.codigo} - {p.nombre} ({p.bodega}) | Stock: {p.stock} | ${Number(p.precio).toFixed(2)}
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

          {/* Detalle del Pedido */}
          <div className="cart-summary-table">
            <h4>Detalle de la Venta (Descuento automático de Bodega):</h4>
            {cart.length === 0 ? (
              <p className="empty-cart-msg">No has seleccionado ningún repuesto aún.</p>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Repuesto</th>
                    <th>Ubicación</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.codigo}</td>
                      <td>{item.nombre}</td>
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
            <span>Total a Facturar (Caja 3):</span>
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
