import Footer from "../../componentes/footer";
import Header from "../../componentes/header";

import classes from "./home.module.css";

function Home() {
    return (
        <div className={classes["home"]}>
            <Header />
            <main>
                <p>Contenido</p>
            </main>

            <div className={classes["spacer"]}></div>
            <Footer />
        </div>
    );
}

export default Home;
