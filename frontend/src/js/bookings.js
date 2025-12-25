// src/public/js/bookings.js

let currentBookingId = null;
let bookings = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadBookings();
  setMinDateInModal();
});

// Set minimum date in modal to today
function setMinDateInModal() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  
  const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  document.getElementById('newDate').min = minDateTime;
}

// Load bookings from API
async function loadBookings() {
  const loadingEl = document.getElementById('loading');
  const containerEl = document.getElementById('bookings-container');
  const emptyEl = document.getElementById('empty-state');
  
  loadingEl.style.display = 'block';
  containerEl.style.display = 'none';
  emptyEl.style.display = 'none';

  try {
    const response = await fetch('/api/bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(response.status === 401 ? 'Authentication required' : 'Failed to load bookings');
    }

    bookings = await response.json();
    renderBookings(bookings);
  } catch (error) {
    console.error('Error loading bookings:', error);
    showAlert(`Erreur: ${error.message}`, 'error');
    emptyEl.style.display = 'block';
  } finally {
    loadingEl.style.display = 'none';
  }
}

// Render bookings
function renderBookings(bookingsData) {
  const containerEl = document.getElementById('bookings-container');
  const emptyEl = document.getElementById('empty-state');

  if (!bookingsData || bookingsData.length === 0) {
    containerEl.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }

  containerEl.innerHTML = bookingsData.map(booking => `
    <div class="booking-card ${booking.status === 'cancelled' ? 'cancelled' : ''}">
      <div class="booking-details">
        <div class="event-title">${booking.eventId?.title || 'Événement'}</div>
        <div class="event-info">
          <div class="info-item">
            <span class="info-label">Date</span>
            <span class="info-value">${formatDate(booking.eventId?.start_date)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Type</span>
            <span class="info-value">${booking.eventId?.type || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Billets</span>
            <span class="info-value">${booking.quantity}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Statut</span>
            <span class="status-badge ${booking.status === 'active' ? 'status-active' : 'status-cancelled'}">
              ${booking.status === 'active' ? 'Actif' : 'Annulé'}
            </span>
          </div>
        </div>
        ${booking.cancelledAt ? `
          <div style="color: #dc3545; font-size: 0.9em; margin-top: 5px;">
            Annulée le ${formatDate(booking.cancelledAt)}
          </div>
        ` : ''}
        ${booking.description ? `
          <div style="color: #666; font-size: 0.9em; margin-top: 10px;">
            ${booking.eventId?.description}
          </div>
        ` : ''}
      </div>
      <div class="actions">
        ${booking.status === 'active' ? `
          <button class="btn-reprogram" onclick="openReprogramModal('${booking._id}')">
            Reprogrammer
          </button>
          <button class="btn-cancel" onclick="openCancelModal('${booking._id}')">
            Annuler
          </button>
        ` : `
          <button class="btn-secondary" disabled style="opacity: 0.5;">
            Réservation annulée
          </button>
        `}
      </div>
    </div>
  `).join('');

  containerEl.style.display = 'grid';
  emptyEl.style.display = 'none';
}

// Open reprogram modal
function openReprogramModal(bookingId) {
  currentBookingId = bookingId;
  document.getElementById('reprogramForm').reset();
  document.getElementById('reprogramModal').classList.add('active');
}

// Close reprogram modal
function closeReprogramModal() {
  document.getElementById('reprogramModal').classList.remove('active');
  currentBookingId = null;
}

// Open cancel modal
function openCancelModal(bookingId) {
  currentBookingId = bookingId;
  document.getElementById('cancelForm').reset();
  document.getElementById('cancelModal').classList.add('active');
}

// Close cancel modal
function closeCancelModal() {
  document.getElementById('cancelModal').classList.remove('active');
  currentBookingId = null;
}

// Submit reprogram form
async function submitReprogramForm() {
  const newDate = document.getElementById('newDate').value;
  const reason = document.getElementById('reason').value;

  if (!newDate && !reason) {
    showAlert('Veuillez entrer une nouvelle date', 'error');
    return;
  }

  if (!newDate) {
    showAlert('Veuillez entrer une nouvelle date', 'error');
    return;
  }

  try {
    const body = {
      newDate: new Date(newDate).toISOString()
    };

    if (reason) {
      body.reason = reason;
    }

    const response = await fetch(`/api/bookings/${currentBookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reprogram booking');
    }

    showAlert('Réservation reprogrammée avec succès', 'success');
    closeReprogramModal();
    loadBookings();
  } catch (error) {
    console.error('Error reprogramming booking:', error);
    showAlert(`Erreur: ${error.message}`, 'error');
  }
}

// Submit cancel form
async function submitCancelForm() {
  const reason = document.getElementById('cancelReason').value;

  try {
    const response = await fetch(`/api/bookings/${currentBookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        reason: reason || 'User requested cancellation'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel booking');
    }

    showAlert('Réservation annulée avec succès', 'success');
    closeCancelModal();
    loadBookings();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    showAlert(`Erreur: ${error.message}`, 'error');
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

// Show alert message
function showAlert(message, type = 'error') {
  const alertEl = document.getElementById('alert');
  alertEl.textContent = message;
  alertEl.className = `alert show alert-${type}`;
  
  setTimeout(() => {
    alertEl.classList.remove('show');
  }, 5000);
}

// Get auth token (stub - implement based on your auth system)
function getAuthToken() {
  // In production, get token from localStorage, sessionStorage, or auth service
  return localStorage.getItem('authToken') || '';
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  const reprogramModal = document.getElementById('reprogramModal');
  const cancelModal = document.getElementById('cancelModal');
  
  if (e.target === reprogramModal) {
    closeReprogramModal();
  }
  if (e.target === cancelModal) {
    closeCancelModal();
  }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeReprogramModal();
    closeCancelModal();
  }
});
