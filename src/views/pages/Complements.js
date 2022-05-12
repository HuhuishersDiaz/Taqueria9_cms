import React, { Component, useMemo, useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
  CardHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
} from 'reactstrap';
import Table from './widgets/Table';
import axios from 'axios';



const { REACT_APP_API_URL, REACT_APP_FILES_URL } = process.env;

const Complements  = () => {
  const [dataComplement, setDataComplement] = useState({
    _id: '',
    code: '',
    name: '',
    details: '',
    status: false,
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setDataComplement({
      _id: '',
      code: '',
      name: '',
      details: '',
      status: false,
    });
    setShow(true);
  };
  //methods when edit
  const [modEditshow, setmodEditshow] = useState(false);
  const modEditClose = () => setmodEditshow(false);

  //data when data is loading
  const [data, setData] = useState([]);
  const [dataSize, setDataSize] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setDataComplement({ ...dataComplement, [name]: value });
    console.log(dataComplement);
  };

  const updateModal = cell => {
    let Complement = cell.row.original;
    setDataComplement({ ...Complement, fileSelected: null });
    setmodEditshow(true);
  };
  // COLUMNS DATA TABLE
  const columns = useMemo(() => [
    {
      Header: 'Codigo',
      accessor: 'code',
      width: 80,
    },
    {
      Header: 'Complemento',
      accessor: 'name',
      width: 200,
    },
    {
      Header: 'Detalles',
      accessor: 'details',
      width: 300,
    },
    {
      Header: 'Creado',
      accessor: 'createdAt',
      width: 80,
    },
    {
      Header: 'Estatus',
      accessor: d => (d.status == true ? 'Activo' : 'Inantivo'),
      width: 80,
    },
    {
      width: 80,
      Header: 'Acciones',
      accessor: 'actions',
      Cell: ({ cell }) => (
        <Button color="info" onClick={e => updateModal(cell)}>
          Editar
        </Button>
      ),
    },
  ]);



  async function getData() {
    await axios.get(`${REACT_APP_API_URL}/Complements/all`).then(res => {
      setData(res.data);
      console.log(res.data);
      setDataSize(res.data.length);
      setLoadingData(false);
    });
  }

  useEffect(() => {
    if (loadingData) {
      getData();
    }
  }, []);

  // function onFileChange(fileChangeEvent) {
  //   file = fileChangeEvent.target.files[0];
  //   //img = file.name;

  // }

  async function submitForm(e) {
    e.preventDefault();

      axios
        .post(`${REACT_APP_API_URL}/Complements/create`, dataComplement)
        .then(c => c.data)
        .then(c => {
          if (c.OK) {
            alert('Almacenado con éxito');
            getData();
            setShow(false);
            setDataComplement({
              code: '',
              name: '',
              details: '',
              image: '',
              price: '0.00',
              status: false,
              fileSelected: null,
            });
          } else {
            alert(c.message);
          }
        });
  }

  async function submitEdit(e) {
    e.preventDefault();

    let updateAction = await axios.put(`${REACT_APP_API_URL}/Complements/update`, dataComplement).then(c => c.data);

    if (updateAction.OK) {
      alert('Informacion Actualizada con éxito');
      setmodEditshow(false);
      getData();
    }
  }

  return (
    <div>
  
      {/* Modal create Complement */}
      <Modal isOpen={show} toggle={handleClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del nuevo Complemento</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitForm}>
            <FormGroup>
              <Label for="code">Codigo</Label>
              <Input
                type="text"
                name="code"
                id="code"
                value={dataComplement.code}
                onChange={e => handleChange(e)}
                placeholder="codigo del Complemento"
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={dataComplement.name}
                onChange={e => handleChange(e)}
                placeholder="nombre del Complemento"
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Descripcion</Label>
              <Input
                type="textarea"
                name="details"
                id="details"
                value={dataComplement.details}
                onChange={e => handleChange(e)}
              />
            </FormGroup>
           
            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataComplement.status} name="status" onChange={e => handleChange(e)} />
                Estatus Complemento
              </Label>
            </FormGroup>
         
            <Button color="warning">Guardar Informacion</Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* Modal create Complement */}

      {/* Modal edit Complement */}
      <Modal isOpen={modEditshow} toggle={modEditClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del Complemento</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitEdit}>
          <FormGroup>
              <Label for="code">Codigo</Label>
              <Input
                type="text"
                name="code"
                id="code"
                value={dataComplement.code}
                onChange={e => handleChange(e)}
                placeholder="codigo del Complemento"
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={dataComplement.name}
                onChange={e => handleChange(e)}
                placeholder="nombre del Complemento"
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Descripcion</Label>
              <Input
                type="textarea"
                name="details"
                id="details"
                value={dataComplement.details}
                onChange={e => handleChange(e)}
              />
            </FormGroup>
           
            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataComplement.status} name="status" onChange={e => handleChange(e)} />
                Estatus Complemento
              </Label>
            </FormGroup>
         
            <Button color="warning">Guardar Información</Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* Modal edit Complement */}

      <Card>
        <CardBody>
          <Row>
            <Col xs={8}>
              <Card>
                <CardBody>
                  <p>Listado de Complementos</p>
                  <small>Complementos</small>
                </CardBody>
              </Card>
            </Col>

            <Col xs={4}>
              <Card>
                <CardBody>
                  <Button color="primary" onClick={handleShow} block outline>
                    <i className="fa fa-plus-circle"></i>&nbsp;&nbsp;Nuevo Complemento
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {loadingData ? <p>Loading Please wait...</p> : <Table hover columns={columns} data={data} />}
          {dataSize == 0 ? <p style={{ fontWeight: 'bold', padding: 5, color: 'red' }}>No records found !!!</p> : null}

          <Pagination aria-label="Page navigation example" size="sm" style={{ float: 'right', paddingTop: 20 }}>
            <PaginationItem>
              <PaginationLink previous href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href="#" />
            </PaginationItem>
          </Pagination>
        </CardBody>
      </Card>
    </div>
  );
};

export default Complements;



// promociones
// Complemento
// Ocaciones
// Repartidores

