import React, { useEffect, useRef, useState } from 'react';
import './BookmarkModal.css';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  destination: [number, number] | null;
  destinationName: string | null;
}

const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  destination,
  destinationName,
}) => {
  const [bookmarkName, setBookmarkName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setBookmarkName(destinationName || '');
    }
  }, [isOpen, destinationName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !destination) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookmarkName.trim()) {
      onSave(bookmarkName);
      setBookmarkName('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
        <h2>Save Bookmark</h2>

        <div className="bookmark-type-buttons">
          <button
            type="button"
            className={`image-button ${
              bookmarkName !== 'Home' && bookmarkName !== 'Work' ? 'selected' : ''
            }`}
            onClick={() => setBookmarkName(destinationName || '')}
            title="Generic"
          >
            <img src="/bookmark.png" alt="Bookmark" />
            <span>Custom</span>
          </button>
          <button
            type="button"
            className={`image-button ${bookmarkName === 'Home' ? 'selected' : ''}`}
            onClick={() => setBookmarkName('Home')}
            title="Home"
          >
            <img src="/home.png" alt="Home" />
            <span>Home</span>
          </button>
          <button
            type="button"
            className={`image-button ${bookmarkName === 'Work' ? 'selected' : ''}`}
            onClick={() => setBookmarkName('Work')}
            title="Work"
          >
            <img src="/work.png" alt="Work" />
            <span>Work</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="bookmarkName">Bookmark Name</label>
          <input
            id="bookmarkName"
            type="text"
            placeholder="Bookmark name"
            value={bookmarkName}
            onChange={(e) => setBookmarkName(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;