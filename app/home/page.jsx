"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import CharacterCard from "../../components/CharacterCard"
import styles from "./home.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Home() {
    const [search, setSearch] = useState("")
    const [characters, setCharacters] = useState([])
    const [notFound, setNotFound] = useState(false)

    const fetchCharacters = async (name = "") => {
        setNotFound(false)
        try {
            const {data}= await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`)
            setCharacters(data.results)
        } catch (error) {
            console.error("Erro ao buscar personagens:", error)
            setNotFound(true)   
            setCharacters([]);
        }
    }

    useEffect(() => {
            fetchCharacters(search)
        },[]);


        const handleCardClick = (name) => {
            toast.info(`Você clicou no personagem: ${name}`,{})
        }
        const handleClick = (message) => {
            toast.info(`Você clicou no botão: ${message}`,{})
        }
    return(

        <div className="container">
            <ToastContainer position="bottom-left" autoClose={3000} theme="light" />
            <h1 className="title">Personagens de Rick and Morty</h1>
            <div className="searchContainer">
                <input type="text" placeholder="Digite o nome do personagem" value={search} onChange={(e) => setSearch(e.target.value)} className="input"/>
                <button className="button" onClick={() => {fetchCharacters(search.trim()); handleClick("buscar")}} >Buscar</button>
                <button className="button-reset" onClick={() => {setSearch(""); fetchCharacters(); handleClick("reset")} }>Reset</button>
            </div>
            {notFound && (
                    <p className="notFound">Nenhum personagem encontrado com esse nome</p>
                )}
            <div className="grid">
                {characters.map((char) =>(
                    <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char.name)}/>
                ))}
            </div>
        </div>
    )
}