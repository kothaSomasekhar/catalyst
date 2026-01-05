import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loginGuest, logout } = useAuth();

    const handleGuestLogin = async () => {
        const name = window.prompt("Enter your name for the mission:", "Cadet");
        if (name) {
            await loginGuest(name);
        }
    };

    const handleStart = async (path: string) => {
        if (!user) {
            const name = window.prompt("Identity verification required. Enter your Cadet Name to initialize mission:", "Cadet");
            if (name) {
                await loginGuest(name);
                navigate(path);
            }
            return;
        }
        navigate(path);
    };

    return (
        <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Operator: {user.displayName}</span>
                        <button className="btn-secondary" onClick={logout} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Disconnect</button>
                    </div>
                ) : (
                    <button className="btn-primary" onClick={handleGuestLogin}>Enter Guest Mode</button>
                )}
            </div>

            <header style={{ marginBottom: '4rem', textAlign: 'center' }} className="animate-float">
                <h1 style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-2px' }}>
                    <span className="text-gradient">CATALYST</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Launch your career into orbit. Choose your trajectory.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '900px' }}>
                {/* Newbie Path */}
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleStart('/newbie')}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1.5rem', background: 'rgba(0, 243, 255, 0.1)', borderRadius: '50%' }}>
                        <Rocket size={48} color="var(--neon-blue)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>I'm a Newbie</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        No resume? No problem. Tell us your dream, and we'll map the stars for you.
                    </p>
                    <button className="btn-primary">
                        Start Journey <Sparkles size={16} style={{ display: 'inline', marginLeft: '5px' }} />
                    </button>
                </div>

                {/* Skilled Path */}
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleStart('/skilled')}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1.5rem', background: 'rgba(188, 19, 254, 0.1)', borderRadius: '50%' }}>
                        <FileText size={48} color="var(--neon-purple)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>I have a Resume</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Upload your CV. We'll benchmark you against 2026 industry standards.
                    </p>
                    <button className="btn-primary" style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)' }}>
                        Analyze Career
                    </button>
                </div>
            </div>
        </div>
    );
};
