import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div id="home-container">
            <Link to="/ged">
                <button id="dnd-button">
                    <h3>GED</h3> <br /> Guild of Expendable Dungeoneers
                </button>
            </Link>
        </div>
    )
}