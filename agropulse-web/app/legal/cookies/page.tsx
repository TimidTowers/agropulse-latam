import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies — AgroPulse",
};

export default function CookiesPage() {
  return (
    <>
      <h1>Política de Cookies</h1>
      <p>
        <strong>Última actualización:</strong> 12 de mayo de 2026
      </p>
      <p>
        El sitio AgroPulse utiliza cookies y tecnologías similares
        (localStorage, sessionStorage) para garantizar el funcionamiento
        básico de la plataforma, recordar las preferencias del usuario,
        medir el rendimiento y, sólo si lo autoriza, personalizar mensajes
        de marketing.
      </p>

      <h2>1. ¿Qué es una cookie?</h2>
      <p>
        Una cookie es un archivo de texto pequeño que el sitio web descarga
        en su dispositivo cuando lo visita. Las cookies permiten al sitio
        recordar acciones y preferencias (como inicio de sesión, idioma,
        país seleccionado) durante un periodo determinado.
      </p>

      <h2>2. Cookies utilizadas por AgroPulse</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Finalidad</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>authjs.session-token</td>
            <td>Esencial</td>
            <td>Mantiene la sesión autenticada (JWT firmado).</td>
            <td>30 días</td>
          </tr>
          <tr>
            <td>authjs.csrf-token</td>
            <td>Esencial</td>
            <td>Previene ataques CSRF en formularios de autenticación.</td>
            <td>Sesión</td>
          </tr>
          <tr>
            <td>agropulse_2fa</td>
            <td>Esencial</td>
            <td>Confirma que la verificación 2FA fue completada.</td>
            <td>8 horas</td>
          </tr>
          <tr>
            <td>agropulse:country</td>
            <td>Esencial</td>
            <td>Recuerda el país elegido para mostrar precios y catálogo.</td>
            <td>1 año (localStorage)</td>
          </tr>
          <tr>
            <td>agropulse:cart</td>
            <td>Esencial</td>
            <td>Persiste el contenido del carrito entre visitas.</td>
            <td>30 días (localStorage)</td>
          </tr>
          <tr>
            <td>agropulse:consent</td>
            <td>Esencial</td>
            <td>Guarda la elección sobre el banner de cookies.</td>
            <td>6 meses (localStorage)</td>
          </tr>
          <tr>
            <td>_ap_an</td>
            <td>Analítica</td>
            <td>
              Identificador anónimo para métricas de uso (sólo si autorizó).
            </td>
            <td>13 meses</td>
          </tr>
          <tr>
            <td>_ap_mk</td>
            <td>Marketing</td>
            <td>
              Personalización de campañas de re-marketing (sólo si autorizó).
            </td>
            <td>6 meses</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Categorías y consentimiento</h2>
      <ul>
        <li>
          <strong>Esenciales:</strong> imprescindibles para el funcionamiento
          del sitio y la seguridad. No requieren consentimiento.
        </li>
        <li>
          <strong>Analíticas:</strong> miden tráfico y rendimiento del sitio
          de forma agregada. Sólo se activan con consentimiento explícito.
        </li>
        <li>
          <strong>Marketing:</strong> personalización de mensajes y campañas.
          Sólo se activan con consentimiento explícito.
        </li>
      </ul>

      <h2>4. Gestión del consentimiento</h2>
      <p>
        Al ingresar por primera vez al sitio aparecerá un banner donde podrá
        elegir entre &ldquo;Aceptar todas&rdquo;, &ldquo;Solo
        esenciales&rdquo; o &ldquo;Configurar&rdquo;. Su elección se guarda
        durante seis (6) meses. Puede cambiarla en cualquier momento
        borrando las cookies de su navegador o solicitando la reapertura del
        banner al DPO.
      </p>

      <h2>5. Cookies de terceros</h2>
      <p>
        En AgroPulse no usamos cookies de redes publicitarias externas (Meta
        Pixel, Google Ads, TikTok) sin antes obtener su consentimiento. Las
        pasarelas de pago, durante la transacción, pueden establecer cookies
        propias en su dominio; consulte las políticas de cada proveedor.
      </p>

      <h2>6. Cómo eliminar o bloquear cookies</h2>
      <p>
        Cada navegador permite gestionar las cookies desde su panel de
        configuración. Bloquear las cookies esenciales puede provocar que
        algunas funcionalidades dejen de operar (no podrá iniciar sesión,
        completar pedidos ni recibir notificaciones).
      </p>
      <ul>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/es/kb/Borrar%20cookies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Edge
          </a>
        </li>
      </ul>

      <h2>7. Contacto</h2>
      <p>
        Para dudas sobre esta política puede contactar a nuestro DPO en{" "}
        <a href="mailto:sebastorresagropulse@gmail.com">
          sebastorresagropulse@gmail.com
        </a>
        .
      </p>
    </>
  );
}
