import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaVolumeUp } from "react-icons/fa";

interface WordData {
  word: string;
  phonetic: string;
  phonetics: { text: string; audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
  }[];
}

const WordPage = () => {
  const router = useRouter();
  const { word } = router.query;
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (word) {
      fetch(`/api/word?word=${word}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setWordData(data[0]);
        })
        .catch(() => setError('Failed to fetch word data'));
    }
  }, [word]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Error: {error}</h1>
      </div>
    );
  }

  if (!wordData) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">{wordData.word}</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <p className="text-gray-600">{wordData.phonetic}</p>
        {wordData.phonetics.map((phonetic, index) => (
          <div key={index} className="mb-4">
          {phonetic.audio && (
            <div className="flex items-center">
              <FaVolumeUp className="mr-2 text-gray-600" />
              <audio controls className="w-full">
                <source src={phonetic.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        ))}
        {wordData.meanings.map((meaning, index) => (
          <div key={index} className="mt-6">
            <h2 className="text-xl font-semibold">{meaning.partOfSpeech}</h2>
            <ul className="list-disc list-inside mt-2">
              {meaning.definitions.map((definition, idx) => (
                <li key={idx} className="mt-2">
                  <p>{definition.definition}</p>
                  {definition.example && (
                    <p className="text-gray-600">Example: {definition.example}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordPage;