import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

// --- 1. DEFINICIONES INTERNAS (Para no depender de archivos externos) ---

// Tipos
type NotificationType = 'info' | 'warning' | 'danger';
interface NotificationItem {
    message: string;
    type: NotificationType;
}

// COMPONENTE: Banner de Notificaciones (Integrado aquí)
const NotificationBanner: React.FC<{ notifications: NotificationItem[], onClose: (index: number) => void }> = ({ notifications, onClose }) => {
    if (notifications.length === 0) return null;
    const getStyles = (type: NotificationType) => {
        switch (type) {
            case 'danger': return "bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
            case 'warning': return "bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200";
            default: return "bg-blue-100/50 border-blue-200 text-blue-800 dark:text-blue-200";
        }
    };
    return (
        <div className="mb-6 flex flex-col gap-2">
            {notifications.map((note, idx) => (
                <div key={idx} className={`${getStyles(note.type)} border p-4 rounded-xl flex items-start gap-3 shadow-sm`}>
                    <span className="material-symbols-outlined">{note.type === 'danger' ? 'error' : 'info'}</span>
                    <p className="text-sm font-bold flex-1">{note.message}</p>
                    <button onClick={() => onClose(idx)} className="opacity-70 hover:opacity-100"><span className="material-symbols-outlined">close</span></button>
                </div>
            ))}
        </div>
    );
};

// COMPONENTE: Modal de KM (Integrado aquí)
const KmUpdateModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (km: string) => void, currentKm: string }> = ({ isOpen, onClose, onSave, currentKm }) => {
    const [km, setKm] = useState(currentKm);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a2920] w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in zoom-in-95 border border-gray-100 dark:border-[#2a3f32]">
                <h3 className="text-lg font-bold mb-4 text-center dark:text-white">Actualizar Kilometraje</h3>
                <input type="number" value={km} onChange={(e) => setKm(e.target.value)} className="w-full text-3xl font-black text-center py-4 bg-gray-50 dark:bg-[#15231b] rounded-xl border border-gray-200 dark:border-[#354f40] mb-6 dark:text-white" autoFocus />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancelar</button>
                    <button onClick={() => onSave(km)} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg">Guardar</button>
                </div>
            </div>
        </div>
    );
};

