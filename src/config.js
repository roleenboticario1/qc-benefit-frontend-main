import { Formio } from 'react-formio';

const getQuery = (query) => {
  window.location.search.substr(1).split('&').forEach(function(item) {
    query[item.split('=')[0]] = item.split('=')[1] && decodeURIComponent(item.split('=')[1]);
  });

  return query;
}

const query = getQuery({});
const PROJECT_URL = query.projectUrl || 'http://localhost:3001';
const API_URL = query.apiUrl || 'http://localhost:3001';

export const AppConfig = {
  projectUrl: PROJECT_URL,
  apiUrl: API_URL
};

export const AuthConfig = {
  anonState: '/auth',
  authState: '/formio',
  login: {
    form: 'user/login'
  },
  register: {
    form: 'user/register'
  }
};

Formio.setProjectUrl(AppConfig.projectUrl);
Formio.setBaseUrl(AppConfig.apiUrl);


// $request = new Request(['id' => $id]);
// $this->approvedByIDRemarks($request);