import React, { useState, useEffect } from 'react';

const MembershipInfo = ({ userId }) => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch membership data from the new API route
    const fetchMembership = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/membership`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch membership info');
        }

        const data = await response.json();
        setMembership(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'abonnement");
        setLoading(false);
      }
    };

    fetchMembership();
  }, [userId]);

  if (loading) return <p>Chargement de l'abonnement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!membership) return null;

  // Format the date nicely (e.g., "12/05/2025")
  const formattedDate = membership.expiration_date 
    ? new Date(membership.expiration_date).toLocaleDateString('fr-FR')
    : 'N/A';

  const isExpired = membership.status === 'expired';

  return (
    <div className="membership-card p-4 border rounded shadow-md mt-6 bg-white">
      <h3 className="text-xl font-bold mb-4">Mon Abonnement</h3>
      
      <div className="mb-2">
        <span className="font-semibold">Type: </span>
        <span className={`badge ${membership.membership_type === 'Premium' ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}>
          {membership.membership_type}
        </span>
      </div>

      <div className="mb-4">
        <span className="font-semibold">Date d'expiration: </span>
        <span>{formattedDate}</span>
      </div>

      <div className="mb-2">
        <span className="font-semibold">Statut: </span>
        <span className={isExpired ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
          {membership.status === 'active' ? 'Actif ✅' : 'Expiré ❌'}
        </span>
      </div>

      {/* Show Renew Button only if expired */}
      {isExpired && (
        <button 
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => alert("Redirection vers la page de paiement...")}
        >
          Renouveler mon abonnement
        </button>
      )}
    </div>
  );
};

export default MembershipInfo;