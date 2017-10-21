import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appReady, scrollUp, scrollDown } from '../actions/app';
import ColumnSet from './ColumnSet';
import './App.css';

const SCROLL_SPEED = 15;

function Car(props) {
    const { year, horsePower, photoHeight } = props.data;
    return (
        <div className="Car">
            <div className="Car-photo" style={{width: '100%', height: photoHeight}}></div>
            <div className="Car-year" style={{height: 30}}>{year}</div>
            <div className="Car-horsePower" style={{height: 30}}>{horsePower}</div>
        </div>
    );
}

function Divider() {
    return (
        <div className="Car-divider" style={{ width: '100%', height: 20 }}></div>
    );
}

function calculateCarSize(car) {
    return 30 + 30 + car.photoHeight;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topHeight: 300,
            maxTopHeight: 300,
            minTopHeight: 0,
            topCollapsed: true,
            topExpanded: false,
            gridHeight: window.innerHeight - 300,
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
            return this.scrollDownHandler(e);
        }
        if (e.deltaY < 0) {
            return this.scrollUpHandler(e);
        }
        return;
    }
    scrollUpHandler = (e) => {
        e.preventDefault();
        console.log('scroll up handler');
        if (this._columnset.isScrollableDown()) {
            /*
            console.log('scroll up handler: grid is scrollable');
            // scroll grid
            this.props.columnsetScrollDown(SCROLL_SPEED);
            */
            this._columnset.scrollHandler(e, SCROLL_SPEED);
        } else {
            // resize top
            const { topHeight, maxTopHeight } = this.state;
            // do nothing in case max top height
            if (topHeight >= maxTopHeight) return;
            const amountToResize = maxTopHeight - topHeight > SCROLL_SPEED ? SCROLL_SPEED : maxTopHeight - topHeight;
            this.setState({
                topHeight: topHeight + amountToResize,
                gridHeight: this.getGridHeight(topHeight + amountToResize),
            });
            // resize grid
            //this.props.columnsetResizeDown({ height: this.getGridHeight(topHeight + amountToResize) });
            //this._columnset.resizeDown(this.getGridHeight(topHeight + amountToResize));
        }
    }
    scrollDownHandler = (e) => {
        e.preventDefault();
        console.log('scroll down handler');
        const { topHeight } = this.state;
        if (topHeight > 0) {
            if (topHeight > SCROLL_SPEED) {
                // we may resize all amount
                this.setState({
                    topHeight: topHeight - SCROLL_SPEED,
                    gridHeight: this.getGridHeight(topHeight - SCROLL_SPEED),
                });
                //this.props.columnsetResizeDown({ height: this.getGridHeight(topHeight - SCROLL_SPEED) });
                //this._columnset.resizeDown(this.getGridHeight(topHeight - SCROLL_SPEED));
            } else {
                // will resize only for top available amount
                this.setState({ topHeight: 0, gridHeight: this.getGridHeight() });
                //this.props.columnsetResizeDown({ height: this.getGridHeight() });
                //this._columnset.resizeDown(this.getGridHeight());
                // TODO expose grid scroll
            }
        } else if (this._columnset.isScrollableUp()) {
                // scroll grid
                //this.props.columnsetScrollUp(SCROLL_SPEED);
                this._columnset.scrollHandler(e, SCROLL_SPEED);
        } else {
            //this.props.columnsetResizeUp({ height: this.props.currentGridHeight - SCROLL_SPEED });
            //this._columnset.resizeUp(this._columnset.getHeight() - SCROLL_SPEED);
        }
    }
    getGridHeight = (topHeight = 0) => {
        return window.innerHeight - topHeight;
    }
    refColumnset = (columnset) => {
        this._columnset = columnset;
    }
    expandTop = () => {
        this.setState({
            topHeight: 500,
            gridHeight: this.getGridHeight(500),
            maxTopHeight: 500,
            topExpanded: true,
            topCollapsed: false,
        });
    }
    collapseTop = () => {
        this.setState({
            topHeight: 300,
            gridHeight: this.getGridHeight(300),
            maxTopHeight: 300,
            topExpanded: false,
            topCollapsed: true,
        });
    }
    render() {
        const { topHeight, gridHeight, maxTopHeight, topExpanded, topCollapsed } = this.state;
        return (
            <div className="App">
                <div style={{ height: maxTopHeight, marginTop: topHeight - maxTopHeight }}>
                    TOP
                    <button onClick={this.expandTop} disabled={topExpanded}>Expand</button>
                    <button onClick={this.collapseTop} disabled={topCollapsed}>Collapse</button>
                </div>
                <ColumnSet
                    id="first"
                    refColumnset={this.refColumnset}
                    //addScrollHandler={this.addScrollHandler}
                    width={500}
                    columnWidth={150}
                    makeHeight={gridHeight}
                    fullViewSize={window.innerHeight}
                    data={this.props.cars}
                    childData={{ renderer: Car, getSize: calculateCarSize }}
                    divider={{ renderer: Divider, size: 20 }}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ items, columnset }) => {
    return {
        items: items.items,
        largeItems: items.large,
        itemsByDate: items.byDate,
        cars: items.cars,
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
