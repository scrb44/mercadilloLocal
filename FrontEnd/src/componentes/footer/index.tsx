import classes from "./footer.module.css";

function Footer() {
    return (
        <footer className={classes["page-footer"]}>
            <div className={classes["page-footer__container"]}>
                <h2>Mercadillo Local</h2>
                <ul className={classes["page-footer__list"]}>
                    <li>Todos los derechos reservados.</li>
                    <li>Todas las marcas son propiedad de sus respectivos fabricantes.</li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
