import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const TASK_TITLES: Record<string, string> = {
    oil: "Aceite de Motor",
    filters_car: "Filtros",
    tyres_car: "Neumáticos",
    timing_belt: "Kit Distribución",
    adblue: "AdBlue",
    brake_fluid: "Líquido de Frenos",
    tire_front: "Neumático Delantero",
    tire_rear: "Neumático Trasero",
    brake_fluid_moto: "Líquido de Frenos",
    brake_pads_moto: "Pastillas de Freno",
    battery_moto: "Batería",
    engine_oil_moto: "Aceite de Motor",
    filters_moto: "Filtros",
    spark_plugs: "Bujías",
    coolant_moto: "Refrigerante",
    desmo: "Desmo Service",
    chain_kit: "Kit de Arrastre",
    chain: "Engrase Cadena",
    fork_oil: "Aceite Horquilla",
    clutch_moto: "Embrague"
};

const getHistoryTitle = (taskId: string, subType: string | undefined) => {
    const title = TASK_TITLES[taskId] || taskId;
    if (subType) {
        if (title.toLowerCase().includes('filtros')) return `Cambio de Filtro: ${subType}`;
        return `Cambio: ${subType}`;
    }
    const lower = title.toLowerCase();
    if (lower.includes('adblue')) return 'Relleno de AdBlue';
    if (lower.includes('engrase')) return 'Engrase realizado';
    if (lower.includes('presión') || lower.includes('revisión')) return 'Revisión realizada';
    if (lower.includes('desmo')) return 'Desmo Service realizado';
    if (lower.includes('itv')) return 'ITV pasada';
    return `Sustitución: ${title}`;
};

const History: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [historyItems, setHistoryItems] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            // Fetch Vehicles and Logs in parallel
            const [vehiclesRes, logsRes] = await Promise.all([
                supabase.from('vehicles').select('*'),
                supabase.from('maintenance_logs').select('*')
            ]);

            const vehicles = vehiclesRes.data || [];
            const logs = logsRes.data || [];

            const items = logs.map(log => {
                const vehicle = vehicles.find(v => v.id === log.vehicle_id);

                return {
                    id: log.id,
                    date: log.date,
                    km: log.odometer_km,
                    taskId: log.task_key,
                    title: getHistoryTitle(log.task_key, undefined),
                    vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehículo desconocido',
                    vehicleType: vehicle ? vehicle.type : 'car',
                    subType: log.notes
                };
            });

            // Sort by date descending
            items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setHistoryItems(items);
        }

        fetchData();
    }, [user]);

    const iconMap: any = { 'car': 'directions_car', 'moto': 'two_wheeler' };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark antialiased transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-[#f0f5f1] dark:border-[#2a3c30]">
                <div className="max-w-[960px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
                        <h1 className="text-xl font-bold tracking-tight">Historial Completo</h1>
                    </div>
                    <div className="flex gap-2">
                        <DarkModeToggle />
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 py-8 pb-24">
                {/* Timeline */}
                {historyItems.length === 0 ? (
                    <div className="text-center py-20 opacity-60">
                        <div className="h-24 w-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-5xl text-gray-400">history_toggle_off</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Sin registros aún</h3>
                        <p className="text-sm">Completa tareas en el panel para verlas aquí.</p>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 md:ml-6 space-y-10">
                        {historyItems.map((item, index) => (
                            <div key={index} className="relative pl-8 md:pl-10">
                                {/* Dot */}
                                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-[#0A0D14] bg-primary shadow-sm"></div>

                                {/* Content */}
                                <div className="bg-card-light dark:bg-card-dark rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-text-main dark:text-white">{item.title}</span>
                                            {item.subType && item.subType !== '' && (
                                                <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium truncate max-w-[150px]">
                                                    {item.subType}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-black/20 px-2 py-1 rounded">
                                            {new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                            <span className="material-symbols-outlined text-gray-500 text-lg">
                                                {iconMap[item.vehicleType]}
                                            </span>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">
                                                {item.vehicleName}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-text-muted dark:text-text-muted-dark">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-lg">speed</span>
                                                <span className="font-mono font-medium">{item.km.toLocaleString('es-ES')} km</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default History;
