import { useEffect, useState, createContext, use } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{

    const [user, setUser] = useState(null)

    useEffect(()=>{
        const token = localStorage.getItem('token')
        const userName = localStorage.getItem('name')
        const email = localStorage.getItem('email')
        if(token) setUser({token, userName, email})
    },[])

    const login = ({token, userName, email})=>{
        localStorage.setItem('token', token)
        localStorage.setItem('name', userName)
        localStorage.setItem('email', email)
        setUser({token, userName, email})
    }

    const logout = ()=>{
        localStorage.clear()
        setUser(null)
    }


    return <>
     <AuthContext.Provider value = {{login, logout, user}}>
            {children}
     </AuthContext.Provider>
    </>
}