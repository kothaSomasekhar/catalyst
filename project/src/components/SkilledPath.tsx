import React, { useState, useEffect } from 'react';
import { Upload, BrainCircuit, Sparkles, CheckCircle2, AlertTriangle, XCircle, BarChart3 } from 'lucide-react';
import { AIService, AutomatedRoadmap } from '../services/aiService';
import { RoadmapView } from './RoadmapView';

export const SkilledPath: React.FC = () => {
    const [roadmap, setRoadmap] = useState<AutomatedRoadmap | null>(null);
    const [loading, setLoading] = useState(false);
    const [targetRole, setTargetRole] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('current_roadmap');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.gap_analysis) setRoadmap(parsed);
            } catch (e) {
                localStorage.removeItem('current_roadmap');
            }
        }
    }, []);

    const handleAnalysis = async () => {
        if (!resumeText || !targetRole) {
            setError('Please provide your experience and target role.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await AIService.generateRoadmapFromResume(resumeText, targetRole);
            setRoadmap(result);
        } catch (err) {
            console.error(err);
            setError('Neural link severed... Please check your configuration.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type === 'application/pdf') {
            setError('Note: Biometric PDF extraction is offline. Please paste your text below.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setResumeText(text);
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        setRoadmap(null);
        localStorage.removeItem('current_roadmap');
        setResumeText('');
        setTargetRole('');
    };

    if (roadmap) {
        return (
            <div className="container" style={{ padding: '4rem 0' }}>
                {/* Gap Analysis Dashboard */}
                <div className="glass-panel" style={{ padding: '3rem', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                            <h2 className="text-gradient" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <BarChart3 size={32} /> Career Readiness Profile
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Benchmarked against {roadmap.title} standards.</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--neon-blue)' }}>{roadmap.readiness_score}%</div>
                            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>Match Probability</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                        {/* Mastered */}
                        <div className="glass-panel" style={{ padding: '1.5rem', borderTop: '4px solid #4ade80' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', marginBottom: '1rem' }}>
                                <CheckCircle2 size={18} /> Mastered
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {roadmap.gap_analysis?.mastered.map(s => (
                                    <span key={s} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '4px' }}>{s}</span>
                                ))}
                            </div>
                        </div>

                        {/* Partial */}
                        <div className="glass-panel" style={{ padding: '1.5rem', borderTop: '4px solid #fbbf24' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '1rem' }}>
                                <AlertTriangle size={18} /> Optimization Point
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {roadmap.gap_analysis?.partial.map(s => (
                                    <span key={s} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '4px' }}>{s}</span>
                                ))}
                            </div>
                        </div>

                        {/* Critical */}
                        <div className="glass-panel" style={{ padding: '1.5rem', borderTop: '4px solid #f87171' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', marginBottom: '1rem' }}>
                                <XCircle size={18} /> Critical Barrier
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {roadmap.gap_analysis?.critical_gap.map(s => (
                                    <span key={s} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '4px' }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <RoadmapView data={roadmap} onReset={handleReset} />
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                <Sparkles className="animate-float" size={48} color="var(--neon-purple)" style={{ marginBottom: '1.5rem', margin: '0 auto 1.5rem' }} />
                <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Master Architect Benchmarking</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Deep-scan your expert profile to identify architectural level gaps.</p>

                <div style={{ textAlign: 'left', display: 'grid', gap: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--neon-blue)', fontWeight: 'bold' }}>Target Role</label>
                        <input
                            type="text"
                            placeholder="e.g. Principal AI Engineer, Cloud Architect..."
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            style={{ margin: 0 }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--neon-purple)', fontWeight: 'bold' }}>Experience Profile / Resume </label>
                        <textarea
                            placeholder="Paste your resume or career summary here..."
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            style={{
                                width: '100%', minHeight: '200px', background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem',
                                color: '#fff', fontSize: '1rem', resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Upload size={18} /> Upload Data
                            </button>
                            <input
                                type="file"
                                accept=".txt,.md"
                                onChange={handleFileUpload}
                                style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                            />
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleAnalysis}
                            disabled={loading}
                            style={{ padding: '1rem 3rem' }}
                        >
                            {loading ? 'Performing Deep Scan...' : 'Calculate Trajectory'}
                        </button>
                    </div>
                    {error && <p style={{ color: 'var(--neon-purple)', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};
