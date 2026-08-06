export function resetPassword() {
  return `
    <!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contraseña actualizada</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f6f7fb;
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
      style="background: #f6f7fb"
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
              max-width: 680px;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            "
          >
            <!-- Header -->

            <tr>
              <td style="padding: 32px 38px 22px">
                <table width="100%">
                  <tr>
                    <td>
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
                        AMCloud Server
                      </p>

                      <p
                        style="margin: 7px 0 0; color: #9ca3af; font-size: 13px"
                      >
                        Almacenamiento privado en la nube
                      </p>
                    </td>

                    <td align="right">
                      <div
                        style="
                          width: 48px;
                          height: 48px;
                          line-height: 48px;
                          background: #3a8bed13;
                          border-radius: 12px;
                          text-align: center;
                          font-size: 20px;
                          font-weight: bold;
                          color: #3a8bed;
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
                    font-size: 34px;
                    line-height: 42px;
                    color: #111827;
                    font-weight: 700;
                  "
                >
                  Tu contraseña fue<br />
                  actualizada.
                </h1>

                <p
                  style="
                    margin: 22px 0 0;
                    font-size: 16px;
                    line-height: 27px;
                    color: #6b7280;
                  "
                >
                  La contraseña de tu cuenta en
                  <strong style="color: #374151"> AMCloud Server </strong>
                  ha sido cambiada correctamente.
                </p>

                <!-- Success Card -->

                <table
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    margin-top: 32px;
                    background: #111827;
                    border-radius: 8px;
                  "
                >
                  <tr>
                    <td
                      align="center"
                      style="padding: 34px 24px; text-align: center"
                    >
                      <div
                        style="
                          width: 72px;
                          height: 72px;
                          line-height: 72px;
                          margin: 0 auto;
                          border-radius: 999px;
                          background: #2563eb;
                          color: #ffffff;
                          font-size: 34px;
                          font-weight: bold;
                        "
                      >
                        ✓
                      </div>

                      <p
                        style="
                          margin: 22px 0 0;
                          color: #ffffff;
                          font-size: 24px;
                          font-weight: bold;
                        "
                      >
                        Cambio realizado correctamente
                      </p>

                      <p
                        style="
                          margin: 10px 0 0;
                          color: #9ca3af;
                          font-size: 14px;
                          line-height: 24px;
                        "
                      >
                        Tu cuenta ya está protegida con tu nueva contraseña.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Security Notice -->

                <table
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    margin-top: 32px;
                    border-left: 4px solid #2563eb;
                    background: #2564eb0b;
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
                        ¿No realizaste este cambio?
                      </p>

                      <p
                        style="
                          margin: 8px 0 0;
                          font-size: 13px;
                          line-height: 21px;
                          color: #6b7280;
                        "
                      >
                        Si tú no cambiaste la contraseña de esta cuenta, te
                        recomendamos restablecerla nuevamente de inmediato y
                        revisar la seguridad de tu correo electrónico.
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
                    font-size: 14px;
                    line-height: 23px;
                    color: #6b7280;
                  "
                >
                  Este correo es únicamente una notificación de seguridad para
                  mantenerte informado sobre los cambios realizados en tu
                  cuenta.
                </p>
              </td>
            </tr>

            <!-- Footer -->

            <tr>
              <td
                style="
                  padding: 22px 38px;
                  background: #f9fafb;
                  border-top: 1px solid #e5e7eb;
                "
              >
                <table width="100%">
                  <tr>
                    <td>
                      <p
                        style="
                          margin: 0;
                          font-size: 12px;
                          font-weight: bold;
                          color: #6b7280;
                        "
                      >
                        AMCloud Server
                      </p>

                      <p
                        style="margin: 5px 0 0; font-size: 11px; color: #9ca3af"
                      >
                        Tu privacidad es nuestra prioridad.
                      </p>
                    </td>

                    <td align="right">
                      <p style="margin: 0; font-size: 11px; color: #9ca3af">
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
              font-size: 11px;
              color: #9ca3af;
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
