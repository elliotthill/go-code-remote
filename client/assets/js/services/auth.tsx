
const auth_url = '/api/user/me';


export type User = {
  id: number,
  email: string
}

export const isAuthenticated = async () => {

  const response = await fetch(auth_url);
  if (!response.ok)
    return null;
  return response.json();

};
