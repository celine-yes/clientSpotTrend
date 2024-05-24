import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SignInUpPage.css';
import logo from './logo.svg'; 

function SignUpPage() {
  const navigate = useNavigate();
  //etat local pour stocker les valeurs des champs du formulaire
  const [formData, setFormData] = useState({
    pseudo: '',
    password: '',
  });

  //gère la mise à jour de l'état local lorsque les champs du formulaire changent
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //gère soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(formData.pseudo, formData.password)
      .then(() => {
        alert('Inscription réussie !');
        navigate('/signin');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'inscription:', error);
        alert(`${error.message}`);
      });
};

  async function signUp(pseudo, password) {
    const response = await fetch('http://localhost:8080/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pseudo, password }),
    });
    if (!response.ok) {
      return response.text().then(text => Promise.reject(new Error(text || 'Échec de l\'inscription')));
    }
    return await response.json();
  }

  return (
    <div className="signInUpPage">
      <div className="logo">
      <img src={logo} className='logoNotConnected'/>
      </div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pseudo">Pseudo :</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-box">
          <button type="submit" className="btn">S'inscrire</button>
          <button type="button" className="btn" onClick={() => navigate('/')}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
