import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url_api } from "../../services/apirest";
import Nuevo from "./Nuevo";
import { confirm } from "../Confirmation";
import Headers from "../Header";


class DatosTalleres extends React.Component {
  //codigo javasctit
  state = {
    registros: [],
    paginaActual: 1,
    cadenaDeBusqueda: "",
    token: localStorage.getItem('token'),
    total_paginas: 0,
    mostrarModal: false,
    tallerSelecionado: null
  };
  componentDidMount = () => {
    this.cargarDatos();
  };

  mostrarModalNuevo = () => {
    this.setState({
      mostrarModal: true,
      tallerSelecionado: null
    })
  }
  mostrarModalEditar = (tall_id) => {
    this.setState({
      mostrarModal: true,
      tallerSelecionado: tall_id
    })
  }
  // eliminar = (tall_id) => {
  //   this.setState({
  //     mostrarModal: true,
  //     tallerSelecionado: tall_id
  //   })
  //   }
  cerrarModal = () => {
    this.setState({mostrarModal: false})
  }
  alGuardar = () => {
    this.cargarDatos() //recargar la tabla
    this.cerrarModal() //cerramos la ventana modal
  }

  cargarDatos = () => {
    let url = url_api + "talleres?page=" + this.state.paginaActual + "&cadena=" + this.state.cadenaDeBusqueda;
    // console.log(this.state.token);

    axios
      .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
      .then(response => {
        this.setState({
          registros: response.data.data,
          total_paginas: response.data.totalPages
        });
      })
      .catch((error) => {
      });
  }


  paginaSiguiene = () => {
    if (this.state.paginaActual < this.state.total_paginas) {
      this.setState(
        { paginaActual: this.state.paginaActual + 1 },
        () => { this.cargarDatos(); }
      )
    }

  }


  paginaAtras = () => {
    if (this.state.paginaActual  >1) {
      this.setState(
        { paginaActual: this.state.paginaActual - 1 },
        () => { this.cargarDatos(); }
      )
    }
  }

  BusquedaTexto = async e => {
    if (e.charCode === 13) {
      this.setState({
        paginaActual: 1,
        cadenaDeBusqueda: e.target.value
      }, () => { this.cargarDatos() })
    }
  }
   irNuevo = ()=> {
    this.props.navigate('/nuevo')
   }
   // Función eliminar
  eliminar = async (tall_id, tall_nombre) => {
    const notificacion = this.props.notificacion;
    if (await confirm(`¿Estás seguro de eliminar el taller con nombre: ${tall_nombre}?`)) {
      let url = url_api + "talleres/" + tall_id;
      axios
        .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
        .then(() => {
          this.cargarDatos(); // Recargar la tabla tras borrar
        })
        .catch((error) => {
          notificacion( error.response.data.error || 'Error al eliminar: ' + error );
        });
    }
  };

  render() {
    return (
      <div>
        <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
          <Header />
          <h1>Datos de talleres</h1>
          <button className="btn btn-success" onClick={this.mostrarModalNuevo}> Nuevo registro</button>
          <input type="text" placeholder={"Busqueda por Nombre del Taller"} onKeyPress={this.BusquedaTexto} style={{ marginLeft: "10px", textAlign: "center", width: "400px" }} />
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Taller Nombre</th>
                <th scope="col">Direccion</th>
                <th scope="col">Telefono</th>
                <th scope="col">Especialidad</th>
              </tr>
            </thead>
            <tbody>
              {this.state.registros.map((value, index) => {
                //Recorrer los registros
                return (
                  <tr key={index}>
                    <th scope="row">{value.tall_id}</th>
                    <td>{value.tall_nombre}</td>
                    <td>{value.tall_direccion}</td>
                    <td>{value.tall_telefono}</td>
                    <td>{value.tall_especialidad}</td>
                    <td>
                      <svg
                        onClick={() => this.mostrarModalEditar(value)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#007aff"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                      </svg>

                      <svg
                        onClick={() => this.eliminar(value.tall_id, value.tall_nombre)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff2d55"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button type="button" className="btn btn-secondary" onClick={this.paginaAtras}>Anterior</button>
          <input type="text" readOnly value={this.state.paginaActual + " de " + this.state.total_paginas} style={{ marginRight: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }} />
          <button type="button" className="btn btn-secondary" onClick={this.paginaSiguiene}>Siguiente</button>
        </div>

        {this.state.mostrarModal && (
          <div className="modal-Overlay" style={modalStyles.Overlay}>
            <div className="modal-content" style={modalStyles.content}>
              <Nuevo tallerE={this.state.tallerSelecionado} onClose={this.cerrarModal} onGuardar={this.alGuardar} notificacion ={this.props.notificacion} />
            </div>
          </div>
        )}
      </div>
    );
  }
}


const modalStyles = {
  Overlay: {
  position:'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom:0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display:'flex',
  justifyContent: 'center',
  alignItems:'center',
  zIndex: 1000
},

content: {
  backgroundColor:'#fff',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto'

}
}
function ContenedorNavegacion(props) {
  let navigate = useNavigate();
  return <DatosTalleres {...props} navigate={navigate} />;
}
export default ContenedorNavegacion;


