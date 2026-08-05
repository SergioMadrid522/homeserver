export function forgotPasswordTemplate(verificationCode: string) {
  return `
    <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Restablecer contraseña</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f6f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f6f7fb"
    >
      <tr>
        <td align="center" style="padding: 48px 16px">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width: 100%;
              max-width: 680px;
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            "
          >
            <!-- Header -->
            <tr>
              <td style="padding: 32px 38px 22px">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td valign="middle">
                      <p
                        style="
                          margin: 0;
                          color: #2563eb;
                          font-size: 13px;
                          font-weight: bold;
                          letter-spacing: 1.4px;
                          text-transform: uppercase;
                        "
                      >
                        AM Cloud Server
                      </p>

                      <p
                        style="
                          margin: 7px 0 0;
                          color: #9ca3af;
                          font-size: 13px;
                        "
                      >
                        Almacenamiento privado en la nube
                      </p>
                    </td>

                    <td width="54" align="right" valign="middle">
                      <div
                        style="
                          width: 48px;
                          height: 48px;
                          line-height: 48px;
                          background-color: #3a8bed13;
                          border-radius: 12px;
                          color: #3a8bed;
                          text-align: center;
                          font-size: 20px;
                          font-weight: bold;
                        "
                      >
                        AM
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 20px 38px 40px">
                <h1
                  style="
                    margin: 0;
                    color: #111827;
                    font-size: 34px;
                    line-height: 42px;
                    font-weight: 700;
                  "
                >
                  Restablece tu<br />
                  contraseña.
                </h1>

                <p
                  style="
                    margin: 22px 0 0;
                    color: #6b7280;
                    font-size: 16px;
                    line-height: 27px;
                  "
                >
                  Recibimos una solicitud para cambiar la contraseña de tu
                  cuenta en
                  <strong style="color: #374151">AM Cloud Server</strong>.
                </p>

                <p
                  style="
                    margin: 14px 0 0;
                    color: #6b7280;
                    font-size: 16px;
                    line-height: 27px;
                  "
                >
                  Introduce el siguiente código en la pantalla de recuperación
                  para continuar:
                </p>

                <!-- Code card -->
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    margin-top: 32px;
                    background-color: #111827;
                    border-radius: 8px;
                  "
                >
                  <tr>
                    <td
                      align="center"
                      style="padding: 28px 24px; text-align: center"
                    >
                      <p
                        style="
                          margin: 0;
                          color: #9ca3af;
                          font-size: 12px;
                          font-weight: bold;
                          letter-spacing: 1px;
                          text-transform: uppercase;
                        "
                      >
                        Código de verificación
                      </p>

                      <p
                        style="
                          margin: 18px 0 0;
                          color: #ffffff;
                          font-size: 38px;
                          line-height: 46px;
                          font-weight: bold;
                          letter-spacing: 8px;
                        "
                      >
                        ${verificationCode}
                      </p>

                      <p
                        style="
                          margin: 14px 0 0;
                          color: #9ca3af;
                          font-size: 13px;
                          line-height: 21px;
                        "
                      >
                        Este código expirará en 5 minutos.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Security notice -->
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    margin-top: 32px;
                    border-left: 4px solid #2563eb;
                    background-color: #2564eb0b;
                  "
                >
                  <tr>
                    <td style="padding: 18px 20px">
                      <p
                        style="
                          margin: 0;
                          color: #2563eb;
                          font-size: 14px;
                          font-weight: bold;
                        "
                      >
                        Protege tu cuenta
                      </p>

                      <p
                        style="
                          margin: 7px 0 0;
                          color: #6b7280;
                          font-size: 13px;
                          line-height: 21px;
                        "
                      >
                        No compartas este código con ninguna persona. AM Cloud
                        Server nunca te pedirá tu código de recuperación por
                        llamada, mensaje o correo electrónico.
                      </p>
                    </td>
                  </tr>
                </table>

                <hr
                  style="
                    margin: 34px 0;
                    border: none;
                    border-top: 1px solid #e5e7eb;
                  "
                />

                <p
                  style="
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 23px;
                  "
                >
                  Si no solicitaste restablecer tu contraseña, puedes ignorar
                  este mensaje. Tu contraseña actual seguirá funcionando y no
                  se realizará ningún cambio en tu cuenta.
                </p>

                <p
                  style="
                    margin: 18px 0 0;
                    color: #9ca3af;
                    font-size: 12px;
                    line-height: 20px;
                  "
                >
                  Si recibes varios mensajes como este sin haberlos solicitado,
                  considera actualizar tu contraseña y revisar la seguridad de
                  tu correo electrónico.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 22px 38px;
                  background-color: #f9fafb;
                  border-top: 1px solid #e5e7eb;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td>
                      <p
                        style="
                          margin: 0;
                          color: #6b7280;
                          font-size: 12px;
                          font-weight: bold;
                        "
                      >
                        AM Cloud Server
                      </p>

                      <p
                        style="
                          margin: 5px 0 0;
                          color: #9ca3af;
                          font-size: 11px;
                        "
                      >
                        Tu privacidad es nuestra prioridad.
                      </p>
                    </td>

                    <td align="right">
                      <p
                        style="
                          margin: 0;
                          color: #9ca3af;
                          font-size: 11px;
                        "
                      >
                        © 2026 All Rights Reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p
            style="
              margin: 18px 0 0;
              color: #9ca3af;
              font-size: 11px;
              text-align: center;
            "
          >
            Este es un correo automático. Por favor, no respondas a este
            mensaje.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;
}
