'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users } from 'lucide-react';

interface SummaryCardProps {
    totalPeople: number;
    moodBreakdown: Record<string, number>;
}

export default function SummaryCard({ totalPeople, moodBreakdown }: SummaryCardProps) {
    const moodColors: Record<string, string> = {
        'Happy': 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]',
        'Neutral': 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
        'Sleepy': 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]',
        'Focused': 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]',
        'Angry': 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-xl p-6 relative overflow-hidden"
        >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-6 border-b border-gray-700/50 pb-4">
                <BarChart3 className="text-primary" />
                <h3 className="text-xl font-bold text-white tracking-widest uppercase">Mission Report</h3>
            </div>

            <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <Users className="text-gray-400 w-4 h-4" />
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Personnel Detected</p>
                </div>
                <div className="flex items-end gap-2">
                    <motion.p
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="text-5xl font-black text-white text-glow"
                    >
                        {String(totalPeople).padStart(2, '0')}
                    </motion.p>
                    <span className="text-sm text-gray-500 mb-2">/ UNITS</span>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">State Analysis</p>
                </div>

                <div className="space-y-5">
                    {Object.entries(moodBreakdown).map(([mood, count], index) => {
                        const percentage = totalPeople > 0 ? (count / totalPeople) * 100 : 0;
                        return (
                            <div key={mood} className="group">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-300 font-mono">{mood.toUpperCase()}</span>
                                    <span className="text-gray-400 font-mono">[{count}]</span>
                                </div>
                                <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/30">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                                        className={`h-full rounded-full ${moodColors[mood] || 'bg-gray-500'}`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {totalPeople === 0 && <p className="text-gray-600 text-sm font-mono text-center py-4">NO BIOSIGNATURES DETECTED</p>}
                </div>
            </div>
        </motion.div>
    );
}
