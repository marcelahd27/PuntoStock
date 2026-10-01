import React from 'react';

export const Caja3ReportModal = ({ isOpen, onClose, sales }) => {
  if (!isOpen) return null;

  // Filtrar ventas de hoy
  const today = new Date().toISOString().split('T')[0];
  const salesToday = sales.filter((s) => s.fecha.startsWith(today));

  const totalConsumidorFinal = salesToday
    .filter((s) => s.tipoComprobante === 'Consumidor Final')
    .reduce((acc, s) => acc + s.total, 0);

  const totalCreditoFiscal = salesToday
    .filter((s) => s.tipoComprobante === 'Crédito Fiscal')
    .reduce((acc, s) => acc + s.total, 0);

  const totalGeneralHoy = totalConsumidorFinal + totalCreditoFiscal;

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-large">
        <div className="modal-header">
          <h2>📊 Reporte de Ventas del Día (Caja 3)</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="caja3-summary-boxes">
          <div className="summary-box box-blue">
            <span>Ventas Consumidor Final</span>
            <h3>${totalConsumidorFinal.toFixed(2)}</h3>
          </div>

          <div className="summary-box box-purple">
            <span>Ventas Crédito Fiscal (CCF)</span>
            <h3>${totalCreditoFiscal.toFixed(2)}</h3>
          </div>

          <div className="summary-box box-green">
            <span>Total del Día para Caja 3</span>
            <h3>${totalGeneralHoy.toFixed(2)}</h3>
          </div>
        </div>

        <h4 className="sales-list-title">Historial de Despachos del Día:</h4>

        <div className="table-responsive max-height-table">
          <table className="custom-table">
            <thead>
              <tr>
                <th>N° Venta</th>
                <th>Tipo</th>
                <th>Cliente / Razón Social</th>
                <th>NRC / NIT</th>
                <th>Repuestos Enviados</th>
                <th>Total ($)</th>
              </tr>
            </thead>
            <tbody>
              {salesToday.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No se han registrado facturaciones en Caja 3 el día de hoy.
                  </td>
                </tr>
              ) : (
                salesToday.map((sale) => (
                  <tr key={sale.id}>
                    <td><span className="code-badge">{sale.id}</span></td>
                    <td>
                      <span className={`badge ${sale.tipoComprobante === 'Crédito Fiscal' ? 'badge-warning' : 'badge-success'}`}>
                        {sale.tipoComprobante}
                      </span>
                    </td>
                    <td><strong>{sale.clienteNombre}</strong></td>
                    <td>{sale.nrcNit || '-'}</td>
                    <td>
                      <ul className="items-list-bullet">
                        {sale.items.map((item, idx) => (
                          <li key={idx}>
                            {item.cantidad}x {item.nombre} ({item.bodega})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td><strong className="price-cell">${sale.total.toFixed(2)}</strong></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
