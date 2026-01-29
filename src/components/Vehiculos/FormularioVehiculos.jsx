import React, { useState, useEffect } from "react";
import axios from "axios";
import { url_api } from "../../services/apirest";
import { placaVehi, colorVehi, marcaVehi, modeloVehi, anioVehi, propIdVehi} from "../../utils/validaciones";

const FormularioVehiculos = ({ vehiculoAEditar, onClose, onGuardar, notificacion, abrirModal, datoForaneo, idForaneo }) => {
  

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    vehi_placa: "",
    vehi_color: "",
    vehi_marca: "",
    vehi_modelo: "",
    vehi_anio: "",
    prop_id: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (vehiculoAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...vehiculoAEditar,
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        vehi_placa: "",
        vehi_color: "",
        vehi_marca: "",
        vehi_modelo: "",
        vehi_anio: "",
        prop_id: "",
      });
    }
  }, [vehiculoAEditar]);

  useEffect(() => {
    // Si idForaneo tiene un valor real (no es vacío ni "0")
    if (idForaneo && idForaneo !== "0") {
      setForm(estadoAnterior => ({
        ...estadoAnterior,
        prop_id: idForaneo // Actualizamos el ID interno del formulario
      }));
    }
  }, [idForaneo]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    console.log(form)
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validar la placa antes de enviar
    if (!placaVehi(form.vehi_placa)) {
      notificacion("Placa inválida");
      setLoading(false);
      return;
    }
    if (!colorVehi(form.vehi_color)) {
      notificacion("Color inválido");
      setLoading(false);
      return;
    }
    if (!marcaVehi(form.vehi_marca)) {
      notificacion("Marca inválida");
      setLoading(false);
      return;
    }
    if (!modeloVehi(form.vehi_modelo)) {
      notificacion("Modelo inválido");
      setLoading(false);
      return;
    }
    if (!anioVehi(form.vehi_anio)) {
      notificacion("Año inválido");
      setLoading(false);
      return;
    }
    if (!propIdVehi(form.prop_id)) {
      notificacion("ID de Propieterio inválido");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    // Determinar si es POST (crear) o PUT (editar)
    const method = vehiculoAEditar ? "put" : "post";
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = vehiculoAEditar
      ? url_api + `vehiculos/${vehiculoAEditar.vehi_id}`
      : url_api + "vehiculos";

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si todo sale bien:
      notificacion(vehiculoAEditar ? "Vehiculo actualizado" : "Vehiculo registrado");
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose(); // Cerramos el modal
    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Error al guardar");
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{vehiculoAEditar ? "Editar Vehiculo" : "Nuevo Vehiculo"}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Placa:</label>
          <input
            type="text"
            name="vehi_placa"
            value={form.vehi_placa}
            onChange={handleChange}
            required
            maxLength="10"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Color:</label>
          <input
            type="text"
            name="vehi_color"
            value={form.vehi_color}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Marca:</label>
          <input
            type="text"
            name="vehi_marca"
            value={form.vehi_marca}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Modelo:</label>
          <input
            type="text"
            name="vehi_modelo"
            value={form.vehi_modelo}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Año:</label>
          <input
            type="text"
            name="vehi_anio"
            value={form.vehi_anio}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Propieterio:</label>
          <input
            type="text" name="propieterio" value={datoForaneo} onClick={abrirModal}
            className="form-control"
          />
        </div>

        <div className="form-group">
          
          <input
            type="text"
            name="prop_id"
            value={form.prop_id}
            onChange={handleChange}
            className="form-control" hidden
          />
        </div>

        <div className="botones-accion" style={{ marginTop: "15px" }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ marginLeft: "10px" }}
            
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioVehiculos;
