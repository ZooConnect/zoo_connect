const API_BASE = '/api/admin';

export const reportService = {
    async getReports({ start, end, type } = {}){
        const params = new URLSearchParams();
        if (start) params.append('start', start);
        if (end) params.append('end', end);
        if (type) params.append('type', type);
        const url = `${API_BASE}/reports?${params.toString()}`;
        const res = await fetch(url, { method: 'GET', credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load reports');
        return await res.json();
    }
};

export default reportService;
