import React, { useState } from 'react';
import { Sparkles, Upload, Loader2, Save, X, MapPin, CheckCircle2, Navigation } from 'lucide-react';
import { generateRoomDescription } from '../services/geminiService';
import { Room } from '../types';

interface PostRoomScreenProps {
  onPost: (room: Room) => void;
  onCancel: () => void;
}

const PostRoomScreen: React.FC<PostRoomScreenProps> = ({ onPost, onCancel }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    features: '',
    description: '',
    price: '',
    upi: '',
    phone: '',
  });

  const handleAI = async () => {
    if (!formData.title || !formData.location || !formData.features) {
      alert("Please fill in Title, Location and Features to generate a description.");
      return;
    }
    setLoadingAI(true);
    const desc = await generateRoomDescription(formData.title, formData.location, formData.features);
    setFormData(prev => ({ ...prev, description: desc }));
    setLoadingAI(false);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Attempt to reverse geocode using OpenStreetMap (free, no key required for client-side)
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
             // Simplify address: take first 3 components or full if short
             const parts = data.display_name.split(', ');
             const simpleLocation = parts.slice(0, 3).join(', ');
             setFormData(prev => ({...prev, location: simpleLocation}));
             setShowMapPreview(true);
          } else {
             // Fallback to coordinates
             setFormData(prev => ({...prev, location: `${latitude}, ${longitude}`}));
             setShowMapPreview(true);
          }
        } catch (error) {
           // Fallback on error
           console.error("Geocoding failed", error);
           setFormData(prev => ({...prev, location: `${latitude}, ${longitude}`}));
           setShowMapPreview(true);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please check your permissions or type it manually.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const files = Array.from(fileList);
      
      const promises = files.map(file => {
          return new Promise<string | null>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                  if (typeof reader.result === 'string') {
                      resolve(reader.result);
                  } else {
                      resolve(null);
                  }
              };
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(file);
          });
      });

      Promise.all(promises).then(results => {
          const validImages = results.filter((img): img is string => typeof img === 'string');
          if (validImages.length > 0) {
              setImages(prev => [...prev, ...validImages]);
          }
      });

      // Reset the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Please fill in the required fields.");
      return;
    }

    const priceValue = parseInt(formData.price);
    if (isNaN(priceValue)) {
      alert("Please enter a valid price.");
      return;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      price: priceValue,
      images: images.length > 0 ? images : [`https://picsum.photos/800/600?random=${Date.now()}`],
      amenities: formData.features 
        ? formData.features.split(',').map(s => s.trim()).filter(s => s.length > 0) 
        : [],
      ownerNumber: formData.phone,
      ownerUPI: formData.upi
    };

    onPost(newRoom);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post a New Room</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Share your space with thousands of seekers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Property Title *</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
                placeholder="e.g. Sunny 2BHK in Indiranagar"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Rent (₹) *</label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
                placeholder="e.g. 15000"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location & Map *</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
                    placeholder="Area, City or click Detect"
                    value={formData.location}
                    onChange={e => {
                      setFormData({...formData, location: e.target.value});
                      setShowMapPreview(false); // Reset map if typing changes
                    }}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                  title="Use Current Location"
                >
                  {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => formData.location && setShowMapPreview(true)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition-colors whitespace-nowrap hidden sm:block"
                >
                  Check Map
                </button>
              </div>
              
              {/* Mobile-only text helper for 'Check Map' */}
              <div className="flex sm:hidden">
                 <button
                  type="button"
                  onClick={() => formData.location && setShowMapPreview(true)}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
                >
                  Verify Location on Map
                </button>
              </div>

              {/* Map Preview Area */}
              {showMapPreview && formData.location && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                     <iframe
                       width="100%"
                       height="100%"
                       frameBorder="0"
                       scrolling="no"
                       src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                       title="Location Preview"
                       className="w-full h-full opacity-90"
                     ></iframe>
                     <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 px-2 py-1 rounded-md text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1 backdrop-blur-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Map Linked
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                    This map view will be shown to users.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Features (comma separated) *</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
              placeholder="e.g. WiFi, AC, Attached Bath, Near Metro"
              value={formData.features}
              onChange={e => setFormData({...formData, features: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <button
                type="button"
                onClick={handleAI}
                disabled={loadingAI}
                className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium disabled:opacity-50"
              >
                {loadingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generate with AI
              </button>
            </div>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow min-h-[120px]"
              placeholder="Describe the property..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</label>
             <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                <Upload className="w-8 h-8 mb-2 group-hover:text-teal-600 transition-colors" />
                <span className="text-sm group-hover:text-teal-600 transition-colors">Click to upload photos</span>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
             </label>

             {/* Image Preview Grid */}
             {images.length > 0 && (
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                     {images.map((img, idx) => (
                         <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                             <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                             <button
                                type="button" 
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                 <X className="w-3 h-3" />
                             </button>
                         </div>
                     ))}
                 </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
                placeholder="+91..."
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">UPI ID (for payments)</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
                placeholder="username@upi"
                value={formData.upi}
                onChange={e => setFormData({...formData, upi: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-lg hover:shadow-teal-500/30 transition-all"
            >
              <Save className="w-4 h-4" />
              Post Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostRoomScreen;