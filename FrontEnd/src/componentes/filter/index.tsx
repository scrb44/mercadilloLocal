import { useState } from "react";
import classes from "./filter.module.css";

function Filter() {
    let [searchName, setSearchName] = useState("");

    return (
        <nav className={classes["page-searcher"]}>
            <input
                type="search"
                name="search"
                placeholder="Barra de busqueda"
                className={classes["page-searcher__search-bar"]}
                onChange={(a) => setSearchName(a.target.value)}
            />
        </nav>
    );
}

export default Filter;
