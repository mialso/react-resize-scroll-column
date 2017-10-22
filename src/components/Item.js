import React from 'react';

import './Item.css';

function Card({ data, childStyle }) {
    return (
        <div className="Card" style={childStyle}>
            <p style={{ height: data.size }}>s: {data.size} -> vA: {data.viewArea}</p>
        </div>
    );
}

export function Item({ data, applyStyle, applyClass, Renderer }) {
    const height = data.size;
    const style = Object.assign({}, applyStyle, { height });
    const itemData = data.data || {};
    const itemClass = `Item ${applyClass}`;
    return (
        <div className={itemClass} style={style}>
            { Renderer ? <Renderer data={itemData}/> : <Card data={data} /> }
        </div>
    );
}

export function BalancerItem({ data, applyStyle, applyClass, childData, viewData, divider }) {
    const height = data.size;
    const style = Object.assign({}, applyStyle, { height });
    const renderItem = data.type && data.type !== 'empty' && childData && typeof childData.renderer === 'function';
    if (!renderItem) return null;

    const childProps = Object.assign(
        {
            data: data.data,
            id: `${childData.props ? childData.props.idPrefix : ''}_${applyClass}`,
            makeHeight: viewData ? viewData.viewArea : 0,
        },
        childData.props,
    );

    const Renderer = data.type === 'divider' ? divider.renderer : childData.renderer;
    const itemClass = `Item ${applyClass}`;

    return (
        <div className={itemClass} style={style}>
            <Renderer {...childProps} />
        </div>
    );
}
