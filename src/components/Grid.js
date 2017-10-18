import React from 'react';
import { connect } from 'react-redux';

import Column from './Column';
import { BalancerItem } from './Item';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/grid';

//export default function Grid({ width, height, columns, columnHeight }) {
function GridItem() {
    return (
        <div className="gridItem"></div>
    );
}

function Grid({ width, height, gridData }) {
    return (
        <div className="Grid" style={{ width, height }}>
            <BalancerItem data={gridData.balancer.top} type="top">
                <GridItem />
            </BalancerItem>
            { gridData._main.map((item, index) => <GridItem key={index} />) }
            <BalancerItem data={gridData.balancer.bottom} type="bottom">
                <GridItem />
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
