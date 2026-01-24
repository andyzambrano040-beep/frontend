import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <center>
        <Link to="/datosvehiculos">
          <Button style={{ margin: "10px" }}>Vehículos</Button>
        </Link>
        <Link to="/datostalleres">
          <Button style={{ margin: "10px" }}>Talleres</Button>
        </Link>
        <Link to="/datospersonas">
          <Button>Propietarios</Button>
        </Link>
      </center>
    </div>
  );
}

export default Header;