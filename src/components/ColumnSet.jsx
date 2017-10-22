import React from 'react';
import { connect } from 'react-redux';
import Column from './Column';
import {
    columnsetInitHeight,
    columnsetDataUpdate,
    columnsetResizeDown,
    columnsetResizeUp,
    //columnsetScrollDown,
    //columnsetScrollUp,
    columnsetScroll,
} from '../actions/columnset'

export class ColumnSet extends React.Component {
    componentDidMount() {
        this.props.columnsetInitHeight({
            height: this.props.makeHeight,
            width: this.props.width,
            columnWidth: this.props.columnWidth,
        }, this.getMyMeta());
        if (this.props.data) {
            this.props.columnsetDataUpdate({ data: this.props.data, isSet: this.props.isSet }, this.getMyMeta());
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.data !== this.props.data) {
            this.props.columnsetDataUpdate({ data: newProps.data, isSet: this.props.isSet }, this.getMyMeta());
        }
        if (newProps.contentScroll !== this.props.contentScroll) {
            this.props.columnsetScroll({ contentPosition: newProps.contentScroll }, this.getMyMeta());
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
        //columnsetScrollDown,
        //columnsetScrollUp,
        columnsetScroll,
    }
)(ColumnSet);
