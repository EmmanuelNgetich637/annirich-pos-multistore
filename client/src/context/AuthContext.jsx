import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser,
    getCurrentUser
} from "../api/authApi";


const AuthContext =
    createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const restoreSession =
            async () => {

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    setLoading(false);

                    return;

                }

                try {

                    const response =
                        await getCurrentUser();

                    if (response.success) {

                        setUser(
                            response.user
                        );

                    } else {

                        localStorage.removeItem(
                            "token"
                        );

                    }

                } catch (error) {

                    console.error(
                        "Session restore failed:",
                        error
                    );

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                } finally {

                    setLoading(false);

                }

            };


        restoreSession();

    }, []);


    const login = async (
        storeCode,
        username,
        password
    ) => {

        const response =
            await loginUser({
                storeCode,
                username,
                password
            });


        if (!response.success) {

            throw new Error(
                response.message ||
                "Login failed"
            );

        }


        localStorage.setItem(
            "token",
            response.token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(
                response.user
            )
        );


        setUser(response.user);


        return response;

    };


    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        setUser(null);

    };


    const value = {

        user,

        loading,

        isAuthenticated:
            Boolean(user),

        login,

        logout

    };


    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

}