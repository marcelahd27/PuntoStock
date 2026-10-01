import React from 'react';

export const StatsCards = ({ products }) => {
  // Cálculo de estadísticas clave
  const totalProducts = products.length;
  
  const totalStockUnits = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  
  const totalValue = products.reduce(
    (acc, p) => acc + (Number(p.precio || 0) * Number(p.stock || 0)), 
    0
  );

  const lowStockCount = products.filter(
    (p) => Number(p.stock) <= Number(p.minStock || 5)
  ).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon icon-blue">📦</div>
        <div className="stat-info">
          <span className="stat-label">Total Productos</span>
          <h3 className="stat-value">{totalProducts}</h3>
          <span className="stat-sub">{totalStockUnits} unidades totales</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-green">💰</div>
        <div className="stat-info">
          <span className="stat-label">Valor del Inventario</span>
          <h3 className="stat-value">${totalValue.toFixed(2)}</h3>
          <span className="stat-sub">En valor monetario</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-amber">⚠️</div>
        <div className="stat-info">
          <span className="stat-label">Alertas de Stock Bajo</span>
          <h3 className="stat-value">{lowStockCount}</h3>
          <span className="stat-sub">Productos por reponer</span>
        </div>
      </div>
    </div>
  );
};
