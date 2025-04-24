"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import CharacterCard from "../../components/CharacterCard"
import "./home.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Loader from "../../components/Loader"

export default function Home() {
    const [search, setSearch] = useState("")
    const [characters, setCharacters] = useState([])
    const [notFound, setNotFound] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true);
    const cacheRef = useRef(new Map());

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        const cache = cacheRef.current;
        const cacheKey = `${name}_${pageNumber}`;
        const nextPageNumber = pageNumber + 1;
        const nextCacheKey = `${name}_${nextPageNumber}`;

        // Criar função para limpar o cache se o tamanho for maior ou igual a 5
        const cleanCacheIfNeeded = () => {
            while (cache.size >= 5) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
                console.log(`♻️ Removido do cache: ${firstKey}`);
            }
        };

        console.log("\n============== BUSCA INICIADA ==============");
        console.log(`📊 Cache anterior: ${cache.size} páginas`);

        // Verificar se o cache já tem a página
        let total = totalPages;

        // Verificar se o cache já tem a página
        // Se sim, usar o cache e não fazer a requisição na API
        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            setCharacters(cached.results);
            setTotalPages(cached.totalPages);
            total = cached.totalPages;
            setNotFound(false);
            setLoading(false);
            console.log(`✅ Usando cache: ${cacheKey}`);
            // Senão, fazer a requisição na API
        } else {
            try {
                const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);

                cleanCacheIfNeeded();
                cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                }); // salvar no cache

                setCharacters(data.results);
                setTotalPages(data.info.pages);
                total = data.info.pages;
                setNotFound(false);
                console.log(`💾 Salvo no cache: ${cacheKey}`);
            } catch {
                setCharacters([]);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }

        // Prefetch a próxima página se ela existir e não estiver no cache
        if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
            try {
                const res = await axios.get(`https://rickandmortyapi.com/api/character/?page=${nextPageNumber}&name=${name}`);
                cleanCacheIfNeeded();
                cache.set(nextCacheKey, {
                    results: res.data.results,
                    totalPages: res.data.info.pages,
                });
                console.log(`📋 Prefetch salvo: ${nextCacheKey}`);
            } catch (err) {
                console.log(`❌ Prefetch falhou: ${nextCacheKey}`, err);
            }
        } else {
            console.log("ℹ️ Prefetch ignorado: já no cache ou fora do limite");
        }

        console.log(`📦 Cache final: ${cache.size} páginas`);
        for (const [key, val] of cache.entries()) {
            console.log(`📦 ${key}: ${val.results.length} personagens`);
        }
        console.log("============== FIM DA BUSCA ==============\n");
    };

    useEffect(() => {
            fetchCharacters(search.trim(), page)
        },[page]);
    useEffect(() => {
            fetchCharacters(search, page)
        },[search]);
    


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
                <button className="button" onClick={() => {
                    fetchCharacters(search.trim(),1);
                    handleClick("buscar"); 
                    setPage(1);
                    }} 
                >
                    Buscar
                </button>
                <button className="button-reset" onClick={() => {
                    setSearch(""); 
                    fetchCharacters("", 1); 
                    handleClick("reset")
                    }}
                >
                    Reset
                </button>
            </div>

            <div className="navControls">
                <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="buttonNav"
                >
                    Página anterior
                </button>
                <div className="pageIndicatorContainer">
                    <span className="pageIndicator">
                        Página {page} de {totalPages}
                    </span>
                </div>
                <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="buttonNav"
                >
                    Proxima página
                </button>
            </div>
            {notFound && (
                    <p className="notFound">Nenhum personagem encontrado com esse nome</p>
                )}
            {loading?(
                <div className={`loaderWrapper ${loading ? "" : "hidden"}`}>
                    <Loader />
                </div>
            ):(                
            <div className="grid">
                {characters.map((char) => (
                    <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char.name)} />
                ))}
            </div>
        )}
        </div>
    )
}