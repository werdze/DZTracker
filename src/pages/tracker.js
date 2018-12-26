import React from 'react'
import Layout from '../components/layout'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { numberFilter, Comparator , textFilter} from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {logoutButton, formatPhotosWithHTMLTag, getAllRequest} from "../utils";


const columns = [
    {
    dataField: 'id',
    text: 'ID',
    hidden: true,
}, {
    dataField: 'photos',
    text: 'Photos',
    // dataFormat: this.imageFormatter,
}, {
    dataField: 'name',
    text: 'Name',
    sort: true,
    filter: textFilter(),
}, {
    dataField: 'company',
    text: 'Company',
    sort: true,
    hidden: true,
}, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    filter: textFilter(),
}, {
    dataField: 'subtype',
    text: 'Subtype',
    sort: true,
    hidden: true,
}, {
    dataField: 'origin_country',
    text: 'Origin Country',
    sort: true,
    hidden: true,
}, {
    dataField: 'origin_city',
    text: 'Origin City',
    sort: true,
    hidden: true,
}, {
    dataField: 'rating',
    text: 'Rating',
    sort: true,
    filter: numberFilter({
        defaultValue: { comparator: Comparator.EQ }
}),
}, {
    dataField: 'comments',
    text: 'Comments',
    hidden: true,
}, {
    dataField: 'ingredients',
    text: 'Ingredients',
    hidden: true,
}, {
    dataField: 'abv',
    text: 'Abv',
    hidden: true,
},];

/**
 * Works with BootstrapTable to allow a user to click on a row, expand it and see the below info
 */
const expandRow = {

    renderer: row => (
        <div>
            <p>{`Brewer/Company: ${row.company}` }</p>
            <p>{`Subtype: ${row.subtype}` }</p>
            <p>{`Origin Country: ${row.origin_country}` }</p>
            <p>{`Origin City: ${row.origin_city}` }</p>
            <p>{`Comments: ${row.comments}` }</p>
            <p>{`Ingredients: ${row.ingredients}` }</p>
            <p>{`ABV: ${row.abv === -1 ? "" : row.abv}` }</p>
            <a href={`http://localhost:8000/editEntry?name= ${row.name}`}>Edit</a>
        </div>
    )
};


class Tracker extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            data: null,
            search: "",
            search_data: null,
        }
    }

    /**
     * Calls getData to get the data from the database
     */
    componentDidMount() {
        this.getData()
    }

    /**
     * Calls getAllRequest to get the data from the database and then sets the states
     */
    async getData(){
        let response = await getAllRequest()
        response.reverse()
        formatPhotosWithHTMLTag(response)
        this.setState({
            data: response,
            search_data: response
        })
    }

    /**
     * Will save the data when inputted into the correct state
     */
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        this.fillTableData(this.state.data, e.target.value)
    }

    /**
     * Will reset the search_data state to the data state info, when backspace is pressed
     */
    onKeyDown = e => {
        if (e.keyCode === 8) {
            this.setState({
                search_data: this.state.data
            })
        }
    }

    /**
     * Prepares table data when the search box is used
     */
    fillTableData(allData, search_text) {
        let narrowed_data = [];
        for (let row = 0; row < allData.length; row++) {
            let search_string_found = false;

            let values = Object.values(allData[row])
            values = [...values.slice(0,3), ...values.slice(4,8), ...values.slice(9,12)]

            for (let ind = 0; ind < values.length; ind++){
                let val = values[ind]
                if(val === null){
                    val = ''
                }
                else{
                    val = val.toString().toLowerCase()
                }
                if(val.includes(search_text.toLowerCase())){
                    search_string_found = true;
                }
            }

            if(search_string_found) {
                narrowed_data.push({
                    'id': allData[row].id,
                    'photos': allData[row].photos,
                    'name': allData[row].name,
                    'company': allData[row].company,
                    'type': allData[row].type,
                    'subtype': allData[row].subtype,
                    'origin_country': allData[row].origin_country,
                    'origin_city': allData[row].origin_city,
                    'rating': allData[row].rating,
                    'comments': allData[row].comments,
                    'ingredients': allData[row].ingredients,
                    'abv': allData[row].abv,
                });
            }
        }
        this.setState({
            search_data: narrowed_data
        })
    }

    render () {
        if (this.state.search_data !== null) {
            return (
                <Layout>
                    <div className="alignRight">
                        {logoutButton()}
                    </div>
                    <input
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        value={this.state.search}
                        type='text'
                        ref='search'
                        name='search'
                        placeholder='Search...'
                        className="searchBox"
                    />
                    <br/>
                    <div>
                        <BootstrapTable
                            keyField='id'
                            data={ this.state.search_data }
                            columns={ columns }
                            bordered={ false }
                            hover={ true }
                            // condensed={ true }
                            filter={ filterFactory() }
                            expandRow={ expandRow }
                            pagination={ paginationFactory() }/>
                    </div>
                </Layout>
            )
        }
        else{
            return (
                <div>
                    {/*Loading Data*/}
                </div>
            )
        }
    }
}

export default Tracker
