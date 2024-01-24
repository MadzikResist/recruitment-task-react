import './navbar.css'
import {Link} from "react-router-dom";

const Navbar = ({ simpleVersion }) => {
    const navContainerClass = simpleVersion ? 'navContainerSimple' : 'navContainer'
    return(
        <div className={navContainerClass}>
            <Link to={`/`} className="linkStyle">
                <div className="navButtons">Simple Version</div>
            </Link>
            <Link to={`/virtualized`} className="linkStyle">
                <div className="navButtons">Virtualized Version</div>
            </Link>
        </div>
    )

}
export default Navbar