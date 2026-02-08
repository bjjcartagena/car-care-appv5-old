import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const CAR_MAKES = [
    "Abarth", "Alfa Romeo", "Audi", "BMW", "BYD", "Citroën", "Cupra", "Dacia",
    "DS Automobiles", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep",
    "Kia", "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "MG", "Mini",
    "Mitsubishi", "Nissan", "Opel", "Peugeot", "Polestar", "Porsche", "Renault",
    "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota",
    "Volkswagen", "Volvo"
];

const MOTO_MAKES = [
    "Aprilia", "Benelli", "BMW Motorrad", "CFMoto", "Ducati", "Harley-Davidson",
    "Honda", "Husqvarna", "Indian", "Kawasaki", "KTM", "Kymco", "Moto Guzzi",
    "MV Agusta", "Piaggio", "Royal Enfield", "Suzuki", "Sym", "Triumph",
    "Vespa", "Voge", "Yamaha", "Zontes"
];

const VehicleProfileSetup: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile } = useAuth();

    // Default to car if no state is passed
    const vehicleType = location.state?.vehicleType || 'car';
    const isMoto = vehicleType === 'moto';

    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const handleSave = async () => {
        if (!make || !user || !profile) return;
        setLoading(true);

        // Check limits
        const { count, error } = await supabase
            .from('vehicles')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        const currentCount = count || 0;
        const limit = profile.vehicles_limit || 1;

        if (currentCount >= limit) {
            setShowUpgradeModal(true);
            setLoading(false);
            return;
        }

        const { error: insertError } = await supabase.from('vehicles').insert({
            user_id: user.id,
            type: vehicleType,
            make,
            model: model || (isMoto ? "Modelo Desconocido" : "Modelo Desconocido"),
            odometer_km: parseInt(mileage) || 0
        });

        if (insertError) {
            console.error("Error saving vehicle:", insertError);
            alert("Error saving vehicle");
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleUpgrade = async (type: 'home' | 'family') => {
        setLoading(true);
        try {
            const endpoint = type === 'home' ? '/api/stripe/checkout-home' : '/api/stripe/checkout-family';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id, email: user?.email })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Error initiating checkout');
            }
        } catch (error) {
            console.error(error);
            alert('Error initiating checkout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display antialiased text-[#111813] dark:text-white min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary selection:text-black">
            {/* Abstract Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Main Layout Container */}
            <div className="layout-container flex h-full grow flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
                {/* Focused Card */}
                <div className="w-full max-w-[580px] bg-white dark:bg-[#1a2920] rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-[#2a3f32] overflow-hidden flex flex-col">
                    {/* Progress Header */}
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Paso 2 de 4</span>
                                <h2 className="text-sm font-semibold text-[#111813] dark:text-gray-200">Datos del Vehículo</h2>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">50% Completado</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-[#25382e] rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/2 rounded-full shadow-glow"></div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="px-8 py-2 flex-1">
                        {/* Heading */}
                        <div className="mb-8">
                            <h1 className="text-[32px] font-bold leading-tight text-[#111813] dark:text-white mb-2 tracking-tight">
                                Vamos a configurar tu {isMoto ? 'moto' : 'coche'}.
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                                Introduce los detalles para cargar el plan de mantenimiento recomendado según el fabricante.
                            </p>
                        </div>

                        {/* Form Fields */}
                        <div className="flex flex-col gap-6">
                            {/* Make Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200" htmlFor="vehicle-make">
                                    Marca
                                </label>
                                <div className="relative group">
                                    <select
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                        className="form-input-transition block w-full h-14 rounded-xl border border-gray-200 dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 text-base text-[#111813] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none bg-none cursor-pointer placeholder:text-gray-400"
                                        id="vehicle-make"
                                    >
                                        <option disabled value="">Selecciona una marca</option>
                                        {(isMoto ? MOTO_MAKES : CAR_MAKES).map((brand) => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Model Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200" htmlFor="vehicle-model">
                                    Modelo
                                </label>
                                <div className="relative">
                                    <input
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="form-input-transition block w-full h-14 rounded-xl border border-gray-200 dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 text-base text-[#111813] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-gray-400 dark:placeholder:text-[#4a6356]"
                                        id="vehicle-model"
                                        placeholder={isMoto ? "ej. MT-07, GS 1250..." : "ej. 3008, Corolla, Golf..."}
                                        type="text"
                                    />
                                </div>
                            </div>

                            {/* Mileage Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200" htmlFor="current-mileage">
                                    Kilometraje actual
                                </label>
                                <div className="relative group">
                                    <input
                                        value={mileage}
                                        onChange={(e) => setMileage(e.target.value)}
                                        className="form-input-transition block w-full h-14 rounded-xl border border-gray-200 dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 pr-16 text-base text-[#111813] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-gray-400 dark:placeholder:text-[#4a6356]"
                                        id="current-mileage"
                                        placeholder="ej. 25.000"
                                        type="number"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a2920] py-1 px-2 rounded">km</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-8 mt-4 bg-gray-50 dark:bg-[#15231b] border-t border-gray-100 dark:border-[#2a3f32]">
                        <button
                            onClick={handleSave}
                            disabled={!make || loading}
                            className={`group w-full h-14 font-bold text-lg rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${!make || loading ? 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20 hover:shadow-primary/40'}`}
                        >
                            <span className="relative z-10">{loading ? 'Guardando...' : 'Guardar Vehículo'}</span>
                            <span className="material-symbols-outlined text-[24px] relative z-10 transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1a2920] w-full max-w-md rounded-2xl p-6 shadow-xl animate-in zoom-in-95">
                        <h3 className="text-xl font-bold mb-4 text-center">Límite Alcanzado</h3>
                        <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
                            Has alcanzado el límite de vehículos de tu plan actual ({profile?.vehicles_limit}). Mejora tu plan para añadir más.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleUpgrade('home')}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex justify-between px-6"
                            >
                                <span>Pack Home (3 Vehículos)</span>
                                <span>14,95€</span>
                            </button>
                            <button
                                onClick={() => handleUpgrade('family')}
                                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors flex justify-between px-6"
                            >
                                <span>Pack Familiar (5 Vehículos)</span>
                                <span>24,95€</span>
                            </button>
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="mt-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleProfileSetup;
