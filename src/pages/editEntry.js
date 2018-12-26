import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Layout from '../components/layout'
import {logoutButton, getSingleRequest, parseNameFromURIString} from "../utils";

import { FilePond, File, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

registerPlugin(FilePondPluginImagePreview);

class editEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: -1,
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
     * Completes a single GET request to obtain the current data for this entry to edit
     */
    async componentDidMount(){
        let name = parseNameFromURIString(this.props.location.search)
        if(name !== "No Name Found"){
            let row = await getSingleRequest(name)

            if(row.length !== 0) {
                let abv = row[0].abv === -1 ? "" : row[0].abv
                this.setState({
                    id: row[0].id,
                    photos: row[0].photos,
                    name: row[0].name,
                    company: row[0].company,
                    type: row[0].type,
                    subtype: row[0].subtype,
                    origin_country: row[0].origin_country,
                    origin_city: row[0].origin_city,
                    rating: row[0].rating,
                    comments: row[0].comments,
                    ingredients: row[0].ingredients,
                    abv: abv,
                })
            }
            else{
                window.location.replace('/tracker')
            }
        }
        else{
            window.location.replace('/tracker')
        }
    }

    /**
     * Posts the data to the database (adds a new row in the table)
     */
    putRequest(){
        let url = 'http://127.0.0.1:5000/editAlcohol/' + this.state.id
        fetch(url, {
            method: "PUT",
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
            // mode:"no-cors",
        })
        window.location.replace('/tracker')
    }

    /**
     * Calls the DELETE API to delete this entry from the database
     */
    deleteEntry() {
        let url = 'http://127.0.0.1:5000/deleteAlcohol/' + this.state.id
        fetch(url, {
            method: "DELETE",
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
            // mode:"no-cors",
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
     * Encrypts the password entered and sends login data to localStorage
     */
    onSubmit = event => {
        this.putRequest()
        event.preventDefault();
    }

    render () {
        if(this.state.id !== -1) {
            return (
                <Layout>
                    <div className="alignRight">{logoutButton()}</div>
                    <br/>
                    <form onSubmit={this.onSubmit} id='login-form' className='centered'>
                        <div className='uploadLabel'>
                            <ControlLabel>Upload a photo here:</ControlLabel>
                        </div>
                        <FilePond allowMultiple={false} server={"http://127.0.0.1:5000/uploadPhoto/" + this.state.name}/>
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
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <Button bsStyle="danger" disabled={!this.validateForm()} onClick={() => { this.deleteEntry() }} type="button">
                            Delete Entry
                        </Button>
                    </form>
                </Layout>
            );
        }
        else{
            return(
                <Layout>
                    <div></div>
                </Layout>
            )
        }
    }
}

export default editEntry