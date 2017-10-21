import React from 'react';
import { connect } from 'react-redux';
import Column from './Column';
import {
    columnsetInitHeight,
    columnsetDataUpdate,
    columnsetResizeDown,
    columnsetResizeUp,
    columnsetScrollDown,
    columnsetScrollUp,
} from '../actions/columnset'

export class ColumnSet extends React.Component {
    componentDidMount() {
        if (this.props.refColumnset) {
            this.props.refColumnset(this);
        }
        this.props.columnsetInitHeight({
            height: this.props.initialHeight,
            width: this.props.width,
            columnWidth: this.props.columnWidth,
        });
    }
    componentWillReceiveProps(newProps) {
        if (Array.isArray(newProps.data) && (newProps.data !== this.props.data)) {
            this.props.columnsetDataUpdate({ dataArray: newProps.data });
        }
    }
    componentWillUnmount() {
    }
    scrollDown = (height) => {
        this.props.columnsetScrollDown(height);
    }
    scrollUp = (height) => {
        this.props.columnsetScrollUp(height);
    }
    resizeDown = (newSize) => {
        this.props.columnsetResizeDown({ height: newSize });
    }
    resizeUp = (newSize) => {
        this.props.columnsetResizeUp({ height: newSize });
    }
    /*
    isFullView = () => {
        return this.props.height === this.props.fullViewSize;
    }
    */
    isScrollableDown = () => {
        return this.props.isScrollableDown;
    }
    isScrollableUp = () => {
        return this.props.isScrollableUp;
    }
    getHeight = () => {
        return this.props.height;
    }
    /*
    getGridHeight = () => {
        const { fullViewSize, height } = this.props;
        return height < fullViewSize ? height : fullViewSize;
    }
    */
    render() {
        console.log('columnset render(): columns: %s', this.props.columns.length);
        const { width, columns, columnWidth } = this.props;
        return (
            <div ref={me => this._me = me} className="ColumnSet" style={{ width }}>
                {
                    columns.map((column, i) => <Column key={i} width={columnWidth} column={column} version={column.version}/>)
                }
            </div>
        );
    }
}

const mapStateToProps = ({ columnset }) => {
    console.log('mapStateToProps: columns: %s', columnset.columns.length);
    return {
        columns: columnset.columns,
        height: columnset.columns.length > 0 ? columnset.columns[0].getArea() : 0,
        isScrollableDown: columnset.columns.reduce((acc, col) => col.isScrollableDown() || acc, false),
        isScrollableUp: columnset.columns.reduce((acc, col) => col.isScrollableUp() || acc, false),
    };
};

export default connect(
    mapStateToProps,
    {
        columnsetDataUpdate,
        columnsetInitHeight,
        columnsetResizeDown,
        columnsetResizeUp,
        columnsetScrollDown,
        columnsetScrollUp,
    }
)(ColumnSet);
