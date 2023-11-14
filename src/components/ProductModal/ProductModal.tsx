import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { PedidoService } from "../../services/PedidoService";
//notif al usuario
import { toast } from 'react-toastify';
import { Pedido } from "../../types/Pedido";
import { EstadoPedido } from "../../types/EstadoPedido";
import React from "react";
import { FormaPago } from "../../types/FormaPago";
import { TipoEnvio } from "../../types/TipoEnvio";



type PedidoModalProps = {
    show: boolean;
    onHide: () => void;
    title: string
    modalType: ModalType;
    ped: Pedido;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const PedidoModal = ({ show, onHide, title, modalType, ped, refreshData }: PedidoModalProps) => {

    const [estadoPedido, setEstadoPedido] = React.useState<EstadoPedido>(EstadoPedido.PENDIENTE_PAGO);

    const onChange = (ep: React.ChangeEvent<HTMLSelectElement>)=>{
        const {value} = ep.target;
        setEstadoPedido(value as unknown as EstadoPedido);
    }
    const [formaPago, setFormaPago] = React.useState<FormaPago>(FormaPago.EFECTIVO);

    const onChange_D = (fp: React.ChangeEvent<HTMLSelectElement>)=>{
        const {value} = fp.target;
        setFormaPago(value as unknown as FormaPago);
    }

    const [tipoEnvio, setTipoEnvio] = React.useState<TipoEnvio>(TipoEnvio.DELIVERY);

    const onChange_T = (te: React.ChangeEvent<HTMLSelectElement>)=>{
        const {value} = te.target;
        setTipoEnvio(value as unknown as TipoEnvio);
    }

    
    //CREATE - UPDATE
    const handleSaveUpdate = async (ped: Pedido) => {
        try {
            const isNew = ped.id === 0;
            if (isNew) {
                await PedidoService.createPedido(ped);
            } else {
                await PedidoService.updatePedido(ped.id, ped);
            }
            toast.success(isNew ? "Pedido Creado" : "Pedido Actualizado", {
                position: "top-center",
            });
            onHide();
            refreshData(prevState => !prevState);
        } catch (error) {
            console.error(error);
            toast.error('A ocurrido un Error');
        }
    };
    //DELETE
    const handleDelete = async () => {
        try {
            await PedidoService.deletePedido(ped.id);
            toast.success("Pedido Borrado", {
                position: "top-center",
            });
            onHide();
            refreshData(prevState => !prevState);
        } catch (error) {
            console.error(error);
            toast.error('A ocurrido un Error');
        }
    }


    const validationSchema = () => {
        return Yup.object().shape({
            id: Yup.number().integer().min(0),
            fechaPedido: Yup.string().required('La fecha del pedido es requerida'),
            horaEstimadaFinalizacion: Yup.string().required('La hora estimada de finalizacion es requerida'),
            total: Yup.number().min(0).required('El total es requerido'),
            estado: Yup.string().required(''),
            tipoEnvio: Yup.string().required(''),
            formaPago: Yup.string().required('')
        });
    };
    const formik = useFormik({
        initialValues: ped,
        validationSchema: validationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Pedido) => handleSaveUpdate(obj),
    });




    return (
        <>
            {modalType === ModalType.DELETE ? (
                <>
                    <Modal show={show} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>¿Está seguro que desea eliminar el Pedido?<br /> <strong>{ped.id}</strong>?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Borrar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </>
            ) : (
                <>
                    <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            
                            <Form onSubmit={formik.handleSubmit}>

                                
                                <Form.Group controlId="formId">
                                    <Form.Label>Id</Form.Label>
                                    <Form.Control
                                        name="id"
                                        type="number"
                                        value={formik.values.id || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={Boolean(formik.errors.id && formik.touched.id)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.id}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                
                                <Form.Group controlId="formFechaPedido">
                                    <Form.Label>Fecha de Pedido</Form.Label>
                                    <Form.Control
                                        name="fechaPedido"
                                        type="text"
                                        value={formik.values.fechaPedido || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={Boolean(formik.errors.fechaPedido && formik.touched.fechaPedido)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.fechaPedido} 
                                    </Form.Control.Feedback>
                                </Form.Group>

                                
                                <Form.Group controlId="formHoraEstimadaFinalizacion">
                                    <Form.Label>Hora de Finalizacion</Form.Label>
                                    <Form.Control
                                        name="horaEstimadaFinalizacion"
                                        type="text"
                                        value={formik.values.horaEstimadaFinalizacion || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={Boolean(formik.errors.horaEstimadaFinalizacion && formik.touched.horaEstimadaFinalizacion)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.horaEstimadaFinalizacion}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                
                                <Form.Group controlId="formTotal">
                                    <Form.Label>Total</Form.Label>
                                    <Form.Control
                                        name="total"
                                        type="number"
                                        value={formik.values.total || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={Boolean(formik.errors.total && formik.touched.total)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.total}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                
                                <Form.Group className={`app ${estadoPedido}`}>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select                                        
                                        name="estado"                                  
                                        onChange={onChange}
                                        id="estado"
                                        
                                        isInvalid={Boolean(formik.errors.estado && formik.touched.estado)}                                       
                                    >               
                                        <option></option>                    
                                        <option  value={EstadoPedido.PENDIENTE_PAGO}>
                                            PENDIENTE_PAGO
                                        </option>   
                                        <option  value={EstadoPedido.PAGADO}>
                                            PAGADO
                                        </option>
                                        <option  value={EstadoPedido.PREPARACION}>
                                            PREPARACION
                                        </option>
                                        <option  value={EstadoPedido.PENDIENTE_ENTREGA}>
                                            PENDIENTE_ENTREGA
                                        </option>
                                        <option  value={EstadoPedido.EN_CAMINO}>
                                            EN_CAMINO
                                        </option>
                                        <option  value={EstadoPedido.CANCELADO}>
                                            CANCELADO
                                        </option>
                                        <option  value={EstadoPedido.NOTA_CREDITO}>
                                            NOTA_CREDITO
                                        </option>  
                                        <option  value={EstadoPedido.COMPLETADO}>
                                            COMPLETADO
                                        </option>            
                                         
                                    </Form.Select>
                                                                           
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.estado}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className={`app ${formaPago}`}>
                                    <Form.Label>Forma de pago</Form.Label>
                                    <Form.Select                                        
                                        name="formaPago"                                  
                                        onChange={onChange_D}
                                        id="formaPago"
                                        isInvalid={Boolean(formik.errors.formaPago && formik.touched.formaPago)}                                       
                                    >               
                                        <option></option>                    
                                        <option  value={FormaPago.EFECTIVO}>
                                            EFECTIVO
                                        </option>   
                                        <option  value={FormaPago.MERCADO_PAGO}>
                                            MERCADO_PAGO
                                        </option>       
                                         
                                    </Form.Select>
                                                                           
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.formaPago}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className={`app ${tipoEnvio}`}>
                                    <Form.Label>Tipo de Envio</Form.Label>
                                    <Form.Select                                        
                                        name="tipoEnvio"                                  
                                        onChange={onChange_T}
                                        id="tipoEnvio"
                                        isInvalid={Boolean(formik.errors.tipoEnvio && formik.touched.tipoEnvio)}                                       
                                    >               
                                        <option></option>                    
                                        <option  value={TipoEnvio.DELIVERY}>
                                            DELIVERY
                                        </option>   
                                        <option  value={TipoEnvio.TAKE_AWAY}>
                                            TAKE_AWAY
                                        </option>
                                                
                                         
                                    </Form.Select>
                                                                           
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.estado}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Modal.Footer className="mt-4">
                                    <Button variant="secondary" onClick={onHide}>
                                        Cancelar
                                    </Button>

                                    <Button variant="primary" type="submit" disabled={!formik.isValid}>
                                        Guardar
                                    </Button>

                                </Modal.Footer>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    )
}

export default PedidoModal;