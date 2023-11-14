import { useEffect, useState } from "react";
import { PedidoService } from "../../services/PedidoService";
import Loader from "../Loader/Loader";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import ProductModal from "../ProductModal/ProductModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import { Pedido } from "../../types/Pedido";
const ProductTable = () => {

    //Variable que va a contener los datos recibidos por la API
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    //Variable que muestra el componente Loader hasta que se reciban los datos de la API
    const [isLoading, setIsLoading] = useState(true);

    //Variable que va actualizar los datos de la tabla luego de cada operacion exitosa
    const [refreshData, setRefreshData] = useState(false);



    //Este hook se va a ejecutar cada vez que se renderize el componente
    useEffect(() => {

        //Llamamos a la funcion para obtener todos los productos declarado en el service
        const fetchPedidos = async () => {
            const pedidos = await PedidoService.getPedidos();
            setPedidos(pedidos);
            setIsLoading(false);
        };

        fetchPedidos();

    }, [refreshData]);

    //Test, este log esta modificado para que muestre los datos de una manera mas legible
    console.log(JSON.stringify(pedidos, null, 2));
    //Se inicializa un producto vacio cuando vallamos a crear uno nuevo, para evitar "undefined"
    const initializeNewPedido = (): Pedido => {
        return {
            id: 0,
            estado: 0,
            tipoEnvio: 0,
            formaPago: 0, 
            fechaPedido: "",
            horaEstimadaFinalizacion: "",
            total: 0,
            domicilioEntrega: {
                id:0,
                calle: "",
                numero: 0,
                codigoPostal: 0,
                localidad: "",
                fechaBaja: "",
            },
            detallePedido: Array(0),
            factura: {
                fechaFacturacion: "",
                id: 0,
                mpPaymentId: 0,
                mpPaymentType: "",
                formaPago: 0,
                totalVenta: BigInt(0),
                detalleFactura: Array(0),
            } ,
        };
    };

    //Producto seleccionado que se va a pasar como prop al Modal
    const [pedido, setPedido] = useState<Pedido>(initializeNewPedido);
   
    //Manejo de Modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    const [title, setTitle] = useState("");

    //Logica de Modal
    const handleClick = (newTitle: string, ped: Pedido, modal: ModalType) => {
        setTitle(newTitle);
        setModalType(modal)
        setPedido(ped);
        setShowModal(true);
    };
    
    return(
        <>
            <Button onClick={() => handleClick("Nuevo Pedido", initializeNewPedido(), ModalType.CREATE)}>
                Nuevo Pedido
            </Button>

            {isLoading ? <Loader /> : (
                <Table hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Fecha pedido</th>
                            <th>Hora de finalizacion</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Forma de pago</th>
                            <th>Tipo de Envío</th>
                            <th>Editar</th>
                            <th>Borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.fechaPedido}</td>
                                <td>{pedido.horaEstimadaFinalizacion}</td>
                                <td>{pedido.total}</td>
                                <td>{pedido.estado}</td>
                                <td>{pedido.formaPago}</td>
                                <td>{pedido.tipoEnvio}</td> 
                                <td><EditButton onClick={() => handleClick("Editar Pedido", pedido, ModalType.UPDATE)}/></td>
                                <td><DeleteButton onClick={() => handleClick("Borrar Pedido", pedido, ModalType.DELETE)}/></td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            {showModal &&(
                <ProductModal                 
                show={showModal}
                onHide={() => setShowModal(false)}
                title={title}
                modalType={modalType}
                ped={pedido}
                refreshData={setRefreshData}
                />

            )}
        </>
    )
}

export default ProductTable;