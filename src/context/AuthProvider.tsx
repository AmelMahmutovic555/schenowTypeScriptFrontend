import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface AuthContextType {
  message: string | null;
  setMessage: Dispatch<SetStateAction<string | null>>;
  apiUrl: string | undefined;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  message: "",
  setMessage: () => {},
  apiUrl: "",
});

const apiUrl = process.env.REACT_APP_API_URL;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        message,
        setMessage,
        apiUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
