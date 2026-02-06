const BASE_URL = 'http://localhost:5281/api';

export const fetchProducts = async () =>
  fetch(`${BASE_URL}/Product`).then(res => res.json());

export const fetchInventory = async () =>
  fetch(`${BASE_URL}/inventory/recommendations`).then(res => res.json());

export const fetchForecast = async (productId: number) =>
  fetch(`${BASE_URL}/forecast/${productId}`).then(res => res.json());

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5281',
});