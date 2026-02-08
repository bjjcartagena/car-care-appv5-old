import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

// Hemos quitado las importaciones de Supabase y Auth para que no den problemas

const VehicleTypeSelection: React.FC = () => {
    const navigate = useNavigate();
    
    // Forzamos a que siempre parezca que no hay vehículos (como en tu foto)
    const hasVehicles = false;

    // Función simplificada: Solo navega a la siguiente pantalla
    const selectType = (type: 'car' | 'moto') => {
        // Pasamos el tipo (car o moto) a la siguiente pantalla pero sin guardar nada en BD
        navigate('/setup-profile', { state: { vehicleType: type } });
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 lg:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-green-800 dark:text-green-300">
                        <span className="material-symbols-outlined text-xl">directions_car</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Car Care App</h2>
                </div>
                <div className="flex gap-2">
                    <DarkModeToggle />
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    {/* Botón de Salir simplificado (solo te lleva al login sin llamar a Supabase) */}
                    <button onClick={() => navigate('/login')} className="flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </header>

            {/* Main Layout Container */}
            <div className="layout-container flex h-full grow flex-col items-center justify-start pt-8 pb-12 px-4 sm:px-6">
                <div className="layout-content-container flex flex-col w-full max-w-[640px] flex-1 gap-8">

                    {/* Progress Bar Section */}
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex gap-6 justify-between items-center">
                            <p className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">
                                Paso 1 de 4
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Configuración</p>
                        </div>
                        <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-2 w-full overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: '25%' }}></div>
                        </div>
                    </div>

                    {/* Page Heading */}
                    <div className="flex flex-col gap-3 text-center sm:text-left mt-4">
                        <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                            Vamos a prepararlo todo.
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                            Selecciona tu tipo de vehículo para personalizar el programa de mantenimiento y los recordatorios.
                        </p>
                    </div>

                    {/* Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">

                        {/* Car Card */}
                        <button onClick={() => selectType('car')} className="group relative flex flex-col items-center sm:items-start gap-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-all duration-200 hover:border-primary hover:shadow-xl hover:shadow-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/20 text-left">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-primary group-hover:text-slate-900 transition-colors duration-200">
                                <span className="material-symbols-outlined text-4xl">directions_car</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center sm:items-start">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Coche</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Turismo, SUV, Furgoneta, etc.</p>
                            </div>
                            <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                        </button>

                        {/* Motorcycle Card */}
                        <button onClick={() => selectType('moto')} className="group relative flex flex-col items-center sm:items-start gap-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-all duration-200 hover:border-primary hover:shadow-xl hover:shadow-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/20 text-left">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-primary group-hover:text-slate-900 transition-colors duration-200">
                                <span className="material-symbols-outlined text-4xl">two_wheeler</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center sm:items-start">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Moto</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Deportiva, Custom, Scooter</p>
                            </div>
                            <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                        </button>
                    </div>

                    {/* Footer Trust Text */}
                    <div className="mt-auto pt-6 text-center">
                        <p className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-500 text-sm font-medium">
                            <span className="material-symbols-outlined text-base">timer</span>
                            Configuración en menos de 2 minutos.
                        </p>
                        
                        <a className="inline-block mt-4 text-sm font-semibold text-slate-400 hover:text-primary transition-colors" href="#">
                            Aún no tengo vehículo
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleTypeSelection;
