import React from 'react';
import { connect } from 'react-redux';
import Column from './Column';

export class ColumnSet extends React.Component {
    render() {
        console.log('columnSet render()');
        const { width, columns, columnWidth } = this.props;
        return (
            <div className="ColumnSet" style={{ width }}>
                {
                    columns.map((column, i) => <Column key={i} width={columnWidth} column={column} version={column.version}/>)
                }
            </div>
        );
    }
}

const mapStateToProps = ({ gridSet }) => {
    return {
        width: gridSet.width,
        columns: gridSet.columns,
        columnWidth: gridSet.columnWidth,
        isGridScrollableDown: false,//grid.column.isScrollableDown(),
        isGridScrollableUp: false,//grid.column.isScrollableUp(),
    };
};

export default connect(
    mapStateToProps,
    null,
)(ColumnSet);
