import Image from "next/image";
import styles from "../styles/loader.module.css";

export default function Loader() {
    return (
        <div className={styles.container}>
            <Image 
                src="/Gif-rick.gif" 
                alt="Carregando" 
                width={200} 
                height={200} 
                className={styles.image} 
                loading="lazy"
            />
            <h1 className={styles.message}>Carregando</h1>
        </div>
    );
}