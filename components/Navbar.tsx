import React, { useState } from 'react';
import { Home, Map, PlusCircle, Moon, Sun, Menu, LogIn, LogOut, User as UserIcon, Heart } from 'lucide-react';
import { ViewState, User } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isDark: boolean;
  toggleTheme: () => void;
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  setView, 
  isDark, 
  toggleTheme,
  user,
  onLogout,
  onLoginClick
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('HOME')}>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Mera Room
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => setView('HOME')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'HOME'
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-white'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={() => setView('SAVED')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'SAVED'
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Saved
              </button>
              <button
                onClick={() => setView('MAP')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'MAP'
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-white'
                }`}
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </button>
              <button
                onClick={() => setView('POST_ROOM')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'POST_ROOM'
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Post Room
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* User Auth Section */}
            {user ? (
               <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                     <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-semibold text-sm">
                       {user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" /> : user.name[0]}
                     </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
                       <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                       </div>
                       <button 
                         onClick={() => {
                           onLogout();
                           setShowProfileMenu(false);
                         }}
                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                       >
                          <LogOut className="w-4 h-4" />
                          Log Out
                       </button>
                    </div>
                  )}
                  
                  {/* Backdrop to close menu */}
                  {showProfileMenu && (
                    <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfileMenu(false)}></div>
                  )}
               </div>
            ) : (
               <button
                 onClick={onLoginClick}
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity shadow-md"
               >
                 <LogIn className="w-4 h-4" />
                 <span className="hidden sm:inline">Log In</span>
               </button>
            )}
            
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around py-3 pb-safe z-50">
          <button onClick={() => setView('HOME')} className={`flex flex-col items-center ${currentView === 'HOME' ? 'text-teal-600' : 'text-gray-500'}`}>
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button onClick={() => setView('SAVED')} className={`flex flex-col items-center ${currentView === 'SAVED' ? 'text-teal-600' : 'text-gray-500'}`}>
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">Saved</span>
          </button>
           <button onClick={() => setView('POST_ROOM')} className={`flex flex-col items-center ${currentView === 'POST_ROOM' ? 'text-teal-600' : 'text-gray-500'}`}>
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs mt-1">Post</span>
          </button>
          <button 
            onClick={() => user ? setShowProfileMenu(!showProfileMenu) : onLoginClick()} 
            className={`flex flex-col items-center ${currentView === 'LOGIN' ? 'text-teal-600' : 'text-gray-500'}`}
          >
            {user ? (
               user.avatar ? <img src={user.avatar} className="w-6 h-6 rounded-full" alt="Profile" /> : <UserIcon className="w-6 h-6" />
            ) : (
               <LogIn className="w-6 h-6" />
            )}
            <span className="text-xs mt-1">{user ? 'Profile' : 'Login'}</span>
          </button>
      </div>
    </nav>
  );
};

export default Navbar;