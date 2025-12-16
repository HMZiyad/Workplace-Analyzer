'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import ResultsDisplay from '../components/ResultsDisplay';
import SummaryCard from '../components/SummaryCard';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('retinaface');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResults(null);
    setError(null);
    analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('model', selectedModel);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to analyze image. Ensure backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-8 bg-transparent"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-12 text-center relative">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary text-glow mb-2">
              WORKPLACE<span className="text-white">_</span>ANALYZER
            </h1>
            <div className="flex items-center justify-center gap-2 text-cyan-300 font-mono text-sm tracking-[0.3em]">
              <Cpu size={16} />
              <span>AI POWERED SURVEILLANCE SYSTEM</span>
              <Zap size={16} />
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">

            {/* Model Selection */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 rounded-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent"></div>

              <label htmlFor="model-select" className="block text-sm font-mono text-primary mb-2 tracking-wider">
                SELECT NERUAL NETWORK MODEL //
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 text-white rounded-none p-3 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                <option value="retinaface">RETINAFACE_V1 [HIGH PRECISION]</option>
                <option value="yolov8">YOLO_V8 [BALANCED]</option>
                <option value="ssd">SSD_MOBILENET [HIGH VELOCITY]</option>
                <option value="opencv">OPENCV_HAAR [LEGACY]</option>
              </select>
              <p className="mt-2 text-[10px] text-gray-500 font-mono text-right">
                SYSTEM WILL AUTO-DOWNLOAD WEIGHTS ON INITIALIZATION
              </p>
            </motion.div>

            {/* Upload Area */}
            {!selectedImage && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ImageUpload onImageSelect={handleImageSelect} />
              </motion.div>
            )}

            {/* Preview & Results */}
            {selectedImage && previewUrl && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-6 rounded-xl relative"
              >
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    LIVE FEED ANALYSIS
                  </h2>
                  <button
                    onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResults(null); }}
                    className="text-xs text-primary hover:text-white hover:underline font-mono tracking-wide"
                  >
                    [ RESET SIGNAL ]
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-96 bg-black/40 rounded-lg border border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.png')] opacity-20"></div>
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 relative z-10"></div>
                    <p className="text-primary font-mono animate-pulse z-10">PROCESSING NEURAL PATHWAYS...</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden bg-black/50 border border-gray-800">
                    <ResultsDisplay
                      imageSrc={previewUrl}
                      results={results?.people || []}
                    />
                    {error && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
                        <div className="text-center">
                          <h3 className="text-red-500 font-bold text-xl mb-2">SYSTEM ERROR</h3>
                          <p className="text-gray-400 font-mono text-sm">{error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar / Stats */}
          <div className="lg:col-span-1">
            {results ? (
              <SummaryCard
                totalPeople={results.total_people}
                moodBreakdown={results.mood_breakdown}
              />
            ) : (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-panel rounded-xl p-8 opacity-50 flex flex-col items-center justify-center text-center h-64 border-dashed border-2 border-gray-800"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800/50 mb-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-400 font-mono tracking-widest">AWAITING DATA</h3>
                <p className="text-gray-600 text-xs font-mono">UPLOAD VISUAL DATA FOR METRIC EXTRACTION</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.main>
  );
}
