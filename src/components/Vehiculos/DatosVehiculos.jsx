import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url_api } from "../../services/apirest";
import FormularioVehiculos from "./FormularioVehiculos.jsx";
import { confirm } from "../Confirmation";
import Header from "../Header";
import modal from "../../css/Modal.css";
import DatosPropietatios from "../propietarios/DatosPropietarios.jsx";

class DatosVehiculos extends React.Component {
  state = {
    registros: [],
    paginaActual: 1,
    cadenaDeBusqueda: "",
    token: localStorage.getItem("token"),
    total_paginas: 0,
    mostrarModal: false,
    vehiculoSeleccionado: null,
    mostrarModalWin: false,
  };

  componentDidMount = () => {
    this.cargarDatos();
  };

  abrirModal = () => {
    this.setState({ mostrarModalWin: true });
  };

  cerrarModalWin = () => {
    this.setState({ mostrarModalWin: false });
  };

  mostrarModalNuevo = () => {
    const {EditarVariable}  = this.props;
    EditarVariable("", "");
    this.setState({
      mostrarModal: true,
      vehiculoSeleccionado: null,
    });
  };

  mostrarModalEditar = (value) => {
    const { EditarVariable } = this.props;
    EditarVariable(value.vehi_id, value.prop_nombre);
    this.setState({
      mostrarModal: true,
      vehiculoSeleccionado: value,
    });
  };

  cerrarModal = () => {
    this.setState({ mostrarModal: false, vehiculoSeleccionado: null });
  };

  alGuardar = () => {
    this.cargarDatos();
    this.cerrarModal();
  };

  cargarDatos = () => {
    // Obtenemos el token directamente del storage por si el del state expiró
    //const tokenActual = localStorage.getItem('token');

    let url =
      url_api +
      "vehiculos?page=" +
      this.state.paginaActual +
      "&cadena=" +
      this.state.cadenaDeBusqueda;
    //console.log("URL de datos de vehículos:", url); // Depuración
    //console.log("Token de autorización:", this.state.token); // Depuración
    axios
      .get(url, { headers: { Authorization: `Bearer ${this.state.token}` } })
      .then((response) => {
        this.setState({
          registros: response.data.data,
          total_paginas: response.data.totalPages,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Función eliminar
  eliminar = async (id, placa) => {
    const notificacion = this.props.notificacion;
    if (
      await confirm(
        `¿Estás seguro de eliminar el vehículo con placa: ${placa}?`,
      )
    ) {
      let url = url_api + "vehiculos/" + id;
      axios
        .delete(url, {
          headers: { Authorization: `Bearer ${this.state.token}` },
        })
        .then(() => {
          this.cargarDatos(); // Recargar la tabla tras borrar
        })
        .catch((error) => {
          notificacion(
            error.response.data.error || "Error al eliminar: " + error,
          );
        });
    }
  };

  PaginaSiguiente = () => {
    if (this.state.paginaActual < this.state.total_paginas) {
      this.setState({ paginaActual: this.state.paginaActual + 1 }, () => {
        this.cargarDatos();
      });
    }
  };

  PaginaAnterior = () => {
    if (this.state.paginaActual > 1) {
      this.setState({ paginaActual: this.state.paginaActual - 1 }, () => {
        this.cargarDatos();
      });
    }
  };

  buscarTexto = (e) => {
    if (e.key === "Enter") {
      this.setState({ paginaActual: 1 }, () => {
        this.cargarDatos();
      });
    }
  };

  manejadorBusqueda = (e) => {
    this.setState({ cadenaDeBusqueda: e.target.value });
  };

  render() {
    return (
      <div>
        <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
          <Header />
          <h1>Datos de vehículos</h1>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-success"
              onClick={this.mostrarModalNuevo}
            >
              Nuevo registro
            </button>
            <input
              type="text"
              placeholder="Busqueda por placa, marca o modelo..."
              className="form-control"
              value={this.state.cadenaDeBusqueda}
              onChange={this.manejadorBusqueda}
              onKeyDown={this.buscarTexto}
              style={{ width: "300px" }}
            />
          </div>

          <table
            className="table table-hover shadow-sm mt-4"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th>ID</th>
                <th>Placa</th>
                <th>Color</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Propietarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.registros.map((value, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <th scope="row">{value.vehi_id}</th>
                  <td>{value.vehi_placa}</td>
                  <td>{value.vehi_color}</td>
                  <td>{value.vehi_marca}</td>
                  <td>{value.vehi_modelo}</td>
                  <td>{value.vehi_anio}</td>
                  <td>{value.prop_nombre}</td>
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
                        onClick={() =>
                          this.eliminar(
                            value.vehi_id,
                            value.vehi_placa + " " + value.vehi_marca,
                          )
                        }
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
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={this.PaginaAnterior}
            >
              Anterior
            </button>
            <span className="badge bg-light text-dark p-2 border">
              Página {this.state.paginaActual} de {this.state.total_paginas}
            </span>
            <button
              className="btn btn-outline-secondary ms-2"
              onClick={this.PaginaSiguiente}
            >
              Siguiente
            </button>
          </div>

          {/* Modal */}
          {this.state.mostrarModal && (
            <div className="modal-overlay" style={modalStyles.Overlay}>
              <div
                className="modal-content shadow-lg"
                style={modalStyles.content}
              >
                <FormularioVehiculos
                  vehiculoAEditar={this.state.vehiculoSeleccionado}
                  onClose={this.cerrarModal}
                  onGuardar={this.alGuardar}
                  notificacion={this.props.notificacion}
                  abrirModal={this.abrirModal}
                  datoForaneo={this.props.datoForaneo}
                  idForaneo={this.props.idForaneo}
                />
              </div>
            </div>
          )}
          {this.state.mostrarModalWin && (
            <div className="modal">
              <div className="contenido-modal">
                <span className="close" onClick={this.cerrarModalWin}>
                  &times;
                </span>
                <DatosPropietatios
                  EditarVariable={this.props.EditarVariable}
                  cerrarModal={this.cerrarModalWin}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const modalStyles = {
  Overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(88, 131, 125, 0.7)",
    display: "flex",
    justifyContent: "center", // Corregido: justifyContent
    alignItems: "center", // Corregido: alignItems
    zIndex: 100,
  },
  content: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
};

function ContenedorNavegacion(props) {
  let navigate = useNavigate();
  return <DatosVehiculos {...props} navigate={navigate} />;
}

export default ContenedorNavegacion;
