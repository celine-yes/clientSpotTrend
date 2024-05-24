import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './logo.svg'; 
import userIcon from './user.svg';
import logoutIcon from './logout.png';
import './styles/ProfilePage.css';


function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [userClassement, setUserClassement] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserInfo() {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        console.error('Token is not available');
        setIsLoading(false);
        navigate('/'); 
        return;
      }

      try {
        console.log(`profile ${token}`);
        const response = await fetch('http://localhost:8080/userinfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info.');
        }

        const data = await response.json();
        setUserInfo(data.userInfo);
        setUserClassement(data.ranking);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur', error);
        navigate('/'); 
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserInfo();
  }, [navigate]);

  const signOut = () => {
    localStorage.removeItem('userToken'); 
    navigate('/');
  };

  if (isLoading) {
    return <p>Chargement des informations de l'utilisateur...</p>;
  }

  if (!userInfo) {
    return <p>Impossible d'afficher les informations de l'utilisateur</p>;
  }

  return (
      <div className="profile-page">
        <div className="sidebar">
          <div className="logo-container">
            <Link to="/"><img src={logo} alt="Logo" className="home-logo" /></Link>
          </div>
          <div className="user-logout-container">
            <Link to="/profile"><img src={userIcon} alt="Profil Utilisateur" className="user-icon" /></Link>
            <img src={logoutIcon} alt="Déconnexion" className="logout-icon" onClick={signOut} style={{cursor: 'pointer'}} />
          </div>
        </div>
        <div className="content-profile">
          <h1>{userInfo.pseudo}</h1>
          <div className="score-section">
            <span className="score-title">Nombre de parties :</span>
            <span className="score-value">{userInfo.nbDeParties}</span>
          </div>
          <div className="score-section">
            <span className="score-title">Score total :</span>
            <span className="score-value">{userInfo.scoreTotal}</span>
          </div>
          <h2>Historique des scores : </h2>
          {userInfo.scoreHistory && userInfo.scoreHistory.length > 0 ? (
          <table striped bordered hover size="sm">
            <thead>
              <tr>
                <th># Parties</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {userInfo.scoreHistory.map((score, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun historique de score disponible.</p>
        )}
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

export default ProfilePage;