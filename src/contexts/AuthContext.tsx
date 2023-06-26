import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { ReactNode, createContext, useEffect, useState } from "react";
import { storageUserSave, storageUserLoad, storageUserRemove } from "@storage/storageUser";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (userUpdate : UserDTO) => Promise<void>; 
    isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthContextProviderProps) {
    const [user,setUser] = useState<UserDTO>({} as UserDTO)
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        try {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setUser(userData)
        } catch (error) {
            throw error;
        }
       
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {

            await storageUserSave(userData)
            await storageAuthTokenSave({token, refresh_token})
        } catch (error) {
            throw error;
        } 
    }

    async function signIn(email: string, password: string) {
        try {
            const {data} = await api.post('/sessions', {email, password})
            
            if (data.user && data.token && data.refresh_token) {
                setIsLoadingUserStorageData(true)
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
                userAndTokenUpdate(data.user, data.token);
            }
        } 
        catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            await storageUserRemove()
            await storageAuthTokenRemove();
            setUser({} as UserDTO)
        } 
        catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function updateUserProfile(userUpdate : UserDTO) {
        try {
            setUser(userUpdate);
            await storageUserSave(userUpdate);

        } catch (error) {
            throw error;
        }
    }

    async function loadUserData() {
        try {
            setIsLoadingUserStorageData(true);
            const userLogged = await storageUserLoad();
            const {token} = await storageAuthTokenGet();

            if(userLogged && token) {
                userAndTokenUpdate(userLogged, token);
            }
        } catch (error) {
            throw error;       
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    useEffect(() => {loadUserData()}, [])

    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(signOut);

        return () => {
            subscribe();
        }
    }, [signOut])
    
    return (
            <AuthContext.Provider value={{user, signIn, signOut,updateUserProfile, isLoadingUserStorageData}}>
                {children}
            </AuthContext.Provider>
        );
}