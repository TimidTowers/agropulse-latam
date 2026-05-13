import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — AgroPulse",
};

export default function PrivacidadPage() {
  return (
    <>
      <h1>Política de Privacidad</h1>
      <p>
        <strong>Última actualización:</strong> 12 de mayo de 2026
      </p>
      <p>
        AgroPulse Technologies S.A. (en adelante, &ldquo;AgroPulse&rdquo;)
        valora la confianza de productores, clientes y aliados logísticos.
        Esta Política describe qué datos personales recopilamos, con qué
        finalidad, sobre qué base legal, cómo los protegemos y cuáles son los
        derechos que el titular puede ejercer en cualquier momento.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        Responsable: <strong>AgroPulse Technologies S.A.</strong>
        <br />
        Domicilio: San José, Costa Rica.
        <br />
        Correo del Data Protection Officer (DPO):{" "}
        <a href="mailto:sebastorresagropulse@gmail.com">
          sebastorresagropulse@gmail.com
        </a>
      </p>

      <h2>2. Datos que recopilamos</h2>
      <ul>
        <li>
          <strong>Datos de identidad y contacto:</strong> nombre completo,
          correo electrónico, teléfono, dirección postal, cédula jurídica
          (cuando aplica).
        </li>
        <li>
          <strong>Datos del rol comercial:</strong> tipo de cuenta (cliente,
          productor, logística), cooperativa, hectáreas cultivadas, vehículos,
          placas, certificaciones.
        </li>
        <li>
          <strong>Datos transaccionales:</strong> historial de pedidos, montos,
          métodos de pago utilizados (no almacenamos números completos de
          tarjeta; se delega en pasarelas certificadas PCI-DSS).
        </li>
        <li>
          <strong>Datos técnicos:</strong> dirección IP, agente de usuario,
          identificadores de sesión, registros de auditoría (logs).
        </li>
        <li>
          <strong>Datos IoT:</strong> métricas de temperatura, humedad,
          coordenadas GPS de lotes y vehículos.
        </li>
        <li>
          <strong>Comunicaciones:</strong> consultas enviadas por formulario,
          email o WhatsApp.
        </li>
      </ul>

      <h2>3. Finalidades del tratamiento</h2>
      <ul>
        <li>Prestación, operación y soporte del Servicio.</li>
        <li>
          Verificación de identidad, prevención de fraude y cumplimiento
          regulatorio (KYC/AML cuando aplique).
        </li>
        <li>
          Facturación, cobranza y liquidación de transacciones a productores.
        </li>
        <li>
          Comunicaciones operativas (cambios de estado de pedido, alertas
          IoT, recuperación de contraseña).
        </li>
        <li>
          Comunicaciones de marketing, sólo cuando el titular haya marcado
          previamente la casilla correspondiente.
        </li>
        <li>
          Mejora continua de la plataforma, métricas de uso anónimas y
          analítica.
        </li>
      </ul>

      <h2>4. Bases legales</h2>
      <p>
        Tratamos sus datos personales con las siguientes bases legales,
        seleccionando la que mejor aplique a cada finalidad:
      </p>
      <ul>
        <li>
          <strong>Ejecución de contrato:</strong> cuando los datos son
          necesarios para prestar el Servicio.
        </li>
        <li>
          <strong>Cumplimiento legal:</strong> obligaciones fiscales,
          contables, de prevención de lavado y respuesta a autoridades.
        </li>
        <li>
          <strong>Interés legítimo:</strong> mejora del Servicio, prevención
          de fraude, seguridad de la información.
        </li>
        <li>
          <strong>Consentimiento expreso:</strong> marketing directo, uso de
          cookies no esenciales.
        </li>
      </ul>

      <h2>5. Compartición y encargados de tratamiento</h2>
      <p>
        AgroPulse comparte datos personales únicamente con encargados de
        tratamiento que ofrecen garantías adecuadas y firman contratos de
        procesamiento de datos. Los principales encargados son:
      </p>
      <ul>
        <li>Resend (envío de correos transaccionales).</li>
        <li>Twilio (mensajería WhatsApp, cuando aplique).</li>
        <li>
          Pasarelas de pago locales (BAC Credomatic, Stripe, Mercado Pago, PSE,
          Webpay, según país).
        </li>
        <li>
          Proveedores de infraestructura cloud y CDN (servidores localizados
          en LATAM y EE.UU.).
        </li>
      </ul>
      <p>
        No vendemos ni cedemos datos personales a terceros con fines
        publicitarios externos.
      </p>

      <h2>6. Transferencias internacionales</h2>
      <p>
        Por la naturaleza distribuida de los Servicios, ciertos datos pueden
        ser procesados fuera del país de residencia del titular. AgroPulse
        asegura niveles de protección equivalentes mediante cláusulas
        contractuales estándar, certificaciones ISO 27001 y/o pertenencia a
        marcos APEC CBPR.
      </p>

      <h2>7. Tiempo de conservación</h2>
      <ul>
        <li>
          Datos de cuenta activa: durante toda la vigencia de la relación
          contractual.
        </li>
        <li>
          Datos transaccionales: cinco (5) años desde la última operación,
          conforme normativa fiscal.
        </li>
        <li>
          Logs de auditoría y seguridad: doce (12) meses, prorrogable cuando
          exista un incidente bajo investigación.
        </li>
        <li>
          Datos de marketing: hasta que el titular retire su consentimiento.
        </li>
      </ul>
      <p>
        Cumplidos los plazos, los datos se eliminan o anonimizan de forma
        irreversible.
      </p>

      <h2>8. Derechos del titular</h2>
      <p>
        En todo momento el titular puede ejercer los siguientes derechos
        (denominados &ldquo;ARCO+&rdquo; en LATAM y &ldquo;GDPR rights&rdquo;
        en UE):
      </p>
      <ul>
        <li>
          <strong>Acceso:</strong> conocer qué datos tratamos y obtener una
          copia.
        </li>
        <li>
          <strong>Rectificación:</strong> corregir datos inexactos o
          incompletos.
        </li>
        <li>
          <strong>Cancelación / Supresión:</strong> solicitar la eliminación
          de los datos cuando ya no sean necesarios o se retire el
          consentimiento.
        </li>
        <li>
          <strong>Oposición:</strong> negarse a tratamientos basados en
          interés legítimo o marketing directo.
        </li>
        <li>
          <strong>Portabilidad:</strong> recibir los datos en formato
          estructurado (JSON / CSV) y transmitirlos a otro responsable.
        </li>
        <li>
          <strong>Limitación:</strong> restringir el tratamiento mientras se
          resuelve una disputa.
        </li>
        <li>
          <strong>Decisiones automatizadas:</strong> solicitar revisión humana
          cuando un proceso automático le afecte significativamente.
        </li>
      </ul>
      <p>
        Para ejercer estos derechos basta con enviar un correo a{" "}
        <a href="mailto:sebastorresagropulse@gmail.com">
          sebastorresagropulse@gmail.com
        </a>{" "}
        indicando el derecho a ejercer y adjuntando copia de un documento que
        acredite la identidad. AgroPulse responderá dentro de los diez (10)
        días hábiles. En caso de inconformidad, el titular podrá presentar
        denuncia ante la autoridad de protección de datos de su país (PRODHAB
        en Costa Rica, ANPD en Brasil, SIC en Colombia, INAI en México, AAIP
        en Argentina, etc.).
      </p>

      <h2>9. Seguridad</h2>
      <p>
        Implementamos medidas técnicas y organizativas razonables: cifrado
        TLS 1.3 en tránsito, hashing bcrypt de contraseñas (cost 10), 2FA
        opcional basado en TOTP, control de acceso por rol (RBAC),
        registro inmutable de auditoría, rotación trimestral de secretos y
        pruebas anuales de pentest. A pesar de ello, ningún sistema es
        100% invulnerable; en caso de incidente notificaremos a las
        autoridades y titulares afectados dentro de las setenta y dos (72)
        horas conforme a la mejor práctica internacional.
      </p>

      <h2>10. Menores de edad</h2>
      <p>
        AgroPulse no ofrece servicios a menores de 18 años. Si detectamos
        cuentas creadas por menores las eliminaremos de inmediato.
      </p>

      <h2>11. Cambios a esta Política</h2>
      <p>
        Cualquier modificación material se notificará con quince (15) días de
        anticipación al correo registrado y se reflejará en esta misma
        página, indicando la fecha de la última actualización.
      </p>

      <h2>12. Contacto del DPO</h2>
      <p>
        Para consultas, reclamos o solicitudes relacionadas con esta
        Política:{" "}
        <a href="/legal/contacto-dpo">Contactar al Data Protection Officer</a>{" "}
        o escribir a{" "}
        <a href="mailto:sebastorresagropulse@gmail.com">
          sebastorresagropulse@gmail.com
        </a>
        .
      </p>
    </>
  );
}
