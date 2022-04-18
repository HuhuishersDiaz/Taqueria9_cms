import React, {Component, useMemo, useState, useEffect } from 'react';
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
  Input
} from 'reactstrap';
import Table from "./widgets/Table";
import axios from 'axios';
import CurrencyInput from 'react-currency-input';

//const [categories,setCateg] = useState([]);

const Products = () => {
  
  //onLoad();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [upload, setUpload] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState("0.00");
  /* global File */
  let file = File;
  let img = "image.png";
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [pics, setPic] = useState(false);
  const handlePics = () => setPic(true);
  const picsClose = () => setPic(false);
  const [urlPic, setUrl] = useState(''); 
  const [data, setData] = useState([]);
  const [dataSize, setDataSize] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  
  const handleChange = (event) => {
    setCategory(event.target.value);
  }
  
  const handleChangeCurrency = (event, maskedvalue, floatvalue) => {
    setAmount(maskedvalue);
  }
  
  const showPicture = (v) => {
    console.log(v.value);
    setUrl(v.value);
    handlePics();
  }
  
  const updateModal = (v) => {
    console.log(v);
  }
  
  // COLUMNS DATA TABLE
  const columns = useMemo(() => [
    {
      Header: "Codigo",
      accessor: "code",
      width:80
    },
    {
      Header: "Producto",
      accessor: "name",
      width:200
    },
    {
      Header: "Detalles",
      accessor: "details",
      width:300,
    },
     {
      Header: "Categoria",
      accessor: "category",
      width:200,
    },
     {
      Header: "Precio",
      accessor: "price",
      width:100,
    },
    {
      Header: "Imagen",
      accessor: "image",
      width:50,
      Cell: ({ cell: { value } }) => (
      <img
        src={'http://cms.etcmediasolutions.com/uploads/'+value}
        alt={value}
        width={60}
        onClick={() => showPicture({value})}
      />
    )
    }, {
      Header: "Creado",
      accessor: "createdAt",
      width:80
    },
    {
      Header:"Acciones",
      accessor:"actions",
      width:80,
      Cell: ({ cell: {value}}) => (
        <Button color="info" onClick={() => updateModal({value})}>Editar</Button>
      )
    }
  ]);
  
  useEffect(()=>{
  
  async function getCategories(){
    await axios.get("http://cms.etcmediasolutions.com:3000/categories/all")
          .then(res => {
            setCategories(res.data);
            console.log(res.data);
          });
  } 
  
  async function getData(){
  await axios.get("http://cms.etcmediasolutions.com:3000/products/all")
        .then(res => {
          setData(res.data);
          console.log(res.data);
          setDataSize(res.data.length);
          setLoadingData(false);
        });
  }
  if(loadingData) {
    getData();
    getCategories();
  }
  }, []);

  
  function onFileChange(fileChangeEvent) {
    file = fileChangeEvent.target.files[0];  
    //img = file.name;
    
  }
  
  async function submitForm(){
     
        let formData = new FormData();
        formData.append('photo', file, file.name);
        
        console.log(file);
    
     axios.all([
        axios.post("http://cms.etcmediasolutions.com:3000/photos/upload",
        formData),
         axios.post("http://cms.etcmediasolutions.com:3000/products/create",{
           category: category,
            code: code,
         name: name,
         details: details,
         price:amount,
         image: file.name,
         })
       ])
       .then(axios.spread((data1,data2) => {
        console.log('data1', data1, 'data2', data2)
       }));
        
    /* global fetch*/
       
          //method: "POST",
        //  body: formData,
        //  enctype: "multipart/form-data",
     
          
       
     
  }
  
  return (
    <div>
    {/* Modal picture category*/}
     <Modal isOpen={pics} toggle={picsClose} style={{width:800,height:500}}>
       <ModalHeader style={{backgroundColor:"#1d1594", color:"#ffffff"}}>Imagen Producto</ModalHeader>
          <ModalBody style={{alignSelf:'center'}}>
             <img style={{padding:10}}
              src={'http://cms.etcmediasolutions.com/uploads/' + urlPic}/>
          </ModalBody>
       <ModalFooter>
       <Button color="primary" >Cambiar Imagen</Button> 
       <Button color="danger" onClick={picsClose}>Cerrar</Button>
       </ModalFooter>
     </Modal>
     {/* Modal picture category */}
    <Card>
    <CardBody>
         <Row>
          <Col xs={4}>
            <Card>
              <CardBody>Listado de Productos</CardBody>
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
                <Button color="primary" onClick={handleShow} block outline><i className="fa fa-plus-circle"></i>&nbsp;&nbsp;Nuevo Producto</Button>
             
               <Modal isOpen={show} toggle={handleClose} modalTransition={{timeout:500}}>
  <ModalHeader>
    Datos del nuevo producto
  </ModalHeader>
  <ModalBody>
   <Form onSubmit={submitForm}>
        <FormGroup>
        <select style={{width:200}} value={category} onChange={handleChange}>
          <label>Categoria</label><br></br>
          {
           categories.map(category => 
            <option value={category.name}>{category.name}</option>
           )}
        </select>
        </FormGroup>
        <FormGroup>
          <Label for="code">Codigo</Label>
          <Input type="text" name="code" id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="codigo del producto" />
        </FormGroup>
        <FormGroup>
          <Label for="name">Nombre</Label>
          <Input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="nombre del producto" />
        </FormGroup>
        <FormGroup>
          <Label for="details">Descripcion</Label>
          <Input type="textarea" name="details" id="details" value={details} onChange={(e) => setDetails(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="price">Precio</Label>
          <CurrencyInput prefix="$" value={amount} onChange={handleChangeCurrency} />
        </FormGroup>
        <FormGroup>
          <Label for="categoryFile">Imagen</Label>
          <Input type="file" onChange={(ev) => onFileChange(ev)} />
       </FormGroup>
        <Button color="warning">Guardar Informacion</Button>
      </Form>
  </ModalBody>
</Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {loadingData ? (
              <p>Loading Please wait...</p>
            ) : (
               <Table hover columns={columns} data={data} />
            )}
            {dataSize==0 ? (<p style={{fontWeight:'bold',padding:5,color:'red'}}>No records found !!!</p>) : null }
                    
        <Pagination aria-label="Page navigation example" size='sm' style={{float:'right', paddingTop:20}}>
          <PaginationItem >
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

export default Products;

