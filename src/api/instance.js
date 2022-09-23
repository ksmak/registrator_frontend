import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://localhost:8000',
	headers: {
		'Content-Type': 'application/json',
	},
})

instance.interceptors.request.use(
	request => {
		request.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem('access_token');
		return request;
	},
	error => {
		return Promise.reject(error);
	}
);

export default instance