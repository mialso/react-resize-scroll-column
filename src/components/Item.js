import React from 'react';

import './Item.css';

function Card({ data, childStyle }) {
    return (
        <div className="Card" style={childStyle}>
            <p style={{ height: data.size }}>s: {data.size} -> vA: {data.viewArea}</p>
        </div>
    );
}

export function Item({ data, applyStyle, applyClass }) {
    const height = data.size;
    const style = Object.assign({}, applyStyle, { height });
    return (
        <div className={`Item ${applyClass}`} style={style}>
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
        const { data, type, children } = this.props;
        const style = {
            height: data.getViewSize(),
            display: data.getSize() > 0 ? 'block' : 'none',
            overflow: 'hidden',
        };
        const childStyle = {
            marginTop: type === 'top' ? data.viewArea - data.size : 0,
            //overflow: type === 'bottom' ? 'hidden' : 'visible',
        };
        return (
            <div className="BalancerItem" style={style}>
                {
                    React.Children.map(
                        children,
                        child => React.cloneElement(
                            child,
                            {
                                applyStyle: childStyle,
                                applyClass: data._raw.renderClass,
                                data,
                            }
                        ),
                    )
                }
            </div>
        );
    }
}
