import React, {Component, useState } from 'react';
import {
  Card,
  CardBody,
  Table,
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
  Form,
  FormGroup,
  FormText, 
  Label,
  Input
} from 'reactstrap';
import axios from 'axios';

const Categories = () => {
  
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  
  /* global File */
  let file = File;
  let img = "image.png";
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  function onFileChange(fileChangeEvent) {
    file = fileChangeEvent.target.files[0];  
    //img = file.name;
    
  }
  
  async function submitForm(){
     try {
       const category = {
         code: code,
         name: name,
         details: details,
         image: file.name,
       }
     const response = await axios.post("http://ec2-3-87-67-179.compute-1.amazonaws.com:3000/categories/create",category);
     console.log(response.data);
     console.log(file);
    
     let formData = new FormData();
    formData.append('photo', file, file.name);
    try {
      /* global fetch */
    const response_file = await fetch("http://ec2-3-87-67-179.compute-1.amazonaws.com:3000/photos/upload",
    {
      method: "POST",
      body: formData,
      enctype: "multipart/form-data",
    });
    if (!response_file.ok) {
      throw new Error(response_file.statusText);
    }
    console.log(response_file);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
   console.log(err);
 }
    
    
  }
  
  return (
    <div>
    <Card>
    <CardBody>
         <Row>
          <Col xs={4}>
            <Card>
              <CardBody>Listado de Categorias</CardBody>
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
                <Button color="primary" onClick={handleShow} block outline><i className="fa fa-plus-circle"></i>&nbsp;&nbsp;Nueva Categoria</Button>
               <Modal isOpen={show} toggle={handleClose} modalTransition={{timeout:500}}>
  <ModalHeader>
    Datos de la nueva categoria
  </ModalHeader>
  <ModalBody>
   <Form onSubmit={submitForm}>
        <FormGroup>
          <Label for="code">Codigo</Label>
          <Input type="text" name="code" id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="codigo de la categoria" />
        </FormGroup>
        <FormGroup>
          <Label for="name">Nombre</Label>
          <Input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="nombre de la categoria" />
        </FormGroup>
        <FormGroup>
          <Label for="details">Descripcion</Label>
          <Input type="textarea" name="details" id="details" value={details} onChange={(e) => setDetails(e.target.value)} />
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
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>
                 <Pagination aria-label="Page navigation example">
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

export default Categories;
