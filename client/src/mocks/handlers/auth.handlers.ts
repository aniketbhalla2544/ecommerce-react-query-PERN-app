import { authRoutes } from '@api/auth';
import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post(authRoutes.SIGN_IN, () => {
    console.log('request to sign-in auth route');
    return HttpResponse.json(
      {
        success: true,
        loginAccessToken: 'asdfljasdjfl.sadfjsjadfl.safjlsdajf',
      },
      {
        status: 200,
      }
    );
  }),
];
