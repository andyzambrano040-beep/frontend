//Validacion de vehiculo
   export const placaVehi = (texto) => {
    let placaRegex = /^[A-Z]{3}-[0-9]{3,4}$/i;
    if (placaRegex.test(texto)) {
      return true;
    } else {
      return false;
    }
  };

   export const colorVehi = (texto) => {
    let colorRegex = /^[a-z]+$/i;
    if (colorRegex.test(texto)) {
      return true;
    } else {
      return false;
    }
  }

   export const marcaVehi = (texto) => {
    let marcaRegex = /^[a-zA-Z\s]+$/;
    if (marcaRegex.test(texto) && texto.trim().length > 0) {
      return true;
    } else {
      return false;
    }
  };

   export const modeloVehi = (texto) => {
    let modeloRegex = /^[a-zA-Z0-9\s]+$/;
    if (modeloRegex.test(texto) && texto.trim().length > 0) {
      return true;
    } else {
      return false;
    }
  };

   export const anioVehi = (numero) => {
    let anioActual = new Date().getFullYear();
    if (typeof numero === 'string') {
      numero = parseInt(numero);
    }
    if (Number.isInteger(numero) && numero >= 1900 && numero <= anioActual) {
      return true;
    } else {
      return false;
    }
  };

   export const propIdVehi = (id) => {
    if (typeof id === 'number' && id > 0 && Number.isInteger(id)) {
      return true;
    } else {
      return false;
    }
  };
  