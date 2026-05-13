import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones — AgroPulse",
};

export default function TerminosPage() {
  return (
    <>
      <h1>Términos y condiciones de uso</h1>
      <p>
        <strong>Última actualización:</strong> 12 de mayo de 2026
      </p>
      <p>
        Bienvenido a AgroPulse Technologies S.A. (en adelante, &ldquo;AgroPulse&rdquo;,
        &ldquo;nosotros&rdquo; o &ldquo;la plataforma&rdquo;), una sociedad
        anónima constituida en San José, Costa Rica, cédula jurídica
        3-101-XXXXXX, dedicada al desarrollo y operación de una plataforma
        AgriTech para la comercialización B2B y gestión IoT de cosechas
        agrícolas en América Latina. Estos términos y condiciones (&ldquo;los
        Términos&rdquo;) regulan el uso del sitio web{" "}
        <a href="/">agropulse.cr</a>, así como cualquier subdominio,
        aplicación móvil, API o servicio asociado (en conjunto, los
        &ldquo;Servicios&rdquo;).
      </p>
      <p>
        Al acceder o utilizar los Servicios, el usuario (&ldquo;Usuario&rdquo;,
        &ldquo;Cliente&rdquo; o &ldquo;Productor&rdquo;, según corresponda)
        manifiesta haber leído, comprendido y aceptado íntegramente estos
        Términos, así como nuestra <a href="/legal/privacidad">Política
        de Privacidad</a> y la <a href="/legal/cookies">Política de
        Cookies</a>. Si el Usuario no está de acuerdo con cualquier
        disposición, deberá abstenerse de utilizar los Servicios.
      </p>

      <h2>1. Objeto y alcance</h2>
      <p>
        AgroPulse ofrece una plataforma digital que conecta productores
        agrícolas, cooperativas, distribuidores y compradores institucionales
        en diez (10) países de América Latina: México, Costa Rica, Colombia,
        Argentina, Chile, Perú, Ecuador, Uruguay, Guatemala y Brasil. Los
        Servicios incluyen, entre otros: un marketplace B2B con catálogo de
        productos perecederos, dashboards analíticos basados en sensores IoT,
        herramientas de trazabilidad de cadena de frío, gestión logística,
        emisión de facturas, recepción de pagos locales y notificaciones
        operativas por correo electrónico y WhatsApp.
      </p>

      <h2>2. Registro de cuenta y elegibilidad</h2>
      <p>
        Para utilizar funcionalidades reservadas (creación de pedidos,
        publicación de lotes, dashboard productor), el Usuario debe registrarse
        con datos verídicos, completos y actualizados. El Usuario garantiza
        ser mayor de edad conforme a la legislación de su país de residencia y
        contar con capacidad legal para celebrar contratos vinculantes.
      </p>
      <ul>
        <li>
          <strong>Productores:</strong> declaran ser propietarios o
          representantes legalmente autorizados de las fincas, cooperativas o
          empresas agrícolas que registren.
        </li>
        <li>
          <strong>Clientes:</strong> declaran adquirir productos para fines
          comerciales, industriales o de reventa, no para consumo personal
          según legislación del consumidor.
        </li>
        <li>
          <strong>Logística:</strong> declaran contar con permisos vigentes
          de transporte refrigerado emitidos por las autoridades de su país.
        </li>
      </ul>
      <p>
        AgroPulse podrá rechazar o suspender registros que detecte como
        fraudulentos, duplicados, automatizados o no conformes con la
        normativa aplicable.
      </p>

      <h2>3. Cuentas, autenticación y seguridad</h2>
      <p>
        El Usuario es responsable de mantener la confidencialidad de sus
        credenciales y, en su caso, del código TOTP de autenticación en dos
        pasos (2FA). Tras cinco (5) intentos fallidos de inicio de sesión, la
        cuenta quedará bloqueada por quince (15) minutos como medida de
        protección. El Usuario notificará a AgroPulse de inmediato sobre
        cualquier acceso no autorizado al correo{" "}
        <a href="mailto:sebastorresagropulse@gmail.com">
          sebastorresagropulse@gmail.com
        </a>
        .
      </p>

      <h2>4. Marketplace, comisiones y pagos</h2>
      <p>
        AgroPulse facilita la celebración de contratos de compraventa entre
        Productores y Clientes, sin ser parte directa del contrato comercial
        salvo que se indique expresamente. Se aplica una comisión de servicio
        del cuatro por ciento (4%) sobre el valor bruto de cada transacción,
        descontada al momento de la liquidación al Productor. Los métodos de
        pago habilitados varían por país (SINPE Móvil, SPEI, OXXO, PSE,
        Nequi, Mercado Pago, Webpay, Yape, Pix, entre otros). Las comisiones
        adicionales del procesador de pago se aplican según se detalle en el
        checkout.
      </p>
      <p>
        Los precios publicados incluyen impuestos locales cuando así lo exija
        la legislación del país emisor. Las facturas se emiten conforme a la
        normativa fiscal aplicable y se entregan electrónicamente.
      </p>

      <h2>5. Obligaciones de los Productores</h2>
      <ul>
        <li>
          Publicar lotes con información veraz, incluyendo cantidad, unidad,
          región, fecha de cosecha y vencimiento.
        </li>
        <li>
          Garantizar la inocuidad alimentaria y respetar la cadena de frío
          declarada (cuando aplique).
        </li>
        <li>
          Cumplir con las certificaciones declaradas (orgánico, fair trade,
          GlobalG.A.P., HACCP, Rainforest Alliance, etc.).
        </li>
        <li>
          Honrar los pedidos confirmados dentro de los plazos comprometidos.
        </li>
        <li>
          Mantener actualizada la disponibilidad del lote para evitar
          ventas en sobrecupo.
        </li>
      </ul>

      <h2>6. Obligaciones de los Clientes</h2>
      <ul>
        <li>
          Proveer datos de facturación correctos y un domicilio de entrega
          accesible.
        </li>
        <li>
          Pagar el precio acordado dentro del plazo establecido en el método
          de pago seleccionado.
        </li>
        <li>
          Recibir la mercadería en el horario coordinado y comunicar
          cualquier disconformidad dentro de las primeras 24 horas posteriores
          a la entrega.
        </li>
        <li>
          Abstenerse de utilizar la plataforma para fines fraudulentos,
          ilícitos o de competencia desleal.
        </li>
      </ul>

      <h2>7. Propiedad intelectual</h2>
      <p>
        Todos los derechos sobre el sitio, el código fuente, las marcas
        AgroPulse, los logos, las visualizaciones de datos y el contenido
        editorial son propiedad de AgroPulse Technologies S.A. o de sus
        licenciantes. Está prohibido reproducir, modificar, descompilar o
        distribuir cualquier parte de la plataforma sin autorización previa
        y por escrito. El contenido aportado por Usuarios (fotografías de
        lotes, descripciones, reviews) se licencia a AgroPulse de forma no
        exclusiva, mundial y gratuita para su exhibición dentro de la
        plataforma y materiales de promoción.
      </p>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        AgroPulse no será responsable por: (i) la calidad sanitaria final del
        producto entregado, atributo bajo responsabilidad del Productor; (ii)
        retrasos derivados de causa mayor, eventos climáticos extremos,
        bloqueos de carreteras o paros laborales; (iii) interrupciones
        derivadas de mantenimiento programado debidamente comunicado; (iv)
        contenido publicado por Usuarios que infrinja derechos de terceros,
        sin perjuicio del procedimiento de notificación y retirada
        contemplado en el numeral 11.
      </p>
      <p>
        En ningún caso la responsabilidad agregada de AgroPulse excederá el
        equivalente al monto pagado por el Usuario en concepto de comisiones
        durante los tres (3) meses inmediatamente anteriores al hecho
        generador.
      </p>

      <h2>9. Suspensión y cancelación</h2>
      <p>
        AgroPulse podrá suspender o cancelar cuentas que infrinjan estos
        Términos, presenten conductas fraudulentas, generen reclamos
        recurrentes o adeuden comisiones. El Usuario puede solicitar la baja
        de su cuenta en cualquier momento mediante el formulario disponible
        en el perfil o escribiendo al DPO. La baja no extingue las
        obligaciones pendientes (pagos, entregas, retención fiscal).
      </p>

      <h2>10. Cumplimiento internacional</h2>
      <p>
        AgroPulse opera conforme a las leyes de Costa Rica (Ley 8968 de
        Protección de la Persona frente al Tratamiento de sus Datos
        Personales) y se compromete a respetar los estándares equivalentes
        en los países donde presta servicios: LGPD (Brasil), Ley 1581 de
        2012 (Colombia), Ley Federal de Protección de Datos (México), Ley
        25.326 (Argentina), Ley 19.628 (Chile), Ley 29.733 (Perú), Ley
        Orgánica de Protección de Datos Personales (Ecuador), Ley 18.331
        (Uruguay) y Decreto 57-2008 (Guatemala). Cuando trate datos de
        residentes en la Unión Europea, AgroPulse cumple los principios del
        Reglamento General de Protección de Datos (RGPD).
      </p>

      <h2>11. Notificación de infracciones (notice &amp; takedown)</h2>
      <p>
        Para reportar contenido que infrinja derechos de propiedad
        intelectual, suplante identidad o publique información falsa,
        contacte al{" "}
        <a href="/legal/contacto-dpo">Data Protection Officer</a> con la
        evidencia correspondiente. AgroPulse responderá dentro de los diez
        (10) días hábiles.
      </p>

      <h2>12. Modificaciones</h2>
      <p>
        AgroPulse podrá actualizar estos Términos para reflejar mejoras en
        los Servicios, cambios legales o de mercado. Los cambios se
        comunicarán con al menos quince (15) días de anticipación a través
        del correo registrado y serán visibles en esta misma página. El uso
        continuado de los Servicios después de la fecha de vigencia implica
        la aceptación de los nuevos Términos.
      </p>

      <h2>13. Ley aplicable y resolución de disputas</h2>
      <p>
        Estos Términos se rigen por las leyes de la República de Costa Rica.
        Las partes acuerdan que cualquier controversia será resuelta, en
        primera instancia, mediante negociación de buena fe. Si no fuese
        posible alcanzar un acuerdo, las partes someterán la disputa a los
        Tribunales de Justicia de San José, Costa Rica, renunciando a
        cualquier otro fuero que pudiera corresponderles. Lo anterior sin
        perjuicio de los derechos imperativos del consumidor en su
        jurisdicción de residencia, cuando aplique.
      </p>

      <h2>14. Contacto</h2>
      <p>
        AgroPulse Technologies S.A. — San José, Costa Rica.
        <br />
        Correo: <a href="mailto:sebastorresagropulse@gmail.com">
          sebastorresagropulse@gmail.com
        </a>
        <br />
        WhatsApp: +506 8337 8828
      </p>
    </>
  );
}
