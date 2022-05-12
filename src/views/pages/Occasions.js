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
import CurrencyInput from 'react-currency-input';

//const [categories,setCateg] =  useState([]);

const { REACT_APP_API_URL, REACT_APP_FILES_URL } = process.env;

const Occasions = () => {
  const [dataOccasion, setDataOccasion] = useState({
    _id: '',
    code: '',
    name: '',
    details: '',
    image: '',
    status: false,
    price: '0.00',
    category: 'Occasion',
    fileSelected: null,
  });


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setDataOccasion({
      _id : '',
      category : 'Occasion',
      code: '',
      name: '',
      details: '',
      image: '',
      price: '0.00',
      status: false,
      fileSelected: null,
    });
    setShow(true);
  };
  const [pics, setPic] = useState(false);
  const handlePics = () => setPic(true);
  const picsClose = () => setPic(false);
  const [urlPic, setUrl] = useState('');
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
    setDataOccasion({ ...dataOccasion, [name]: value });
    console.log(dataOccasion);
  };

  const showPicture = v => {
    console.log(v.value);
    setUrl(v.value);
    handlePics();
  };

  const updateModal = cell => {
    let Occasion = cell.row.original;
    setDataOccasion({ ...Occasion, fileSelected: null });
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
      Header: 'Occasiono',
      accessor: 'name',
      width: 200,
    },
    {
      Header: 'Detalles',
      accessor: 'details',
      width: 300,
    },
   
    {
      Header: 'Precio',
      accessor: 'price',
      accessor: d => `$${d.price}`,

      width: 100,
    },
    {
      Header: 'Imagen',
      accessor: 'image',
      width: 50,
      Cell: ({ cell: { value } }) => (
        <img src={REACT_APP_FILES_URL + value} alt={value} width={60} onClick={() => showPicture({ value })} />
      ),
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
    await axios.get(`${REACT_APP_API_URL}/Occasions/all`).then(res => {
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

  function onFileChange(e) {
    if (dataOccasion._id != '') {
      let res = window.confirm('¿Desea Actualizar la imagen de precentación?');
      if (!res) {
        e.target.value = '';
        throw 'Operación Cancelada';
      }
    }
    let file = e.target.files[0];
    setDataOccasion({ ...dataOccasion, image: file.name, fileSelected: file });
  }

  async function submitForm(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('photo', dataOccasion.fileSelected);
    let statusImage = await axios.post(`${REACT_APP_API_URL}/photos/upload`, formData).then(c => c.data);
    if (statusImage.OK) {
      axios
        .post(`${REACT_APP_API_URL}/Occasions/create`, dataOccasion)
        .then(c => c.data)
        .then(c => {
          if (c.OK) {
            alert('Almacenado con éxito');
            getData();
            setShow(false);
            setDataOccasion({
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
    } else {
      alert(statusImage.message);
    }
  }

  async function submitEdit(e) {
    e.preventDefault();

    if (dataOccasion.fileSelected != null) {
      let formData = new FormData();
      formData.append('photo', dataOccasion.fileSelected);

      let statusImage = await axios.post(`${REACT_APP_API_URL}/photos/upload`, formData).then(c => c.data);
      if (!statusImage.OK) {
        alert(statusImage.message);
        throw 'Operacion cancelada';
      }
    }

    let updateAction = await axios.put(`${REACT_APP_API_URL}/Occasions/update`, dataOccasion).then(c => c.data);

    if (updateAction.OK) {
      alert('Informacion Actualizada con éxito');
      setmodEditshow(false);
      getData();
    }
  }

  return (
    <div>
      {/* Modal picture category*/}
      <Modal isOpen={pics} toggle={picsClose} style={{ width: 800, height: 500 }}>
        <ModalHeader style={{ backgroundColor: '#1d1594', color: '#ffffff' }}>Imagen Occasiono</ModalHeader>
        <ModalBody style={{ alignSelf: 'center' }}>
          <img style={{ padding: 10 }} src={ REACT_APP_FILES_URL + urlPic} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Cambiar Imagen</Button>
          <Button color="danger" onClick={picsClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
      {/* Modal picture category */}
      {/* Modal create Occasion */}
      <Modal isOpen={show} toggle={handleClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del nuevo Occasiono</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitForm}>
       
            <FormGroup>
              <Label for="code">Codigo</Label>
              <Input
                type="text"
                name="code"
                id="code"
                value={dataOccasion.code}
                onChange={e => handleChange(e)}
                placeholder="codigo del Occasiono"
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={dataOccasion.name}
                onChange={e => handleChange(e)}
                placeholder="nombre del Occasiono"
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Descripcion</Label>
              <Input
                type="textarea"
                name="details"
                id="details"
                value={dataOccasion.details}
                onChange={e => handleChange(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Precio</Label>
              <CurrencyInput
                prefix="$"
                value={dataOccasion.price}
                onValueChange={(event, maskedvalue, floatvalue) => setDataOccasion({ ...dataOccasion, price: floatvalue })}
                className="form-control"
              />
            </FormGroup>
            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataOccasion.status} name="status" onChange={e => handleChange(e)} />
                Estatus Ocación
              </Label>
            </FormGroup>
            <FormGroup>
              <Label for="categoryFile">Imagen</Label>
              <Input type="file" onChange={ev => onFileChange(ev)} />
            </FormGroup>
            <Button color="warning">Guardar Informacion</Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* Modal create Occasion */}

      {/* Modal edit Occasion */}
      <Modal isOpen={modEditshow} toggle={modEditClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del Occasiono</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitEdit}>
            
            <FormGroup>
              <Label for="code">Codigo</Label>
              <Input
                type="text"
                name="code"
                id="code"
                value={dataOccasion.code}
                onChange={e => handleChange(e)}
                placeholder="codigo del Occasiono"
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={dataOccasion.name}
                onChange={e => handleChange(e)}
                placeholder="nombre del Occasiono"
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Descripcion</Label>
              <Input
                type="textarea"
                name="details"
                id="details"
                value={dataOccasion.details}
                onChange={e => handleChange(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Precio</Label>
              <CurrencyInput
                prefix="$"
                value={dataOccasion.price}
                onValueChange={(value, name) => setDataOccasion({ ...dataOccasion, price: value })}
                className="form-control"
              />
            </FormGroup>
            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataOccasion.status} name="status" onChange={e => handleChange(e)} />
                Estatus Banner
              </Label>
            </FormGroup>
            <FormGroup>
              <Label for="categoryFile">Imagen</Label>
              <Input type="file" onChange={ev => onFileChange(ev)} />
            </FormGroup>
            <Button color="warning">Guardar Información</Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* Modal edit Occasion */}

      <Card>
        <CardBody>
          <Row>
            <Col xs={8}>
              <Card>
                <CardBody>
                  <p>Listado de Occasionos</p>
                  <small>Occasionos</small>
                </CardBody>
              </Card>
            </Col>

            <Col xs={4}>
              <Card>
                <CardBody>
                  <Button color="primary" onClick={handleShow} block outline>
                    <i className="fa fa-plus-circle"></i>&nbsp;&nbsp;Nuevo Occasiono
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

export default Occasions;



// promociones
// Complemento
// Ocaciones
// Repartidores

