import classes from "./header.module.css";

function Header() {
    return (
        <header className={classes["page-header"]}>
            <h1>Mercadillo Local</h1>

            <ul className={classes["page-header__list"]}>
                <li>¿Quienes somos?</li>
                <li>Perfil</li>
                <li className={classes["page-header__cart"]}>Carrito (0)</li>
            </ul>
        </header>
    );
}

export default Header;
