// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Calendar, LogOut, Menu, User, X } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import logo from "../images/logo-envite.svg";

// const Navbar: React.FC = () => {
//   const { user, logout, isAuthenticated } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   if (!isAuthenticated) return null;

//   return (
//     <nav className="bg-[#2F2F2F] shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center ">
//             <Link to="/">
//               <img className="w-40 h-auto " src={logo} alt="logo Envite" />
//             </Link>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link
//               to="/"
//               className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Eventos
//             </Link>
//             <Link
//               to="/my-events"
//               className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Meus Eventos
//             </Link>
//             <Link
//               to="/participating"
//               className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Participando
//             </Link>

//             {/* User Menu */}
//             <div className="relative ml-3 flex items-center space-x-4">
//               <Link
//                 to="/me"
//                 className="flex items-center text-white hover:text-indigo-600"
//               >
//                 <User size={18} className="mr-2" />
//                 <span>{user?.name || user?.username}</span>
//               </Link>
//               <button
//                 type="button"
//                 className="flex items-center text-white hover:text-red-600"
//                 onClick={handleLogout}
//               >
//                 <LogOut size={18} className="mr-2" />
//                 <span>Sair</span>
//               </button>
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <div className="flex items-center md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden">
//           <div className="pt-2 pb-3 space-y-1 px-2">
//             <Link
//               to="/"
//               className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Eventos
//             </Link>
//             <Link
//               to="/my-events"
//               className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Meus Eventos
//             </Link>
//             <Link
//               to="/participating"
//               className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Participante
//             </Link>
//             <Link
//               to="/me"
//               className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Perfil
//             </Link>
//             <button
//               onClick={() => {
//                 setIsMenuOpen(false);
//                 handleLogout();
//               }}
//               className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-indigo-600 hover:bg-gray-50"
//             >
//               <LogOut size={16} className="mr-2" />
//               Terminar sessão
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Calendar, LogOut, Menu, User, X, Search } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../images/logo-envite.svg";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Defina aqui as rotas onde a busca aparece
  const searchableRoutes = ["/"]; // ajuste conforme necessário

  // Inicializa o search com o valor da URL
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 500);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Atualiza o URL com ?search= quando o usuário digita
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);

    if (debouncedSearch.trim() === "") {
      currentParams.delete("search");
    } else {
      currentParams.set("search", debouncedSearch.trim());
    }

    if (searchableRoutes.includes(location.pathname)) {
      navigate(`${location.pathname}?${currentParams.toString()}`, {
        replace: true,
      });
    }
  }, [debouncedSearch, navigate, location.pathname]);

  // Opcional: reseta o campo search ao mudar de página
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    setSearch(currentParams.get("search") || "");
  }, [location.pathname]);

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-[#2F2F2F] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/">
              <img className="w-40 h-auto" src={logo} alt="logo Envite" />
            </Link>
          </div>

          {/* Barra de busca nas rotas permitidas */}
          {searchableRoutes.includes(location.pathname) && (
            <div className="hidden md:flex mx-4 flex-grow max-w-md relative">
              {/* Ícone de busca */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500 " />
              </div>
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-[#1E1E1E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          )}

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Eventos
            </Link>
            <Link
              to="/my-events"
              className="text-white hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Meus Eventos
            </Link>
            <Link
              to="/participating"
              className="text-white hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Participando
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/me"
                className="flex items-center text-white hover:text-indigo-600"
              >
                <User size={18} className="mr-2" />
                <span>{user?.name || user?.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-red-600"
              >
                <LogOut size={18} className="mr-2" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Botão menu mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2">
          {searchableRoutes.includes(location.pathname) && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500 " />
              </div>
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-[#1E1E1E] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          )}
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-white"
          >
            Eventos
          </Link>
          <Link
            to="/my-events"
            onClick={() => setIsMenuOpen(false)}
            className="block text-white"
          >
            Meus Eventos
          </Link>
          <Link
            to="/participating"
            onClick={() => setIsMenuOpen(false)}
            className="block text-white"
          >
            Participando
          </Link>
          <Link
            to="/me"
            onClick={() => setIsMenuOpen(false)}
            className="block text-white"
          >
            Perfil
          </Link>
          <button onClick={handleLogout} className="block text-white">
            <LogOut size={16} className="inline mr-2" />
            Terminar sessão
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
