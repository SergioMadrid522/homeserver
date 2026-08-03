import { CreatedUser } from 'src/types/user.types';
import { getLocalFormattedDate } from 'src/utils/date.util';

export function welcomeTemplate(user: CreatedUser) {
  return `
    <html lang="es">
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
            <tr>
              <td>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
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
                                font-size: 24px;
                              "
                            >
                              AM
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td style="padding: 20px 38px 40px">
                      <p
                        style="
                          margin: 0 0 12px;
                          color: #6b7280;
                          font-size: 14px;
                        "
                      >
                        Hola, ${user.name}:
                      </p>

                      <h1
                        style="
                          margin: 0;
                          color: #111827;
                          font-size: 34px;
                          line-height: 42px;
                          font-weight: 700;
                        "
                      >
                        Tu nube personal<br />
                        ya está preparada.
                      </h1>

                      <p
                        style="
                          margin: 22px 0 0;
                          color: #6b7280;
                          font-size: 16px;
                          line-height: 27px;
                        "
                      >
                        Hemos creado correctamente tu cuenta en
                        <strong style="color: #374151"> AM Cloud Server</strong
                        >. A partir de ahora puedes almacenar y administrar tus
                        archivos desde un espacio privado.
                      </p>

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
                          <td style="padding: 24px 26px">
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
                              Tu plan de almacenamiento
                            </p>

                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              style="margin-top: 12px"
                            >
                              <tr>
                                <td valign="bottom">
                                  <p
                                    style="
                                      margin: 0;
                                      color: #ffffff;
                                      font-size: 38px;
                                      font-weight: bold;
                                      line-height: 42px;
                                    "
                                  >
                                    150 GB
                                  </p>

                                  <p
                                    style="
                                      margin: 7px 0 0;
                                      color: #9ca3af;
                                      font-size: 13px;
                                    "
                                  >
                                    disponibles para tus archivos
                                  </p>
                                </td>

                                <td align="right" valign="bottom">
                                  <span
                                    style="
                                      display: inline-block;
                                      padding: 7px 12px;
                                      background-color: #2563eb;
                                      border-radius: 20px;
                                      color: #ffffff;
                                      font-size: 12px;
                                      font-weight: bold;
                                    "
                                  >
                                    CUENTA ACTIVA
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="margin-top: 30px"
                      >
                        <tr>
                          <td
                            width="50%"
                            valign="top"
                            style="
                              padding: 0 14px 22px 0;
                              border-bottom: 1px solid #e5e7eb;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                color: #9ca3af;
                                font-size: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.6px;
                              "
                            >
                              Usuario
                            </p>

                            <p
                              style="
                                margin: 8px 0 0;
                                color: #111827;
                                font-size: 15px;
                                font-weight: bold;
                              "
                            >
                              ${user.name} ${user.lastname}
                            </p>
                          </td>

                          <td
                            width="50%"
                            valign="top"
                            style="
                              padding: 0 0 22px 14px;
                              border-bottom: 1px solid #e5e7eb;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                color: #9ca3af;
                                font-size: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.6px;
                              "
                            >
                              Fecha de alta
                            </p>

                            <p
                              style="
                                margin: 8px 0 0;
                                color: #111827;
                                font-size: 15px;
                                font-weight: bold;
                              "
                            >
                                ${getLocalFormattedDate(user.createdAt)}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td colspan="2" style="padding-top: 22px">
                            <p
                              style="
                                margin: 0;
                                color: #9ca3af;
                                font-size: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.6px;
                              "
                            >
                              Correo asociado
                            </p>

                            <p
                              style="
                                margin: 8px 0 0;
                                color: #111827;
                                font-size: 15px;
                                font-weight: bold;
                              "
                            >
                              ${user.email}
                            </p>
                          </td>
                        </tr>
                      </table>

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
                              Tu privacidad es nuestra prioridad
                            </p>

                            <p
                              style="
                                margin: 7px 0 0;
                                color: #6b7280;
                                font-size: 13px;
                                line-height: 21px;
                              "
                            >
                              Tus archivos estarán asociados únicamente a tu
                              cuenta y se almacenarán en una infraestructura
                              privada administrada por AM Cloud Server.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="margin-top: 34px"
                      >
                        <tr>
                          <td align="left" style="text-align: center">
                            <a
                              href="{{loginUrl}}"
                              style="
                                display: inline-block;
                                padding: 15px 28px;
                                background-color: #2564ebfb;
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 6px;
                                font-size: 15px;
                                font-weight: bold;
                              "
                            >
                              Iniciar sesión
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p
                        style="
                          margin: 34px 0 0;
                          color: #9ca3af;
                          font-size: 12px;
                          line-height: 20px;
                        "
                      >
                        Este mensaje fue enviado porque se registró una cuenta
                        con esta dirección de correo. Si no reconoces esta
                        actividad, puedes ignorar el mensaje.
                      </p>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    background-color: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                  "
                >
                  <tr>
                    <td style="padding: 22px 38px">
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
                              style="margin: 0; color: #9ca3af; font-size: 11px"
                            >
                              © 2026 All Rights Reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="margin: 18px 0 0; color: #9ca3af; font-size: 11px">
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
