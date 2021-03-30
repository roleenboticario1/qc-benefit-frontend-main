import http from "../http-common";

class BenefitDataService {
  getAll() {
    return http.get("/benefits");
  }

  get(id) {
    return http.get(`/benefits/${id}`);
  }

  create(data) {
    return http.post("/benefits", data);
  }

  update(id, data) {
    return http.put(`/benefits/${id}`, data);
  }

  delete(id) {
    return http.delete(`/benefits/${id}`);
  }
}

export default new BenefitDataService();