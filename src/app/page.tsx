"use client"
import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import useBookmarks from "../../hooks/useBookmarks";
import { FaBookmark, FaRegBookmark, FaTrash, FaSpinner,  FaBook } from "react-icons/fa";


interface Phonetic {
  text: string;
  audio: string;
}

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface WordData {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}


export default function Home() {
  const [wordData, setWordData] = useState<WordData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const [loading, setLoading] = useState(false);
  

  const handleSearch = async (word: string) => {
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors
    try {
      const res = await fetch(`/api/word?word=${word}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setWordData(data);
    } catch (err) {
      setError('Failed to fetch word data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = (word: string) => {
    if (bookmarks.includes(word)) {
      removeBookmark(word);
    } else {
      addBookmark(word);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 overflow-x-hidden">
    <div className="text-center mb-6 flex items-center justify-center gap-2">
        <FaBook className="text-2xl text-blue-500" />
        <h1 className="text-xl font-semibold dark:text-white">Dictionary App</h1>
      </div>
    <SearchBar onSearch={handleSearch} />
    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    {loading ? (
      <div className="text-center mt-4">
        <FaSpinner className="animate-spin inline-block text-blue-500 text-4xl" />
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    ) : wordData && wordData.length > 0 ? (
      <div className="mt-6 p-4 bg-white rounded shadow max-w-2xl mx-auto">
        {wordData.map((entry: WordData, index: number) => (
          <div key={index} className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold mb-4 text-blue-950">{entry.word}</h1>
              <button
                onClick={() => handleBookmark(entry.word)}
                className={`p-2 rounded ${
                  bookmarks.includes(entry.word)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {bookmarks.includes(entry.word) ? (
                  <FaBookmark className="inline-block" />
                ) : (
                  <FaRegBookmark className="inline-block" />
                )}
              </button>
            </div>
            <p className="text-gray-600 mb-4">{entry.phonetic}</p>
            {entry.phonetics.map((phonetic: Phonetic, idx: number) => (
              <div key={idx} className="mb-4">
                {phonetic.audio && (
                     <audio controls className="w-full">
                    <source src={phonetic.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
            {entry.meanings.map((meaning: Meaning, idx: number) => (
              <div key={idx} className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {meaning.partOfSpeech}
                </h2>
                <ul className="list-disc list-inside">
                  {meaning.definitions.map((definition: Definition, idx: number) => (
                    <li key={idx} className="mb-2">
                      <p>{definition.definition}</p>
                      {definition.example && (
                        <p className="text-gray-600">
                          Example: {definition.example}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center mt-4">No word data found. Try searching for a word!</p>
    )}

    {/* Display Bookmarked Words */}
    <div className="mt-8 max-w-2xl mx-auto">
<h2 className="text-2xl font-bold mb-4 text-blue-950">
  <FaBookmark className="inline-block mr-2" />
  Bookmarks
</h2>
{bookmarks.length > 0 ? (
  <ul className="list-disc list-inside">
    {bookmarks.map((bookmark, index) => (
      <li key={index} className="mb-2 flex justify-between items-center">
        {bookmark}
        <button
          onClick={() => removeBookmark(bookmark)}
          className="text-red-500 hover:text-red-600"
        >
          <FaTrash />
        </button>
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-600">No bookmarks yet.</p>
)}
</div>
  </div>

  );
}
