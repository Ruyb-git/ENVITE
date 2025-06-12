import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import logo from "../components/images/logo-envite.svg";
import api from "../utils/api";
import toast from "react-hot-toast";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setErrors({});
      await api.post("/api/v1/user/register/", data);
      toast.success("Registro bem-sucedido! Inicie sessão.");
      navigate("/login");
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrors(error.response.data);
        Object.entries(error.response.data).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            toast.error(messages[0]);
          }
        });
      } else {
        toast.error("Erro no registro. Por favor, tente novamente mais tarde!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex h-screen flex justify-between bg-[#1E1E1E] p-32 pr-40 pl-40">
      <div className="flex flex-col justify-between">
        <div>
          <img className="w-23 h-auto" src={logo} alt="logo Envite" />
          <h1 className="text-white text-[36px] font-bold p-4">
            Crie sua conta e comece <br /> a criar eventos
          </h1>
        </div>
        <div>
          <h2 className="text-white p-4">
            Faça parte do ENVITE e ajude a propagar eventos locais. <br />
            Interaja, participe e conecte-se com pessoas da sua região.
          </h2>
        </div>
      </div>

      <div className="max-w-[550px] w-full space-y-8">
        <div className="w-full h-full bg-[#2F2F2F] border-[#434343] border-[2px] py-8 px-4 rounded-[27px] sm:px-10">
          <div className="pb-8">
            <h1 className="text-white text-[36px] font-medium">Registrar</h1>
            <h2 className="text-white">
              Crie sua conta preenchendo os campos abaixo
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  label="Username"
                  error={
                    formErrors.username?.message ||
                    (errors.username && errors.username[0])
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  label="Nome Completo"
                  error={
                    formErrors.name?.message || (errors.name && errors.name[0])
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  label="E-mail"
                  type="email"
                  error={
                    formErrors.email?.message ||
                    (errors.email && errors.email[0])
                  }
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
                  msg="Use 8 ou mais caracteres com uma mistura de letras, números e símbolos"
                  error={
                    formErrors.password?.message ||
                    (errors.password && errors.password[0])
                  }
                  {...field}
                />
              )}
            />

            <div className="pt-16">
              <Button type="submit" isLoading={loading} fullWidth>
                Registrar
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-white">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Iniciar sessão
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
