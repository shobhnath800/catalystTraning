import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '50s',
  cloud: {
    // Project: default project
    projectID: 3723431,
    // Test runs with the same name groups test runs together.
    name: 'Test (07/12/2024-23:02:51)'
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },  
};

export default function() {
  http.get('http://localhost:3000/server/nodejstest_function/user/api/v1/create-user');
  sleep(1);
}