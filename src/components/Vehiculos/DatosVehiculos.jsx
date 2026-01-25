import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url_api } from "../../services/apirest";
import FormularioVehiculos from "./FormularioVehiculos";
import { confirm } from "../Confirmation";
import Header from "../Header";

class DatosVehiculos extends React.Component {
  state = {
    registros: [],
    paginaActual: 1,
    cadenaDeBusqueda: "",
    token: localStorage.getItem("token"),
    total_paginas: 0,
    mostrarMoadal: false,
    vehiculoSeleccionado: null,
  };

  componentDidMount = () => {
    this.cargarDatos();
  };

  mostrarMoadalNuevo = () => {
    this.setState({
      mostrarMoadal: true,
      vehiculoSeleccionado: null,
    });
  };

  mostrarMoadalEditar = (vehiculo) => {
    this.setState({
      mostrarMoadal: true,
      vehiculoSeleccionado: vehiculo, // Pasamos el objeto completo del vehículo
    });
  };

  cerrarModal = () => {
    this.setState({ mostrarMoadal: false, vehiculoSeleccionado: null });
  };

  alGurdar = () => {
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
              onClick={this.mostrarMoadalNuevo}
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

          <table className="table table-hover shadow-sm mt-4">
            <thead className="table-dark">
              <tr>
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
                <tr key={index}>
                  <th scope="row">{value.vehi_id}</th>
                  <td>{value.vehi_placa}</td>
                  <td>{value.vehi_color}</td>
                  <td>{value.vehi_marca}</td>
                  <td>{value.vehi_modelo}</td>
                  <td>{value.vehi_anio}</td>
                  <td>{value.prop_nombre}</td>
                  <td>
                    {/* Icono Editar */}
                    <button
                      className="btn btn-link p-0 me-2"
                      onClick={() => this.mostrarMoadalEditar(value)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#007aff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    {/* Icono Eliminar */}
                    <button
                      className="btn btn-link p-0"
                      onClick={() =>
                        this.eliminar(
                          value.vehi_id,
                          value.vehi_placa + "" + value.vehi_marca,
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff2d55"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
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
          {this.state.mostrarMoadal && (
            <div className="modal-overlay" style={modalStyles.Overlay}>
              <div
                className="modal-content shadow-lg"
                style={modalStyles.content}
              >
                <FormularioVehiculos
                  vehiculoAEditar={this.state.vehiculoSeleccionado}
                  onClose={this.cerrarModal}
                  onGuardar={this.alGurdar}
                  notificacion={this.props.notificacion}
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
