import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VehicleProfileSetup: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const vehicleType = location.state?.vehicleType || 'car';

    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState("");

    const handleSave = () => {
        if (!make) return;
        
        // ENVÍA LOS DATOS DIRECTAMENTE AL DASHBOARD
        navigate('/dashboard', { 
            state: { 
                localVehicle: {
                    id: 'local-1',
                    type: vehicleType,
                    make: make,
                    model: model || 'Modelo Estándar',
                    mileage: mileage || 0
                }
            } 
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-[#111813] text-slate-900 dark:text-white">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-black mb-2">Datos del Vehículo</h1>
                <p className="text-gray-500 mb-8">Rellena la ficha técnica básica.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Marca</label>
                        <select className="w-full h-12 border rounded-lg px-4 bg-transparent" value={make} onChange={e => setMake(e.target.value)}>
                            <option value="" disabled>Selecciona...</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Ford">Ford</option>
                            <option value="BMW">BMW</option>
                            <option value="Honda">Honda</option>
                            <option value="Seat">Seat</option>
                            <option value="Volkswagen">Volkswagen</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Modelo</label>
                        <input className="w-full h-12 border rounded-lg px-4 bg-transparent" type="text" placeholder="Ej. Corolla" value={model} onChange={e => setModel(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Kilómetros</label>
                        <input className="w-full h-12 border rounded-lg px-4 bg-transparent" type="number" placeholder="Ej. 120000" value={mileage} onChange={e => setMileage(e.target.value)} />
                    </div>

                    <button onClick={handleSave} disabled={!make} className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg mt-6 disabled:opacity-50">
                        Guardar y Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleProfileSetup;
