import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContextType, LoginFormData, User } from "../types";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          // Verify token is valid
          await api.post("/api/v1/user/auth/token/verify/", { token });

          // Get user data
          const response = await api.get("/api/v1/user/me/");
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/user/auth/login/", data);
      const { access, refresh, user } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Get more detailed user info
      const userResponse = await api.get("/api/v1/user/me/");
      setUser(userResponse.data);

      navigate("/");
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/api/v1/user/auth/logout/");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
