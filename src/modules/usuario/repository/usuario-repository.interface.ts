export interface IUsuarioRepository {
  create(usuario: any): Promise<any>;
  findAll(): Promise<any[]>;
  findOne(id: string): Promise<any>;
  update(id: string, usuario: any): Promise<any>;
  remove(id: string): Promise<any>;
}
