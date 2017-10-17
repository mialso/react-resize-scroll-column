import React from 'react';

import Column from './Column';

export default function Grid({ width, height, columns, columnHeight }) {
    return (
        <div className="Grid" style={{ width }}>
            { columns.map((column, index) =>  <Column key={index} data={column} height={columnHeight}/>) }
        </div>
    );
}
