/**
 * AgroPulse — Pedidos pre-cargados (demo persistente).
 *
 * Estos pedidos se inyectan en `seedIfNeeded()` del store en memoria para
 * que existan SIEMPRE al arrancar el demo. IDs determinísticos (no Date.now)
 * para que las URLs sigan siendo válidas tras reiniciar la lambda.
 *
 * Cobertura:
 *   - 2 pedidos del cliente CR `u-cli-cr-001` (recibido / entregado)
 *   - 1 pedido del cliente CO `u-cli-co-001` (en_transito)
 *   - 2 pedidos al productor CR `u-prod-cr-001` (confirmado_productor / empacado)
 *   - 1 pedido asignado a logística CR `u-log-cr-001` (ultima_milla)
 */
import type { OrderExtended, OrderItem, OrderStatusHistoryEntry } from "./types";

// ----- helpers -----------------------------------------------------------

function item(p: Partial<OrderItem> & {
  productorId: string;
  productorName: string;
  productName: string;
  productSlug: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}): OrderItem {
  const subtotal = p.quantity * p.unitPrice;
  return {
    productId: p.productId ?? `p-${p.productSlug}`,
    productSlug: p.productSlug,
    productName: p.productName,
    productImage: p.productImage,
    productorId: p.productorId,
    productorName: p.productorName,
    quantity: p.quantity,
    unit: p.unit,
    unitPrice: p.unitPrice,
    subtotal,
  };
}

function totals(items: OrderItem[], shippingFee: number) {
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const commissionFee = Math.round(subtotal * 0.04 * 100) / 100;
  const total = subtotal + commissionFee + shippingFee;
  return { subtotal, commissionFee, shippingFee, total };
}

function hist(entries: OrderStatusHistoryEntry[]): OrderStatusHistoryEntry[] {
  return entries;
}

// ----- imágenes (mismas URLs que productos del catálogo) ----------------
const IMG_CAFE = "https://images.unsplash.com/photo-1559525839-d9acfd0b8978?auto=format&fit=crop&w=1200&q=80";
const IMG_PINA = "https://images.unsplash.com/photo-1550828520-4cb496926fc9?auto=format&fit=crop&w=1200&q=80";
const IMG_AGUACATE = "https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=1200&q=80";
const IMG_BANANO = "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?auto=format&fit=crop&w=1200&q=80";
const IMG_CACAO = "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1200&q=80";

// ----- pedidos -----------------------------------------------------------

