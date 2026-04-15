import React, { useState, useEffect } from 'react';

/**
 * ==============================================================================
 * SKELETON: WOOCOMMERCE REPORTS DASHBOARD
 * Skill: woocommerce-reports-dashboard
 * ==============================================================================
 * Este es un componente de ejemplo (React/Next/Tauri) que ilustra la arquitectura 
 * visual y la ingesta de datos de la API de WooCommerce (/reports/sales).
 */

const WooDashboardExample = () => {
  // 1. Estado Global del Dashboard
  const [dateRange, setDateRange] = useState({ 
    min: '2026-01-01', 
    max: '2026-12-31' 
  });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetcher a la API (Debe abstraerse a un servicio seguro en backend/tauri command)
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ejemplo genérico. En producción USAR el backend para ocultar cs_ y ck_.
        const response = await fetch(`/api/woo/reports/sales?min=${dateRange.min}&max=${dateRange.max}`);
        if (!response.ok) throw new Error('Error al obtener datos');
        
        const data = await response.json();
        // WooCommerce devuelve un array. Tomamos el agregado total [0]
        setReportData(data[0] || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [dateRange]);

  // 3. Export PDF Handler (Ejemplo conceptual usando window.print o html2pdf)
  const handleExportPDF = () => {
    window.print(); // Solución MVP. En PRO usar html2pdf.js o similar apuntando al ID del container.
  };

  // 4. Renderizado Condicional: Skeletons
  if (isLoading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded"></div>)}
        </div>
      </div>
    );
  }

  // 5. Renderizado Principal (UX Premium)
  return (
    <div id="dashboard-container" className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      
      {/* A. Cabecera y Filtros */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Rendimiento Financiero</h1>
          <p className="text-slate-500">Analizando periodo: {dateRange.min} - {dateRange.max}</p>
        </div>
        <div className="flex gap-4">
          <input type="date" className="border rounded px-3 py-2" defaultValue={dateRange.min} onChange={(e) => setDateRange({...dateRange, min: e.target.value})}/>
          <input type="date" className="border rounded px-3 py-2" defaultValue={dateRange.max} onChange={(e) => setDateRange({...dateRange, max: e.target.value})}/>
          <button onClick={handleExportPDF} className="bg-slate-800 text-white px-4 py-2 rounded shadow hover:bg-slate-700 transition">
            Exportar PDF
          </button>
        </div>
      </header>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

      {/* B. Top Cards (Jerarquía de Información) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Ventas Brutas" value={`€${reportData?.total_sales || '0.00'}`} trend="+12%" />
        <StatCard title="Ventas Netas" value={`€${reportData?.net_sales || '0.00'}`} trend="+8%" />
        <StatCard title="Total Pedidos" value={reportData?.total_orders || '0'} trend="-2%" />
        <StatCard title="Reembolsos Emitidos" value={`€${reportData?.total_refunds || '0.00'}`} alert={true} />
      </section>

      {/* C. Gráficos y Tablas */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
           <h3 className="text-lg font-semibold mb-4 text-slate-700">Evolución de Ingresos</h3>
           {/* Aquí iría un componente Recharts <LineChart> */}
           <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50 rounded">
              [Espacio para Gráfico de Líneas Recharts]
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-semibold mb-4 text-slate-700">Top Productos</h3>
            {/* Aquí iría una tabla o Doughnut Chart */}
            <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50 rounded">
              [Espacio para Ranking Lista/PieChart]
           </div>
        </div>
      </section>

    </div>
  );
};

// Sub-componente UI Menor
const StatCard = ({ title, value, trend, alert = false }) => (
  <div className={`p-6 rounded-xl shadow-sm border ${alert ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
    <h4 className="text-slate-500 text-sm font-medium mb-2">{title}</h4>
    <div className="flex items-baseline justify-between">
      <span className={`text-3xl font-bold ${alert ? 'text-red-700' : 'text-slate-800'}`}>{value}</span>
      {trend && (
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

export default WooDashboardExample;
