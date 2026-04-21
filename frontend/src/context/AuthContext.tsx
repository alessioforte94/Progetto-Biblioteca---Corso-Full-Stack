import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { checkSession, loginUser, logoutUser, registerUser } from '../api/auth.Api';
import type { AuthInfo, Credentials } from '../types/db.type';

type AuthState = {
    userId: number | null;
    email: string | null;
    role: 'USER' | 'ADMIN' | null;
    loading: boolean;
};

type AuthContextType = AuthState & {
    login: (credentials: Credentials) => Promise<void>;
    register: (info: AuthInfo) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        userId: null,
        email: null,
        role: null,
        loading: true,
    });

    // Al mount controlla se esiste una sessione attiva
    // sessionStorage si resetta alla chiusura della tab/browser,
    // quindi se il flag non c'è significa che è una nuova sessione browser
    useEffect(() => {
        const isNewBrowserSession = !sessionStorage.getItem('browserSession');

        const init = async () => {
            if (isNewBrowserSession) {
                // Nuova sessione browser: invalida l'eventuale sessione server rimasta
                try { await logoutUser(); } catch { /* ignore */ }
                sessionStorage.setItem('browserSession', '1');
                setState({ userId: null, email: null, role: null, loading: false });
                return;
            }

            try {
                const data = await checkSession();
                setState({
                    userId: (data as any).userId ?? null,
                    email: data.email,
                    role: data.role,
                    loading: false,
                });
            } catch {
                setState({ userId: null, email: null, role: null, loading: false });
            }
        };

        init();
    }, []);

    const login = async (credentials: Credentials) => {
        await loginUser(credentials);
        sessionStorage.setItem('browserSession', '1');
        const session = await checkSession();
        setState({
            userId: (session as any).userId ?? null,
            email: session.email,
            role: session.role,
            loading: false,
        });
    };

    const register = async (info: AuthInfo) => {
        await registerUser(info);
    };

    const logout = async () => {
        await logoutUser();
        setState({ userId: null, email: null, role: null, loading: false });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
