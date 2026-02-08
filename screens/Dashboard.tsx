import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

// --- Helpers de Lógica ORIGINALES (Recuperados) ---
const calculateRemaining = (taskKey: string, intervalKm: number, currentKm: number, history: any, vehicleId: string, defaultRemaining: string) => {
    if (history && history[vehicleId] && history[vehicleId][taskKey]) {
        const entry = history[vehicleId][taskKey];
        let lastServiceKm = Array.isArray(entry) ? parseInt(entry[0].km) : parseInt(entry.km);
        const kmDriven = currentKm - lastServiceKm;
        const remaining = intervalKm - kmDriven;
        return remaining < 0 ? `Vencido hace ${Math.abs(remaining).toLocaleString('es-ES')} KM` : `${remaining.toLocaleString('es-ES')} KM`;
    }
    return defaultRemaining;
};

const getMaintenanceTasks = (type: string, make: string, km: number, history: any, vehicleId: string) => {
    if (type === 'moto') {
        return [
            { id: 'oil_moto', title: "Aceite Motor", icon: "oil_barrel", color: "text-orange-600", bg: "bg-orange-50", subtitle: "Cambio de aceite y filtro", remaining: calculateRemaining('oil_moto', 5000, km, history, vehicleId, "5.000 KM") },
            { id: 'chain', title: "Kit de Arrastre", icon: "link", color: "text-gray-600", bg: "bg-gray-100", subtitle: "Cadena, piñón y corona", remaining: calculateRemaining('chain', 20000, km, history, vehicleId, "20.000 KM") },
            { id: 'tires_moto', title: "Neumáticos", icon: "two_wheeler", color: "text-blue-600", bg: "bg-blue-50", subtitle: "Desgaste y presión", remaining: calculateRemaining('tires_moto', 10000, km, history, vehicleId, "10.000 KM") },
        ];
    } else {
        return [
            { id: 'oil', title: "Aceite de Motor", icon: "oil_barrel", color: "text-orange-600", bg: "bg-orange-50", subtitle: "Sustitución lubricante", remaining: calculateRemaining('oil', 15000, km, history, vehicleId, "15.000 KM") },
            { id: 'filters_car', title: "Filtros", icon: "filter_alt", color: "text-yellow-600", bg: "bg-yellow-50", subtitle: "Aceite, Aire...", remaining: calculateRemaining('filters_car', 15000, km, history, vehicleId, "15.000 KM") },
            { id: 'tyres_car', title: "Neumáticos", icon: "tire_repair", color: "text-blue-600", bg: "bg-blue-50", subtitle: "Rotación o cambio", remaining: calculateRemaining('tyres_car', 40000, km, history, vehicleId, "40.000 KM") },
        ];
    }
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Para recibir datos sin login
    const { user } = useAuth();
    
    const [vehicle, setVehicle] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [history, setHistory] = useState<any>({});
    const [showKmModal, setShowKmModal] = useState(false);

    useEffect(() => {
        const initDashboard = async () => {
            // 1. INTENTO DE CARGAR DATOS REALES (SI HAY LOGIN)
            if (user) {
                const { data: vehicles } = await supabase.from('vehicles').select('*');
                if (vehicles && vehicles.length > 0) {
                    const v = { ...vehicles[0], mileage: vehicles[0].odometer_km };
                    setVehicle(v);
                    setTasks(getMaintenanceTasks(v.type, v.make, parseInt(v.mileage), {}, v.id));
                    return;
                }
            }

            // 2. FALLBACK: SI NO HAY LOGIN, USAMOS LOS DATOS PASADOS (SIN INVENTAR)
            if (location.state?.localVehicle) {
                const v = location.state.localVehicle;
                setVehicle(v);
                // Usamos la lógica REAL de cálculo, no datos falsos
                setTasks(getMaintenanceTasks(v.type, v.make, v.mileage, {}, v.id));
                return;
            }

            // 3. Si no hay nada, redirigimos al inicio
            if (!user && !location.state?.localVehicle) {
                navigate('/');
            }
        };

        initDashboard();
    }, [user, navigate, location.state]);

    if (!vehicle) return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Cargando tu garaje...</div>;

    const iconMap: any = { 'car': 'directions_car', 'moto': 'two_wheeler' };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark font-display">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#1a2920]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#2a3c30]">
                <div className="max-w-[960px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-2xl text-primary">directions_car</span>
                        <h1 className="text-xl font-bold">Car Care App</h1>
                    </div>
                    <div className="flex gap-2 items-center">
                         <DarkModeToggle />
                        <button onClick={() => navigate('/login')} className="p-2"><span className="material-symbols-outlined text-red-500">logout</span></button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[960px] mx-auto px-4 md:px-6 py-6 pb-24">
                {/* Vehicle Card */}
                <div className="flex items-center justify-between mb-8 relative z-20 bg-white dark:bg-[#1a2920] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2a3f32]">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                             <span className="material-symbols-outlined text-4xl">{iconMap[vehicle.type] || 'directions_car'}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-400">Vehículo Activo</p>
                            <h2 className="text-3xl font-extrabold capitalize leading-none mb-1">{vehicle.make} {vehicle.model}</h2>
                            <div className="flex items-center gap-2 text-gray-500 font-medium cursor-pointer hover:text-primary transition-colors" onClick={() => setShowKmModal(true)}>
                                <span className="material-symbols-outlined text-lg">edit_road</span>
                                <span>{parseInt(vehicle.mileage).toLocaleString('es-ES')} km</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                <h3 className="text-lg font-bold mb-4 opacity-80">Mantenimiento Programado</h3>
                <div className="grid grid-cols-1 gap-4">
                    {tasks.map((task, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#1a2920] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3f32] flex items-center gap-4 hover:border-primary/40 transition-all cursor-pointer">
                            <div className={`h-12 w-12 rounded-xl ${task.bg} ${task.color} flex items-center justify-center shrink-0`}>
                                <span className="material-symbols-outlined text-2xl">{task.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg">{task.title}</h4>
                                <p className="text-sm opacity-60 font-medium">{task.subtitle}</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-black text-gray-800 dark:text-gray-200">{task.remaining}</span>
                                <span className="text-xs text-gray-400 font-bold uppercase">Restante</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
