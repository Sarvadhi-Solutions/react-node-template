import { http, HttpResponse } from 'msw';

const BASE = '*/api/v1';

export const authHandlers = [
  http.post(`${BASE}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        token: 'test-token-123',
        user: {
          id: '1',
          email: 'test@example.com',
          role: 'SUPER_ADMIN',
          name: 'Test User',
          status: 'active',
        },
      },
    });
  }),

  http.get(`${BASE}/auth/me`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        role: 'SUPER_ADMIN',
        name: 'Test User',
        status: 'active',
      },
    });
  }),

  http.get(`${BASE}/auth/sign-out`, () => {
    return HttpResponse.json({ success: true, data: null });
  }),
];
