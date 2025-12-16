'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Detection {
    id: number;
    bbox: [number, number, number, number]; // x, y, w, h
    mood: string;
}

interface ResultsDisplayProps {
    imageSrc: string;
    results: Detection[];
}

export default function ResultsDisplay({ imageSrc, results }: ResultsDisplayProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [scale, setScale] = useState(1);

    // Handle responsive scaling of bounding boxes
    useEffect(() => {
        const handleResize = () => {
            if (imgRef.current) {
                const naturalWidth = imgRef.current.naturalWidth;
                const clientWidth = imgRef.current.clientWidth;
                if (naturalWidth > 0) {
                    setScale(clientWidth / naturalWidth);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        // Initial calc when image loads
        if (imgRef.current?.complete) handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [imageSrc]);

    const onImgLoad = () => {
        if (imgRef.current) {
            const naturalWidth = imgRef.current.naturalWidth;
            const clientWidth = imgRef.current.clientWidth;
            if (naturalWidth > 0) {
                setScale(clientWidth / naturalWidth);
            }
        }
    };

    // Mood color map for HUD
    const getMoodColor = (mood: string) => {
        const colors: any = {
            'Happy': 'text-yellow-400 border-yellow-400',
            'Neutral': 'text-cyan-400 border-cyan-400',
            'Sleepy': 'text-blue-400 border-blue-400',
            'Focused': 'text-purple-400 border-purple-400',
            'Angry': 'text-red-500 border-red-500',
        };
        return colors[mood] || 'text-cyan-400 border-cyan-400';
    };

    return (
        <div className="relative inline-block w-full overflow-hidden rounded-lg border border-gray-700 bg-black">
            {/* Image */}
            <motion.img
                initial={{ filter: "brightness(0) blur(10px)" }}
                animate={{ filter: "brightness(1) blur(0px)" }}
                transition={{ duration: 0.8 }}
                ref={imgRef}
                src={imageSrc}
                alt="Analyzed Workplace"
                className="w-full h-auto opacity-80"
                onLoad={onImgLoad}
            />

            {/* Scan Beam Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none w-full h-1/4"
                animate={{ top: ['-25%', '125%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                style={{ zIndex: 10 }}
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

            {results.map((person, index) => {
                const [x, y, w, h] = person.bbox;
                const colorClass = getMoodColor(person.mood);

                return (
                    <motion.div
                        key={person.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`absolute border pointer-events-none ${colorClass.split(' ')[1]}`}
                        style={{
                            left: `${x * scale}px`,
                            top: `${y * scale}px`,
                            width: `${w * scale}px`,
                            height: `${h * scale}px`,
                            boxShadow: `0 0 10px currentColor`
                        }}
                    >
                        {/* HUD Corners */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-current"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-current"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-current"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-current"></div>

                        {/* Label Tag */}
                        <div className={`absolute -top-8 left-0 ${colorClass.split(' ')[0]} bg-black/70 backdrop-blur-md text-xs px-2 py-1 border border-current flex items-center gap-2`}>
                            <span className="font-mono font-bold">TARGET_{person.id}</span>
                            <span className="w-px h-3 bg-current"></span>
                            <span className="uppercase tracking-wider">{person.mood.toUpperCase()}</span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
