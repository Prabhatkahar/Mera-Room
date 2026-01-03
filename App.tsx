import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RoomCard from './components/RoomCard';
import FilterBar from './components/FilterBar';
import PostRoomScreen from './screens/PostRoomScreen';
import RoomDetailScreen from './screens/RoomDetailScreen';
import LoginScreen from './screens/LoginScreen';
import { Room, ViewState, MOCK_ROOMS, SortOption, User } from './types';
import { Search, SlidersHorizontal, Heart } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [savedRooms, setSavedRooms] = useState<Set<string>>(new Set());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('RELEVANCE');

  // Apply dark mode class to html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handlePostRoom = (newRoom: Room) => {
    setRooms([newRoom, ...rooms]);
    setCurrentView('HOME');
  };

  const toggleSave = (id: string) => {
    setSavedRooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView('ROOM_DETAIL');
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
    setSearchQuery('');
    setSortOption('RELEVANCE');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('HOME');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('HOME');
  };

  const handleNavigation = (view: ViewState) => {
    // Removed authentication check for POST_ROOM to allow direct access
    setCurrentView(view);
  };

  const filteredRooms = rooms.filter(room => {
    // 1. Search Query
    const matchesSearch = 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      room.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Price Range
    const matchesMinPrice = minPrice === '' || room.price >= minPrice;
    const matchesMaxPrice = maxPrice === '' || room.price <= maxPrice;

    // 3. Amenities (Room must have ALL selected amenities)
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => room.amenities.includes(amenity));

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesAmenities;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortOption) {
      case 'PRICE_LOW_HIGH':
        return a.price - b.price;
      case 'PRICE_HIGH_LOW':
        return b.price - a.price;
      case 'NEWEST':
        return parseInt(b.id) - parseInt(a.id);
      case 'RELEVANCE':
      default:
        return 0; // Keep original order
    }
  });

  // Derived state for saved rooms
  const savedRoomList = rooms.filter(room => savedRooms.has(room.id));

  const activeFilterCount = (minPrice !== '' ? 1 : 0) + (maxPrice !== '' ? 1 : 0) + selectedAmenities.length + (sortOption !== 'RELEVANCE' ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar Logic: Show on all except specific screens if needed. Showing on all for now except maybe Detail if desired */}
      {currentView !== 'ROOM_DETAIL' && (
        <Navbar 
          currentView={currentView} 
          setView={handleNavigation} 
          isDark={isDark} 
          toggleTheme={toggleTheme}
          user={currentUser}
          onLogout={handleLogout}
          onLoginClick={() => setCurrentView('LOGIN')}
        />
      )}

      <main className={`${currentView === 'ROOM_DETAIL' ? '' : 'pt-6 px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto'}`}>
        
        {currentView === 'HOME' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Search & Filter Header */}
            <div className="max-w-xl mx-auto md:mx-0 space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm shadow-sm transition-all"
                    placeholder="Search by location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-xl border transition-colors flex items-center gap-2 ${
                    showFilters || activeFilterCount > 0
                      ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-teal-600 text-white text-[10px] rounded-full font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Collapsible Filter Bar */}
              <FilterBar
                isVisible={showFilters}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                selectedAmenities={selectedAmenities}
                toggleAmenity={toggleAmenity}
                sortOption={sortOption}
                setSortOption={setSortOption}
                onClear={clearFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onPress={handleRoomClick}
                  onToggleSave={toggleSave}
                  isSaved={savedRooms.has(room.id)}
                />
              ))}
            </div>

            {sortedRooms.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No rooms found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                {(activeFilterCount > 0 || searchQuery) && (
                  <button 
                    onClick={clearFilters}
                    className="mt-4 text-teal-600 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {currentView === 'SAVED' && (
           <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Rooms</h2>
             </div>

             {savedRoomList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRoomList.map(room => (
                    <RoomCard 
                      key={room.id} 
                      room={room} 
                      onPress={handleRoomClick}
                      onToggleSave={toggleSave}
                      isSaved={true}
                    />
                  ))}
                </div>
             ) : (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                     <Heart className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No saved rooms yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                    When you find a room you like, tap the heart icon to save it here for later.
                  </p>
                  <button 
                    onClick={() => setCurrentView('HOME')}
                    className="px-6 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
                  >
                    Browse Rooms
                  </button>
                </div>
             )}
           </div>
        )}

        {currentView === 'MAP' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in zoom-in-95 duration-200">
             <div className="bg-teal-100 dark:bg-teal-900/30 p-6 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
               </svg>
             </div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Map View</h2>
             <p className="text-gray-500 dark:text-gray-400 max-w-md">
               Google Maps integration requires an active API key with billing enabled. In a production environment, this would display an interactive map of all room locations.
             </p>
             <button onClick={() => setCurrentView('HOME')} className="text-teal-600 font-medium hover:underline">
               Back to List
             </button>
          </div>
        )}

        {currentView === 'POST_ROOM' && (
          <PostRoomScreen 
            onPost={handlePostRoom} 
            onCancel={() => setCurrentView('HOME')} 
          />
        )}
        
        {currentView === 'LOGIN' && (
          <LoginScreen 
            onLogin={handleLogin}
            onCancel={() => setCurrentView('HOME')}
          />
        )}

        {currentView === 'ROOM_DETAIL' && selectedRoom && (
          <RoomDetailScreen 
            room={selectedRoom} 
            onBack={() => setCurrentView('HOME')}
            onToggleSave={toggleSave}
            isSaved={savedRooms.has(selectedRoom.id)}
          />
        )}

      </main>
    </div>
  );
}

export default App;