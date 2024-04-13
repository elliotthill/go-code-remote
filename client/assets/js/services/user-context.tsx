import React, { useState, useEffect, createContext, Dispatch, SetStateAction } from 'react';
import { isAuthenticated, User } from './auth.js';


export interface UserContextType {
    currentUser: User | null
    setCurrentUser: Dispatch<SetStateAction<User | null>>
}

type ContextProviderProps = {
    children?: React.ReactNode
}

const UserContext = createContext<UserContextType>({currentUser:null,setCurrentUser:()=>{}});


export const UserProvider = ({ children }: ContextProviderProps) => {
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
