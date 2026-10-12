import axios from 'axios';
import { BACKEND_API_URL } from '@env';

const Api = axios.create({
  baseURL: BACKEND_API_URL || 'http://10.0.2.2:3000',
  timeout: 10000,
});

export default Api;
