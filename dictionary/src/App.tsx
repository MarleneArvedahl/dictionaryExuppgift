import { useState } from 'react';
import './App.css';
import bookPicture from './assets/book-2-svgrepo-com.svg';

type Definition = {
    word: string;
    meanings: Meaning[];
    phonetics: Phonetic[];
};

type Meaning = {
    partOfSpeech: string;
    definitions: DefinitionDetail[];
};

type Phonetic = {
    audio: string;
};

type DefinitionDetail = {
    definition: string;
};

function App() {
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState<Definition[] | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    //när man trycker på knappen kollar den ifall det är tomt i inputfältet och i så fall skickas det ut ett felmeddelande.
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!word.trim()) {
            setErrorMessage(
                'Du har inte fyllt i något ord ännu, var snäll och gör det'
            );
            setWord('');
            setDefinition(null);
            return;
        }
        setErrorMessage('');
        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            );
            if (!response.ok) {
                throw new Error('Word not found');
            }
            const data = await response.json();
            setDefinition(data);
        } catch (Error) {
            setErrorMessage(
                'Ditt ord gav tyvärr ingen träff, var god fyll i ett annat'
            );
            setWord('');
            setDefinition(null);
        }
    };

    return (
        <div className='dictionaryWrapper'>
            <header className='dictionary__Header'>
                <h1>
                    Your <span>Dictionary</span>
                </h1>
                <img className='book' src={bookPicture} alt='' />
            </header>
            <form className='form__Wrapper' action='' onSubmit={handleSearch}>
                <input
                    type='text'
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder='sök engelskt ord'
                    id='dictionary-input'
                    name='word'
                />
            </form>
            <button className='searchButton' onClick={handleSearch}>
                Slå upp ord
            </button>

            {/* Visa felmeddelandet om det finns ett */}
            {errorMessage && (
                <p style={{ color: 'red', fontStyle: 'italic' }}>
                    {errorMessage}
                </p>
            )}
            {definition && (
                <article className='definition'>
                    <section className='h2AndAudio'>
                        <h2 className='searchedWord'>
                            Du sökte på:{' '}
                            <span className='choosenWord'>
                                "{definition[0].word}"
                            </span>
                        </h2>
                        {/* Spela upp ljudklippet om det finns */}
                        {definition[0].phonetics.length > 0 &&
                        definition[0].phonetics[0].audio ? (
                            <section className='audio'>
                                <audio
                                    key={definition[0].phonetics[0].audio}
                                    controls
                                >
                                    <source
                                        src={definition[0].phonetics[0].audio}
                                        type='audio/mpeg'
                                    />
                                    'Inget ljud finns att spela upp'
                                </audio>
                                <h2>Lyssna på uttal</h2>
                            </section>
                        ) : (
                            // Visa meddelande om det inte finns ett ljudspår
                            <p style={{ color: 'red', fontStyle: 'italic' }}>
                                Det finns inget ljudspår att spela upp.
                            </p>
                        )}
                    </section>
                    {definition.map((filteredWord, index) => (
                        <main
                            key={`${filteredWord.word}-${filteredWord.meanings}-${index}`}
                        >
                            {filteredWord.meanings.length > 0 && (
                                <section className='allDescription'>
                                    <h3 className='descriptionText'>
                                        {
                                            <ul>
                                                <li>
                                                    {
                                                        filteredWord.meanings[0]
                                                            .definitions[0]
                                                            .definition
                                                    }
                                                </li>
                                            </ul>
                                        }
                                    </h3>
                                </section>
                            )}
                        </main>
                    ))}
                </article>
            )}
        </div>
    );
}

export default App;
