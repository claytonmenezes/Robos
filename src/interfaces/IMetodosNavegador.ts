export interface IMetodosNavegador {
  defineBrowser (): Promise<void>
  abrePagina (url: string): Promise<void>
  pegaTextoElemento (selector: string): Promise<string>
  pegaTableElemento (selector: string): Promise<Array<Object>>
  esperaElementoExistir (selector: string): Promise<void>
  esperaElementoSumir (selector: string): Promise<void>
  verificaElementoVisivel (selector: string): Promise<Boolean>
}