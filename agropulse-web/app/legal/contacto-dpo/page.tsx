import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto DPO — AgroPulse",
};

export default function ContactoDpoPage() {
  return (
    <>
      <h1>Contacto del Data Protection Officer (DPO)</h1>
      <p>
        En AgroPulse Technologies S.A. designamos un Oficial de Protección
        de Datos (Data Protection Officer, DPO) responsable de velar por el
        cumplimiento de la normativa de privacidad en los diez países donde
        operamos.
      </p>

      <h2>Identidad del DPO</h2>
      <ul>
        <li>
          <strong>Nombre:</strong> Sebastián Torres Méndez
        </li>
        <li>
          <strong>Cargo:</strong> Data Protection Officer (DPO) — AgroPulse
          Technologies S.A.
        </li>
        <li>
          <strong>Domicilio profesional:</strong> San José, Costa Rica.
        </li>
        <li>
          <strong>Correo electrónico:</strong>{" "}
          <a href="mailto:sebastorresagropulse@gmail.com">
            sebastorresagropulse@gmail.com
          </a>
        </li>
        <li>
          <strong>WhatsApp:</strong> +506 8337 8828
        </li>
      </ul>

      <h2>¿Cuándo escribir al DPO?</h2>
      <ul>
        <li>Para ejercer cualquier derecho ARCO+ o GDPR sobre sus datos.</li>
        <li>Para reportar un posible incidente de seguridad.</li>
        <li>
          Para solicitar la portabilidad de sus datos en formato JSON o CSV.
        </li>
        <li>
          Para presentar dudas o reclamos sobre tratamientos de marketing,
          cookies o transferencias internacionales.
        </li>
        <li>
          Para consultas relacionadas con la atención a autoridades de
          protección de datos.
        </li>
      </ul>

      <h2>Plazos de respuesta</h2>
      <p>
        El DPO responderá las solicitudes dentro de los diez (10) días
        hábiles siguientes a su recepción. Cuando la complejidad del caso lo
        requiera, el plazo podrá extenderse hasta veinte (20) días hábiles,
        notificando al titular el motivo.
      </p>

      <h2>Autoridades de protección de datos por país</h2>
      <ul>
        <li>
          🇨🇷 Costa Rica — <strong>PRODHAB</strong>
        </li>
        <li>
          🇲🇽 México — <strong>INAI</strong>
        </li>
        <li>
          🇨🇴 Colombia — <strong>SIC, Delegatura de Protección de Datos</strong>
        </li>
        <li>
          🇦🇷 Argentina — <strong>AAIP</strong>
        </li>
        <li>
          🇨🇱 Chile — <strong>Consejo para la Transparencia / futura ANPD</strong>
        </li>
        <li>
          🇵🇪 Perú — <strong>ANPDP</strong>
        </li>
        <li>
          🇪🇨 Ecuador — <strong>Superintendencia de Protección de Datos</strong>
        </li>
        <li>
          🇺🇾 Uruguay — <strong>URCDP</strong>
        </li>
        <li>
          🇬🇹 Guatemala — <strong>Procuraduría de los Derechos Humanos</strong>
        </li>
        <li>
          🇧🇷 Brasil — <strong>ANPD</strong>
        </li>
      </ul>

      <p>
        Cualquier titular que considere insatisfactoria la respuesta de
        AgroPulse podrá presentar denuncia ante la autoridad de protección
        de datos correspondiente.
      </p>
    </>
  );
}
