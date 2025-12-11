export const getAsignaciionEmpleadoTemplate = (nroTicket: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 8px;">
    
    <!-- Header -->
    <div style="background-color: #f8f9fa; padding: 10px; border-bottom: 2px solid #28a745; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #28a745;">Nuevo Reclamo Asignado</h2>
    </div>

    <!-- Greeting -->
    <p>Hola,</p>
    <p>Te informamos que se te ha asignado un nuevo reclamo</p>

    <!-- Main Box -->
    <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Número de Ticket:</strong> ${nroTicket}</p>
      <p style="margin: 5px 0;">Puedes ingresar al sistema para ver los detalles completos del reclamo.</p>
    </div>

    <!-- Footer -->
    <p style="margin-bottom: 20px;">
      Te recomendamos revisarlo a la brevedad para continuar con el flujo de trabajo correspondiente.
    </p>
    
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #777;">Sistema de Gestión de Reclamos - Grupo 3</p>

  </div>
`;
