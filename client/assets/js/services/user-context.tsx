import React, { useState, useEffect, createContext } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from './auth.js';


const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const  [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let cuser : {} | null = await isAuthenticated();

      setCurrentUser(cuser);
    };

    checkLoggedIn();
  }, []);


  return (
    <UserContext.Provider value={{currentUser, setCurrentUser}}>
      { children }
    </UserContext.Provider>
  );
};


export default UserContext;