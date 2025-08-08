'use client';

import { useState } from 'react';
import SpotifyLoader from '../components/SpotifyLoader';
import { useLoader, simulateLoading, withLoading } from '../utils/loader';

const LoaderExample: React.FC = () => {
  const loader = useLoader();
  const [data, setData] = useState<string | null>(null);

  // Example of using the loader with async operation
  const fetchData = async () => {
    await simulateLoading(3000); // Simulate 3 seconds loading
    return "Data loaded successfully!";
  };

  // Wrap the async function with loading state
  const fetchDataWithLoading = withLoading(fetchData, loader);

  const handleLoadData = async () => {
    try {
      const result = await fetchDataWithLoading();
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Spotify Loader Demo
        </h1>
        
        <button
          onClick={handleLoadData}
          disabled={loader.isLoading}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-medium rounded-lg transition-colors"
        >
          {loader.isLoading ? 'Loading...' : 'Load Data'}
        </button>

        {data && (
          <p className="text-green-400 text-lg">{data}</p>
        )}
      </div>

      {/* Spotify Loader Component */}
      <SpotifyLoader 
        isLoading={loader.isLoading}
        message="Fetching your Spotify data..."
      />
    </div>
  );
};

export default LoaderExample;
