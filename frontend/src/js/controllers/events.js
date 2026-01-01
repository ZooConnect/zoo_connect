
const API_BASE_URL = '/api'; 

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadEvents(); // Chargement initial
});

/**
 * Configuration des écouteurs d'événements
 */
function setupEventListeners() {
    const applyBtn = document.getElementById('applyFilters');
    const clearBtn = document.getElementById('clearFilters');
    const listViewBtn = document.getElementById('listViewBtn');
    const calendarViewBtn = document.getElementById('calendarViewBtn');

    if (applyBtn) applyBtn.addEventListener('click', applyFilters);
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    
    if (listViewBtn) listViewBtn.addEventListener('click', () => switchView('list'));
    if (calendarViewBtn) calendarViewBtn.addEventListener('click', () => switchView('calendar'));
}

/**
 * Gestion des vues
 */
function switchView(view) {
    const listView = document.getElementById('listView');
    const calendarView = document.getElementById('calendarView');
    const listViewBtn = document.getElementById('listViewBtn');
    const calendarViewBtn = document.getElementById('calendarViewBtn');

    if (view === 'list') {
        listView.classList.remove('hidden');
        calendarView.classList.remove('active');
        listViewBtn.classList.add('active');
        calendarViewBtn.classList.remove('active');
    } else {
        listView.classList.add('hidden');
        calendarView.classList.add('active');
        listViewBtn.classList.remove('active');
        calendarViewBtn.classList.add('active');
    }
}

/**
 * Récupération des données depuis le Backend
 */
async function loadEvents(filters = {}) {
    showLoading(true);
    hideError();

    try {
        const queryParams = new URLSearchParams();
        if (filters.date) queryParams.append('date', filters.date);
        if (filters.type) queryParams.append('type', filters.type);

        const response = await fetch(`${API_BASE_URL}/events?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }

        const events = await response.json();
        displayResultsSummary(events, filters);
        displayEvents(events);
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showError('Impossible de charger les événements.');
    } finally {
        showLoading(false);
    }
}

/**
 * Affichage de la grille d'événements
 */
function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    
    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <div class="no-events-icon">📭</div>
                <h3>No events found</h3>
                <p>Try changing your filters to see more activities.</p>
            </div>`;
        return;
    }

    container.innerHTML = `<div class="events-grid">
        ${events.map(event => createEventCard(event)).join('')}
    </div>`;
}

/**
 * Génération de la carte HTML (avec Location dynamique)
 */
function createEventCard(event) {
    const start = new Date(event.start_date);
    
    // Formatage français pour la date et l'heure
    const dateStr = start.toLocaleDateString('fr-FR', { 
        day: 'numeric', month: 'short' 
    });
    const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;

    return `
    <article class="event-card">
        <div class="event-header">
            <span class="event-type">${escapeHtml(event.type || 'General')}</span>
            <h3 class="event-title">${escapeHtml(event.title)}</h3>
        </div>
        <div class="event-body">
            <div class="event-date">
                <span>🕒 <b>${timeStr}</b></span> | <span>📅 ${dateStr}</span>
            </div>
            <p class="event-description">${escapeHtml(event.description || '')}</p>
            <div class="event-location">
                📍 <span><b>Location:</b> ${escapeHtml(event.location || 'See Zoo Map')}</span>
            </div>
            <span class="event-status ${event.status === 'active' ? 'status-active' : 'status-upcoming'}">
                ${event.status === 'active' ? '● En cours' : '○ Programmé'}
            </span>
        </div>
    </article>
    `;
}

/**
 * Utilitaires UI
 */
function applyFilters() {
    const filters = {
        date: document.getElementById('dateFilter').value,
        type: document.getElementById('typeFilter').value
    };
    loadEvents(filters);
}

function clearFilters() {
    document.getElementById('dateFilter').value = '';
    document.getElementById('typeFilter').value = '';
    loadEvents();
}

function displayResultsSummary(events, filters) {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.innerHTML = `
            <div class="results-summary">
                <span class="results-count">${events.length} événement(s) trouvé(s)</span>
            </div>`;
    }
}

function showLoading(show) { document.getElementById('loading').style.display = show ? 'block' : 'none'; }
function showError(msg) { 
    const err = document.getElementById('errorMessage');
    err.textContent = msg;
    err.style.display = 'block';
}
function hideError() { document.getElementById('errorMessage').style.display = 'none'; }

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}