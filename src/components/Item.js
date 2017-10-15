import React from 'react';

import './Item.css';

export default function Item({ data, addStyle }) {
    const style = Object.assign(
        {
            height: data.getSize(),
        },
        addStyle,
    );
    return (
        <div className="Item" style={style}>
            n: { data.data.text }
            <p>s: {data.size} -> vA: {data.viewArea}</p>
        </div>
    );
}
