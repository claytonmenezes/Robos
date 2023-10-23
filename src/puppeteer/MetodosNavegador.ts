import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'

export class MetodosNavegador implements IMetodosNavegador {
  defineBrowser(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  abrePagina(url: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  pegaTextoElemento(selector: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  pegaTableElemento(selector: string): Promise<Object[]> {
    throw new Error('Method not implemented.')
  }
  esperaElementoExistir(selector: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  esperaElementoSumir(selector: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  verificaElementoVisivel(selector: string): Promise<Boolean> {
    throw new Error('Method not implemented.')
  }
}