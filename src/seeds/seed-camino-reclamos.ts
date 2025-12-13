// seed-caminos-reclamos-final.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { connect, Schema, Types } from 'mongoose';

// -----------------------------
// CONSTANTES (proporcionadas por vos)
// -----------------------------
//ESTAN MAL CORREGIR.
const ESTADO_PENDIENTE_ID = '6921ce775659f081b8e59e5a';
const ESTADO_EN_PROCESO_ID = '6921ce775659f081b8e59e5b';
const ESTADO_RESUELTO_ID = '6921ce775659f081b8e59e5c';

// ÁREAS
const AREA_DESARROLLO = '69246b407d0518c5e0c46f82';
const AREA_UXUI = '69246b777d0518c5e0c46f83';
const AREA_PRODUCTO = '69246ba07d0518c5e0c46f84';
const AREA_INFRAESTRUCTURA = '69246bc07d0518c5e0c46f85';

/*
const AREA_DESARROLLO = '69246b407d0518c5e0c46f82';
const AREA_UXUI = '69246b777d0518c5e0c46f83';
const AREA_PRODUCTO = '69246ba07d0518c5e0c46f84';
const AREA_INFRAESTRUCTURA = '69246bc07d0518c5e0c46f85';
*/

// SUBÁREAS (tu listado)
const SUB_BACKEND = '69246b417d0518c5e0c46f8f';
const SUB_FRONTEND = '69246b417d0518c5e0c46f92';
const SUB_FULLSTACK = '69246b417d0518c5e0c46f95';
const SUB_MOBILE = '69246b417d0518c5e0c46f98';
const SUB_TESTING = '69246b427d0518c5e0c46f9b';
const SUB_DEV_OPS = '69246b427d0518c5e0c46f9e';

const SUB_PROTOTIPADO = '69246b427d0518c5e0c46fa1';
const SUB_DISEÑO_UX = '69246b427d0518c5e0c46fa4';
const SUB_DISEÑO_UI = '69246b437d0518c5e0c46fa7';

const SUB_PRODUCT_MANAGER = '69246b437d0518c5e0c46faa';
const SUB_PRODUCT_OWNER = '69246b437d0518c5e0c46fad';
const SUB_SCRUM_MASTER = '69246b437d0518c5e0c46fb0';

const SUB_REDES = '69246b447d0518c5e0c46fb3';
const SUB_INFRAESTRUCTURA = '69246b447d0518c5e0c46fb6';
const SUB_CIBERSEGURIDAD = '69246b447d0518c5e0c46fb9';
const SUB_SOPORTE_TECNICO = '69246b457d0518c5e0c46fbc';

// Subarea -> Area (map)
const SUBAREA_TO_AREA: Record<string, string> = {
  [SUB_BACKEND]: AREA_DESARROLLO,
  [SUB_FRONTEND]: AREA_DESARROLLO,
  [SUB_FULLSTACK]: AREA_DESARROLLO,
  [SUB_MOBILE]: AREA_DESARROLLO,
  [SUB_TESTING]: AREA_DESARROLLO,
  [SUB_DEV_OPS]: AREA_DESARROLLO,

  [SUB_PROTOTIPADO]: AREA_UXUI,
  [SUB_DISEÑO_UX]: AREA_UXUI,
  [SUB_DISEÑO_UI]: AREA_UXUI,

  [SUB_PRODUCT_MANAGER]: AREA_PRODUCTO,
  [SUB_PRODUCT_OWNER]: AREA_PRODUCTO,
  [SUB_SCRUM_MASTER]: AREA_PRODUCTO,

  [SUB_REDES]: AREA_INFRAESTRUCTURA,
  [SUB_INFRAESTRUCTURA]: AREA_INFRAESTRUCTURA,
  [SUB_CIBERSEGURIDAD]: AREA_INFRAESTRUCTURA,
  [SUB_SOPORTE_TECNICO]: AREA_INFRAESTRUCTURA,
};

