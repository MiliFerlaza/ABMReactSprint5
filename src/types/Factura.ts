import { DetalleFactura } from "./DetalleFactura";
import { FormaPago } from "./FormaPago";

export interface Factura{
    id: number;
    fechaFacturacion: String;
    mpPaymentId: number;
    mpPaymentType: String;
    formaPago: FormaPago;
    totalVenta: BigInt;
    detalleFactura: Array<DetalleFactura>;
}