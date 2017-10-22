import React from 'react';
import { Item, BalancerItem } from './Item';
import { Balancer } from './Balancer';

import './Column.css';

export default class Column extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.version !== this.props.version) {
            return true;
        }
        return false;
    }
    render() {
        console.log('column render()');
        const { width, column, childData, divider } = this.props;
        const topBalancer = column.balancer.top;
        const bottomBalancer = column.balancer.bottom;
        const height = column.getArea();
        return (
            <div className="Column" style={{ width, height }}>
                <Balancer data={topBalancer} type="top" version={topBalancer.version}>
                    <BalancerItem childData={childData} divider={divider}/>
                </Balancer>
                {
                    column._main.map((item, index) => 
                        <Item
                            key={index}
                            data={item}
                            applyClass={item.renderClass}
                            Renderer={item.type === 'divider' ? divider.renderer : childData.renderer}
                        />)
                }
                <Balancer data={bottomBalancer} type="bottom" version={bottomBalancer.version}>
                    <BalancerItem childData={childData} divider={divider}/>
                </Balancer>
            </div>
        );
    }
}
