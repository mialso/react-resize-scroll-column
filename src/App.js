import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from './actions';
import Grid from './Grid';

import './App.css';

class App extends Component {
    wheelListener = (e) => {
        if (e.deltaY > 0) return this.props.scrollDown();
        if (e.deltaY < 0) return this.props.scrollUp();
        return;
    }
    componentDidMount() {
        window.addEventListener('wheel', this.wheelListener);
        this.props.appReady();
    }
    componentWillUnmount() {
        window.removeEventListener('wheel', this.wheelListener);
    }
    componentWillReceiveProps(newProps) {
        if (Array.isArray(newProps.items) && (newProps.items !== this.props.items)) {
            this.props.gridDataReady(newProps.items);
        }
    }
    render() {
        const { width, height, columns } = this.props;
        return (
            <div className="App">
                <Grid {...{ width, height, columns }}/>
            </div>
        );
    }
}

const mapStateToProps = ({ items, grid }) => {
    return {
        items: items.items,
        width: grid.width,
        height: grid.height,
        columns: grid.columns,
    };
};

export default connect(
    mapStateToProps,
    actions,
)(App);
