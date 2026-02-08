import React from 'react';

const DarkModeToggle: React.FC = () => {
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <button 
            onClick={toggleTheme}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-main dark:text-white"
            title="Cambiar modo oscuro"
        >
            <span className="material-symbols-outlined">contrast</span>
        </button>
    );
};

export default DarkModeToggle;