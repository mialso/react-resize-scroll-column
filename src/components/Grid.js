import React from 'react';
import { connect } from 'react-redux';

import Column from './Column';
import { BalancerItem, Item } from './Item';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/grid';

//export default function Grid({ width, height, columns, columnHeight }) {

class Grid extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.version !== this.props.version) {
            return true;
        }
        return false;
    }
    render() {
        const { width, gridData } = this.props;
        const topBalancer = gridData.balancer.top;
        const bottomBalancer = gridData.balancer.bottom;
        return (
            <div className="Grid" style={{ width }}>
                <BalancerItem data={topBalancer} type="top" version={topBalancer.version}>
                    <Item />
                </BalancerItem>
                { gridData._main.map((item, index) => <Item key={index} data={item} />) }
                <BalancerItem data={bottomBalancer} type="bottom" version={bottomBalancer.version}>
                    <Item />
                </BalancerItem>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        width: GRID_WIDTH,
        gridData: state.grid.column,
        version: state.grid.column.version,
    };
}

export default connect(
    mapStateToProps,
    {},
)(Grid);
