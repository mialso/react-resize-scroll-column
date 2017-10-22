import React from 'react';

export class Balancer extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.version !== this.props.version) {
            return true;
        }
        return false;
    }
    render() {
        const { data, type, children } = this.props;
        const style = {
            height: data.getViewSize(),
            display: data.getSize() > 0 ? 'block' : 'none',
            overflow: 'hidden',
        };
        const childStyle = {
            marginTop: type === 'top' ? data.viewArea - data.size : 0,
            //overflow: type === 'bottom' ? 'hidden' : 'visible',
        };
        return (
            <div className="BalancerItem" style={style}>
                {
                    React.Children.map(
                        children,
                        child => React.cloneElement(
                            child,
                            {
                                applyStyle: childStyle,
                                applyClass: data._raw.renderClass,
                                data: data._raw,
                                viewData: data,
                            }
                        ),
                    )
                }
            </div>
        );
    }
}
