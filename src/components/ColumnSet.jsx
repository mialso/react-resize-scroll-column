import React from 'react';
import { connect } from 'react-redux';
import Column from './Column';

export class ColumnSet extends React.Component {
    render() {
        const { gridSet } = this.props;
        return (
            <div className="ColumnSet" style={{ width: gridSet.width }}>
                {
                    gridSet.columns.map((column, i) => <Column key={i} width={gridSet.columnWidth} column={column}/>)
                }
            </div>
        );
    }
}

const mapStateToProps = ({ gridSet }) => {
    return {
        gridSet: gridSet || {},
        isGridScrollableDown: false,//grid.column.isScrollableDown(),
        isGridScrollableUp: false,//grid.column.isScrollableUp(),
    };
};

export default connect(
    mapStateToProps,
    null,
)(ColumnSet);
