import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './logo.svg'; 
import userIcon from './user.svg'; 
import logoutIcon from './logout.png'; 
import './styles/QuizPage.css';
import { apiUrl } from './App';

function QuizPage() {
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('userToken'));
  const [question, setQuestion] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
     setIsMounted(true);
     return () => setIsMounted(false);
  }, []);
 
  useEffect(() => {
     if (isMounted && questionCount === 0) {
     }
  }, [isMounted, questionCount]);
  
  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/generate-question`);
      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }
      const data = await response.json();
      setQuestion(data);
      setSelectedChoice(null);
      setError(null);
    } catch (error) {
      console.error('Problème lors de la récupération de la question', error);
      setError('Failed to load the question. Please try again.');
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  //cas ou l'utilisateur choisit de quitter le quizz avant de le finir
  const handleCancelQuiz = () => {
    setQuestion(null);
    setSelectedChoice(null);
    setQuestionCount(0);
    setIsQuizComplete(false);
  }

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    if (choice === question.answer) { 
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    if (questionCount < 9) {
      setQuestionCount(prevCount => prevCount + 1);
      fetchQuestion(); 
    } else {
      setIsQuizComplete(true);
      sendScoreToServer(score);
    }
  };

  const getButtonClass = (choice) => {
    if (selectedChoice === null) return "choice-button";
    if (choice === question.answer) return "choice-button correct";
    if (choice === selectedChoice) return "choice-button incorrect";
    return "choice-button";
  };

  const sendScoreToServer = async (finalScore) => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch('http://localhost:8080/finish-quizz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score: finalScore })
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du score');
      }
      navigate('/results', { state: { score: finalScore } });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score', error);
    }
  };

  const signOut = () => {
    localStorage.removeItem('userToken');
    setIsConnected(false);
    handleCancelQuiz();
    navigate('/');
  };

  //pour la mise en page avec les questions passées, et qui reste
  const paginationDots = Array(10).fill(null).map((_, index) => (
    <span key={index} className={`dot ${index === questionCount ? 'active' : ''}`}></span>
  ));

  return (
    <div className="quiz-page">
      <div className="sidebar">
        <div className="logo-container">
          <Link to="/" onClick={handleCancelQuiz}><img src={logo} alt="Logo" className="home-logo" /></Link>
        </div>
        <div className="user-logout-container">
          <Link to="/profile" onClick={handleCancelQuiz}><img src={userIcon} alt="Profil Utilisateur" className="user-icon" /></Link>
          <img src={logoutIcon} alt="Déconnexion" className="logout-icon" onClick={signOut} style={{cursor: 'pointer'}} />
        </div>
      </div>
      <div className="quiz-content">
        <h1>SpotTrend Quiz</h1>
        <div className="pagination">{paginationDots}</div>
        {isQuizComplete ? (
          <div className="quiz-complete">
            <h2>Quiz Terminé!</h2>
            <p>Votre score final: {score}</p>
          </div>
        ) : (
          loading ? (
            <p>Loading question...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            question && (
              <div className="question-container">
                <p className="question-title">{question.question}</p>
                <div className="choices-container">
                  {question.choices.map((choice, index) => (
                    <button key={index} onClick={() => handleChoice(choice)} className={getButtonClass(choice)} disabled={selectedChoice !== null}>
                      {choice}
                    </button>
                  ))}
                </div>
                <p>Score: {score}</p>
                {selectedChoice !== null && (
                  <button className="next-question-button" onClick={handleNextQuestion}>
                    {questionCount === 9 ? 'Terminer' : 'Question Suivante'}
                  </button>
                )}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default QuizPage;
