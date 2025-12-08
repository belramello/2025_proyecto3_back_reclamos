export const getWelcomeTemplate = (rol: string, url: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h1 style="color: #0056b3;">Bienvenido a Gestión de Reclamos</h1>
    <p>Hola,</p>
    <p>Has sido registrado en nuestro sistema con el rol de: <strong>${rol}</strong>.</p>
    <p>Para completar tu registro y definir tu contraseña, por favor haz clic en el siguiente botón:</p>
    <a href="${url}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Activar Cuenta</a>
    <p style="margin-top: 20px; font-size: 12px; color: #777;">
      Si el botón no funciona, copia y pega este enlace: <br> ${url}
    </p>
    <p>Este enlace expirará en 24 horas.</p>
  </div>
`;