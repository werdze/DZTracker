import React from 'react'
import Layout from '../components/layout'
import {logoutButton, baseFlaskUrl} from "../utils";


class DataAnalysis extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            file_data: null,
        }
    }

    /**
     * Opens a new window/tab with the backup data, ready for download
     */
    backupData(){
        let url = baseFlaskUrl + '/downloadBackupFile'
        window.open(url)
    }

    /**
     * Reads in the input file and set's the data from it to the file_data state
     */
    fileChangedHandler = (event) => {
        let f = event.target.files[0]

        let fileReader = new FileReader();
        fileReader.readAsText(f);

        this.setState({
            file_data: fileReader
        })
    }

    /**
     * Sends the backup file data to the Restore API Endpoint to process
     */
    restoreData = () => {
        if(this.state.file_data !== null) {
            let content = this.state.file_data.result;

            let url = baseFlaskUrl + '/restoreBackup'
            fetch(url, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    data: content,
                }),
                mode: "no-cors",
            })
            window.location.reload()
        }
    }

    render () {
        return (
            <Layout>
                <div className="alignRight">
                    {logoutButton()}
                </div>
                <br/>
                <div className="left">
                    <button type="button" className='logoutTypeButtons' onClick={this.backupData}>Backup Data</button>
                </div>
                    <br/>
                    <br/>
                <div className='wrapper'>
                    <input className='logoutTypeButtons' type="file" accept='.txt' onChange={this.fileChangedHandler}/>
                </div>
                    <br/>
                <div className="left">
                    <button className='logoutTypeButtons' onClick={this.restoreData}>Restore Data!</button>
                </div>

            </Layout>
        )

    }
}

export default DataAnalysis
