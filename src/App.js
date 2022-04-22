import React, {useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {

  const baseUrl='colocar aqui la url'; /* ACA VA EL ENDPOINT DE CADETES */
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [cadeteSeleccionado, setCadeteSeleccionado]=useState({
    id:'',
    nombre: '',
    apellido: '',
    cuit: '',
    telefono: ''
  })

  const handleChange=e=>{
    const{name,value}=e.target;
setCadeteSeleccionado({
  ...cadeteSeleccionado,
  [name]: value
});
console.log(cadeteSeleccionado); /* ELIMINAR ESTO, ES SOLO PARA VER LO QUE MANDAMOS A LA API */
}

const abrirCerrarModalInsertar=()=>{
 setModalInsertar(!modalInsertar);
}

const abrirCerrarModalEditar=()=>{
  setModalEditar(!modalEditar);
 }

 const abrirCerrarModalEliminar=()=>{
  setModalEliminar(!modalEliminar);
 }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error); /* ESTO TMB DEBERIAMOS ELIMINARLO? */
    })
  }

  const peticionPost=async()=>{
    delete cadeteSeleccionado.id;
    await axios.post(baseUrl, cadeteSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);/* ESTO TMB DEBERIAMOS ELIMINARLO? */
    })
  }

  const peticionPut=async()=>{   
    await axios.put(baseUrl+"/"+cadeteSeleccionado.id, cadeteSeleccionado)
    .then(response=>{
      var respuesta = response.data
      var dataAuxiliar = data;
      dataAuxiliar.map(cadete=>{
        if(cadete.id===cadeteSeleccionado.id){
          cadete.nombre=respuesta.nombre;
          cadete.apellido=respuesta.apellido;
          cadete.cuit=respuesta.cuit;
          cadete.telefono=respuesta.telefono;
        }
      })
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{   
    await axios.delete(baseUrl+"/"+cadeteSeleccionado.id)
    .then(response=>{
    setData(data.filter(cadete=>cadete.id!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }


  const seleccionarCadete=(cadete,caso)=>{
    setCadeteSeleccionado(cadete);
    (caso==='Editar')?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className="App">
      <br></br>
      <button onClick={()=>abrirCerrarModalInsertar()} className='btn btn-success'>Crear nuevo</button>
      <br></br>
      <table className='table table-boardered'> 
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>CUIT</th>
          <th>Telefono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(gestor=>( /* VERIFICAR Y CAMBIAR POR LOS NOMBRES DE LOS CAMPOS DE LA TABLA*/
          <tr key={gestor.id}>
            <td>{gestor.id}</td>
            <td>{gestor.nombre}</td>
            <td>{gestor.apellido}</td>
            <td>{gestor.cuit}</td>
            <td>{gestor.telefono}</td>
            <td>
              <button className='btn btn-primary' onClick={()=>seleccionarCadete(cadete, "Editar")}>Editar</button> {"  "}
              <button className='btn btn-danger'onClick={()=>seleccionarCadete(cadete, "Eliminar")}>Eliminar</button> 
            </td>
          </tr>
        ))}

      </tbody>
      
      </table>
      

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Cadete</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre: </label>
            <br />
            <input type='text' className='form-control' name='nombre' onChange={handleChange}/>
            <br />
            <label>Apellido: </label>
            <br />
            <input type='text' className='form-control' name='apellido' onChange={handleChange}/>
            <br />
            <label>CUIT: </label>
            <br />
            <input type='number' className='form-control' name='cuit' onChange={handleChange}/>
            <br />
            <label>Telefono: </label>
            <br />
            <input type='number' className='form-control' name='telefono' onChange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionPost()} >Insert</button> {"  "}
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Cadete</ModalHeader>
        <ModalBody>
          <div className='form-group'>
          <label>ID: </label>
            <br />
            <input type='text' className='form-control' readOnly value={cadeteSeleccionado && cadeteSeleccionado.id}/>
            <br />
            <label>Nombre: </label>
            <br />
            <input type='text' className='form-control' name='nombre' onChange={handleChange} value={cadeteSeleccionado && cadeteSeleccionado.nombre}/>
            <br />
            <label>Apellido: </label>
            <br />
            <input type='text' className='form-control' name='apellido' onChange={handleChange} value={cadeteSeleccionado && cadeteSeleccionado.apellido}/>
            <br />
            <label>CUIT: </label>
            <br />
            <input type='number' className='form-control' name='cuit' onChange={handleChange} value={cadeteSeleccionado && cadeteSeleccionado.cuit}/>
            <br />
            <label>Telefono: </label>
            <br />
            <input type='number' className='form-control' name='telefono' onChange={handleChange} value={cadeteSeleccionado && cadeteSeleccionado.telefono}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionPut()}>Editar</button> {"  "}
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
         Esta seguro que desea eliminar el cadete {cadeteSeleccionado && cadeteSeleccionado.nombre} ?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={()=>peticionDelete()}>Si</button>
          <button className='btn btn-secondary' onClick={()=>abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>

    
    </div>
  );
}

export default App;