// -----------------------------
// EMPLEADOS POR SUBÁREA (IDs que me diste)
// -----------------------------
const EMPLEADOS_BY_SUBAREA: Record<string, string[]> = {
  [SUB_BACKEND]: ['693b0999a676473a70150bfb', '693b0999a676473a70150bfc'],
  [SUB_FRONTEND]: ['693b0999a676473a70150bfd', '693b0999a676473a70150bfe'],
  [SUB_FULLSTACK]: ['693b0999a676473a70150bff', '693b0999a676473a70150c00'],
  [SUB_MOBILE]: ['693b0999a676473a70150c01', '693b0999a676473a70150c02'],
  [SUB_TESTING]: ['693b0999a676473a70150c03', '693b0999a676473a70150c04'],
  [SUB_DEV_OPS]: ['693b0999a676473a70150c05', '693b0999a676473a70150c06'],

  [SUB_PROTOTIPADO]: ['693b0999a676473a70150c07', '693b0999a676473a70150c08'],
  [SUB_DISEÑO_UX]: ['693b0999a676473a70150c09', '693b0999a676473a70150c0a'],
  [SUB_DISEÑO_UI]: ['693b0999a676473a70150c0b', '693b0999a676473a70150c0c'],

  [SUB_PRODUCT_MANAGER]: [
    '693b0999a676473a70150c0d',
    '693b0999a676473a70150c0e',
  ],
  [SUB_PRODUCT_OWNER]: ['693b0999a676473a70150c0f', '693b0999a676473a70150c10'],
  [SUB_SCRUM_MASTER]: ['693b0999a676473a70150c11', '693b0999a676473a70150c12'],

  [SUB_REDES]: ['693b0999a676473a70150c13', '693b0999a676473a70150c14'],
  [SUB_INFRAESTRUCTURA]: [
    '693b0999a676473a70150c15',
    '693b0999a676473a70150c16',
  ],
  [SUB_CIBERSEGURIDAD]: [
    '693b0999a676473a70150c17',
    '693b0999a676473a70150c18',
  ],
  [SUB_SOPORTE_TECNICO]: [
    '693b0999a676473a70150c19',
    '693b0999a676473a70150c1a',
  ],
};

// -----------------------------
// RECLAMOS objetivos (me los diste)
// -----------------------------
const RECLAMOS_IDS = [
  '693b1c1beb1b8c98088941f2',
  '693b1c1ceb1b8c98088941fa',
  '693b1c1ceb1b8c9808894202',
  '693b1c1deb1b8c980889420a',
  '693b1c1deb1b8c9808894212',
  '693b1c1eeb1b8c980889421a',
  '693b1c1feb1b8c9808894222',
  '693b1c1feb1b8c980889422a',
  '693b1c1feb1b8c9808894232',
  '693b1c20eb1b8c980889423a',
  '693b1c20eb1b8c9808894242',
  '693b1c21eb1b8c980889424a',
  '693b1c21eb1b8c9808894252',
];

// -----------------------------
// TipoAsignacionesEnum (strings)
// -----------------------------
const TipoAsignacionesEnum = {
  INICIAL: 'Inicial',
  DE_AREA_A_SUBAREA: 'AsignacionDeAreaASubarea',
  DE_AREA_A_AREA: 'AsignacionDeAreaAArea',
  DE_AREA_A_EMPLEADO: 'AsignacionDeAreaAEmpleado',
  AUTOASIGNACION: 'Autoasignacion',
  DE_EMPLEADO_A_EMPLEADO: 'AsignacionDeEmpleadoAEmpleado',
  DE_EMPLEADO_A_SUBAREA: 'AsignacionDeEmpleadoASubarea',
  DE_EMPLEADO_A_AREA: 'AsignacionDeEmpleadoAArea',
};

// -----------------------------
// Utilidades
// -----------------------------
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

