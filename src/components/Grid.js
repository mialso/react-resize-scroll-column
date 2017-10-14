import React from 'react';

import Column from './Column';

export default function Grid({ width, height, columns }) {
    return (
        <div className="Grid" style={{ width, height }}>
            { columns.map((column, index) =>  <Column key={index} data={column} />) }
        </div>
    );
}
