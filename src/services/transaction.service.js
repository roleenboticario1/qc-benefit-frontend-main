import http from "../http-common";

class TransactionDataService {
  getAll(page=0, limit=10, search="") {
    return http.get(`/transactions?page=${page}&limit=${limit}&search=${search}`);
  }

  get(id) {
    return http.get(`/transactions/${id}?`);
  }

  create(data) {
    return http.post("/transactions", data);
  }

  update(id, data) {
    return http.put(`/transactions/${id}`, data);
  }

  delete(id) {
    return http.delete(`/transactions/${id}`);
  }

 // getbyQcId(data){
 //     return http.post(`/https://qaunifylb.unifysyscontrol.com/web-ums/index.php/Qcid_Api/get_info/${data}`);
 //  }
}

export default new TransactionDataService();