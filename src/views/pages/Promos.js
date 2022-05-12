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

const Promos = () => {
  const [dataPromo, setDataPromo] = useState({
    _id: '',
    code: '',
    name: '',
    details: '',
    image: '',
    status: false,
    price: '0.00',
    category: 'promo',
    fileSelected: null,
  });

  const [categories, setCategories] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setDataPromo({_id : '',
      code: '',
      name: '',
      details: '',
      image: '',
    category: 'promo',
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
    setDataPromo({ ...dataPromo, [name]: value });
    console.log(dataPromo);
  };

  const showPicture = v => {
    console.log(v.value);
    setUrl(v.value);
    handlePics();
  };

  const updateModal = cell => {
    let Promo = cell.row.original;
    setDataPromo({ ...Promo, fileSelected: null });
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
      Header: 'Promosión',
      accessor: 'name',
      width: 200,
    },
    {
      Header: 'Detalles',
      accessor: 'details',
      width: 300,
    },
    {
      Header: 'Categoria',
      // accessor: 'category',
      accessor: c => {
        let categori = categories.filter(c => c.code === c.category);
        console.log(categori);
        return categori.length > 0 ? categori[0].name : '';
      },
      width: 200,
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
    await axios.get(`${REACT_APP_API_URL}/Promos/all`).then(res => {
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
    if (dataPromo._id != '') {
      let res = window.confirm('¿Desea Actualizar la imagen de precentación?');
      if (!res) {
        e.target.value = '';
        throw 'Operación Cancelada';
      }
    }
    let file = e.target.files[0];
    setDataPromo({ ...dataPromo, image: file.name, fileSelected: file });
  }

  async function submitForm(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('photo', dataPromo.fileSelected);
    let statusImage = await axios.post(`${REACT_APP_API_URL}/photos/upload`, formData).then(c => c.data);
    if (statusImage.OK) {
      axios
        .post(`${REACT_APP_API_URL}/Promos/create`, dataPromo)
        .then(c => c.data)
        .then(c => {
          if (c.OK) {
            alert('Almacenado con éxito');
            getData();
            setShow(false);
            setDataPromo({
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

    if (dataPromo.fileSelected != null) {
      let formData = new FormData();
      formData.append('photo', dataPromo.fileSelected);

      let statusImage = await axios.post(`${REACT_APP_API_URL}/photos/upload`, formData).then(c => c.data);
      if (!statusImage.OK) {
        alert(statusImage.message);
        throw 'Operacion cancelada';
      }
    }

    let updateAction = await axios.put(`${REACT_APP_API_URL}/Promos/update`, dataPromo).then(c => c.data);

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
        <ModalHeader style={{ backgroundColor: '#1d1594', color: '#ffffff' }}>Imagen Promoo</ModalHeader>
        <ModalBody style={{ alignSelf: 'center' }}>
          <img style={{ padding: 10 }} src={'http://cms.etcmediasolutions.com/uploads/' + urlPic} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Cambiar Imagen</Button>
          <Button color="danger" onClick={picsClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
      {/* Modal picture category */}
      {/* Modal create Promo */}
      <Modal isOpen={show} toggle={handleClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del nuevo Promoo</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitForm}>
           
            <FormGroup>
              <Label for="code">Codigo</Label>
              <Input
                type="text"
                name="code"
                id="code"
                value={dataPromo.code}
                onChange={e => handleChange(e)}
                placeholder="codigo del Promoo"
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={dataPromo.name}
                onChange={e => handleChange(e)}
                placeholder="nombre del Promoo"
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Descripcion</Label>
              <Input
                type="textarea"
                name="details"
                id="details"
                value={dataPromo.details}
                onChange={e => handleChange(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Precio</Label>
              <CurrencyInput
                prefix="$"
                value={dataPromo.price}
                onChangeEvent={(event, maskedvalue, floatvalue) => setDataPromo({ ...dataPromo, price: floatvalue })}
                className="form-control"
              />
            </FormGroup>
            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataPromo.status} name="status" onChange={e => handleChange(e)} />
                Estatus Banner
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
      {/* Modal create Promo */}

      {/* Modal edit Promo */}
      <Modal isOpen={modEditshow} toggle={modEditClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del Promoo</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitEdit}>
          
            <FormGroup>
              <Label for="code">Codigo</Label>
              <Input
                type="text"
                name="code"
                id="code"
                value={dataPromo.code}
                onChange={e => handleChange(e)}
                placeholder="codigo del Promoo"
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={dataPromo.name}
                onChange={e => handleChange(e)}
                placeholder="nombre del Promoo"
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Descripcion</Label>
              <Input
                type="textarea"
                name="details"
                id="details"
                value={dataPromo.details}
                onChange={e => handleChange(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Precio</Label>
              <CurrencyInput
                prefix="$"
                value={dataPromo.price}
                onChangeEvent={(event, maskedvalue, floatvalue) => setDataPromo({ ...dataPromo, price: maskedvalue })}
                className="form-control"
              />
            </FormGroup>
            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataPromo.status} name="status" onChange={e => handleChange(e)} />
                Estatus Banner
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
      {/* Modal edit Promo */}

      <Card>
        <CardBody>
          <Row>
            <Col xs={8}>
              <Card>
                <CardBody>
                  <p>Listado de Promoos</p>
                  <small>Promoos</small>
                </CardBody>
              </Card>
            </Col>

            <Col xs={4}>
              <Card>
                <CardBody>
                  <Button color="primary" onClick={handleShow} block outline>
                    <i className="fa fa-plus-circle"></i>&nbsp;&nbsp;Nuevo Promoo
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

export default Promos;



// promociones
// Complemento
// Ocaciones
// Repartidores

