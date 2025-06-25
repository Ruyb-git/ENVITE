// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Navigate, Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import Input from "../components/ui/Input";
// import Button from "../components/ui/Button";
// import logo from "../components/images/logo-envite.svg";

// const loginSchema = z.object({
//   email: z.string().email("E-mail inválido"),
//   password: z.string().min(1, "A senha é obrigatória"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// const LoginPage: React.FC = () => {
//   const { login, isAuthenticated, loading } = useAuth();
//   const [error, setError] = useState<string | null>(null);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       setError(null);
//       await login(data);
//     } catch (err) {
//       setError("E-mail ou Senha inválidos");
//     }
//   };

//   if (isAuthenticated) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row justify-between bg-[#1E1E1E] p-6 sm:p-12 lg:p-32 gap-10">
//       <div className="flex flex-col justify-between lg:max-w-md text-center lg:text-left items-center lg:items-start">
//         <div>
//           <img className="w-24 h-auto mb-6" src={logo} alt="logo Envite" />
//           <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">
//             Encontre eventos em sua <br className="hidden lg:block" />
//             região e convide amigos
//           </h1>
//         </div>

//         <div>
//           <h2 className="text-white text-base sm:text-lg">
//             Para propagar a interação e aumentar o ciclo social de amigos, <br className="hidden lg:block" />
//             o ENVITE promove a disseminação de eventos em <br className="hidden lg:block" />
//             determinadas localidades.
//           </h2>
//         </div>
//       </div>

//       <div className="w-full max-w-[550px] mx-auto">
//         <div className="w-full bg-[#2F2F2F] border-[#434343] border-2 py-8 px-6 sm:px-10 rounded-[27px]">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//               {error}
//             </div>
//           )}

//           <div className="pb-10">
//             <h1 className="text-white text-3xl font-medium">Login</h1>
//             <h2 className="text-white text-base">Faça o login caso já tenha uma conta</h2>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             <Controller
//               name="email"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   label="E-mail"
//                   type="email"
//                   error={errors.email?.message}
//                   {...field}
//                 />
//               )}
//             />

//             <Controller
//               name="password"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   label="Senha"
//                   type="password"
//                   msg="Use 6 ou mais caracteres com uma mistura de letras, números e símbolos"
//                   error={errors.password?.message}
//                   {...field}
//                 />
//               )}
//             />

//             <div className="pt-10">
//               <Button type="submit" isLoading={loading} fullWidth>
//                 Entrar
//               </Button>

//               <div className="text-center pt-4">
//                 <p className="text-sm text-white">
//                   Ainda não tem uma conta?{" "}
//                   <Link
//                     to="/register"
//                     className="font-medium text-indigo-600 hover:text-indigo-500"
//                   >
//                     Inscreva-se agora
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import logo from "../components/images/logo-envite.svg";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data);
    } catch (err) {
      setError("E-mail ou Senha inválidos");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-between bg-[#1E1E1E] p-6 sm:p-12 lg:p-32 lg:pr-40 lg:pl-40 gap-10">
      <div className="flex flex-col justify-between lg:max-w-md text-center lg:text-left items-center lg:items-start">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <img
            className="w-56 sm:w-48 lg:w-full h-auto mb-6 mx-auto lg:mx-0"
            src={logo}
            alt="logo Envite"
          />
          <h1 className="text-white text-2xl p-4 sm:text-3xl lg:text-3xl font-bold ">
            Encontre eventos em sua região e convide amigos
          </h1>
        </div>

        <div>
          <h2 className="text-white p-4 text-base">
            Para propagar a interação e aumentar o ciclo social de amigos,o
            ENVITE promove a disseminação de eventos em determinadas
            localidades.
          </h2>
        </div>
      </div>

      <div className="max-w-[550px] w-full">
        <div className="w-full h-full flex flex-col bg-[#2F2F2F] border-[#434343] border-2 py-8 px-6 sm:px-10 rounded-[27px]">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="pb-10">
            <h1 className="text-white text-3xl font-medium">Login</h1>
            <h2 className="text-white text-base">
              Faça o login caso já tenha uma conta
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  label="E-mail"
                  type="email"
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  label="Senha"
                  type="password"
                  msg="Use 6 ou mais caracteres com uma mistura de letras, números e símbolos"
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />

            <div className="pt-12 sm:pt-52">
              <Button type="submit" isLoading={loading} fullWidth>
                Entrar
              </Button>

              <div className="text-center pt-4">
                <p className="text-sm text-white">
                  Ainda não tem uma conta?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Inscreva-se agora
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
