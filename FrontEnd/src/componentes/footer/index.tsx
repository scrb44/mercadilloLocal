import { Link } from "react-router-dom";
import classes from "./footer.module.css";

function Footer() {
    return (
        <footer className={classes["page-footer"]}>
            <div className={classes["page-footer__container"]}>
                <h2>Mercadillo Local</h2>
                <ul className={classes["page-footer__list"]}>
                    <li>
                        <Link
                            to="/quienes-somos"
                            className={classes["page-header__link"]}
                        >
                            ¿Quiénes somos?
                        </Link>
                    </li>
                    <li>
                        Todas las marcas son propiedad de sus respectivos fabricantes.
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
