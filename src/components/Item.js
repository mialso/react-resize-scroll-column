import React from 'react';

import './Item.css';

function Card({ data, childStyle }) {
    return (
        <div className="Card" style={childStyle}>
            <p style={{ height: data.size }}>s: {data.size} -> vA: {data.viewArea}</p>
        </div>
    );
}

export function Item({ data, applyStyle }) {
    const style = Object.assign({}, applyStyle, { height: data.getSize() });
    return (
        <div className="Item" style={style}>
            <Card data={data} />
        </div>
    );
}

export class BalancerItem extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.version !== this.props.version) {
            return true;
        }
        return false;
    }
    render() {
        console.log('BalancerItem render');
        const { data, type, children } = this.props;
        const style = {
            marginTop: type === 'top' ? data.getMargin() : 0,
            marginBottom: type === 'bottom' ? data.getMargin() : 0,
            height: data.getSize(),
            display: data.getSize() > 0 ? 'block' : 'none',
        };
        const childStyle = {
            //marginTop: type === 'top' ? data.viewArea - data.size : 0,
            overflow: type === 'bottom' ? 'hidden' : 'visible',
        };
        return (
            <div className="BalancerItem" style={style}>
                {
                    React.Children.map(
                        children,
                        child => React.cloneElement(child, { applyStyle: childStyle, data }),
                    )
                }
            </div>
        );
    }
}
