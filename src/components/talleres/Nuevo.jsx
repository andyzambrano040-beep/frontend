import React, { useState, useEffect } from "react";
import axios from "axios";
import { url_api } from "../../services/apirest";
import { LetrasNumeros, SoloLetras, SoloNumeros } from "../../utils/validaciones";

const Nuevo = ({ tallerE, onClose, onGuardar, notificacion }) => {
  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    tall_nombre: '',
    tall_direccion: '',
    tall_telefono: '',
    tall_especialidad: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (tallerE) {
      // Si recibimos un cliente, rellenamos el formulario

      setForm({
        tall_nombre: tallerE.tall_nombre,
        tall_direccion: tallerE.tall_direccion,
        tall_telefono: tallerE.tall_telefono,
        tall_especialidad: tallerE.tall_especialidad,
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        tall_nombre: "",
        tall_direccion: "",
        tall_telefono: "",
        tall_especialidad: "",
      });
    }
  }, [tallerE]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (LetrasNumeros(form.tall_nombre) === false) {
      notificacion("El nombre Solo Debe Contener Letras y Números");
      setLoading(false);
      return;
    }

    if (LetrasNumeros(form.tall_direccion) === false) {
      notificacion("La direccion Solo Debe Contener Letras y Números");
      setLoading(false);
      return;
    }
    if (SoloNumeros(form.tall_telefono) === false) {
      notificacion("El telefono Solo Debe Contener Números");
      setLoading(false);
      return;
    }
    if (SoloLetras(form.tall_especialidad) === false) {
      notificacion("La especialidad Solo Debe Contener Letras");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    // Determinar si es POST (crear) o PUT (editar)
    const method = tallerE ? "put" : "post";
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = tallerE
      ? url_api + `talleres/${tallerE.tall_id}`
      : url_api + "talleres";

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si todo sale bien:
      alert(tallerE ? "Cliente actualizado" : "Cliente registrado");
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
      <h3>{tallerE ? "Editar Taller" : "Nuevo Taller"}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Taller</label>
          <input
            type="text"
            name="tall_nombre"
            value={form.tall_nombre}
            onChange={handleChange}
            required
            maxLength="100"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Dirrecion</label>
          <input
            type="text"
            name="tall_direccion"
            value={form.tall_direccion}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Telefono del Taller</label>
          <input
            type="text"
            name="tall_telefono"
            value={form.tall_telefono}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Especialidad</label>
          <input
            type="text"
            name="tall_especialidad"
            value={form.tall_especialidad}
            onChange={handleChange}
            className="form-control"
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

export default Nuevo;
