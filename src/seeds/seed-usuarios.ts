import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

// --------------------------------------------
// CONSTANTES
// --------------------------------------------
const AREA_DESARROLLO = '69246b407d0518c5e0c46f82';
const AREA_UXUI = '69246b777d0518c5e0c46f83';
const AREA_PRODUCTO = '69246ba07d0518c5e0c46f84';
const AREA_INFRAESTRUCTURA = '69246bc07d0518c5e0c46f85';

//AREA DESARROLLO
const SUB_BACKEND = '69246b417d0518c5e0c46f8f';
const SUB_FRONTEND = '69246b417d0518c5e0c46f92';
const SUB_FULLSTACK = '69246b417d0518c5e0c46f95';
const SUB_MOBILE = '69246b417d0518c5e0c46f98';
const SUB_TESTING = '69246b427d0518c5e0c46f9b';
const SUB_DEV_OPS = '69246b427d0518c5e0c46f9e';
//AREA UXUI
const SUB_PROTOTIPADO = '69246b427d0518c5e0c46fa1';
const SUB_DISEÑO_UX = '69246b427d0518c5e0c46fa4';
const SUB_DISEÑO_UI = '69246b437d0518c5e0c46fa7';
//AREA PRODUCTO
const SUB_PRODUCT_MANAGER = '69246b437d0518c5e0c46faa';
const SUB_PRODUCT_OWNER = '69246b437d0518c5e0c46fad';
const SUB_SCRUM_MASTER = '69246b437d0518c5e0c46fb0';
//AREA INFRAESTRUCTURA
const SUB_REDES = '69246b447d0518c5e0c46fb3';
const SUB_INFRAESTRUCTURA = '69246b447d0518c5e0c46fb6';
const SUB_CIBERSEGURIDAD = '69246b447d0518c5e0c46fb9';
const SUB_SOPORTE_TECNICO = '69246b457d0518c5e0c46fbc';

const ROL_ENCARGADO = '692213ca7a194cd01af50594';
const ROL_EMPLEADO = '692213ca7a194cd01af50598';

// --------------------------------------------
// MODELO
// --------------------------------------------
const usuarioSchema = new Schema({
  nombreUsuario: String,
  email: String,
  contraseña: String,
  nombre: String,
  telefono: String,
  direccion: String,
  rol: { type: Types.ObjectId, ref: 'Rol' },
  area: { type: Types.ObjectId, ref: 'Area', default: null },
  subarea: { type: Types.ObjectId, ref: 'Subarea', default: null },
});

// --------------------------------------------
// HELPERS
// --------------------------------------------

const crearEncargado = (usuario, nombre, tel, dir, area) => ({
  nombreUsuario: usuario,
  email: `${usuario}@empresa.com`,
  contraseña: usuario, // contraseña = usuario
  nombre,
  telefono: tel,
  direccion: dir,
  rol: ROL_ENCARGADO,
  area,
  subarea: null,
});

const generarEmpleados = (subarea, empleados) =>
  empleados.map(([usuario, nombreCompleto, tel, dir]) => ({
    nombreUsuario: usuario,
    email: `${usuario}@empresa.com`,
    contraseña: usuario, // contraseña = usuario
    nombre: nombreCompleto,
    telefono: tel,
    direccion: dir,
    rol: ROL_EMPLEADO,
    area: null,
    subarea,
  }));