// -----------------------------
// SEED
// -----------------------------
async function runSeed() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI no definida');

    const conn = await connect(uri, { dbName: 'R3cl4mos' });
    console.log('🔗 Conectado a MongoDB');

    // Modelos ligeros (strict: false) para no depender de imports
    const Reclamo = conn.model(
      'Reclamo',
      new Schema({}, { strict: false, collection: 'reclamos' }),
    );
    const HistorialAsignacion = conn.model(
      'HistorialAsignacion',
      new Schema(
        {
          reclamo: { type: Types.ObjectId, ref: 'Reclamo', required: true },
          desdeArea: { type: Types.ObjectId, ref: 'Area', default: null },
          haciaArea: { type: Types.ObjectId, ref: 'Area', default: null },
          desdeSubarea: { type: Types.ObjectId, ref: 'Subarea', default: null },
          haciaSubarea: { type: Types.ObjectId, ref: 'Subarea', default: null },
          deEmpleado: { type: Types.ObjectId, ref: 'Usuario', default: null },
          haciaEmpleado: {
            type: Types.ObjectId,
            ref: 'Usuario',
            default: null,
          },
          fechaAsignacion: { type: Date, default: Date.now },
          fechaHoraFin: { type: Date, default: null },
          tipoAsignacion: { type: String, required: true },
          comentario: { type: String, default: null },
        },
        { collection: 'historial_asignaciones' },
      ),
    );

    const HistorialEstado = conn.model(
      'HistorialEstado',
      new Schema(
        {
          reclamo: { type: Types.ObjectId, ref: 'Reclamo', required: true },
          usuarioResponsable: {
            type: Types.ObjectId,
            ref: 'Usuario',
            default: null,
          },
          fechaHoraInicio: { type: Date, default: Date.now },
          fechaHoraFin: { type: Date, default: null },
          estado: { type: Types.ObjectId, ref: 'Estado', required: true },
        },
        { collection: 'historial_estado' },
      ),
    );

    // Helper: obtener subarea y area de un empleado (mirando EMPLEADOS_BY_SUBAREA)
    function getSubareaForEmpleado(empId: string) {
      for (const [sub, emps] of Object.entries(EMPLEADOS_BY_SUBAREA)) {
        if (emps.includes(empId)) return sub;
      }
      return null;
    }
    function getAreaForSubarea(subId: string) {
      return SUBAREA_TO_AREA[subId] || null;
    }

    // Procesamos cada reclamo
    for (const reclamoId of RECLAMOS_IDS) {
      const reclamoDoc = (await Reclamo.findById(reclamoId).lean()) as any;
      if (!reclamoDoc) {
        console.log(`⚠ Reclamo no encontrado: ${reclamoId}`);
        continue;
      }

      // Leemos ultimo historial asignacion actual
      const ultAsigId = reclamoDoc.ultimoHistorialAsignacion;
      if (!ultAsigId) {
        console.log(
          `⚠ Reclamo ${reclamoId} no tiene ultimoHistorialAsignacion, lo salto.`,
        );
        continue;
      }

      const ultimoAsig = await HistorialAsignacion.findById(ultAsigId).lean();
      if (!ultimoAsig) {
        console.log(
          `⚠ Ult historial asignacion no encontrado ${String(ultAsigId)}`,
        );
        continue;
      }

      // Determinar contexto actual desde ultimo historial
      let currentArea: string | null = null;
      let currentSubarea: string | null = null;
      let currentEmpleado: string | null = null;

      if (ultimoAsig.haciaEmpleado) {
        currentEmpleado = String(ultimoAsig.haciaEmpleado);
        currentSubarea = getSubareaForEmpleado(currentEmpleado);
        currentArea = currentSubarea ? getAreaForSubarea(currentSubarea) : null;
      } else if (ultimoAsig.haciaSubarea) {
        currentSubarea = String(ultimoAsig.haciaSubarea);
        currentArea = getAreaForSubarea(currentSubarea);
      } else if (ultimoAsig.haciaArea) {
        currentArea = String(ultimoAsig.haciaArea);
      } else {
        console.log(
          `⚠ Reclamo ${reclamoId} - contexto no detectado en ultimo historial.`,
        );
        continue;
      }

      console.log(
        `\nProcesando reclamo ${reclamoId} — contexto: area=${currentArea} subarea=${currentSubarea} empleado=${currentEmpleado}`,
      );

      // Decidir cuantos pasos crear (1..5)
      const pasos = randInt(1, 5);
      let fechaCursor = new Date();

      // track de si ya entró en proceso (primer empleado)
      let yaEnProceso = false;

      // get prev historial ids to close
      let prevHistAsigId = String(ultimoAsig._id);
      let prevHistEstadoId = reclamoDoc.ultimoHistorialEstado
        ? String(reclamoDoc.ultimoHistorialEstado)
        : null;

      // función para cerrar historial asignacion previo
      async function cerrarHistAsigPrev(prevId: string | null) {
        if (!prevId) return;
        const durMin = randInt(30, 60 * 24 * 2); // 30 min a 2 días
        const fechaFin = addMinutes(fechaCursor, durMin);
        await HistorialAsignacion.updateOne(
          { _id: prevId },
          { $set: { fechaHoraFin: fechaFin } },
        );
      }
      // cerrar historial estado previo
      async function cerrarHistEstadoPrev(prevId: string | null) {
        if (!prevId) return;
        const fechaFin = addMinutes(fechaCursor, randInt(1, 60 * 12)); // 1 min a 12h
        await HistorialEstado.updateOne(
          { _id: prevId },
          { $set: { fechaHoraFin: fechaFin } },
        );
      }

      for (let i = 0; i < pasos; i++) {
        // decidir transición válida según contexto actual
        let nuevo: any = {
          reclamo: reclamoDoc._id,
          fechaAsignacion: fechaCursor,
          tipoAsignacion: TipoAsignacionesEnum.INICIAL, // se sobreescribe
        };

        // ---------- CASO: actualmente en AREA ----------
        if (currentArea && !currentSubarea && !currentEmpleado) {
          // desde AREA -> puede ir a SUBAREA del area (preferible) o a EMPLEADO del area
          const acciones = ['A_SUBAREA', 'A_EMPLEADO'];
          const acc = pick(acciones);

          if (acc === 'A_SUBAREA') {
            // elegir subareas del area
            const subs = Object.keys(SUBAREA_TO_AREA).filter(
              (s) => SUBAREA_TO_AREA[s] === currentArea,
            );
            if (subs.length === 0) {
              // fallback a empleado del area
              const empsArea = Object.entries(EMPLEADOS_BY_SUBAREA)
                .filter(([sub]) => SUBAREA_TO_AREA[sub] === currentArea)
                .flatMap(([, emps]) => emps);
              if (empsArea.length === 0) {
                console.log(`  → No empleados en area ${currentArea}`);
                break;
              }
              const emp = pick(empsArea);
              nuevo.haciaEmpleado = emp;
              nuevo.tipoAsignacion = TipoAsignacionesEnum.DE_AREA_A_EMPLEADO;
              // también completar haciaArea/haciaSubarea según empleado
              const empSub = getSubareaForEmpleado(emp)!;
              nuevo.desdeArea = currentArea;
              nuevo.haciaArea = currentArea;
              nuevo.haciaSubarea = empSub;
              currentEmpleado = emp;
              currentSubarea = empSub;
              currentArea = getAreaForSubarea(empSub);
            } else {
              const subDestino = pick(subs);
              nuevo.tipoAsignacion = TipoAsignacionesEnum.DE_AREA_A_SUBAREA;
              nuevo.desdeArea = currentArea;
              nuevo.haciaArea = currentArea;
              nuevo.haciaSubarea = subDestino;
              // no empleados en este paso
              currentSubarea = subDestino;
              currentEmpleado = null;
              currentArea = getAreaForSubarea(subDestino);
            }
          } else {
            // A_EMPLEADO: pick empleado in area
            const empsArea = Object.entries(EMPLEADOS_BY_SUBAREA)
              .filter(([sub]) => SUBAREA_TO_AREA[sub] === currentArea)
              .flatMap(([, emps]) => emps);
            if (empsArea.length === 0) {
              console.log(`  → No empleados en area ${currentArea}`);
              break;
            }
            const emp = pick(empsArea);
            const empSub = getSubareaForEmpleado(emp)!;
            nuevo.tipoAsignacion = TipoAsignacionesEnum.DE_AREA_A_EMPLEADO;
            nuevo.desdeArea = currentArea;
            nuevo.haciaArea = currentArea;
            nuevo.haciaSubarea = empSub;
            nuevo.haciaEmpleado = emp;
            currentEmpleado = emp;
            currentSubarea = empSub;
            currentArea = getAreaForSubarea(empSub);
          }
        }

        // ---------- CASO: actualmente en SUBAREA ----------
        else if (currentSubarea && !currentEmpleado) {
          // SUBAREA -> empleado (autoasignacion) (solo empleados de esa subarea)
          const posibles = EMPLEADOS_BY_SUBAREA[currentSubarea] || [];
          if (posibles.length === 0) {
            console.log(
              `  → No empleados en subarea ${currentSubarea}, salteo.`,
            );
            break;
          }
          const empleadoDestino = pick(posibles);
          nuevo.tipoAsignacion = TipoAsignacionesEnum.AUTOASIGNACION;
          nuevo.desdeSubarea = currentSubarea;
          nuevo.haciaSubarea = currentSubarea;
          nuevo.desdeArea = getAreaForSubarea(currentSubarea);
          nuevo.haciaArea = nuevo.desdeArea;
          nuevo.deEmpleado = null; // en autoasignacion de sistema, desdeEmpleado puede ser null
          nuevo.haciaEmpleado = empleadoDestino;
          currentEmpleado = empleadoDestino;
          currentSubarea = getSubareaForEmpleado(empleadoDestino);
          currentArea = getAreaForSubarea(currentSubarea!);
        }

        // ---------- CASO: actualmente en EMPLEADO ----------
        else if (currentEmpleado) {
          // obtener subarea y area del empleado actual
          const empSub = getSubareaForEmpleado(currentEmpleado);
          const empArea = empSub ? getAreaForSubarea(empSub) : null;
          // opciones: a otro empleado (misma subarea), a otra subarea (misma area), a otra area (distinta a la del empleado)
          const opciones: any[] = [];
          if (empSub) opciones.push('A_EMPLEADO');
          if (empArea) opciones.push('A_SUBAREA');
          if (empArea) opciones.push('A_AREA'); // IMPORTANT: si A_AREA elegida, elegir un area distinta a empArea (según tu cambio)
          const eleccion = pick(opciones);

          if (eleccion === 'A_EMPLEADO') {
            const candidatos = (EMPLEADOS_BY_SUBAREA[empSub!] || []).filter(
              (e) => e !== currentEmpleado,
            );
            if (candidatos.length === 0) {
              // fallback a subarea
              // procedemos como A_SUBAREA
            } else {
              const nuevoEmp = pick(candidatos);
              nuevo.tipoAsignacion =
                TipoAsignacionesEnum.DE_EMPLEADO_A_EMPLEADO;
              nuevo.desdeArea = empArea;
              nuevo.haciaArea = empArea;
              nuevo.desdeSubarea = empSub;
              nuevo.haciaSubarea = empSub;
              nuevo.deEmpleado = currentEmpleado;
              nuevo.haciaEmpleado = nuevoEmp;
              currentEmpleado = nuevoEmp;
              currentSubarea = empSub;
              currentArea = empArea;
            }
          }

          if (!nuevo.haciaEmpleado && eleccion === 'A_SUBAREA') {
            // elegir otra subarea dentro de misma area, distinta a la suya
            const subs = Object.keys(SUBAREA_TO_AREA).filter(
              (s) => SUBAREA_TO_AREA[s] === empArea && s !== empSub,
            );
            if (subs.length === 0) {
              // fallback a asignar a area distinta
              // choose different area below
            } else {
              const subDestino = pick(subs);
              nuevo.tipoAsignacion = TipoAsignacionesEnum.DE_EMPLEADO_A_SUBAREA;
              nuevo.desdeArea = empArea;
              nuevo.haciaArea = empArea;
              nuevo.desdeSubarea = empSub;
              nuevo.haciaSubarea = subDestino;
              nuevo.deEmpleado = currentEmpleado;
              currentSubarea = subDestino;
              currentEmpleado = null;
              currentArea = empArea;
            }
          }

          if (
            !nuevo.haciaEmpleado &&
            !nuevo.haciaSubarea &&
            eleccion === 'A_AREA'
          ) {
            // EMPLEADO -> AREA: must choose an area different than empArea (según tu instrucción)
            const todasAreas = [
              AREA_DESARROLLO,
              AREA_UXUI,
              AREA_PRODUCTO,
              AREA_INFRAESTRUCTURA,
            ];
            const opcionesAreas = todasAreas.filter((a) => a !== empArea);
            if (opcionesAreas.length === 0) {
              console.log('  → No hay otras areas disponibles (improbable).');
              break;
            }
            const areaDestino = pick(opcionesAreas);
            nuevo.tipoAsignacion = TipoAsignacionesEnum.DE_EMPLEADO_A_AREA;
            nuevo.desdeArea = empArea;
            nuevo.haciaArea = areaDestino;
            nuevo.desdeSubarea = empSub;
            nuevo.deEmpleado = currentEmpleado;
            // context becomes areaDestino
            currentArea = areaDestino;
            currentSubarea = null;
            currentEmpleado = null;
          }
        } else {
          console.log('  → Contexto desconocido, salteo.');
          break;
        }

        // ---------- crear la asignacion cerrando la anterior ----------
        await cerrarHistAsigPrev(prevHistAsigId);

        // Crear la asignación con los campos ya armados
        const createdAsig = await HistorialAsignacion.create(nuevo);
        // Actualizamos prevHistAsigId
        prevHistAsigId = String(createdAsig._id);

        // Si la nueva asignación implica que POR PRIMERA VEZ llega a un empleado -> crear historialEstado EN_PROCESO
        if (nuevo.haciaEmpleado && !yaEnProceso) {
          // cerrar prev estado
          await cerrarHistEstadoPrev(prevHistEstadoId);
          // crear EN_PROCESO
          const histEnProceso = await HistorialEstado.create({
            reclamo: reclamoDoc._id,
            usuarioResponsable: nuevo.haciaEmpleado,
            fechaHoraInicio: addMinutes(fechaCursor, 1),
            estado: ESTADO_EN_PROCESO_ID,
          });
          prevHistEstadoId = String(histEnProceso._id);
          // push both asignacion and estado into reclamo
          await Reclamo.updateOne(
            { _id: reclamoDoc._id },
            {
              $push: {
                historialAsignaciones: createdAsig._id,
                historialEstados: histEnProceso._id,
              },
              $set: {
                ultimoHistorialAsignacion: createdAsig._id,
                ultimoHistorialEstado: histEnProceso._id,
              },
            },
          );
          yaEnProceso = true;
        } else {
          // no nuevo estado, solo push asignacion y set ultimoHistAsig
          await Reclamo.updateOne(
            { _id: reclamoDoc._id },
            {
              $push: { historialAsignaciones: createdAsig._id },
              $set: { ultimoHistorialAsignacion: createdAsig._id },
            },
          );
        }

        console.log(
          `  → Paso ${i + 1}: tipo=${createdAsig.tipoAsignacion}  haciaArea=${createdAsig.haciaArea || ''} haciaSubarea=${createdAsig.haciaSubarea || ''} haciaEmpleado=${createdAsig.haciaEmpleado || ''}`,
        );

        // avanzar cursor temporal
        fechaCursor = addMinutes(fechaCursor, randInt(10, 60 * 12)); // 10 min - 12 h
      } // end pasos

      // Al final del flujo: si termina en empleado y ya está en proceso, generar RESUELTO
      if (currentEmpleado) {
        // cerrar historialestado previo
        await cerrarHistEstadoPrev(prevHistEstadoId);

        // cerrar la ultima asignacion (fechaHoraFin)
        await HistorialAsignacion.updateOne(
          { _id: prevHistAsigId },
          {
            $set: {
              fechaHoraFin: addMinutes(new Date(), randInt(10, 60 * 24)),
            },
          },
        );

        // crear HistorialEstado RESUELTO (no crear nueva asignacion)
        const histRes = await HistorialEstado.create({
          reclamo: reclamoDoc._id,
          usuarioResponsable: currentEmpleado,
          fechaHoraInicio: addMinutes(new Date(), 1),
          fechaHoraFin: addMinutes(new Date(), randInt(10, 60 * 24)),
          estado: ESTADO_RESUELTO_ID,
        });

        await Reclamo.updateOne(
          { _id: reclamoDoc._id },
          {
            $push: { historialEstados: histRes._id },
            $set: { ultimoHistorialEstado: histRes._id },
          },
        );

        console.log(
          `  → Reclamo ${reclamoId} FINALIZADO (RESUELTO) por empleado ${currentEmpleado}`,
        );
      } else {
        console.log(
          `  → Reclamo ${reclamoId} terminó en area/subarea — permanece sin resolver.`,
        );
      }
    } // end for reclamos

    console.log('\n🎉 Seed de caminos (final) completado.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed caminos final:', err);
    process.exit(1);
  }
}

runSeed();
