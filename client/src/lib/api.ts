import type { DashboardData, Sale, Task } from '../types';

const API = '/api';

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch(`${API}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function fetchSales(search?: string): Promise<Sale[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API}/sales${params}`);
  if (!res.ok) throw new Error('Failed to fetch sales');
  return res.json();
}

export async function createSale(data: {
  customer_name: string;
  channel: string;
  amount: number;
  status?: string;
}): Promise<Sale> {
  const res = await fetch(`${API}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create sale');
  return res.json();
}

export async function toggleTask(id: string, is_completed: boolean): Promise<Task> {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_completed }),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function searchDashboard(q: string) {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}
