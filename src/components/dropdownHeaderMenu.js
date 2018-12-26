import React from 'react';
import DropdownMenu from 'react-dd-menu';
import 'react-dd-menu/dist/react-dd-menu.css'

class DropdownHeaderMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            isMenuOpen: false
        };
        this.close = this.close.bind(this);
    }

    toggle = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    close() {
        this.setState({ isMenuOpen: false });
    }

    render() {
        const menuOptions = {
            isOpen: this.state.isMenuOpen,
            close: this.close,
            toggle: <button type="button" className='headerDDButton' onClick={this.toggle}>{this.props.title}</button>,
            align: 'center'

        };
        return (
            <div>
                <DropdownMenu {...menuOptions}>
                    <h3 className='dDOption'>
                        <div className='addPadding'>
                            <a className='dDOption' href="/login">{this.props.option1}</a>
                            <br/>
                            <a className='dDOption' href="/tracker">{this.props.option2}</a>
                            <br/>
                            <a className='dDOption' href="/newEntry">{this.props.option3}</a>
                            <br/>
                            <a className='dDOption' href="/dataAnalysis">{this.props.option4}</a>
                            <br/>
                            <a className='dDOption' href="/settings">{this.props.option5}</a>
                        </div>
                    </h3>
                </DropdownMenu>
            </div>
        );
    }
}

export default DropdownHeaderMenu