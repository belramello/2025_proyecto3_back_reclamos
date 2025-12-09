export const getNotificacionReclamoTemplate = (
  nroTicket: string,
  titulo: string,
  nuevoEstado: string,
  mensaje: string
) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 8px;">
    <div style="background-color: #f8f9fa; padding: 10px; border-bottom: 2px solid #007bff; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #007bff;">Actualización de Reclamo #${nroTicket}</h2>
    </div>
    
    <p>Hola,</p>
    <p>Te informamos que hubo novedades en tu reclamo: <strong>${titulo}</strong></p>
    
    <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Estado Actual:</strong> ${nuevoEstado}</p>
      <p style="margin: 5px 0;"><strong>Novedad:</strong> ${mensaje}</p>
    </div>

    <p>Puedes ver más detalles ingresando al sistema.</p>
    
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #777;">Sistema de Gestión de Reclamos - Grupo 3</p>
  </div>
`;