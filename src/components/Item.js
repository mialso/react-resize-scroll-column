import React from 'react';

import './Item.css';

function Card({ data, childStyle }) {
    return (
        <div className="Card" style={childStyle}>
            <p style={{ height: data.size / 2 }}>n: { data.data.text }</p>
            <p style={{ height: data.size / 2 }}>s: {data.size} -> vA: {data.viewArea}</p>
        </div>
    );
}

export function Item({ data }) {
    return (
        <div className="Item" style={{ height: data.getSize() }}>
            <Card data={data} />
        </div>
    );
}

export function BalancerItem({ data, type, children }) {
    const style = {
        marginTop: type === 'top' ? data.getMargin() : 0,
        marginBottom: type === 'bottom' ? data.getMargin() : 0,
        height: data.getSize(),
    };
    const childStyle = {
        marginTop: type === 'top' ? data.viewArea - data.size : 0,
        overflow: type === 'bottom' ? 'hidden' : 'visible',
    };
    return (
        <div className="BalancerItem" style={style}>
            { children }
        </div>
    );
}
