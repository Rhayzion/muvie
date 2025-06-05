import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"


const AuthContext =createContext();

    export const useAuth = () => {
        return useContext(AuthContext);
    };

// provider component to start up with no user, watch for sign in or out, update if any, share user trough app
export const AuthProvider =({ children}) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const unsubscribe = onAuthStateChanged(
            auth, 
            (currentUser) =>{
                setUser(currentUser)
                setLoading(false)
            }
        );
        return () => unsubscribe()
    }, []);


    return(
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};