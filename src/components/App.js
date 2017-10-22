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
        <div className="Car-divider" style={{ width: '100%', height: 20 }}>
            divider
        </div>
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
            gridContentScroll: 0,
        };
    }
    componentDidMount() {
        window.addEventListener('wheel', this.wheelListener);
        this.props.appReady();
    }
    componentWillUnmount() {
        window.removeEventListener('wheel', this.wheelListener);
    }
    _gridState = {};
    scrollAmount = 0;
    ticking = false;

    wheelListener = (e) => {
        if (e.deltaY > 0) {
            this.scrollAmount -= 1;
            
            //return this.scrollDownHandler(e);
        }
        if (e.deltaY < 0) {
            this.scrollAmount += 1;
            //return this.scrollUpHandler(e);
        }
        this.handleScrolling(this);
        return;
    }
    handleTicking = (g) => {
        if (!g.ticking) {
            requestAnimationFrame(() => {
                g.handleScrolling();
                g.ticking = false;
            });
        }
        g.ticking = true;
    }
    handleScrolling = () => {
        this.scrollAmount > 0
            ? this.scrollUpHandler(this.scrollAmount)
            : this.scrollDownHandler(-this.scrollAmount);
        this.scrollAmount = 0;
    }
    scrollUpHandler = (amount) => {
        const toScroll = SCROLL_SPEED * amount;
        if (this.isGridFullView() && this._gridState.isScrollableDown) {
            this.setState({ gridContentScroll: this.state.gridContentScroll + toScroll });
        } else {
            // resize top
            const { topHeight, maxTopHeight } = this.state;
            // do nothing in case max top height
            if (topHeight >= maxTopHeight) return;
            const amountToResize = maxTopHeight - topHeight > toScroll ? toScroll : maxTopHeight - topHeight;
            this.setState({
                topHeight: topHeight + amountToResize,
                gridHeight: this.getGridHeight(topHeight + amountToResize),
            });
        }
    }
    scrollDownHandler = (amount) => {
        const { topHeight } = this.state;
        const toScroll = amount * SCROLL_SPEED;
        if (topHeight > 0) {
            if (topHeight > toScroll) {
                // we may resize all amount
                this.setState({
                    topHeight: topHeight - toScroll,
                    gridHeight: this.getGridHeight(topHeight - toScroll),
                });
            } else {
                // will resize only for top available amount
                this.setState({ topHeight: 0, gridHeight: this.getGridHeight() });
            }
        } else if (this.isGridFullView() && this._gridState.isScrollableUp) {
            // scroll grid
            this.setState({ gridContentScroll: this.state.gridContentScroll - toScroll });
        } else {
            //this.props.columnsetResizeUp({ height: this.props.currentGridHeight - SCROLL_SPEED });
            //this._columnset.resizeUp(this._columnset.getHeight() - SCROLL_SPEED);
            this.setState({ gridHeight: this.state.gridHeight - toScroll });
        }
    }
    getGridHeight = (topHeight = 0) => {
        return window.innerHeight - topHeight;
    }
    isGridFullView = () => {
        return this._gridState.height === Number.parseInt(window.innerHeight) && this._gridState.isFullView;
    }
    gridStateHandler = (gridState) => {
        this._gridState = gridState;
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
        const { topHeight, gridHeight, maxTopHeight, topExpanded, topCollapsed, gridContentScroll } = this.state;
        return (
            <div className="App">
                <div style={{ height: maxTopHeight, marginTop: topHeight - maxTopHeight }}>
                    TOP
                    <button onClick={this.expandTop} disabled={topExpanded}>Expand</button>
                    <button onClick={this.collapseTop} disabled={topCollapsed}>Collapse</button>
                </div>
                <ColumnSet
                    id="first"
                    width={600}
                    columnWidth={180}
                    makeHeight={gridHeight}
                    contentScroll={gridContentScroll}
                    fullViewSize={window.innerHeight}
                    data={this.props.yearCars50}
                    stateHandler={this.gridStateHandler}
                    childData={{
                        renderer: Car,
                        getSize: calculateCarSize,
                    }}
                    divider={{ renderer: Divider, size: 20 }}
                />
                <Divider />
                <ColumnSet
                    id="second"
                    width={600}
                    columnWidth={180}
                    makeHeight={0}
                    contentScroll={() => {}}
                    data={this.props.yearCars60}
                    stateHandler={() => {}}
                    childData={{
                        renderer: Car,
                        getSize: calculateCarSize,
                    }}
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
        yearCars50: items.yearCars ? items.yearCars['50s'] : [],
        yearCars60: items.yearCars ? items.yearCars['60s'] : [],
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
