import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gridDataReady, gridUpdateHeight } from '../actions/grid'
import { appReady, scrollUp, scrollDown } from '../actions/app';
import Grid from './Grid';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topHeight: 300,
        };
    }

    wheelListener = (e) => {
        if (e.deltaY > 0) return this.props.scrollDown();
        if (e.deltaY < 0) return this.props.scrollUp();
        return;
    }
    componentDidMount() {
        window.addEventListener('wheel', this.wheelListener);
        this.props.appReady();
        this.props.gridUpdateHeight({ height: window.innerHeight - this.state.topHeight });
    }
    componentWillUnmount() {
        window.removeEventListener('wheel', this.wheelListener);
    }
    componentWillReceiveProps(newProps) {
        if (Array.isArray(newProps.items) && (newProps.items !== this.props.items)) {
            this.props.gridDataReady({ items: newProps.items });
        }
    }
    render() {
        return (
            <div className="App">
                <div style={{ height: this.state.topHeight }}>TOP</div>
                <Grid />
            </div>
        );
    }
}

const mapStateToProps = ({ items, grid }) => {
    return {
        items: items.items,
    };
};

export default connect(
    mapStateToProps,
    {
        gridDataReady,
        gridUpdateHeight,
        appReady,
        scrollUp,
        scrollDown,
    }
)(App);
