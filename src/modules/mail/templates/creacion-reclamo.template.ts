export function getTicketCreationTemplate(
  nroTicket: string,
  titulo: string,
  fechaCreacion: string,
): string {
  return `
    <html>
      <head>
        <style>
          /* Fuentes y Reseteo Básico */
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4; /* Fondo suave */
            margin: 0;
            padding: 0;
          }
          
          /* Contenedor Principal */
          .container { 
            max-width: 600px; 
            margin: 30px auto; 
            padding: 0; 
            background-color: #ffffff; 
            border-radius: 8px; 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); 
            overflow: hidden; /* Para contener el header */
          }
          
          /* Encabezado */
          .header { 
            background-color: #35a899ff; /* Azul primario */
            color: white; 
            padding: 20px; 
            text-align: center; 
          }
          .header h2 { 
            font-size: 24px; /* Letra más grande para el título */
            margin: 0; 
            font-weight: 500;
          }
          
          /* Contenido del Cuerpo */
          .content { 
            padding: 25px 30px; 
          }
          .content p { 
            font-size: 16px; /* Letra de cuerpo más grande */
            margin-bottom: 15px;
          }
          
          /* Bloque de Información del Ticket */
          .ticket-info { 
            background-color: #e9f7ff; /* Fondo azul claro */
            border-left: 5px solid #007bff; /* Borde de color */
            padding: 15px; 
            border-radius: 4px; 
            margin: 20px 0; 
          }
          .ticket-info p { 
            margin: 8px 0; 
            font-size: 16px;
          }
          
          /* Destacados (Número de Ticket) */
          .highlight { 
            font-weight: bold; 
            color: #333;
          }
          .ticket-number {
            font-size: 18px; 
            color: #007bff; /* Color azul para el ticket */
            font-weight: bold;
          }

          /* Pie de Página */
          .footer { 
            margin-top: 25px; 
            padding: 15px;
            font-size: 12px; 
            color: #999; 
            text-align: center; 
            border-top: 1px solid #eeeeee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Reclamo Creado Exitosamente</h2>
          </div>
          
          <div class="content">
            <p>Estimado/a cliente,</p>
            <p>Le confirmamos que su solicitud ha sido **registrada correctamente** bajo el siguiente número de ticket:</p>

            <div class="ticket-info">
              <p><span class="highlight">Número de Ticket:</span> <span class="ticket-number">#${nroTicket}</span></p>
              <p><span class="highlight">Título del Reclamo:</span> ${titulo}</p>
              <p><span class="highlight">Fecha de Registro:</span> ${fechaCreacion}</p>
              <p><span class="highlight">Estado Inicial:</span> **Pendiente de Asignar**</p>
            </div>

            <p>Nuestro equipo revisará su reclamo a la brevedad. Le notificaremos por este medio cuando su estado cambie o se le asigne un responsable.</p>
            
            <p>Gracias por utilizar nuestro sistema de gestión.</p>
          </div>

          <div class="footer">
            Este es un correo automático. Por favor, no responda a este mensaje.
          </div>
        </div>
      </body>
    </html>
  `;
}