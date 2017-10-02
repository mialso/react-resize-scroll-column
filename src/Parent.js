import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from './actions';

class Child extends Component {
    _element = null;
    _height = null;
    componentDidMount() {
        const { cont, pos } = this.props;
        let height = null;
        if (this._element) this._height = this._element.getBoundingClientRect().height;
        this.props.childReady(cont, pos, this._height);
    }

    componentWillReceiveProps(newProps) {
        const { cont, pos } = this.props;
        if (-newProps.marginTop > this._height) {
            this.props.removeChild(cont, pos, this._height);
        }
    }

    render() {
        const { children, marginTop } = this.props;
        return (
            <div
                ref={element => this._element = element}
                style={{marginTop: `${marginTop}px`}} className="child">
                {children}
            </div>
        );
    }
}

class Parent extends Component {
    _element = null;
    componentDidMount() {
        const { pos, minHeight } = this.props;
        let height = null;
        if (this._element) height = this._element.getBoundingClientRect().height;
        this.props.containerReady(pos, minHeight, height);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.childData.length === this.props.childData.length) return;
        if (nextProps.childData.length === 0) {
            this.props.containerFix(this.props.pos);
        }
    }
    render() {
        const { childData, viewPosition, pos } = this.props;
        return (
            <div
                ref={element => this._element = element}
                className="parent">
                {childData.map(
                    (child, index) => {
                        return (
                            <Child
                                key={child.id}
                                cont={pos}
                                pos={index}
                                childReady={this.props.childReady}
                                removeChild={this.props.removeChild}
                                marginTop={index === 0 ? -viewPosition : 0}>
                                {child.data}
                            </Child>
                        );
                    }
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    const me = state.containers[props.pos] || { position: 0, height: 0 }
    return {
        viewPosition:  me.position,
        //curHeight: me.height - me.position,
    };
};

export default connect(
    mapStateToProps,
    actions,
)(Parent);
