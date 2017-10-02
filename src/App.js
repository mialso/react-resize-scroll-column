import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from './actions';
import './App.css';
import Parent from './Parent';

class App extends Component {
    wheelListener = (e) => {
        if (e.deltaY > 0) return this.props.scrollDown();
        if (e.deltaY < 0) return this.props.scrollUp();
        return;
    }
    componentDidMount() {
        window.addEventListener('wheel', this.wheelListener);
    }
    componentWillUnmount() {
        window.removeEventListener('wheel', this.wheelListener);
    }
    render() {
        return (
            <div className="App">
                <Parent
                    key="1"
                    minHeight={100}
                    maxHeight={300}
                    pos={0}
                    childData={this.props.dataOne} />
                <Parent
                    minHeight={0}
                    maxHeight={500}
                    key="2"
                    pos={1}
                    childData={this.props.dataTwo} />
                <Parent
                    minHeight={0}
                    maxHeight={800}
                    key="3" 
                    pos={2}
                    childData={this.props.dataThree} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        dataOne: state.dataToDisplay[0],
        dataTwo: state.dataToDisplay[1],
        dataThree: state.dataToDisplay[2],
    };
};

export default connect(
    mapStateToProps,
    actions,
)(App);
