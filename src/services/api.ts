import { storageAuthTokenGet } from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, {AxiosInstance} from "axios";

type SignOut = () => void;

type APIInstance = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
    baseURL: 'http://10.0.0.206:3333'
}) as APIInstance;

api.registerInterceptTokenManager = signOut => {
    const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {
        if (requestError?.response?.status === 401) {
            if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
                const {refresh_token} = await storageAuthTokenGet();

                if(!refresh_token) {
                    signOut();
                    return Promise.reject(requestError);
                }
            }

            signOut();
        }

        if (requestError.response && requestError.response.data) {
            return Promise.reject(new AppError(requestError.response.data.message));
        } else {
            return Promise.reject(new AppError('Erro no servidor. Tente novamente mais tarde.'))
        }
    })

    return () => {
        api.interceptors.response.eject(interceptTokenManager);
    }
}


export { api };