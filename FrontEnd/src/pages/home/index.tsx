import Footer from "../../componentes/footer";
import Header from "../../componentes/header";

import classes from "./home.module.css";

function Home() {
    return (
        <>
            <Header />

            <Footer />
            <div className={classes["background-blur"]}></div>
        </>
    );
}

export default Home;
