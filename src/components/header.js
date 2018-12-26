import React from 'react'
import '../layouts/general.css'
import DropdownHeaderMenu from "./dropdownHeaderMenu";

const headerText = <div className='headerTitle'>{"DZ's Tracker!"}</div>
const element = <DropdownHeaderMenu title={headerText} option1="Login" option2="Tracker" option3="New Entry" option4="Data Analysis" option5="Settings"/>;

const Header = ({ siteTitle }) => (
    <div className='headerBackground'
    >
        <div className='logoAndHeaderText'>
            <h1 style={{ margin: 0, textAlign:'center'}}>
                {element}
            </h1>
        </div>

    </div>
)

export default Header
