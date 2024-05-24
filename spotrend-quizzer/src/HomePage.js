
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './logo.svg'; 
import userIcon from './user.svg'; 
import logoutIcon from './logout.png'; 
import './styles/HomePage.css';


function HomePage() {
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('userToken'));
  const [topPlayers, setTopPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  //surveille les changements dans localStorage pour 'userToken'
  useEffect(() => {
    const handleStorageChange = () => {
      setIsConnected(!!localStorage.getItem('userToken'));
    };

    //ajoute un écouteur d'événements sur le stockage pour réagir aux changements
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

   //fontion pour charger les classements du serveur
   async function fetchTopPlayers () {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/topPlayers', {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Impossible de récupérer les meilleurs joueurs.');
      }
      const data = await response.json();
      setTopPlayers(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des meilleurs joueurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopPlayers();
  }, []);

  const startQuiz = () => {
    navigate('/quiz'); //fonction qui redirige l'utilisateur vers la page du quiz
  };

  const signOut = () => {
    localStorage.removeItem('userToken');
    setIsConnected(false); 
  };


  if (!isConnected) {
    //si l'utilisateur n'est pas connecté, page de connexion ou d'inscription
    return (
      <div className="outer-box">
      <div className="logo">
      <img src={logo} className='logoAccueil'/>
      </div>
        <div className="title-box">
          <h1>SPOTTREND QUIZ</h1>
        </div>
        <div className="button-box">
          <Link to="/signin" className="btn">Se Connecter</Link>
          <Link to="/signup" className="btn">S'inscrire</Link>
        </div>
      </div>
    );
  }

  //si connecté, affiche la page principale
  return (
    <div className="main-page">
      <div className="sidebar">
        <div className="logo-container">
          <Link to="/" onClick={() => fetchTopPlayers()}><img src={logo} alt="Logo" className="home-logo" /></Link>
        </div>
        <div className="user-logout-container">
          <Link to="/profile"><img src={userIcon} alt="Profil Utilisateur" className="user-icon" /></Link>
          <img src={logoutIcon} alt="Déconnexion" className="logout-icon" onClick={signOut} style={{cursor: 'pointer'}} />
        </div>
      </div>
      <div className="content">
        <h1>SPOTTREND QUIZ</h1>
        <h2>Classement : </h2>
        {isLoading ? (
          <p>Chargement des meilleurs joueurs...</p>
        ) : (
          <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Pseudo</th>
              <th>Score Total</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers && topPlayers.map((player) => (
              <tr key={player.pseudo}>
                <td>{player.rank}</td>
                <td>{player.pseudo}</td>
                <td>{player.scoreTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
        <button className="start-quiz-button" onClick={startQuiz}>COMMENCER</button>
      </div>
    </div>
  );
}

export default HomePage;