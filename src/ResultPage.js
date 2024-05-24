import React, { useState, useEffect } from 'react';
import { useLocation, Link} from 'react-router-dom';
import logo from './logo.svg'; 
import userIcon from './user.svg'; 
import logoutIcon from './logout.png'; 
import './styles/ResultPage.css';

function ResultPage() {
  const location = useLocation();
  const [userClassement, setUserClassement] = useState([]);

  const { score } = location.state || { score: 'Score non trouvé' };
  const [quizResults, setQuizResults] = useState({
    scoreTotal: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResults = async () => {
      const token = localStorage.getItem('userToken');
      try {
        const response = await fetch('http://localhost:8080/get-result', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des résultats du quiz');
        }
        const data = await response.json();
        setQuizResults(data);
        setUserClassement(data.userRanking)
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des résultats du quiz', error);
        setIsLoading(false);
      }
    };

    fetchQuizResults();
  }, []);

  const signOut = () => {
    localStorage.removeItem('userToken');
    console.log("Déconnexion de l'utilisateur");
  };

  return (
    <div className="result-page">
      <div className="sidebar">
        <div className="logo-container">
          <Link to="/"><img src={logo} alt="Logo" className="home-logo" /></Link>
        </div>
        <div className="user-logout-container">
          <Link to="/profile"><img src={userIcon} alt="Profil Utilisateur" className="user-icon" /></Link>
          <img src={logoutIcon} alt="Déconnexion" className="logout-icon" onClick={signOut} style={{cursor: 'pointer'}} />
        </div>
      </div>
      <div className="content-result">
        <h1>Résultats</h1>
        <div className="score-section">
          <span className="score-title">Score pour cette partie :</span>
          <span className="score-value">{score} / 10</span>
        </div>
        <div className="score-section">
          <span className="score-title">Score total :</span>
          <span className="score-value">{quizResults.scoreTotal}</span>
        </div>
        <h2>Classement : </h2>
        {userClassement && userClassement.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Pseudo</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {userClassement.map((user) => (
                <tr key={user.pseudo}>
                  <td>{user.rank}</td>
                  <td>{user.pseudo}</td>
                  <td>{user.scoreTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Le classement n'est pas encore disponible.</p>
        )}
      </div>
    </div>
  );
}

export default ResultPage;
