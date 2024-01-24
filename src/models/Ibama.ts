import { ZodError, z } from "zod"

export const Ibama = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type Ibama = z.infer<typeof Ibama>

export const createIbama = (ibama: Ibama) => {
  try {
    const result = Ibama.safeParse(ibama)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}