import React from 'react';
import './SearchBar.css';


export const SearchBar: React.FC = () => {
  return (
    <div className="search-bar-container">
      <input 
        type="text" 
        placeholder="Buscar espadas, pociones, armaduras..." 
        className="search-input"
      />
      <button className="search-button">Buscar</button>
    </div>
  );
};