// --- 2. LÓGICA DEL DASHBOARD ---

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Estado principal
    const [vehicle, setVehicle] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [showKmModal, setShowKmModal] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    // Cargar datos al iniciar
    useEffect(() => {
        // 1. ¿Viene del paso anterior (Configuración)?
        if (location.state?.localVehicle) {
            const v = location.state.localVehicle;
            loadVehicleData(v);
        } 
        // 2. Si no, usamos un coche de ejemplo por defecto para que NO salga en blanco
        else {
            const defaultCar = {
                id: 'default',
                type: 'car',
                make: 'Vehículo',
                model: 'De Ejemplo',
                mileage: '15000'
            };
            loadVehicleData(defaultCar);
        }
    }, [location.state]);

    const loadVehicleData = (v: any) => {
        setVehicle(v);
        // Generamos las tareas basadas en el vehículo cargado
        const newTasks = generateTasks(v.type, parseInt(v.mileage));
        setTasks(newTasks);
        
        // Generamos una notificación de ejemplo si el KM es alto
        if (parseInt(v.mileage) > 100000) {
            setNotifications([{ type: 'warning', message: 'Tu vehículo tiene más de 100.000km. Revisa la correa de distribución.' }]);
        }
    };

    // Generador de Tareas (Lógica simplificada aquí mismo)
    const generateTasks = (type: string, km: number) => {
        const createItem = (id: string, title: string, subtitle: string, icon: string, color: string, interval: number) => {
            const remaining = interval - (km % interval);
            return {
                id, title, subtitle, icon, color,
                remaining: `${remaining.toLocaleString('es-ES')} km`
            };
        };

        if (type === 'moto') {
            return [
                createItem('oil', 'Aceite Motor', 'Cambio de aceite', 'oil_barrel', 'bg-orange-100 text-orange-600', 5000),
                createItem('chain', 'Kit de Arrastre', 'Engrase y tensión', 'link', 'bg-gray-100 text-gray-600', 1000),
                createItem('tires', 'Neumáticos', 'Presión y dibujo', 'two_wheeler', 'bg-blue-100 text-blue-600', 10000),
            ];
        } else {
            return [
                createItem('oil', 'Aceite y Filtro', 'Sustitución', 'oil_barrel', 'bg-orange-100 text-orange-600', 15000),
                createItem('tires', 'Neumáticos', 'Revisión desgaste', 'tire_repair', 'bg-blue-100 text-blue-600', 40000),
                createItem('brakes', 'Frenos', 'Pastillas y discos', 'disc_full', 'bg-red-100 text-red-600', 30000),
                createItem('itv', 'ITV', 'Inspección técnica', 'fact_check', 'bg-purple-100 text-purple-600', 50000),
            ];
        }
    };

    const handleSaveKm = (newKm: string) => {
        if (!vehicle) return;
        const updatedVehicle = { ...vehicle, mileage: newKm };
        setVehicle(updatedVehicle);
        setTasks(generateTasks(updatedVehicle.type, parseInt(newKm)));
        setShowKmModal(false);
    };

    if (!vehicle) return <div className="p-10 text-center">Cargando...</div>;

    const iconMap: any = { 'car': 'directions_car', 'moto': 'two_wheeler' };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#111813] text-slate-900 dark:text-white font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#1a2920]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#2a3c30]">
                <div className="max-w-[960px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-2xl text-green-600">local_gas_station</span>
                        <h1 className="text-lg font-bold">Car Care</h1>
                    </div>
                    <div className="flex gap-2">
                         <DarkModeToggle />
                        <button onClick={() => navigate('/login')} className="p-2 text-red-500"><span className="material-symbols-outlined">logout</span></button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[960px] mx-auto px-4 py-6 pb-24">
                <NotificationBanner notifications={notifications} onClose={() => setNotifications([])} />

                {/* Tarjeta del Vehículo */}
                <div className="bg-gray-50 dark:bg-[#1a2920] p-6 rounded-2xl border border-gray-100 dark:border-[#2a3f32] mb-8 flex items-center justify-between relative overflow-hidden">
                    <div className="flex items-center gap-4 z-10">
                        <div className="h-14 w-14 bg-white dark:bg-[#25382e] rounded-full flex items-center justify-center shadow-sm text-green-600 dark:text-green-400">
                             <span className="material-symbols-outlined text-3xl">{iconMap[vehicle.type] || 'directions_car'}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-400 mb-1">Vehículo Actual</p>
                            <h2 className="text-2xl font-black capitalize leading-none">{vehicle.make} {vehicle.model}</h2>
                            <div className="flex items-center gap-2 mt-1 text-gray-500 font-medium cursor-pointer hover:text-green-600 transition-colors" onClick={() => setShowKmModal(true)}>
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <span>{parseInt(vehicle.mileage).toLocaleString('es-ES')} km</span>
                            </div>
                        </div>
                    </div>
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-gray-200/50 dark:text-white/5 pointer-events-none">directions_car</span>
                </div>

                {/* Lista de Tareas */}
                <h3 className="text-lg font-bold mb-4 px-1">Mantenimiento</h3>
                <div className="grid grid-cols-1 gap-3">
                    {tasks.map((task, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#1a2920] p-4 rounded-xl border border-gray-100 dark:border-[#2a3f32] flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${task.color}`}>
                                <span className="material-symbols-outlined text-2xl">{task.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base truncate">{task.title}</h4>
                                <p className="text-sm text-gray-400 truncate">{task.subtitle}</p>
                            </div>
                            <div className="text-right whitespace-nowrap">
                                <span className="block font-black text-lg">{task.remaining}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Restante</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <KmUpdateModal isOpen={showKmModal} onClose={() => setShowKmModal(false)} onSave={handleSaveKm} currentKm={vehicle.mileage} />
        </div>
    );
};

export default Dashboard;
