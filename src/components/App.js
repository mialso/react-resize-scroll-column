import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gridDataReady, gridResizeDown, gridScrollUp, gridScrollDown } from '../actions/grid'
import { appReady, scrollUp, scrollDown } from '../actions/app';
import Grid from './Grid';

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
        if (e.deltaY > 0) return this.scrollDownHandler();//props.scrollDown();
        if (e.deltaY < 0) return this.scrollUpHandler();//props.scrollUp();
        return;
    }
    componentDidMount() {
        window.addEventListener('wheel', this.wheelListener);
        this.props.appReady();
        this.props.gridResizeDown({ height: this.getGridHeight(this.state.topHeight) });
    }
    componentWillUnmount() {
        window.removeEventListener('wheel', this.wheelListener);
    }
    componentWillReceiveProps(newProps) {
        if (Array.isArray(newProps.items) && (newProps.items !== this.props.items)) {
            this.props.gridDataReady({ items: newProps.items });
        }
    }
    scrollUpHandler = () => {
        if (this.props.isGridScrollableUp) {
            console.log('scroll up handler: grid is scrollable');
            // scroll grid
        } else {
            // resize top
            const { topHeight, maxTopHeight } = this.state;
            // do nothing in case max top height
            if (topHeight >= maxTopHeight) return;
            const amountToResize = maxTopHeight - topHeight > SCROLL_SPEED ? SCROLL_SPEED : maxTopHeight - topHeight;
            this.setState({ topHeight: topHeight + amountToResize });
            // resize grid
            this.props.gridResizeDown({ height: this.getGridHeight(topHeight + amountToResize) });
        }
    }
    scrollDownHandler = () => {
        console.log('scroll down handler');
        const { topHeight } = this.state;
        if (topHeight > 0) {
            if (topHeight > SCROLL_SPEED) {
                // we may resize all amount
                this.setState({ topHeight: topHeight - SCROLL_SPEED });
                this.props.gridResizeDown({ height: this.getGridHeight(topHeight - SCROLL_SPEED) });
            } else {
                // will resize only for top available amount
                this.setState({ topHeight: 0 });
                this.props.gridResizeDown({ height: this.getGridHeight() });
                // TODO expose grid scroll
            }
        } else {
            // scroll grid
            this.props.gridScrollUp(SCROLL_SPEED);
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
                <Grid />
            </div>
        );
    }
}

const mapStateToProps = ({ items, grid }) => {
    return {
        items: items.items,
        isGridScrollableDown: grid.column.isScrollableDown(),
        isGridScrollableUp: grid.column.isScrollableUp(),
    };
};

export default connect(
    mapStateToProps,
    {
        gridDataReady,
        gridResizeDown,
        gridScrollUp,
        gridScrollDown,
        appReady,
        scrollUp,
        scrollDown,
    }
)(App);
