'use client'

import { useEffect, useState } from "react";

import UniversalInput from "@/app/_components/universalInput.component";

import { defaultURL, pokemonsEndpoint } from "@/app/_types/api.type";

import Image from 'next/image';
import "./quiz.css";

export default function Quiz() {
    const [currentPoke, setCurrentPoke] = useState<any>(null)
    const [currentInput, setCurrentInput] = useState('')
    const [submitFeedback, setSubmitFeedback] = useState('')

    const [trigger, setTrigger] = useState(0)
    
    // fetch image
    useEffect(() => {
        // Random between 1 and 1025
        const randomId = Math.ceil(Math.random() * 1025)

        fetch(defaultURL + pokemonsEndpoint + randomId).then((res) => {
            if(res.ok) res.json().then((foundPoke) => {
                if(foundPoke) {
                    setCurrentPoke(foundPoke)
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    }, [trigger])

    function guessThePokemonCallback() {
        const currentInputAsNumber = parseInt(currentInput)
        const currentPokeIdAsNumber = parseInt(currentPoke?.id)

        if (isNaN(currentInputAsNumber) || isNaN(currentPokeIdAsNumber)) {
            return
        }

        if (currentInputAsNumber === currentPokeIdAsNumber) {
            setTrigger(trigger + 1)
            setCurrentPoke(null)
            setCurrentInput('')
            setSubmitFeedback("You're right ;)")
        } else {
            const diff = Math.abs(currentInputAsNumber - currentPokeIdAsNumber)
            
            if(diff <= 5) setSubmitFeedback("You're close !")
            else if(diff === 10) setSubmitFeedback("Ahah... No ^^")
            else if(diff % 100 === 0) setSubmitFeedback("Really ?")
            else setSubmitFeedback("You're wrong :D")
        }
    }

    function giveUpCallback() {
        setTrigger(trigger - 1)
        setSubmitFeedback(`Dommage c'était le ${currentPoke.id}`)
        setCurrentInput('')
    }

    return (
        <div className="quiz">
            {submitFeedback}
            <div className="guessContainer">
                <div className="pokeCard">
                    <Image src={currentPoke ? currentPoke.sprites.front_default : '/Logo.png'} alt={currentPoke?.name ? currentPoke.name : ''} width={300} height={300} />
                </div>

                <div className="inputGroup">
                    <UniversalInput
                        inputValue={currentInput}
                        type="number"
                        inputChangeCallback={setCurrentInput}
                        submitCallback={guessThePokemonCallback}
                    />
                    <div className="buttonGroup">
                        <button onClick={guessThePokemonCallback}>Try ?</button>
                        <button onClick={giveUpCallback}>Give up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
