import React from 'react'
import Layout from '../components/layout'
import {Link, navigateTo} from "gatsby";

class IndexPage extends React.Component {

    /**
     * Will redirect to login or tracker page, depending on if the current user is already authorized
     */
    UNSAFE_componentWillMount() {
        let isAuth = true;
        if (isAuth === false) {
            navigateTo('/login');
        }
        else {
            navigateTo('/tracker');
        }
    }

    render() {
        return (
            <Layout>
                <h1>Hi people</h1>
                <p>Welcome to your new Gatsby site.</p>
                <p>Now go build something great.</p>
                <div style={{maxWidth: '300px', marginBottom: '1.45rem'}}>
                </div>
                <Link to="/tracker/">Go to tracker page</Link>
                <br/>
                <Link to="/login/">Go to login page</Link>
            </Layout>
        )
    }

}
export default IndexPage
