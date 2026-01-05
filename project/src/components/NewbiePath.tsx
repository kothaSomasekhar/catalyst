import React, { useState, useEffect } from 'react';
import { Search, Rocket } from 'lucide-react';
import { AIService, AutomatedRoadmap } from '../services/aiService';
import { RoadmapView } from './RoadmapView';
import { useAuth } from '../context/AuthContext';

export const NewbiePath: React.FC = () => {
    const { user } = useAuth();
    const [dreamJob, setDreamJob] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Catalyst Core initializing...');
    const [roadmap, setRoadmap] = useState<AutomatedRoadmap | null>(null);

    useEffect(() => {
        const savedRoadmap = localStorage.getItem('current_roadmap');
        if (savedRoadmap) {
            try {
                setRoadmap(JSON.parse(savedRoadmap));
            } catch (e) {
                console.error("Failed to parse saved roadmap");
                localStorage.removeItem('current_roadmap');
            }
        }
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dreamJob.trim()) return;

        setLoading(true);
        setLoadingText('Vibe Check: AI Career Coach is thinking...');

        try {
            const data = await AIService.generateRoadmap(dreamJob);
            setRoadmap(data);
        } catch (error) {
            console.error(error);
            setLoadingText('Core calibrating... please check your Groq API Key.');
            setTimeout(() => setLoading(false), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setRoadmap(null);
        localStorage.removeItem('current_roadmap');
        setDreamJob('');
    };

    return (
        <div className="container" style={{ padding: '4rem 0', minHeight: '100vh' }}>
            {!roadmap ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh' }}>
                    <div className="glass-panel" style={{ padding: '4rem', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                        <Rocket className="animate-float" size={48} color="var(--neon-blue)" style={{ margin: '0 auto 2rem' }} />
                        <h2 className="text-neon" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Define Target trajectory</h2>
                        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={dreamJob}
                                onChange={(e) => setDreamJob(e.target.value)}
                                placeholder="e.g. AI Architect, Quantum Developer..."
                                autoFocus
                                disabled={loading}
                                style={{ paddingRight: '4rem' }}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neon-blue)'
                                }}>
                                <Search size={24} />
                            </button>
                        </form>
                        {loading && <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }} className="animate-float">{loadingText}</p>}
                    </div>
                </div>
            ) : (
                <RoadmapView data={roadmap} onReset={handleReset} />
            )}
        </div>
    );
};
