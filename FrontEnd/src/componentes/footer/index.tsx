import classes from "./footer.module.css";

function Footer() {
    return (
        <footer className={classes["page-footer"]}>
            <div className={classes["page-footer__container"]}>
                <h2>Footer</h2>
                <ul className={classes["page-footer__list"]}>
                    <li>Elemento 1</li>
                    <li>Elemento 2</li>
                    <li>Elemento 3</li>
                    <li>Elemento 4</li>
                    <li>Elemento 5</li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
