import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../services/apirest";
import Nuevo from "./Nuevo";
import { confirm } from "../Confirmation";

class DatosPropietarios extends React.Component {
  searchTimeout = null;
  //codigo javasctit
  state = {
    registros: [],
    paginaActual: 1,
    cadenaDeBusqueda: "",
    searchText: "",
    token: localStorage.getItem('token'),
    total_paginas: 0,
    mostrarModal: false,
    propietarioSeleccionado: null
  };
  componentDidMount = () => {
    this.cargarDatos();
  };
  mostrarModalNuevo = () => {
    this.setState({
      mostrarModal: true,
      propietarioSeleccionado: null
    })
  };
  mostrarModalEditar = (prop) => {
    this.setState({
      mostrarModal: true,
      propietarioSeleccionado: prop
    })
  };
  cerrarModal = () => {
    this.setState({ mostrarModal: false })
  };
  alGuardar = () => {
    this.cargarDatos() //recargar la tabla
    this.cerrarModal() //cerramos la ventana modal
  };
  cargarDatos = () => {
    const cadena = encodeURIComponent(this.state.cadenaDeBusqueda || '');
    const url = API_URL + "propietarios?page=" + this.state.paginaActual + "&cadena=" + cadena;
    console.log('[cargarDatos] solicitar URL:', url, 'cadenaDeBusqueda:', this.state.cadenaDeBusqueda);

    axios
      .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
      .then(response => {
        console.log('[cargarDatos] respuesta recibida:', response.data);
        let registros = response.data.data || [];
        // Si el backend no aplicó el filtro por nombre, aplicar filtro cliente sobre los registros recibidos
        if (this.state.cadenaDeBusqueda && this.state.cadenaDeBusqueda.trim() !== '') {
          const q = this.state.cadenaDeBusqueda.toLowerCase();
          registros = registros.filter(r => (r.prop_nombre || '').toLowerCase().includes(q));
        }
        this.setState({
          //registros: response.data.data,
          registros: registros,
          total_paginas: response.data.totalPages
        });
      })
      .catch((error) => {
        console.error('[cargarDatos] error:', error);
      });
  };

  paginaSiguiene = () => {
    if (this.state.paginaActual < this.state.total_paginas) {
      this.setState(
        { paginaActual: this.state.paginaActual + 1 },
        () => { this.cargarDatos(); }
      )
    }

  }

  paginaAtras = () => {
    if (this.state.paginaActual > 1) {
      this.setState(
        { paginaActual: this.state.paginaActual - 1 },
        () => { this.cargarDatos(); }
      )
    }
  }

  handleSearchChange = (e) => {
    const v = e.target.value;
    // actualizar input inmediatamente
    this.setState({ searchText: v });
    console.log('[Busqueda] input change:', v);

    // limpiar cualquier timeout previo
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    // si quedó vacío, ejecutar búsqueda inmediata para limpiar filtro
    if (!v || v.trim() === '') {
      this.setState({ cadenaDeBusqueda: '' , paginaActual: 1}, () => { this.cargarDatos(); });
      return;
    }

    // debounce: ejecutar búsqueda automática 600ms después de dejar de teclear
    this.searchTimeout = setTimeout(() => {
      this.doSearch();
    }, 600);
  }

  handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.doSearch();
    }
  }

  doSearch = () => {
    console.log('[Busqueda] ejecutar search:', this.state.searchText);
    // clear timeout if any
    if (this.searchTimeout) { clearTimeout(this.searchTimeout); this.searchTimeout = null; }
    this.setState({ paginaActual: 1, cadenaDeBusqueda: this.state.searchText }, () => {
      this.cargarDatos();
    });
  }

  clearSearch = () => {
    if (this.searchTimeout) { clearTimeout(this.searchTimeout); this.searchTimeout = null; }
    this.setState({ searchText: '', cadenaDeBusqueda: '' , paginaActual: 1}, () => { this.cargarDatos(); });
  }

  componentWillUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }
  irNuevo = () => {
    this.props.navigate('/nuevo')
  }

  // Función eliminar
  eliminar = async (prop_id, prop_nombre) => {
    const notificacion = this.props.notificacion;
    if (await confirm(`¿Estás seguro de eliminar el propietario con nombre: ${prop_nombre}?`)) {
      let url = API_URL + "propietarios/" + prop_id;
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
        <div className="col-10 position-absolute top-30 start-50 translate-middle-x">

          <h1>Datos de Propietarios</h1>
          <button className="btn btn-primary" onClick={this.mostrarModalNuevo}>Nuevo registro</button>
          <input
            type="text"
            placeholder={"Busqueda por Nombre del Propietario"}
            value={this.state.searchText}
            onChange={this.handleSearchChange}
            onKeyDown={this.handleSearchKeyDown}
            style={{ marginLeft: "10px", textAlign: "center", width: "320px" }}
          />
          <button className="btn btn-light" onClick={this.clearSearch} style={{ marginLeft: "6px" }}>Limpiar</button>
          <div style={{ display: 'inline-block', marginLeft: '12px', fontSize: '12px', color: '#444' }}>Buscando: <strong>{this.state.cadenaDeBusqueda}</strong></div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Cedula</th>
                <th scope="col">Nombre</th>
                <th scope="col">Telefono</th>
                <th scope="col">Direccion</th>
                <th scope="col">UserID</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.registros.map((value, index) => {
                //Recorrer los registros
                return (
                  // prop_id
                  // prop_cedula
                  // prop_nombre
                  // prop_telefono
                  // prop_direccion
                  // user_id
                  <tr key={index}>
                    <th scope="row">{value.prop_id}</th>
                    <td>{value.prop_cedula}</td>
                    <td>{value.prop_nombre}</td>
                    <td>{value.prop_telefono}</td>
                    <td>{value.prop_direccion}</td>
                    <td>{value.user_id}</td>
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
                        onClick={() => this.eliminar(value.prop_id, value.prop_nombre)}
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
          <input type="text" readOnly value={this.state.paginaActual + " de " + this.state.total_paginas} 
            style={{ marginRight: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }} />
          <button type="button" className="btn btn-secondary" onClick={this.paginaSiguiene}>Siguiente</button>
        </div>
        {this.state.mostrarModal && (
          <div className="modal-Overlay" style={modalStyles.Overlay}>
            <div className="modal-content" style={modalStyles.content}>
              <Nuevo propietarioE={this.state.propietarioSeleccionado} 
              onClose={this.cerrarModal} 
              onGuardar={this.alGuardar} 
              notificacion={this.props.notificacion}
              />
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
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
},

content: {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '10px',
  maxWidth: '720px',
  width: '90%',
  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  maxHeight: '90vh',
  overflowY: 'auto'
}
}

function ContenedorNavegacion(props) {
  let navigate = useNavigate();
  return <DatosPropietarios {...props} navigate={navigate} />;
}
export default ContenedorNavegacion;
