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
            height: this.props.makeHeight,
            width: this.props.width,
            columnWidth: this.props.columnWidth,
        }, this.getMyMeta());
    }
    componentWillReceiveProps(newProps) {
        if (Array.isArray(newProps.data) && (newProps.data !== this.props.data)) {
            this.props.columnsetDataUpdate({ dataArray: newProps.data }, this.getMyMeta());
        }
        if (newProps.makeHeight !== this.props.makeHeight) {
            if (!this.isScrollableUp()) {
                this.props.columnsetResizeUp({ height: newProps.makeHeight }, this.getMyMeta());
            }
            if (!this.isScrollableDown()) {
                this.props.columnsetResizeDown({ height: newProps.makeHeight }, this.getMyMeta());
            }
        }
    }
    componentWillUnmount() {
    }
    getMyMeta() {
        return { id: this.props.id };
    }
    scrollHandler = (e, amount) => {
        if (e.deltaY > 0) {
            return this.props.columnsetScrollUp(amount, this.getMyMeta());
        }
        if (e.deltaY < 0) {
            return this.props.columnsetScrollDown(amount, this.getMyMeta());
        }
        return;
    }
    isScrollableDown = () => {
        return this.props.isScrollableDown;
    }
    isScrollableUp = () => {
        return this.props.isScrollableUp;
    }
    getHeight = () => {
        return this.props.height;
    }
    render() {
        console.log('columnset render(): columns: %s', this.props.columns.length);
        const { width, columns, columnWidth, childData, divider } = this.props;
        return (
            <div ref={me => this._me = me} className="ColumnSet" style={{ width }}>
                {
                    columns.map((column, i) => 
                        <Column
                            key={i}
                            width={columnWidth}
                            column={column}
                            version={column.version}
                            childData={childData}
                            divider={divider}
                        />)
                }
            </div>
        );
    }
}

const mapStateToProps = ({ columnset }, { id }) => {
    return {
        columns: columnset[id] && columnset[id].columns || [],
        height: columnset[id] && columnset[id].columns.length > 0 ? columnset[id].columns[0].getArea() : 0,
        isScrollableDown: columnset[id] && columnset[id].columns.reduce((acc, col) => col.isScrollableDown() || acc, false),
        isScrollableUp: columnset[id] && columnset[id].columns.reduce((acc, col) => col.isScrollableUp() || acc, false),
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