// --------------------------------------------
// SEED
// --------------------------------------------
async function runSeed() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI no definida');

    const conn = await connect(uri, { dbName: 'R3cl4mos' });
    const Usuario = conn.model('Usuario', usuarioSchema);

    // --------------------------------------------
    // ENCARGADOS
    // --------------------------------------------
    const encargados = [
      crearEncargado(
        'juanperez',
        'Juan Pérez',
        '351-5000001',
        'San Martín 123',
        AREA_DESARROLLO,
      ),
      crearEncargado(
        'marcelolopez',
        'Marcelo López',
        '351-5000002',
        'Rivadavia 456',
        AREA_UXUI,
      ),
      crearEncargado(
        'andresgarcia',
        'Andrés García',
        '351-5000003',
        'Bv. Illia 789',
        AREA_PRODUCTO,
      ),
      crearEncargado(
        'carolinadiaz',
        'Carolina Díaz',
        '351-5000004',
        'Sarmiento 987',
        AREA_INFRAESTRUCTURA,
      ),
    ];

    // --------------------------------------------
    // EMPLEADOS
    // --------------------------------------------
    const empleados = [
      // DESARROLLO
      ...generarEmpleados(SUB_BACKEND, [
        ['marianogomez', 'Mariano Gómez', '351-5010001', 'Calle 1'],
        ['lucasramirez', 'Lucas Ramírez', '351-5010002', 'Calle 2'],
      ]),
      ...generarEmpleados(SUB_FRONTEND, [
        ['florenciaavila', 'Florencia Ávila', '351-5010010', 'Calle 3'],
        ['anaparedes', 'Ana Paredes', '351-5010011', 'Calle 4'],
      ]),
      ...generarEmpleados(SUB_FULLSTACK, [
        ['sebastianvargas', 'Sebastián Vargas', '351-5010020', 'Calle 5'],
        ['martinalonso', 'Martín Alonso', '351-5010021', 'Calle 6'],
      ]),
      ...generarEmpleados(SUB_MOBILE, [
        ['nicolasmolina', 'Nicolás Molina', '351-5010030', 'Calle 7'],
        ['tatianaruiz', 'Tatiana Ruiz', '351-5010031', 'Calle 8'],
      ]),
      ...generarEmpleados(SUB_TESTING, [
        ['paulaflores', 'Paula Flores', '351-5010040', 'Calle 9'],
        ['federicorios', 'Federico Ríos', '351-5010041', 'Calle 10'],
      ]),
      ...generarEmpleados(SUB_DEV_OPS, [
        ['gustavotorres', 'Gustavo Torres', '351-5010050', 'Calle 11'],
        ['marianasalas', 'Mariana Salas', '351-5010051', 'Calle 12'],
      ]),

      // UX/UI
      ...generarEmpleados(SUB_PROTOTIPADO, [
        ['agustinaguerra', 'Agustina Guerra', '351-5020001', 'Calle 13'],
        ['lautaronavarro', 'Lautaro Navarro', '351-5020002', 'Calle 14'],
      ]),
      ...generarEmpleados(SUB_DISEÑO_UX, [
        ['rominadiaz', 'Romina Díaz', '351-5020010', 'Calle 15'],
        ['belenmartinez', 'Belén Martínez', '351-5020011', 'Calle 16'],
      ]),
      ...generarEmpleados(SUB_DISEÑO_UI, [
        ['diegomansilla', 'Diego Mansilla', '351-5020020', 'Calle 17'],
        ['veronicacosta', 'Verónica Costa', '351-5020021', 'Calle 18'],
      ]),

      // PRODUCTO
      ...generarEmpleados(SUB_PRODUCT_MANAGER, [
        ['rocioceleste', 'Rocío Celeste', '351-5030001', 'Calle 19'],
        ['maximilianobreda', 'Maximiliano Breda', '351-5030002', 'Calle 20'],
      ]),
      ...generarEmpleados(SUB_PRODUCT_OWNER, [
        ['valentinagomez', 'Valentina Gómez', '351-5030010', 'Calle 21'],
        ['juanignaciososa', 'Juan Ignacio Sosa', '351-5030011', 'Calle 22'],
      ]),
      ...generarEmpleados(SUB_SCRUM_MASTER, [
        ['emanuelrivero', 'Emanuel Rivero', '351-5030020', 'Calle 23'],
        ['laramontiel', 'Lara Montiel', '351-5030021', 'Calle 24'],
      ]),

      // INFRAESTRUCTURA
      ...generarEmpleados(SUB_REDES, [
        ['franciscocampos', 'Francisco Campos', '351-5040001', 'Calle 25'],
        ['gustavohuerta', 'Gustavo Huerta', '351-5040002', 'Calle 26'],
      ]),
      ...generarEmpleados(SUB_INFRAESTRUCTURA, [
        ['alejandropaz', 'Alejandro Paz', '351-5040010', 'Calle 27'],
        ['vaninasoto', 'Vanina Soto', '351-5040011', 'Calle 28'],
      ]),
      ...generarEmpleados(SUB_CIBERSEGURIDAD, [
        ['estebangallo', 'Esteban Gallo', '351-5040020', 'Calle 29'],
        ['marceladiaz', 'Marcela Díaz', '351-5040021', 'Calle 30'],
      ]),
      ...generarEmpleados(SUB_SOPORTE_TECNICO, [
        ['camilamendez', 'Camila Méndez', '351-5040030', 'Calle 31'],
        ['ricardotello', 'Ricardo Tello', '351-5040031', 'Calle 32'],
      ]),
    ];

    const todos = [...encargados, ...empleados];

    // HASH PASSWORDS
    for (const u of todos) {
      u.contraseña = await bcrypt.hash(u.contraseña, 10);
    }

    await Usuario.insertMany(todos);

    console.log('✔ Usuarios insertados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

runSeed();
