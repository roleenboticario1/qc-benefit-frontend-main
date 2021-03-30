import http from "../http-common";

class UserDataService {
  login(data) {
    return http.post("/login", data);
  }

  logout(data) {
    return http.post("/logout", data);
  }

  verify(data) {
    return http.post("/verify", data);
  }
}

export default new UserDataService();