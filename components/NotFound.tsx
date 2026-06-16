import React from 'react';

export const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-lab-muted flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mb-8 animate-bounce">
                <span className="text-4xl">🚀</span>
            </div>
            <h1 className="text-4xl font-black text-lab-muted mb-4 tracking-tight">Oeps! Je bent uit de baan geraakt</h1>
            <p className="text-lg text-lab-muted mb-10 max-w-md">
                De pagina die je zoekt lijkt niet te bestaan of is verplaatst naar een andere missie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <a 
                    href="/" 
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    Terug naar de basis
                </a>
                <a 
                    href="/ict" 
                    className="bg-white border border-lab-muted text-lab-muted px-8 py-4 rounded-xl font-bold hover:bg-lab-muted transition-all"
                >
                    ICT & Beheer
                </a>
            </div>
            <div className="mt-16 text-lab-muted text-xs uppercase tracking-widest font-bold">
                Foutcode: 404
            </div>
        </div>
    );
};
