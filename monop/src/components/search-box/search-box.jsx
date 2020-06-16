import React from 'react';
import './search-box.css';

export const Search = ({placeholder, handleChange}) => {
    return <input className="search" type="search" onChange={handleChange} placeholder={placeholder}/>
};