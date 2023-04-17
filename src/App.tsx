import { useState } from "react";
import "./styles/global.css";

import { useFieldArray, useForm } from "react-hook-form";
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
    .email("Formato de e-mail inválido")
    .refine((email) => {
      return email.endsWith("@gmail.com");
    }, "O e-mail precisa ser do Gmail"),
  password: z.string().min(6, "A senha precisa de no mínimo de 6 caracteres"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("O titulo e obrigatorio"),
        knowledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(2, "Insira pelo menos 2 tecnlogias"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export function App() {
  const [output, setOutput] = useState();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function addNewTech() {
    append({ title: "", knowledge: 0 });
  }

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
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            type="email"
            className=" border border-zinc-600 shadow-sm rounded h-10 px-3 text-white bg-zinc-900"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>

          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-sm"
            >
              Adicionar
            </button>
          </label>
          {/* {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>} */}
          {fields.map((fields, index) => {
            return (
              <div className="flex flex-1 gap-2" key={fields.id}>
                <div className="flex-1 flex-col gap-1">
                  <input
                    type="text"
                    className=" border border-zinc-600 shadow-sm rounded h-10 px-3 text-white bg-zinc-900"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500 text-sm">
                      {errors.techs?.[index]?.title?.message}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 flex-1 border border-zinc-600 shadow-sm rounded h-10 px-3 text-white bg-zinc-900"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-red-500 text-sm">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {errors.techs && (
            <span className="text-red-500 text-sm">{errors.techs.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10"
        >
          Salvar
        </button>
        <pre className=" text-white h-10">{output}</pre>
      </form>
    </main>
  );
}

export default App;
