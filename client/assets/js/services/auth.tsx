
const auth_url = '/api/user/me';

export const isAuthenticated = async () => {

  const response = await fetch(auth_url);
  if (!response.ok)
    return null;
  return response.json();
  return data.data;


};
