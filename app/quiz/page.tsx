'use client'

import { useEffect, useState } from "react";
import Image from 'next/image';
import "./quiz.css";

export default function Quiz() {
    const defaultURL = 'https://pokeapi.co/api/v2/pokemon/'

    const [idInput, setIdInput] = useState(0)
    const [imgURL, setImgURL] = useState('')
    const [currentPoke, setCurrentPoke] = useState<any>({})
    const [trigger, setTrigger] = useState(0)
    const [mistakeMsg, setMistakeMsg] = useState('')
    
    // fetch image
    useEffect(() => {
        // Random between 1 and 1025
        const randomId = Math.ceil(Math.random() * 1025)

        fetch(defaultURL + randomId).then((res) => {
            if(res.ok) res.json().then((foundPoke) => {
                if(foundPoke) {
                    setCurrentPoke(foundPoke)
                    
                    const url = foundPoke.sprites.front_default

                    if(typeof url === 'string') {
                        setImgURL(url)
                    }
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    }, [trigger])

    useEffect(() => {
        setMistakeMsg('')
    }, [idInput])

    function guessThePokemonCallback() {
        if (idInput === currentPoke.id) {
            setTrigger(trigger + 1)
        } else {
            setMistakeMsg("You're wrong :D")
        }
    }

    function giveUpCallback() {
        setTrigger(trigger - 1)
    }

    return (
        <div className="quiz">
            {mistakeMsg}

            <div className="pokeCard">
                <Image src={imgURL} alt={currentPoke.name ? currentPoke.name : ''} width={300} height={300} />
            </div>

            <div className="inputGroup">
                <input name="pokemonID" type="number" value={idInput} onChange={event => setIdInput(parseInt(event.target.value))} />
                <button onClick={guessThePokemonCallback}>Try ?</button>
                <button onClick={giveUpCallback}>Give up</button>
            </div>
        </div>
    );
}
