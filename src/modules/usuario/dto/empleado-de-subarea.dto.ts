export class EmpleadoDto {
  id: string;
  nombre: string;
  // Agregamos los campos que faltaban
  apellido?: string; 
  email: string;
  subarea?: any; // Lo ponemos como any para que acepte tanto el ID como el Objeto populado
  cantidadReclamos?: number;
}