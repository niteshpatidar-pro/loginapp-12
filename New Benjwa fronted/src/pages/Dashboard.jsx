import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Calendar, MapPin, Building2, LayoutDashboard, Settings, Bell } from 'lucide-react';

const Dashboard = () => {
    const { user, logout, toggleDarkMode, darkMode } = useAuth();

    return (
        <div className="min-h-screen bg-cbre-light dark:bg-[#0f0f0f] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-cbre-dark text-white hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-tighter">CBRE <span className="text-[10px] font-normal uppercase tracking-[4px] block opacity-60">Corporate</span></h1>
                </div>
                
                <nav className="flex-1 mt-6 px-4 space-y-2">
                    <a href="#" className="flex items-center px-4 py-3 bg-cbre-green rounded-lg text-sm font-medium">
                        <LayoutDashboard className="h-5 w-5 mr-3" /> Dashboard
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
                        <Building2 className="h-5 w-5 mr-3" /> Properties
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
                        <Settings className="h-5 w-5 mr-3" /> Settings
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Global Dashboard</h2>
                    
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                            {darkMode ? <Calendar className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                        </button>
                        <div className="flex items-center space-x-3 border-l pl-4 dark:border-gray-800">
                            <div className="w-8 h-8 bg-cbre-green rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {user?.fullName?.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{user?.fullName}</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {user?.fullName}</h3>
                        <p className="text-gray-500 text-sm mt-1">Identity verified via Multi-Factor Authentication</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="cbre-card flex flex-col items-center text-center">
                            <div className="p-4 bg-cbre-green/10 rounded-full mb-4">
                                <User className="h-8 w-8 text-cbre-green" />
                            </div>
                            <h4 className="font-bold text-gray-800 dark:text-white">Profile Identity</h4>
                            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                        </div>

                        <div className="cbre-card flex flex-col items-center text-center">
                            <div className="p-4 bg-blue-100 rounded-full mb-4">
                                <Calendar className="h-8 w-8 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-gray-800 dark:text-white">Last Login Session</h4>
                            <p className="text-sm text-gray-500 mt-1">
                                {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now'}
                            </p>
                        </div>

                        <div className="cbre-card flex flex-col items-center text-center">
                            <div className="p-4 bg-purple-100 rounded-full mb-4">
                                <MapPin className="h-8 w-8 text-purple-600" />
                            </div>
                            <h4 className="font-bold text-gray-800 dark:text-white">Location Access</h4>
                            <p className="text-sm text-gray-500 mt-1">Global Headquarters (Remote)</p>
                        </div>
                    </div>

                    <div className="mt-8 cbre-card overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-800 dark:text-white">System Security Log</h4>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ACTIVE</span>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <div className="flex items-center">
                                        <ShieldCheck className="h-4 w-4 text-cbre-green mr-3" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Successful JWT Token Refresh</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono">10:4{i} AM</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
