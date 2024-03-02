import { Usuario } from "../model/usuario";
import { BASE_URL } from "../infra/config";

export class UsuarioService {

  static async buscarPorEmail(email:string) : Promise<Usuario[]> {

    // const url = `${BASE_URL}usuario/obter?email=${email}`
    // const response = await fetch(url);

    // if (!response.ok){
    //   throw new Error(`Erro ao buscar usuário ${response.statusText}`)
    // }

    // const data = await response.json();

    const data: Usuario[] = [
      {nome: 'Weslei',email: 'teste@teste.com',celular: '00-11111-1111'},
      {nome: 'Weslei2222',email: 'teste@teste.com',celular: '00-11111-1111'}
    ]

    return data as Usuario[];
  }
}