export const SEED_ORDERS: OrderExtended[] = [
  // 1. Cliente CR — recibido
  (() => {
    const items: OrderItem[] = [
      item({
        productSlug: "cafe-tarrazu-finca",
        productName: "Café Tarrazú SHB",
        productImage: IMG_CAFE,
        productorId: "u-prod-cr-001",
        productorName: "Sofía Castro Jiménez",
        quantity: 10,
        unitPrice: 3800,
        unit: "kg",
      }),
    ];
    const t = totals(items, 4500);
    return {
      id: "o-seed-cr-0001",
      shortCode: "AP-2026-0001",
      customerId: "u-cli-cr-001",
      customerInfo: {
        name: "María Fernanda Solís",
        email: "maria@cliente.cr",
        phone: "+506 8444 9012",
        address: {
          line1: "Avenida Escazú, Torre 2 of. 1205",
          city: "Escazú",
          state: "San José",
          postalCode: "10201",
          country: "CR",
        },
        country: "CR",
      },
      items,
      currency: "CRC",
      ...t,
      paymentMethodId: "sinpe-movil",
      paymentMethodLabel: "SINPE Móvil",
      paymentStatus: "pagado",
      status: "recibido",
      statusHistory: hist([
        {
          status: "recibido",
          timestamp: "2026-05-10T14:20:00Z",
          note: "Pedido creado por el cliente",
          by: "u-cli-cr-001",
          byRole: "cliente",
        },
      ]),
      estimatedDelivery: "2026-05-15T16:00:00Z",
      notes: "Entregar en recepción del edificio. Llamar a María al llegar.",
      createdAt: "2026-05-10T14:20:00Z",
      country: "CR",
    };
  })(),

  // 2. Cliente CR — entregado
  (() => {
    const items: OrderItem[] = [
      item({
        productSlug: "pina-dorada-pital",
        productName: "Piña Dorada MD-2",
        productImage: IMG_PINA,
        productorId: "u-prod-cr-001",
        productorName: "Sofía Castro Jiménez",
        quantity: 50,
        unitPrice: 980,
        unit: "kg",
      }),
      item({
        productSlug: "banano-cavendish-limon",
        productName: "Banano Cavendish",
        productImage: IMG_BANANO,
        productorId: "u-prod-cr-001",
        productorName: "Sofía Castro Jiménez",
        quantity: 8,
        unitPrice: 750,
        unit: "caja 18kg",
      }),
    ];
    const t = totals(items, 6000);
    return {
      id: "o-seed-cr-0002",
      shortCode: "AP-2026-0002",
      customerId: "u-cli-cr-001",
      customerInfo: {
        name: "María Fernanda Solís",
        email: "maria@cliente.cr",
        phone: "+506 8444 9012",
        address: {
          line1: "Avenida Escazú, Torre 2 of. 1205",
          city: "Escazú",
          state: "San José",
          postalCode: "10201",
          country: "CR",
        },
        country: "CR",
      },
      items,
      currency: "CRC",
      ...t,
      paymentMethodId: "iban-cr",
      paymentMethodLabel: "Transferencia IBAN",
      paymentStatus: "pagado",
      logisticaUserId: "u-log-cr-001",
      trackingNumber: "AP-TR-CR-1024",
      status: "entregado",
      statusHistory: hist([
        { status: "recibido", timestamp: "2026-04-28T09:10:00Z", by: "u-cli-cr-001", byRole: "cliente" },
        { status: "confirmado_productor", timestamp: "2026-04-28T11:30:00Z", by: "u-prod-cr-001", byRole: "productor", note: "Lote reservado, listo en 24h" },
        { status: "preparando", timestamp: "2026-04-29T08:00:00Z", by: "u-prod-cr-001", byRole: "productor" },
        { status: "empacado", timestamp: "2026-04-29T14:45:00Z", by: "u-prod-cr-001", byRole: "productor", note: "Pallet sellado, listo para recolectar" },
        { status: "en_transito", timestamp: "2026-04-30T07:20:00Z", by: "u-log-cr-001", byRole: "logistica", note: "Salida desde Tarrazú" },
        { status: "ultima_milla", timestamp: "2026-04-30T13:10:00Z", by: "u-log-cr-001", byRole: "logistica" },
        { status: "entregado", timestamp: "2026-04-30T15:35:00Z", by: "u-log-cr-001", byRole: "logistica", note: "Entregado en recepción del edificio. Recibido por María Solís." },
      ]),
      estimatedDelivery: "2026-04-30T16:00:00Z",
      createdAt: "2026-04-28T09:10:00Z",
      country: "CR",
    };
  })(),

  // 3. Cliente CO — en_transito (productor MX, logística CR)
  (() => {
    const items: OrderItem[] = [
      item({
        productSlug: "aguacate-hass-michoacan",
        productName: "Aguacate Hass",
        productImage: IMG_AGUACATE,
        productorId: "u-prod-mx-001",
        productorName: "Raúl Hernández García",
        quantity: 200,
        unitPrice: 110,
        unit: "kg",
      }),
    ];
    const t = totals(items, 2400);
    return {
      id: "o-seed-co-0003",
      shortCode: "AP-2026-0003",
      customerId: "u-cli-co-001",
      customerInfo: {
        name: "Carlos Andrés Vargas",
        email: "carlos@cliente.co",
        phone: "+57 310 555 4488",
        address: {
          line1: "Calle 93 #11-30, Of. 502",
          city: "Bogotá",
          state: "Cundinamarca",
          postalCode: "110221",
          country: "CO",
        },
        country: "CO",
      },
      items,
      currency: "MXN",
      ...t,
      paymentMethodId: "pse",
      paymentMethodLabel: "PSE",
      paymentStatus: "pagado",
      logisticaUserId: "u-log-cr-001",
      trackingNumber: "AP-TR-MX-2210",
      status: "en_transito",
      statusHistory: hist([
        { status: "recibido", timestamp: "2026-05-05T16:40:00Z", by: "u-cli-co-001", byRole: "cliente" },
        { status: "confirmado_productor", timestamp: "2026-05-05T19:15:00Z", by: "u-prod-mx-001", byRole: "productor" },
        { status: "preparando", timestamp: "2026-05-06T10:00:00Z", by: "u-prod-mx-001", byRole: "productor" },
        { status: "empacado", timestamp: "2026-05-07T09:30:00Z", by: "u-prod-mx-001", byRole: "productor", note: "Pallet refrigerado listo" },
        { status: "en_transito", timestamp: "2026-05-08T18:00:00Z", by: "u-log-cr-001", byRole: "logistica", note: "Salida desde Uruapan vía aérea a Bogotá" },
      ]),
      estimatedDelivery: "2026-05-13T12:00:00Z",
      notes: "Importación con permiso ICA #44128. Cadena de frío obligatoria.",
      createdAt: "2026-05-05T16:40:00Z",
      country: "CO",
    };
  })(),

  // 4. Productor CR — confirmado_productor (cliente CR distinto)
  (() => {
    const items: OrderItem[] = [
      item({
        productSlug: "cacao-criollo-puntarenas",
        productName: "Cacao Criollo Fermentado",
        productImage: IMG_CACAO,
        productorId: "u-prod-cr-001",
        productorName: "Sofía Castro Jiménez",
        quantity: 25,
        unitPrice: 4500,
        unit: "kg",
      }),
    ];
    const t = totals(items, 8000);
    return {
      id: "o-seed-cr-0004",
      shortCode: "AP-2026-0004",
      customerId: "u-cli-cr-001",
      customerInfo: {
        name: "María Fernanda Solís",
        email: "maria@cliente.cr",
        phone: "+506 8444 9012",
        address: {
          line1: "Avenida Escazú, Torre 2 of. 1205",
          city: "Escazú",
          state: "San José",
          postalCode: "10201",
          country: "CR",
        },
        country: "CR",
      },
      items,
      currency: "CRC",
      ...t,
      paymentMethodId: "card-international",
      paymentMethodLabel: "Tarjeta crédito/débito",
      paymentStatus: "pagado",
      status: "confirmado_productor",
      statusHistory: hist([
        { status: "recibido", timestamp: "2026-05-09T11:25:00Z", by: "u-cli-cr-001", byRole: "cliente" },
        { status: "confirmado_productor", timestamp: "2026-05-09T15:50:00Z", by: "u-prod-cr-001", byRole: "productor", note: "Lote reservado. Cosecha esta semana." },
      ]),
      estimatedDelivery: "2026-05-18T16:00:00Z",
      createdAt: "2026-05-09T11:25:00Z",
      country: "CR",
    };
  })(),

  // 5. Productor CR — empacado, sin logística asignada todavía
  (() => {
    const items: OrderItem[] = [
      item({
        productSlug: "pina-dorada-pital",
        productName: "Piña Dorada MD-2",
        productImage: IMG_PINA,
        productorId: "u-prod-cr-001",
        productorName: "Sofía Castro Jiménez",
        quantity: 120,
        unitPrice: 980,
        unit: "kg",
      }),
    ];
    const t = totals(items, 5000);
    return {
      id: "o-seed-cr-0005",
      shortCode: "AP-2026-0005",
      customerId: "u-cli-co-001",
      customerInfo: {
        name: "Carlos Andrés Vargas",
        email: "carlos@cliente.co",
        phone: "+57 310 555 4488",
        address: {
          line1: "Calle 93 #11-30, Of. 502",
          city: "Bogotá",
          state: "Cundinamarca",
          postalCode: "110221",
          country: "CO",
        },
        country: "CO",
      },
      items,
      currency: "CRC",
      ...t,
      paymentMethodId: "card-international",
      paymentMethodLabel: "Tarjeta crédito/débito",
      paymentStatus: "pagado",
      status: "empacado",
      statusHistory: hist([
        { status: "recibido", timestamp: "2026-05-07T08:00:00Z", by: "u-cli-co-001", byRole: "cliente" },
        { status: "confirmado_productor", timestamp: "2026-05-07T13:20:00Z", by: "u-prod-cr-001", byRole: "productor" },
        { status: "preparando", timestamp: "2026-05-08T09:00:00Z", by: "u-prod-cr-001", byRole: "productor" },
        { status: "empacado", timestamp: "2026-05-10T11:45:00Z", by: "u-prod-cr-001", byRole: "productor", note: "Pallet de 120 kg listo para recoger en bodega" },
      ]),
      estimatedDelivery: "2026-05-16T16:00:00Z",
      notes: "Pendiente asignar transporte logística para envío a CO.",
      createdAt: "2026-05-07T08:00:00Z",
      country: "CR",
    };
  })(),

  // 6. Logística CR — ultima_milla
  (() => {
    const items: OrderItem[] = [
      item({
        productSlug: "banano-cavendish-limon",
        productName: "Banano Cavendish",
        productImage: IMG_BANANO,
        productorId: "u-prod-cr-001",
        productorName: "Sofía Castro Jiménez",
        quantity: 14,
        unitPrice: 750,
        unit: "caja 18kg",
      }),
    ];
    const t = totals(items, 3500);
    return {
      id: "o-seed-cr-0006",
      shortCode: "AP-2026-0006",
      customerId: "u-cli-cr-001",
      customerInfo: {
        name: "María Fernanda Solís",
        email: "maria@cliente.cr",
        phone: "+506 8444 9012",
        address: {
          line1: "Avenida Escazú, Torre 2 of. 1205",
          city: "Escazú",
          state: "San José",
          postalCode: "10201",
          country: "CR",
        },
        country: "CR",
      },
      items,
      currency: "CRC",
      ...t,
      paymentMethodId: "sinpe-movil",
      paymentMethodLabel: "SINPE Móvil",
      paymentStatus: "pagado",
      logisticaUserId: "u-log-cr-001",
      trackingNumber: "AP-TR-CR-3041",
      status: "ultima_milla",
      statusHistory: hist([
        { status: "recibido", timestamp: "2026-05-08T10:15:00Z", by: "u-cli-cr-001", byRole: "cliente" },
        { status: "confirmado_productor", timestamp: "2026-05-08T12:00:00Z", by: "u-prod-cr-001", byRole: "productor" },
        { status: "preparando", timestamp: "2026-05-09T08:30:00Z", by: "u-prod-cr-001", byRole: "productor" },
        { status: "empacado", timestamp: "2026-05-09T13:00:00Z", by: "u-prod-cr-001", byRole: "productor" },
        { status: "en_transito", timestamp: "2026-05-10T06:45:00Z", by: "u-log-cr-001", byRole: "logistica", note: "Salida desde San Marcos de Tarrazú" },
        { status: "ultima_milla", timestamp: "2026-05-12T07:30:00Z", by: "u-log-cr-001", byRole: "logistica", note: "En ruta a Escazú. ETA 10:00 AM." },
      ]),
      estimatedDelivery: "2026-05-12T10:30:00Z",
      createdAt: "2026-05-08T10:15:00Z",
      country: "CR",
    };
  })(),
];
