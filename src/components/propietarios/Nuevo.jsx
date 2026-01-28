import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { url_api } from "../../services/apirest";
import { soloLetras, validarNumeros } from '../../utils/validaciones';


const Nuevo = ({ propietarioE, onClose, onGuardar, notificacion }) => {

  // 1. Estado del formulario
  const [form, setForm] = useState({
    prop_cedula: '', 
    prop_nombre: '', 
    prop_telefono: '', 
    prop_direccion: '',
    user_id: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (propietarioE) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        prop_cedula: propietarioE.prop_cedula,
        prop_nombre: propietarioE.prop_nombre,
        prop_telefono: propietarioE.prop_telefono,
        prop_direccion: propietarioE.prop_direccion,
        user_id: propietarioE.user_id,
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
         prop_cedula: '', prop_nombre: '', prop_telefono: '', prop_direccion: '', user_id: '',
      });
    }
  }, [propietarioE]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // validación simple usando utilidades en src/utils/validaciones.js


  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

if (soloLetras(form.prop_nombre) === false) {
      setError('El nombre solo debe contener letras y espacios.');
      setLoading(false);
      return;
    }
    if (validarNumeros(form.prop_telefono) === false) {
      setError('El teléfono debe contener solo números.');
      setLoading(false);
      return;
    }
    if (validarNumeros(form.user_id) === false) {
      setError('El ID de usuario debe contener solo números.');
      setLoading(false);
      return;
    }
    if (validarNumeros(form.prop_cedula) === false || form.prop_cedula.length !== 10) {
      setError('La cédula debe contener solo números y tener 10 dígitos.');
      setLoading(false);
      return;
    }
    if (form.prop_direccion.length > 100) {
      setError('La dirección no debe exceder los 100 caracteres.');
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem('token');
    
    // Determinar si es POST (crear) o PUT (editar)
    const method = propietarioE ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = propietarioE 
        ? url_api + `propietarios/${propietarioE.prop_id}`
        : url_api + 'propietarios';

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      alert(propietarioE ? 'Propietario actualizado' : 'Propietario registrado');
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose();   // Cerramos el modal

    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container" style={{ position: 'relative', minWidth: '320px', width: '520px', maxWidth: '95vw', fontFamily: 'Segoe UI, Roboto, Arial', color: '#222' }}>
      <h3>{propietarioE ? 'Editar Propietario' : 'Nuevo Propietario'}</h3>
      
      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* contenedor para notificaciones dentro del formulario */}
        <div className="notificacion" style={{ position: 'relative', marginBottom: '10px', display: 'flex', justifyContent: 'center', zIndex: 2001 }}></div>
        <div className="form-group">
          <label>Cedula</label>
          <input 
            type="text" name="prop_cedula" value={form.prop_cedula} onChange={handleChange} 
            required maxLength="10" 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Nombre del Propietario</label>
          <input 
            type="text" name="prop_nombre" value={form.prop_nombre} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Telefono</label>
          <input 
            type="text" name="prop_telefono" value={form.prop_telefono} onChange={handleChange} 
            required 
            maxLength="10"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Direccion</label>
          <input 
            type="text" name="prop_direccion" value={form.prop_direccion} onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>ID usuario</label>
          <input 
            type="text" name="user_id" value={form.user_id} onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="botones-accion" style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Nuevo;
