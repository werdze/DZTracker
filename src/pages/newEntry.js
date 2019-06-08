import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Layout from '../components/layout'
import {logoutButton, baseFlaskUrl} from "../utils";
import 'bootstrap/dist/css/bootstrap.min.css';

import { registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

registerPlugin(FilePondPluginImagePreview);


class newEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: "",
            name: "",
            company: "",
            type: "",
            subtype: "",
            origin_country: "",
            origin_city: "",
            rating: "",
            comments: "",
            ingredients: "",
            abv: "",
        };
    }

    /**
     * Posts the data to the database (adds a new row in the table)
     */
    postRequest(){
        let url = baseFlaskUrl + '/addAlcohol'
        fetch(url, {
            method: "POST",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                photos: this.state.photos,
                name: this.state.name,
                company: this.state.company,
                type: this.state.type,
                subtype: this.state.subtype,
                origin_country: this.state.origin_country,
                origin_city: this.state.origin_city,
                rating: this.state.rating,
                comments: this.state.comments,
                ingredients: this.state.ingredients,
                abv: this.state.abv,
            }),
            mode:"no-cors",
        })
        window.location.replace('/tracker')
    }

    /**
     * Makes sure that the name field is not empty
     */
    validateForm() {
        return this.state.name.length > 0;
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
     * ...
     */
    onSubmit = event => {
        this.postRequest()
        event.preventDefault();
    }

    render () {
        return (
            <Layout>
                <div className="alignRight">{logoutButton()}</div>
                <form onSubmit={this.onSubmit} id='login-form' className='centered'>
                    {/*<div className='uploadLabel'>*/}
                        {/*<ControlLabel>Upload a photo here:</ControlLabel>*/}
                    {/*</div>*/}
                    {/*<br/>*/}
                    {/*<FilePond allowMultiple={true} server={baseUrl + "/uploadPhoto/" + this.state.name}>*/}
                        {/*{console.log(this.state.name)}*/}
                    {/*</FilePond>*/}
                    <br/><br/>
                    <FormGroup controlId="name" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl autoFocus value={this.state.name} placeholder="Name (Required) (Only A-Z,0-9,'!*-_().)" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="company" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.company} placeholder="Brewer/Company" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="type" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.type} placeholder="Type" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="subtype" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.subtype} placeholder="Subtype" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="origin_country" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.origin_country} placeholder="Origin Country" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="origin_city" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.origin_city} placeholder="Origin City, State" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="rating" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.rating} placeholder="Rating (1-5)" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="comments" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.comments} placeholder="Comments" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="ingredients" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.ingredients} placeholder="Ingredients" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <FormGroup controlId="abv" bsSize="large">
                        <ControlLabel></ControlLabel>
                        <FormControl value={this.state.abv} placeholder="Abv" onChange={this.onChange} type="text"/>
                    </FormGroup>
                    <br/>
                    <Button bsStyle="primary" block disabled={!this.validateForm()} type="submit">
                        Submit
                    </Button>
                </form>
            </Layout>
        );
    }
}

export default newEntry