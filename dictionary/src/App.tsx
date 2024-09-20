import { useState } from 'react';
import './App.css';

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

    const handleSearch = async () => {
        if (!word.trim()) {
            return;
        }

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
            console.log('något gick fel');
        }
    };

    return (
        <div className='dictionaryWrapper'>
            <header className='dictionary__Header'>
                <h1>
                    Your <span>Dictionary</span>
                </h1>
                <img
                    className='book'
                    src='./assets/book-2-svgrepo-com.svg'
                    alt=''
                />
            </header>
            <form className='form__Wrapper' action=''>
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

            {definition && (
                <article className='definition'>
                        {definition.map((filteredWord, index) => (
                          <main key={`${filteredWord.word}-${filteredWord.meanings}-${index}`}>
                              <h2>Du sökte på: {filteredWord.word}</h2>
                                {/* Spela upp ljudklippet om det finns */}
                                {filteredWord.phonetics.length > 0 &&
                                    filteredWord.phonetics[0].audio && (
                                        <section className='audio'>
                                            <p>Lyssna på uttal</p>
                                            <audio controls>
                                                <source
                                                    src={
                                                        filteredWord
                                                            .phonetics[0].audio
                                                    }
                                                    type='audio/mpeg'
                                                />
                                                Your browser does not support
                                                the audio element.
                                            </audio>
                                        </section>
                                    )}
                                {filteredWord.meanings.map((meaning, index) => (
                                    <section className='allDescription' key={index}>
                                        <h3>{meaning.partOfSpeech}</h3>
                                        <ul>
                                            {meaning.definitions.map(
                                                (def, i) => (
                                                    <li key={i}>
                                                        {def.definition}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </section>
                                ))}
                            </main>
                        ))}
                </article>
            )}
        </div>
    );
}

export default App;


