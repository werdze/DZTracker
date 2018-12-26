import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Layout from '../components/layout'
import {logoutButton} from "../utils";
const bcrypt = require('bcryptjs');


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    /**
     * Makes sure that the username and password fields are not empty
     */
    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    /**
     * Will save the data when inputted into the correct state
     */
    onChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    /**
     * Encrypts the password entered and sends login data to localStorage
     */
    onSubmit = event => {
        bcrypt.hash(this.state.password, 10).then((pass) => {
            console.log(this.state.username)
            console.log(pass)
            localStorage.setItem('username', this.state.username)
            localStorage.setItem('password', pass)
        })
        // event.preventDefault();
    }

    render () {
        return (
            <Layout>
                <div className="alignRight">{logoutButton()}</div>
                <form onSubmit={this.onSubmit} id='login-form' className='centered'>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.username}
                            placeholder="Username"
                            onChange={this.onChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl
                            value={this.state.password}
                            placeholder="Password"
                            onChange={this.onChange}
                            type="password"
                        />
                    </FormGroup>
                    <br/>
                    <Button
                        block
                        // bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </Layout>
        );
    }
}

export default Login