import {
  createKindeManagementAPIClient,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server';

export default async function useToken() {
  const apiClient = await createKindeManagementAPIClient();
  const user = await apiClient.oauthApi.getUser();
  const token = await getKindeServerSession().getAccessToken();

  const isAuthLoading = !token && !user;

  return { token, isLoading: isAuthLoading, user };
}
