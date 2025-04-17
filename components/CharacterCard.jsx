import styles from '../styles/characterCard.module.css';

export default function CharacterCard( {character, onClick} ) {
    return(
        <div className={styles.card} onClick={onClick}> 
            <img
                src={character.image}
                alt={character.name}
                className={styles.avatar}
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