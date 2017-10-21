import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    gridSetDataUpdate,
    gridSetResizeDown,
    gridSetScrollDown,
    gridSetScrollUp,
} from '../actions/gridSet'
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
        };
    }

    wheelListener = (e) => {
        if (e.deltaY > 0) return this.scrollUpHandler();//props.scrollDown();
        if (e.deltaY < 0) return this.scrollDownHandler();//props.scrollUp();
        return;
    }
    componentDidMount() {
        window.addEventListener('wheel', this.wheelListener);
        this.props.appReady();
        this.props.gridSetResizeDown({ height: this.getGridHeight(this.state.topHeight) });
    }
    componentWillUnmount() {
        window.removeEventListener('wheel', this.wheelListener);
    }
    componentWillReceiveProps(newProps) {
        if (Array.isArray(newProps.items) && (newProps.items !== this.props.items)) {
            this.props.gridSetDataUpdate({ dataArray: newProps.items });
        }
    }
    scrollDownHandler = () => {
        console.log('scroll up handler');
        if (this.props.isGridScrollableDown) {
            console.log('scroll up handler: grid is scrollable');
            // scroll grid
            this.props.gridSetScrollDown(SCROLL_SPEED);
        } else {
            // resize top
            const { topHeight, maxTopHeight } = this.state;
            // do nothing in case max top height
            if (topHeight >= maxTopHeight) return;
            const amountToResize = maxTopHeight - topHeight > SCROLL_SPEED ? SCROLL_SPEED : maxTopHeight - topHeight;
            this.setState({ topHeight: topHeight + amountToResize });
            // resize grid
            this.props.gridSetResizeDown({ height: this.getGridHeight(topHeight + amountToResize) });
        }
    }
    scrollUpHandler = () => {
        console.log('scroll down handler');
        const { topHeight } = this.state;
        if (topHeight > 0) {
            if (topHeight > SCROLL_SPEED) {
                // we may resize all amount
                this.setState({ topHeight: topHeight - SCROLL_SPEED });
                this.props.gridSetResizeDown({ height: this.getGridHeight(topHeight - SCROLL_SPEED) });
            } else {
                // will resize only for top available amount
                this.setState({ topHeight: 0 });
                this.props.gridSetResizeDown({ height: this.getGridHeight() });
                // TODO expose grid scroll
            }
        } else {
            // scroll grid
            this.props.gridSetScrollUp(SCROLL_SPEED);
        }
    }
    getGridHeight = (topHeight = 0) => {
        return window.innerHeight - topHeight;
    }
    render() {
        const { topHeight, maxTopHeight } = this.state;
        return (
            <div className="App">
                <div style={{ height: maxTopHeight, marginTop: topHeight - maxTopHeight }}>TOP</div>
                <ColumnSet />
            </div>
        );
    }
}

const mapStateToProps = ({ items, gridSet }) => {
    return {
        items: items.items,
        isGridScrollableDown: gridSet.columns.reduce((acc, col) => col.isScrollableDown() || acc, false),
        isGridScrollableUp: gridSet.columns.reduce((acc, col) => col.isScrollableUp() || acc, false),
    };
};

export default connect(
    mapStateToProps,
    {
        gridSetDataUpdate,
        gridSetResizeDown,
        gridSetScrollDown,
        gridSetScrollUp,
        appReady,
        scrollUp,
        scrollDown,
    }
)(App);
