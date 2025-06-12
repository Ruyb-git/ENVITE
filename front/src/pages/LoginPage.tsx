import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import logo from "../components/images/logo-envite.svg";
import { Calendar } from "lucide-react";

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
    <div className="min-h-screen flex h-screen flex justify-between bg-[#1E1E1E] p-32 pr-40 pl-40 ">
      <div className="flex flex-col justify-between ">
        <div>
          <img className=" w-23 h-auto " src={logo} alt="logo Envite" />
          <h1 className="text-white text-[36px] font-bold  p-4">
            Encontre eventos em sua <br />
            região e convide amigos
          </h1>
        </div>

        <div>
          <h2 className="text-white  p-4">
            Para propagar a interação e aumentar o ciclo social de amigos,
            <br /> o ENVITE promove a disseminação de eventos em determinadas
            <br />
            localidades.
          </h2>
        </div>
      </div>

      <div className="max-w-[550px] w-full space-y-8">
        <div className="w-[full] h-full bg-[#2F2F2F] border-[#434343] border-[2px] py-8 px-4 rounded-[27px] sm:px-10 ">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="pb-16">
            <h1 className="text-white text-[36px] font-medium">Login</h1>
            <h2 className="text-white">Faça o login caso já tenha uma conta</h2>
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

            <div className="pt-16">
              <Button type="submit" isLoading={loading} fullWidth>
                Entrar
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm  text-white">
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
