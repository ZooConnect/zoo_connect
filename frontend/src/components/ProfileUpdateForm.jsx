import React, { useState, useEffect } from 'react';
import MembershipInfo from './MembershipInfo'; // Import the new component

const ProfileUpdateForm = () => {
  // ---------------------------------------------------------
  // 1. SETUP: Get User ID (Replace this logic with your Auth system later)
  // For now, we assume we are testing with a specific User ID.
  // ---------------------------------------------------------
  const userId = "6931af867c6ac4ba9b51a7a2";

  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState(null);

  // ---------------------------------------------------------
  // 2. LOGIC: Handle Input Changes
  // ---------------------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------------------
  // 3. LOGIC: Handle Form Submit (Update Profile)
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Erreur de connexion au serveur" });
    }
  };

  // ---------------------------------------------------------
  // 4. UI: Render the Page
  // ---------------------------------------------------------
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Mon Compte</h2>

      {/* --- SECTION 1: UPDATE FORM (SCRUM-23) --- */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="votre@email.com"
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700">Nouveau Mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Mettre à jour mon profil
        </button>
      </form>

      {/* Feedback Message */}
      {message && (
        <div className={`mt-4 p-2 text-center rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* --- SECTION 2: MEMBERSHIP CARD (SCRUM-24) --- */}
      {/* This automatically fetches and displays the subscription info */}
      <MembershipInfo userId={userId} />

    </div>
  );
};

export default ProfileUpdateForm;