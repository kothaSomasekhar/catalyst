import React, { useState, useMemo } from 'react';
import { AutomatedRoadmap, Topic } from '../services/aiService';
import {
    CheckCircle,
    Rocket,
    Trophy,
    RefreshCcw,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Clock,
    Target,
    Code,
    Zap
} from 'lucide-react';

interface RoadmapViewProps {
    data: AutomatedRoadmap;
    onReset: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ data, onReset }) => {
    const [quizMode, setQuizMode] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<Topic[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

    // Prioritize Critical Gap questions for the quiz
    const startQuiz = () => {
        const critical = data.topics.filter(t => t.category === 'Critical Gap');
        const other = data.topics.filter(t => t.category !== 'Critical Gap');
        const finalQuestions = [...critical, ...other].slice(0, 5);
        setQuizQuestions(finalQuestions);
        setQuizMode(true);
    };

    const handleAnswer = (index: number) => {
        setSelectedAnswer(index);
        const isCorrect = index === quizQuestions[currentQuestionIndex].quiz.answer_index;

        setTimeout(() => {
            if (isCorrect) setScore(s => s + 1);

            if (currentQuestionIndex < quizQuestions.length - 1) {
                setCurrentQuestionIndex(i => i + 1);
                setSelectedAnswer(null);
            } else {
                setQuizFinished(true);
            }
        }, 1000);
    };

    if (quizFinished) {
        return (
            <div className="glass-panel animate-fade-in" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
                <Trophy size={64} color="var(--neon-blue)" style={{ marginBottom: '1.5rem' }} />
                <h2 className="text-neon" style={{ fontSize: '2.5rem' }}>Evaluation Complete</h2>
                <p style={{ fontSize: '1.5rem', marginTop: '1rem', color: '#fff' }}>
                    Score: <span className="text-gradient" style={{ fontWeight: 'bold' }}>{score} / {quizQuestions.length}</span>
                </p>
                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={() => {
                        setQuizMode(false);
                        setQuizFinished(false);
                        setCurrentQuestionIndex(0);
                        setScore(0);
                    }}>Back to Tree</button>
                    <button className="btn-secondary" onClick={onReset}>New Scan</button>
                </div>
            </div>
        );
    }

    if (quizMode) {
        const topic = quizQuestions[currentQuestionIndex];
        return (
            <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '800px', margin: '2rem auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Diagnostic {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    <span className="text-neon" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{topic.category} Focus</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', lineHeight: '1.4' }}>{topic.quiz.question}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {topic.quiz.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => selectedAnswer === null && handleAnswer(idx)}
                            style={{
                                padding: '1.25rem',
                                textAlign: 'left',
                                background: selectedAnswer === idx
                                    ? (idx === topic.quiz.answer_index ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 0, 255, 0.1)')
                                    : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${selectedAnswer === idx
                                    ? (idx === topic.quiz.answer_index ? 'var(--neon-blue)' : 'var(--neon-purple)')
                                    : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            {/* Header Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ flex: 1 }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{data.title}</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={18} color="var(--neon-blue)" />
                            <span style={{ fontWeight: 700 }}>{data.readiness_score}% Readiness</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {data.skills.slice(0, 3).map(s => (
                                <span key={s} style={{ fontSize: '0.75rem', opacity: 0.6 }}>{s} •</span>
                            ))}
                        </div>
                    </div>
                </div>
                <button className="btn-secondary" onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCcw size={16} /> Rescan
                </button>
            </div>

            {/* Tech Tree Flow */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {data.topics.map((topic, idx) => {
                    const isExpanded = expandedTopic === topic.id;
                    const isCritical = topic.category === 'Critical Gap';

                    return (
                        <div key={topic.id} className="glass-panel"
                            style={{
                                transition: 'all 0.3s ease',
                                borderLeft: `6px solid ${isCritical ? 'var(--neon-purple)' : 'var(--neon-blue)'}`
                            }}
                        >
                            <div
                                onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                                style={{ padding: '1.5rem 2rem', cursor: 'pointer', display: 'flex', gap: '2rem', alignItems: 'center' }}
                            >
                                <div style={{
                                    fontSize: '2rem', fontWeight: 800, opacity: 0.1, minWidth: '60px'
                                }}>0{idx + 1}</div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{topic.name}</h4>
                                        <span style={{
                                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px',
                                            background: isCritical ? 'rgba(188, 19, 254, 0.2)' : 'rgba(0, 243, 255, 0.1)',
                                            color: isCritical ? 'var(--neon-purple)' : 'var(--neon-blue)',
                                            border: `1px solid ${isCritical ? 'var(--neon-purple)' : 'var(--neon-blue)'}`
                                        }}>{topic.category}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{topic.desc}</p>
                                </div>

                                {isExpanded ? <ChevronUp size={24} opacity={0.5} /> : <ChevronDown size={24} opacity={0.5} />}
                            </div>

                            {isExpanded && (
                                <div className="animate-fade-in" style={{ padding: '0 2rem 2rem 6rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                        <div>
                                            <h5 style={{ color: 'var(--neon-blue)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                                <Target size={16} /> Sub-Skills
                                            </h5>
                                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                                {topic.sub_skills.map(skill => (
                                                    <li key={skill} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                                        <div style={{ width: '6px', height: '6px', background: 'var(--neon-blue)', borderRadius: '50%' }} />
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 style={{ color: 'var(--neon-purple)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                                <Code size={16} /> Project Milestone
                                            </h5>
                                            <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                                                {topic.project_milestone}
                                            </div>
                                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                <Clock size={14} /> Estimated Study: {topic.estimated_hours} Hours
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <button
                    className="btn-primary"
                    onClick={startQuiz}
                    style={{ padding: '1.5rem 4rem', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '12px' }}
                >
                    Run Targeted Diagnostic  <Rocket size={24} />
                </button>
            </div>
        </div>
    );
};
