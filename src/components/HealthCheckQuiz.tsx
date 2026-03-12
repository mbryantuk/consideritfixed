'use client';

import { useState } from 'react';
import styles from './HealthCheckQuiz.module.css';
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

const QUESTIONS = [
  {
    id: 1,
    text: "When was the last time you fully restarted your computer?",
    options: [
      { text: "Today or Yesterday", score: 2 },
      { text: "Within the last week", score: 1 },
      { text: "I can't remember!", score: 0 }
    ]
  },
  {
    id: 2,
    text: "Are your important photos and files backed up?",
    options: [
      { text: "Yes, automatically in the cloud", score: 2 },
      { text: "I manually copy them to a USB/Drive", score: 1 },
      { text: "No, they are only on my device", score: 0 }
    ]
  },
  {
    id: 3,
    text: "How often do you install software or security updates?",
    options: [
      { text: "As soon as they appear", score: 2 },
      { text: "Once every month or two", score: 1 },
      { text: "I usually ignore them", score: 0 }
    ]
  },
  {
    id: 4,
    text: "Do you have any 'dead zones' where Wi-Fi doesn't work in your house?",
    options: [
      { text: "None, it's great everywhere", score: 2 },
      { text: "Maybe one or two spots", score: 1 },
      { text: "Yes, it's very unreliable", score: 0 }
    ]
  }
];

export default function HealthCheckQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (points: number) => {
    setScore(prev => prev + points);
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setScore(0);
    setIsFinished(false);
  };

  const getResult = () => {
    if (score >= 7) return {
      title: "Excellent!",
      desc: "Your tech is in great shape. Keep doing what you're doing!",
      icon: <CheckCircle className={styles.resIcon} style={{ color: '#0D9488' }} size={48} />,
      cta: "Keep it up!"
    };
    if (score >= 4) return {
      title: "Good, but could be better.",
      desc: "You're doing the basics right, but there are some risks (like backups or updates).",
      icon: <AlertTriangle className={styles.resIcon} style={{ color: '#EA580C' }} size={48} />,
      cta: "Book a 30-min Health Check"
    };
    return {
      title: "Action Needed!",
      desc: "Your technology might be at risk of failing, losing data, or slowing down significantly.",
      icon: <XCircle className={styles.resIcon} style={{ color: '#ef4444' }} size={48} />,
      cta: "Request a Complete Tech Audit"
    };
  };

  if (isFinished) {
    const result = getResult();
    return (
      <div className={styles.container}>
        <div className={styles.resultContent}>
          {result.icon}
          <h3>{result.title}</h3>
          <p>{result.desc}</p>
          <div className={styles.actions}>
            <Link href="/contact" className="btn btn-primary">{result.cta}</Link>
            <button onClick={restart} className={styles.restartBtn}>
              <RefreshCcw size={16} /> Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentStep];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Activity size={24} className={styles.icon} />
        <h3>Tech Health Check</h3>
        <span className={styles.progress}>Question {currentStep + 1} of {QUESTIONS.length}</span>
      </div>
      
      <div className={styles.content}>
        <h4>{question.text}</h4>
        <div className={styles.optionsGrid}>
          {question.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(opt.score)} className={styles.optionBtn}>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
