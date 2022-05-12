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

const Banners = () => {
  const [dataBanner, setDataBanner] = useState({
    _id: '',
    code: '',
    name: '',
    details: '',
    image: '',
    status: false,
    fileSelected: null,
  });

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setDataBanner({ ...dataBanner, [name]: value });
    console.log(dataBanner);
  };

  //onLoad();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [upload, setUpload] = useState(false);

  /* global File */
  let file = File;
  let img = 'image.png';

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setDataBanner({
      _id: '',
      code: '',
      name: '',
      details: '',
      image: '',
      status: false,
      fileSelected: null,
    });
    setShow(true);
  };

  const [pics, setPic] = useState(false);
  const handlePics = () => setPic(true);
  const picsClose = () => setPic(false);
  const [urlPic, setUrl] = useState('');
  //when data loaded
  const [data, setData] = useState([]);
  const [dataSize, setDataSize] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  const [modEditshow, setmodEditshow] = useState(false);
  const modEditClose = () => setmodEditshow(false);

  const showPicture = v => {
    console.log(v.value);
    setUrl(REACT_APP_FILES_URL + '/uploads/' + v.value);
    handlePics();
  };

  const updateModal = cell => {
    let Banner = cell.row.original;
    setDataBanner({ ...Banner, fileSelected: null });
    setmodEditshow(true);
    console.log(dataBanner);
  };

  // COLUMNS DATA TABLE
  const columns = useMemo(() => [
    {
      Header: 'Codigo',
      accessor: 'code',
      width: 80,
    },
    {
      Header: 'Banner',
      accessor: 'name',
      width: 200,
    },
    {
      Header: 'Detalles',
      accessor: 'details',
      width: 300,
    },
    {
      Header: 'Estatus',
      accessor: d => (d.status == true ? 'Activo' : 'Inantivo'),
      width: 80,
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
    await axios.get(`${REACT_APP_API_URL}/banners/all`).then(res => {
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

  function onFileChange(e) {
    if (dataBanner._id != '') {
      let res = window.confirm('¿Desea Actualizar la imagen de precentacióa?');
      if (!res) {
        e.target.value = '';
        throw 'Operación Cancelada';
      }
    }
    let file = e.target.files[0];
    setDataBanner({ ...dataBanner, image: file.name, fileSelected: file });
  }

  async function submitSave(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('photo', dataBanner.fileSelected);

    let statusImage = await axios.post(`${REACT_APP_API_URL}/photos/upload`, formData).then(c => c.data);
    if (statusImage.OK) {
      axios
        .post(`${REACT_APP_API_URL}/banners/create`, dataBanner)
        .then(c => c.data)
        .then(c => {
          if (c.OK) {
            alert('Almacenado con éxito');
            getData();
            setShow(false);
            setDataBanner({
              code: '',
              name: '',
              details: '',
              image: '',
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

    if (dataBanner.fileSelected != null) {
      let formData = new FormData();
      formData.append('photo', dataBanner.fileSelected);

      let statusImage = await axios.post(`${REACT_APP_API_URL}/photos/upload`, formData).then(c => c.data);
      if (!statusImage.OK) {
        alert(statusImage.message);
        throw 'Operacion cancelada';
      }
    }

    let updateAction = await axios.put(`${REACT_APP_API_URL}/categories/update`, dataBanner).then(c => c.data);

    if (updateAction.OK) {
      alert('Informacion Actualizada con éxito');
      setmodEditshow(false);
      getData();
    }
  }

  return (
    <div>
      {/* Modal picture Banner*/}
      <Modal isOpen={pics} toggle={picsClose} style={{ width: 800, height: 500 }}>
        <ModalHeader style={{ backgroundColor: '#1d1594', color: '#ffffff' }}>Imagen Banner</ModalHeader>
        <ModalBody style={{ alignSelf: 'center' }}>
          <img style={{ padding: 10 }} src={urlPic} />
        </ModalBody>
      </Modal>
      {/* Modal picture Banner */}
      {/* modal new Banner */}
      <Modal isOpen={show} toggle={handleClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos del nuevo Banner</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitSave}>
            <FormGroup>
              <Label for="code">Codigo</Label>
              <Input
                type="text"
                name="code"
                value={dataBanner.code || ''}
                onChange={handleChange}
                placeholder="codigo de la Banner"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                value={dataBanner.name || ''}
                name="name"
                onChange={handleChange}
                placeholder="nombre de la Banner"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Descripcion</Label>
              <Input type="textarea" value={dataBanner.details || ''} name="details" onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="BannerFile">Imagen</Label>
              <Input type="file" accept=".jpg" onChange={ev => onFileChange(ev)} required />
            </FormGroup>

            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataBanner.status} name="status" onChange={handleChange} />
                Estatus Banner
              </Label>
            </FormGroup>
            <hr />
            <Button color="warning">Guardar Informacion</Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* modal new Banner */}
      {/* modal edit Banner */}
      <Modal isOpen={modEditshow} toggle={modEditClose} modalTransition={{ timeout: 500 }}>
        <ModalHeader>Datos de la Banner</ModalHeader>
        <ModalBody>
          <Form onSubmit={submitEdit}>
            <FormGroup>
              <Label for="code">Codigo</Label>
              <Input
                type="text"
                name="code"
                value={dataBanner.code}
                onChange={handleChange}
                placeholder="codigo de la Banner"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                type="text"
                value={dataBanner.name}
                name="name"
                onChange={handleChange}
                placeholder="nombre de la Banner"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="details">Descripcion</Label>
              <Input type="textarea" value={dataBanner.details} name="details" onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="BannerFile">Imagen</Label>
              <Input type="file" accept=".jpg" onChange={ev => onFileChange(ev)} />
            </FormGroup>
            <FormGroup check>
              <Label for="details" check>
                <Input type="checkbox" checked={dataBanner.status} name="status" onChange={handleChange} />
                Estatus Banner
              </Label>
            </FormGroup>
            <hr />
            <Button color="warning">Actualizar Informacion</Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* modal edit Banner */}
      <Card>
        <CardBody>
          <Row>
            <Col xs={4}>
              <Card>
                <CardBody>Listado de Banners</CardBody>
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
                    <i className="fa fa-plus-circle"></i>&nbsp;&nbsp;Nueva Banner
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

export default Banners;
