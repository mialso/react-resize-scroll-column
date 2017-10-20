import React from 'react';
import { Item, BalancerItem } from './Item';

import './Column.css';

export default class Column extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.column.version !== this.props.column.version) {
            return true;
        }
        return false;
    }
    render() {
        const { width, column } = this.props;
        const topBalancer = column.balancer.top;
        const bottomBalancer = column.balancer.bottom;
        const height = column.getArea();
        return (
            <div className="Grid" style={{ width, height }}>
                <BalancerItem data={topBalancer} type="top" version={topBalancer.version}>
                    <Item />
                </BalancerItem>
                {
                    column._main.map((item, index) => <Item key={index} data={item} applyClass={item.renderClass} />)
                }
                <BalancerItem data={bottomBalancer} type="bottom" version={bottomBalancer.version}>
                    <Item />
                </BalancerItem>
            </div>
        );
    }
}
