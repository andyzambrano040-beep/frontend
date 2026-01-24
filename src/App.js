import React from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import{ BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DatosVehiculos from './components/Vehiculos/DatosVehiculos';
import DatosTalleres from './components/talleres/DatosTalleres';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

class App extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      NoModal: true,
      idForaneo: "0",
      datoForaneo: "0",
    };
    this.EditarVariable = this.EditarVariable.bind(this);
  }

  EditarVariable(valorid, valorDato) {
    this.setState({
      idForaneo: valorid,
      datoForaneo: valorDato
    });
  }


  notificacion = (mensaje) => {
    const parrafo = document.createElement("P"); //Crea un parrafo
    parrafo.textContent = mensaje; //Asigna texto al parrafo
    //agregar css que he quitado en App.css
    parrafo.style.backgroundColor = "#ca6243";
    parrafo.style.border = "2px solid #10baee";
    parrafo.style.padding = "10px";
    parrafo.style.borderRadius = "8px";
    parrafo.style.boxShadow = "2px 2px 10px rgba(8, 232, 248, 0.3)";
    parrafo.style.marginBottom = "10px";
    parrafo.style.fontWeight = "bold";
    document.querySelector(".notificacion").appendChild(parrafo); //Agregamos a la notificacion un elemento hijo
    // Trigger animation
    setTimeout(() => {
      parrafo.style.transform = "translateX(0)";
    }, 10);
    setTimeout(() => {
      //Quita el parrafo despues de unos segundos
      parrafo.remove();
    }, 2000);
  };

  render() {
    return (
      
      <div className="App">
        <div className='notificacion'></div>
            <Router>
              <Routes>
               <Route path='/' element={<Login/>} />
              <Route path='/datosvehiculos' element={<DatosVehiculos notificacion={this.notificacion} />} />
              <Route path='/datosTalleres' element={<DatosTalleres notificacion={this.notificacion} />} />
               <Route path='/dashboard' element={<Dashboard/>} />
              </Routes>
            </Router>
      </div>
    );
  }
}

export default App;


