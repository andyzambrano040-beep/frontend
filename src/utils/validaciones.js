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
export const LetrasNumeros = (texto) => {
  let NomApeRegex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9+\-.\s]+$/;
  return NomApeRegex.test(texto);
}

// Valida que el texto contenga solo letras (incluye acentos, Ñ y espacios)
export const SoloLetras = (texto) => {
  let letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/;
  return letrasRegex.test(texto);
}

// Valida que el texto contenga solo números (dígitos)
export const SoloNumeros = (texto) => {
  let numerosRegex = /^\d+$/;
  return numerosRegex.test(texto);
}

export const soloLetras = (texto) => {
  let NomApeRegex = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
  if (NomApeRegex.test(texto)) {
    return true;
  } else {
    return false;
  }
};
export const validarNumeros = (numero) => {
  const regex = /^[0-9]\d*$/;
  if (regex.test(numero)) {
    return true;
  } else {
    return false;
  }
};
