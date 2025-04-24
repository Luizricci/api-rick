import styles from '../styles/characterCard.module.css';
import Image from 'next/image';

export default function CharacterCard( {character, onClick} ) {
    return(
        <div className={styles.card} onClick={onClick}> 
            <Image
                src={character.image}
                alt={character.name}
                className={styles.avatar}
                width={125}
                height={125}
            />
            <h3 className={styles.title}>{character.name}</h3>
            <p>{character.status}</p>
            <p>{character.species}</p>
            <p>{character.type || "sem tipo"}</p>
            <p>{character.gender}</p>
            <p>{character.origin?.name}</p>
        </div>
    )
}