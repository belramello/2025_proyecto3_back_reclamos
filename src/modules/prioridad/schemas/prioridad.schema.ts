import { Schema, Types } from 'mongoose';

export const PrioridadSchema = new Schema(
  {
    nombre: { type: String, required: true },


    reclamos: [{ type: Types.ObjectId, ref: 'Reclamo' }],
  },
  {
    collection: 'prioridad',
    timestamps: true,
  }
);
