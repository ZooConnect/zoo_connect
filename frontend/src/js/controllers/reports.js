import reportService from '../services/report.service.js';

class ReportsController{
    constructor(){
        this.startDate = document.getElementById('startDate');
        this.endDate = document.getElementById('endDate');
        this.typeSelect = document.getElementById('reportType');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.summary = document.getElementById('summary');
        this.details = document.getElementById('details');

        this.attach();
        this.load();
    }

    attach(){
        this.refreshBtn.addEventListener('click', ()=> this.load());
    }

    async load(){
        const start = this.startDate.value || undefined;
        const end = this.endDate.value || undefined;
        const type = this.typeSelect.value;
        try{
            this.summary.innerHTML = '<p>Loading...</p>';
            const resp = await reportService.getReports({ start, end, type });
            const data = resp.data || resp; // accept either shape
            this.renderSummary(data);
        }catch(err){
            this.summary.innerHTML = `<p style="color:#d32f2f">${err.message}</p>`;
        }
    }

    renderSummary(data){
        const cards = [];
        if (data.visitors){
            cards.push(`<div class="card"><h3>Visitors</h3><p>Total bookings: ${data.visitors.totalBookings}</p><p>Total visitors: ${data.visitors.totalVisitors}</p></div>`);
        }
        if (data.revenue){
            cards.push(`<div class="card"><h3>Revenue</h3><p>Total: ${data.revenue.totalRevenue}</p><p>Invoices: ${data.revenue.invoicesCount}</p></div>`);
        }
        if (data.health){
            cards.push(`<div class="card"><h3>Animal Health</h3><p>Checks: ${data.health.checks}</p><p>Treatments: ${data.health.treatments}</p><p>Alerts: ${data.health.alerts}</p></div>`);
        }
        if (cards.length === 0) cards.push('<div class="card"><p>No data for selected criteria.</p></div>');
        this.summary.innerHTML = cards.join('');
    }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=> new ReportsController()); else new ReportsController();
