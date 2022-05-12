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

//const [categories,setCateg] = useState([]);
const { REACT_APP_API_URL, REACT_APP_FILES_URL } = process.env;

const Drivers = () => {
  //onLoad();
  /* global File */
  let file = File;

  const [dataDriver, setDataDrive] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    status: false,
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setDataDrive({
      _id: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      status: false,
    });
  };

  //methods when edit
  const [modEditshow, setmodEditshow] = useState(false);
  const modEditClose = () => setmodEditshow(false);

  //methods for data
  const [data, setData] = useState([]);
  const [dataSize, setDataSize] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  const updateModal = cell => {
    let driver = cell.row.original;
    setDataDrive({ ...driver });
    setmodEditshow(true);
  };

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setDataDrive({ ...dataDriver, [name]: value });
    console.log(dataDriver);
    setmodEditshow(true);
  };

  // COLUMNS DATA TABLE
  const columns = useMemo(() => [
    {
      Header: 'Nombre',
      accessor: 'name',
      width: 80,
    },
    {
      Header: 'Email',
      accessor: 'email',
      width: 200,
    },
    {
      Header: 'Telefono',
      accessor: 'phone',
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
      Header: 'Acciones',
      accessor: 'actions',
      width: 80,
      Cell: ({ cell }) => (
        <Button color="info" onClick={() => updateModal(cell)}>
          Editar
        </Button>
      ),
    },
  ]);

  useEffect(() => {
    if (loadingData) {
      getData();
    }
  }, []);

  async function getData() {
    await axios
      .get(REACT_APP_API_URL + '/dealers/all')
      .then(res => {
        setData(res.data);
        console.log(res.data);
        setDataSize(res.data.length);
        setLoadingData(false);
      })
      .catch(err => {
        alert('Error Interno ');
      });
  }

  async function submitForm(e) {
    e.preventDefault();

    axios.post(REACT_APP_API_URL + '/dealers/create', dataDriver).then(res => {
      console.log(res.data);
      if (res.data.OK) {
        alert('Operacion Exitosa');
        getData();
      }
    });

    /* global fetch*/

    //method: "POST",
    //  body: formData,
    //  enctype: "multipart/form-data",
  }

  return (
    <div>
      <Modal isOpen={show} toggle={handleClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del Nuevo Repartidor</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitForm}>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={dataDriver.name}
                onChange={e => handleChange(e)}
                placeholder="nombre de la categoria"
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Email</Label>
              <Input type="email" name="email" id="email" value={dataDriver.email} onChange={e => handleChange(e)} />
            </FormGroup>
            <FormGroup>
              <Label for="details">Telefono</Label>
              <Input type="phone" name="phone" id="phone" value={dataDriver.phone} onChange={e => handleChange(e)} />
            </FormGroup>
            <FormGroup>
              <Label for="details">Contraseña</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={dataDriver.password}
                onChange={e => handleChange(e)}
              />
            </FormGroup>

            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataDriver.status} name="status" onChange={e => handleChange(e)} />
                Estatus Ocación
              </Label>
            </FormGroup>

            <Button color="warning">Guardar Informacion</Button>
          </Form>
        </ModalBody>
      </Modal>

      <Modal isOpen={modEditshow} toggle={modEditClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del Nuevo Repartidor</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitForm}>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={dataDriver.name}
                onChange={e => handleChange(e)}
                placeholder="nombre de la categoria"
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Email</Label>
              <Input type="email" name="email" id="email" value={dataDriver.email} onChange={e => handleChange(e)} />
            </FormGroup>
            <FormGroup>
              <Label for="details">Telefono</Label>
              <Input type="phone" name="phone" id="phone" value={dataDriver.phone} onChange={e => handleChange(e)} />
            </FormGroup>
            <FormGroup>
              <Label for="details">Contraseña</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={dataDriver.password}
                onChange={e => handleChange(e)}
              />
            </FormGroup>

            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataDriver.status} name="status" onChange={e => handleChange(e)} />
                Estatus Ocación
              </Label>
            </FormGroup>

            <Button color="warning">Guardar Informacion</Button>
          </Form>
        </ModalBody>
      </Modal>
      <Card>
        <CardBody>
          <Row>
            <Col xs={4}>
              <Card>
                <CardBody>Listado de Repartidores</CardBody>
              </Card>
            </Col>
            <Col xs={4}>
              <Card>
                <CardBody></CardBody>
              </Card>
            </Col>
            <Col xs={4}>
              <Card>
                <CardBody>
                  <Button color="primary" onClick={handleShow} block outline>
                    <i className="fa fa-plus-circle"></i>&nbsp;&nbsp;Nuevo Repartidor
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

export default Drivers;
