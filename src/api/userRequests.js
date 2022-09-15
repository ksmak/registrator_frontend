export default function(instance) {
    return {
        get_token(params) {
            return instance.post('api/token/', params)
        },
        refresh_token(token) {
            return instance.post('api/token/refresh/', token)
        },
        get_dicts() {
            return instance.get('user_requests/get_dicts')
        },
        get_list(page_size, page) {
            return instance.get(`user_requests/?page_size=${page_size}&page=${page}`);
        },
        get(id) {
            return instance.get(`user_requests/${id}`)
        },
        async update(item) {
            if (item.id === null) {
                return await instance.post('user_requests/', item);
            } else {
                return await instance.put(`user_requests/${item.id}/`, item);
            }
        },
        async delete(id) {
            return await instance.delete(`user_requests/${id}`)
        },   
        async check_iin(id, status, db, iin) {
            return await instance.get(`user_requests/check_iin/?id=${id}&status=${status}&db=${db}&iin=${iin}`);
        },
        async check_phone(id, status, db, phone) {
            return await instance.get(`user_requests/check_phone/?id=${id}&status=${status}&db=${db}&phone=${phone}`);
        },     
        async print_password(ids) {
            return await instance.get(`user_requests/print/?${ids}`, { responseType: 'blob' });
        },
        async send_email(ids, to_addr, zip_pas) {
            return await instance.get(`user_requests/send/?${ids}&to_addr=${to_addr}&zip_pas=${zip_pas}`);
        },
        get_addr_list() {
            return instance.get('user_requests/get_addr_list/');
        }
    }
}