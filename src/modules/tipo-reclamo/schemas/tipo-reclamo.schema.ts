import { Schema, model, Types } from 'mongoose';

export const TipoReclamoSchema = new Schema(
  {
    nombre: { type: String, required: true },

    reclamos: [{ type: Types.ObjectId, ref: 'Reclamo' }],
  },
  {
    collection: 'tipo_reclamo',
    timestamps: true, 
  }
);

export const TipoReclamoModel = model('TipoReclamo', TipoReclamoSchema);
