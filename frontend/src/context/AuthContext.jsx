import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext() //Creamos contexto

export const AuthProvider = ({children}) => {
    const [user, setUser ] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    

    useEffect(() => {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (token && storedUser ) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        }
    }, [])

    const login = (userData, token) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))

        setUser(userData)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setUser(null)
        setIsAuthenticated(false)
    }

    const updateUser = (nuevosDatos) => {
        setUser((prevUser) => {
            // 1. Fusionamos los datos viejos con los nuevos
            const updatedUser = { ...prevUser, ...nuevosDatos };
            
            // 2. Sobrescribimos el localStorage para que no se pierda al recargar (F5)
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // 3. Devolvemos el nuevo usuario para que React actualice la pantalla
            return updatedUser;
        });
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
