import { Schema, Types } from 'mongoose';

export const NivelCriticidadSchema = new Schema(
  {
    nombre: { type: String, required: true },


    reclamos: [{ type: Types.ObjectId, ref: 'Reclamo' }],
  },
  {
    collection: 'nivel_criticidad',
    timestamps: true, 
  }
);
export default NivelCriticidadSchema;