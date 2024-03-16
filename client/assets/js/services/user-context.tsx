import React, { useState, useEffect, createContext } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated, User } from './auth.js';


const UserContext = createContext<User>(null);


export const UserProvider = ({ children }) => {
  const  [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let cuser :User | null = await isAuthenticated();

      setCurrentUser(cuser);
    };

    checkLoggedIn().then(r => {});
  }, []);


  return (
    <UserContext.Provider value={{currentUser, setCurrentUser}}>
      { children }
    </UserContext.Provider>
  );
};


export default UserContext;