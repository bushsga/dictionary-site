import { useState, useEffect } from 'react';

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  const addBookmark = (word: string) => {
    const updatedBookmarks = [...bookmarks, word];
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const removeBookmark = (word: string) => {
    const updatedBookmarks = bookmarks.filter((b) => b !== word);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  return { bookmarks, addBookmark, removeBookmark };
};

export default useBookmarks;