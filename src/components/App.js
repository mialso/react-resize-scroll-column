import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appReady, scrollUp, scrollDown } from '../actions/app';
import ColumnSet from './ColumnSet';
import './App.css';

const SCROLL_SPEED = 15;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topHeight: 300,
            maxTopHeight: 300,
            minTopHeight: 0,
            topCollapsed: true,
            topExpanded: false,
        };
    }
    componentDidMount() {
        window.addEventListener('wheel', this.wheelListener);
        this.props.appReady();
    }
    componentWillUnmount() {
        window.removeEventListener('wheel', this.wheelListener);
    }
    wheelListener = (e) => {
        if (e.deltaY > 0) {
            return this.scrollDownHandler();
        }
        if (e.deltaY < 0) {
            return this.scrollUpHandler();
        }
        return;
    }
    scrollUpHandler = () => {
        console.log('scroll up handler');
        if (this._columnset.isScrollableDown()) {
            /*
            console.log('scroll up handler: grid is scrollable');
            // scroll grid
            this.props.columnsetScrollDown(SCROLL_SPEED);
            */
            this._columnset.scrollDown(SCROLL_SPEED);
        } else {
            // resize top
            const { topHeight, maxTopHeight } = this.state;
            // do nothing in case max top height
            if (topHeight >= maxTopHeight) return;
            const amountToResize = maxTopHeight - topHeight > SCROLL_SPEED ? SCROLL_SPEED : maxTopHeight - topHeight;
            this.setState({ topHeight: topHeight + amountToResize });
            // resize grid
            //this.props.columnsetResizeDown({ height: this.getGridHeight(topHeight + amountToResize) });
            this._columnset.resizeDown(this.getGridHeight(topHeight + amountToResize));
        }
    }
    scrollDownHandler = () => {
        console.log('scroll down handler');
        const { topHeight } = this.state;
        if (topHeight > 0) {
            if (topHeight > SCROLL_SPEED) {
                // we may resize all amount
                this.setState({ topHeight: topHeight - SCROLL_SPEED });
                //this.props.columnsetResizeDown({ height: this.getGridHeight(topHeight - SCROLL_SPEED) });
                this._columnset.resizeDown(this.getGridHeight(topHeight - SCROLL_SPEED));
            } else {
                // will resize only for top available amount
                this.setState({ topHeight: 0 });
                //this.props.columnsetResizeDown({ height: this.getGridHeight() });
                this._columnset.resizeDown(this.getGridHeight());
                // TODO expose grid scroll
            }
        } else {
            if (this._columnset.isScrollableUp()) {
                // scroll grid
                //this.props.columnsetScrollUp(SCROLL_SPEED);
                this._columnset.scrollUp(SCROLL_SPEED);
            } else {
                //this.props.columnsetResizeUp({ height: this.props.currentGridHeight - SCROLL_SPEED });
                this._columnset.resizeUp(this._columnset.getHeight() - SCROLL_SPEED);
            }
        }
    }
    getGridHeight = (topHeight = 0) => {
        return window.innerHeight - topHeight;
    }
    refColumnset = (columnset) => {
        this._columnset = columnset;
    }
    expandTop = () => {
        this.setState({ topHeight: 500, maxTopHeight: 500, topExpanded: true, topCollapsed: false });
        this._columnset.resizeDown(this.getGridHeight(500));
    }
    collapseTop = () => {
        this.setState({ topHeight: 300, maxTopHeight: 300, topExpanded: false, topCollapsed: true });
        this._columnset.resizeDown(this.getGridHeight(300));
    }
    render() {
        const { topHeight, maxTopHeight, topExpanded, topCollapsed } = this.state;
        return (
            <div className="App">
                <div style={{ height: maxTopHeight, marginTop: topHeight - maxTopHeight }}>
                    TOP
                    <button onClick={this.expandTop} disabled={topExpanded}>Expand</button>
                    <button onClick={this.collapseTop} disabled={topCollapsed}>Collapse</button>
                </div>
                <ColumnSet
                    refColumnset={this.refColumnset}
                    width={500}
                    columnWidth={150}
                    initialHeight={window.innerHeight - topHeight}
                    fullViewSize={window.innerHeight}
                    data={this.props.items}
                    //columns={this.props.columns}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ items, columnset }) => {
    return {
        items: items.items,
        //columns: columnset.columns,
    };
};

export default connect(
    mapStateToProps,
    {
        appReady,
        scrollUp,
        scrollDown,
    }
)(App);
