import { Schema, Types } from 'mongoose';

export const ReclamoSchema = new Schema(
  {
    nroTicket: { type: String, required: true },

    // Relaciones con otras colecciones
    tipoReclamo: { type: Types.ObjectId, ref: 'TipoReclamo', required: true },
    prioridad: { type: Types.ObjectId, ref: 'Prioridad', required: true },
    nivelCriticidad: { type: Types.ObjectId, ref: 'NivelCriticidad', required: true },

    proyecto: { type: Number }, // luego podés cambiarlo a ObjectId con ref: 'Proyecto'

    descripcion: { type: String },
    imagenUrl: { type: String },
    resumenResolucion: { type: String },

    fechaCreacion: { type: Date, default: Date.now },
    fechaEliminacion: { type: Date, default: null },
  },
  {
    collection: 'reclamos',
    timestamps: true, // crea automáticamente createdAt y updatedAt
  }
);
export default ReclamoSchema;