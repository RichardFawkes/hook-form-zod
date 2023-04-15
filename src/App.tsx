import { useState } from "react";
import "./styles/global.css";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("O nome é obrigatório")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("O e-mail é obrigatório")
    .email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha precisa de no mínimo de 6 caracteres"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export function App() {
  const [output, setOutput] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="">Nome</label>
          <input
            type="text"
            className=" border border-zinc-600 shadow-sm rounded h-10 px-3 text-white bg-zinc-900"
            {...register("name")}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            type="email"
            className=" border border-zinc-600 shadow-sm rounded h-10 px-3 text-white bg-zinc-900"
            {...register("email")}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input
            type="password"
            className=" border border-zinc-600 shadow-sm rounded h-10 px-3 text-white bg-zinc-900"
            {...register("password")}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10"
        >
          Entrar
        </button>
        <pre className=" text-white h-10">{output}</pre>
      </form>
    </main>
  );
}

export default App;
