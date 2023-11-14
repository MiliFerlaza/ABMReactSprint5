import { DetallePedido } from "./DetallePedido";
import { Domicilio } from "./Domicilio";
import { EstadoPedido } from "./EstadoPedido";
import { Factura } from "./Factura";
import { FormaPago } from "./FormaPago";
import { TipoEnvio } from "./TipoEnvio";

export interface Pedido{
    id: number;
    fechaPedido: string;
    horaEstimadaFinalizacion: string;
    total: number;
    estado: EstadoPedido;
    formaPago: FormaPago;
    tipoEnvio: TipoEnvio;
    domicilioEntrega: Domicilio;
    detallePedido: Array<DetallePedido>;
    factura: Factura;
}