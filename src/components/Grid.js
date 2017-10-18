import React from 'react';
import { connect } from 'react-redux';

import Column from './Column';
import { BalancerItem, Item } from './Item';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/grid';

//export default function Grid({ width, height, columns, columnHeight }) {

function Grid({ width, height, gridData }) {
    return (
        <div className="Grid" style={{ width, height }}>
            <BalancerItem data={gridData.balancer.top} type="top">
                <Item />
            </BalancerItem>
            { gridData._main.map((item, index) => <Item key={index} data={item} />) }
            <BalancerItem data={gridData.balancer.bottom} type="bottom">
                <Item />
            </BalancerItem>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        width: GRID_WIDTH,
        gridData: state.grid.column,
        height: state.grid.height,
    };
}

export default connect(
    mapStateToProps,
    {},
)(Grid);
