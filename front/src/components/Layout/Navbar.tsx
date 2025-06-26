import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../images/logo-envite.svg";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-[#2F2F2F] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center ">
            <Link to="/">
              <img className="w-40 h-auto " src={logo} alt="logo Envite" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Eventos
            </Link>
            <Link
              to="/my-events"
              className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Meus Eventos
            </Link>
            <Link
              to="/participating"
              className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Participando
            </Link>

            {/* User Menu */}
            <div className="relative ml-3 flex items-center space-x-4">
              <Link
                to="/me"
                className="flex items-center text-white hover:text-indigo-600"
              >
                <User size={18} className="mr-2" />
                <span>{user?.name || user?.username}</span>
              </Link>
              <button
                type="button"
                className="flex items-center text-white hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              to="/my-events"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Meus Eventos
            </Link>
            <Link
              to="/participating"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Participante
            </Link>
            <Link
              to="/me"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Perfil
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
            >
              <LogOut size={16} className="mr-2" />
              Terminar sessão
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
