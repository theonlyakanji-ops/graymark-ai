import React, { useState, useEffect, useRef } from 'react';
import { INTERVIEW_QUESTIONS, evaluateAnswer } from '../services/aiEngine';
import {
  MessageSquare, Send, Award, RefreshCw, Sparkles, ArrowRight,
  Mic, MicOff, Volume2, AlertCircle, CheckCircle2, AlertTriangle, Lightbulb, ExternalLink
} from 'lucide-react';

export default function MockInterview() {
  const [selectedRole, setSelectedRole] = useState('software-engineering');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationHistory, setEvaluationHistory] = useState([]);
  const [currentEval, setCurrentEval] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Voice recording & Speech-to-Text state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const questions = INTERVIEW_QUESTIONS[selectedRole] || INTERVIEW_QUESTIONS['software-engineering'];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = (err) => {
        setErrorMessage(`Microphone error: ${err.error || 'Access denied or speech recognition interrupted.'}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitAnswer(e);
    }
  };

  const toggleListening = () => {
    setErrorMessage(null);
    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type your answer response.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setErrorMessage('Failed to access microphone. Please check browser microphone permissions.');
      }
    }
  };

  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setEvaluationHistory([]);
    setCurrentEval(null);
    setErrorMessage(null);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      setErrorMessage('Please type or speak an answer response before submitting.');
      return;
    }

    setErrorMessage(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    try {
      const evaluation = await evaluateAnswer(currentQuestion.question, userAnswer, selectedRole);
      setCurrentEval(evaluation);
      setEvaluationHistory(prev => [
        ...prev,
        {
          question: currentQuestion.question,
          answer: userAnswer,
          eval: evaluation
        }
      ]);
    } catch (err) {
      setErrorMessage(err.message || 'Error evaluating interview answer.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setCurrentEval(null);
    setErrorMessage(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setEvaluationHistory([]);
    setCurrentEval(null);
    setErrorMessage(null);
  };

  const isCompleted = currentQuestionIndex === questions.length - 1 && currentEval !== null;

  return (
    <div className="animate-fade-in" role="region" aria-label="Interactive AI Mock Interview">
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Interactive AI Mock Interview</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Practice role-specific interview questions. Press <strong>Ctrl+Enter</strong> to submit.
          </p>
        </div>

        {/* Role Track Selector */}
        <div className="sample-selector">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role Track:</span>
          <button
            onClick={() => handleRoleChange('software-engineering')}
            className={`btn btn-sm ${selectedRole === 'software-engineering' ? 'btn-primary' : 'btn-secondary'}`}
            aria-label="Select Software Engineer Track"
          >
            Software Engineer
          </button>
          <button
            onClick={() => handleRoleChange('data-science')}
            className={`btn btn-sm ${selectedRole === 'data-science' ? 'btn-primary' : 'btn-secondary'}`}
            aria-label="Select Data Scientist Track"
          >
            Data Scientist
          </button>
          <button
            onClick={() => handleRoleChange('product-management')}
            className={`btn btn-sm ${selectedRole === 'product-management' ? 'btn-primary' : 'btn-secondary'}`}
            aria-label="Select Product Manager Track"
          >
            Product Manager
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="card" style={{ background: 'var(--bg-danger)', border: '1px solid var(--border-danger)', marginBottom: '1rem', padding: '0.875rem 1.25rem' }} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{errorMessage}</span>
          </div>
        </div>
      )}

      {!isCompleted ? (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Left Column: Interviewer Question Box & Input Form */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge badge-neutral">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="badge badge-info">{currentQuestion.type}</span>
            </div>

            {/* Question Box */}
            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  <MessageSquare size={14} /> AI Interviewer
                </div>
                <button
                  type="button"
                  onClick={handleSpeakQuestion}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  aria-label="Read question aloud"
                >
                  <Volume2 size={12} /> Read Aloud
                </button>
              </div>

              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                &quot;{currentQuestion.question}&quot;
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitAnswer}>
              <div className="form-group">
                <div className="label">
                  <span>Your Answer Response</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`btn btn-sm ${isListening ? 'btn-primary pulse' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                      aria-label={isListening ? "Stop Recording Microphone" : "Start Microphone Speech to Text"}
                    >
                      {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                      {isListening ? 'Stop Recording' : 'Voice Input (Mic)'}
                    </button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                </div>

                <textarea
                  id="answer-textarea"
                  className="textarea"
                  placeholder="Type or record your response here... (Shortcut: Ctrl+Enter)"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={8}
                  disabled={Boolean(currentEval) || isEvaluating}
                />
              </div>

              {!currentEval && (
                <button
                  type="submit"
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  aria-label="Submit Answer for Evaluation"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw size={16} className="pulse" />
                      Evaluating Answer with AI...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Answer for AI Evaluation
                    </>
                  )}
                </button>
              )}
            </form>

            {currentEval && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                {currentQuestionIndex < questions.length - 1 ? (
                  <button onClick={handleNextQuestion} className="btn btn-primary" style={{ width: '100%' }}>
                    Next Question <ArrowRight size={16} />
                  </button>
                ) : (
                  <button onClick={handleNextQuestion} className="btn btn-primary" style={{ width: '100%' }}>
                    View Final Performance Scorecard <Award size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: 5-Part AI Feedback Panel */}
          <div>
            {!currentEval && !isEvaluating && (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--bg-subtle)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                  color: 'var(--text-muted)'
                }}>
                  <Sparkles size={24} />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>AI Feedback Panel</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 320, margin: '0 auto' }}>
                  Record or type your response to inspect clarity scoring, STAR framework detection, and coaching tips.
                </p>
              </div>
            )}

            {isEvaluating && (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }} role="status">
                <div className="pulse" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                  <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Analyzing Response</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Scoring technical depth, clarity, relevance, and STAR structure...
                </p>
              </div>
            )}

            {currentEval && !isEvaluating && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* 1. Score & Executive Reframe */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="score-box" style={{ minWidth: 95, padding: '0.875rem' }}>
                    <span className="score-value" style={{ color: currentEval.score >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                      {currentEval.score}
                    </span>
                    <span className="score-label">Score</span>
                  </div>
                  <div>
                    <span className={`badge ${currentEval.starMethodUsed ? 'badge-success' : 'badge-neutral'}`} style={{ marginBottom: '0.375rem' }}>
                      {currentEval.starMethodUsed ? '✓ STAR Method Applied' : 'STAR Method Recommended'}
                    </span>
                    <p style={{ fontSize: '0.84375rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {currentEval.executiveTakeaway || currentEval.keyFeedback}
                    </p>
                  </div>
                </div>

                {/* Sub Scores */}
                <div className="grid-2">
                  <div className="card" style={{ padding: '0.875rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Clarity</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>{currentEval.clarityScore}%</div>
                  </div>
                  <div className="card" style={{ padding: '0.875rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Relevance</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>{currentEval.relevanceScore}%</div>
                  </div>
                </div>

                {/* 2. What You Did Well */}
                {currentEval.whatYouDidWell && (
                  <div className="card">
                    <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <CheckCircle2 size={16} color="var(--color-success)" />
                      1. What You Did Well
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {currentEval.whatYouDidWell}
                    </p>
                  </div>
                )}

                {/* 3. What is Not Working */}
                {currentEval.whatIsNotWorking && (
                  <div className="card">
                    <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <AlertTriangle size={16} color="var(--color-warning)" />
                      2. What is Not Working
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {currentEval.whatIsNotWorking}
                    </p>
                  </div>
                )}

                {/* 4. How to Fix It */}
                {currentEval.howToFixIt && (
                  <div className="card">
                    <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Lightbulb size={16} color="var(--color-info)" />
                      3. How to Fix It (STAR Strategy)
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 500, background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      {currentEval.howToFixIt}
                    </p>
                  </div>
                )}

                {/* 5. External Learning Resources */}
                {currentEval.externalResources && currentEval.externalResources.length > 0 && (
                  <div className="card">
                    <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>
                      4. Recommended Learning Resources
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {currentEval.externalResources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.625rem 0.875rem', background: 'var(--bg-subtle)',
                            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                            textDecoration: 'none', color: 'var(--text-primary)'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{res.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{res.description}</div>
                          </div>
                          <ExternalLink size={14} color="var(--text-muted)" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      ) : (
        /* Completed Final Scorecard */
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--bg-success)', color: 'var(--color-success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
          }}>
            <Award size={32} />
          </div>
          <h3 style={{ fontSize: '1.375rem', marginBottom: '0.5rem' }}>Mock Interview Completed!</h3>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 1.5rem' }}>
            Great job practicing! You answered all {questions.length} questions in the {selectedRole.replace('-', ' ')} track.
          </p>

          <div className="grid-3" style={{ maxWidth: 600, margin: '0 auto 2rem', textAlign: 'center' }}>
            {evaluationHistory.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Q{idx + 1} Score</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {item.eval.score}%
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleRestart} className="btn btn-primary">
            Start New Interview Session
          </button>
        </div>
      )}
    </div>
  );
}
