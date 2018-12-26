import React from "react";

/**
 * For use with allowing multiple photos to be shown. TBD if it will work
 */
export const imageFormatter = (photo_link) => {
    return <img src={photo_link} height={125}/>
}

/**
 * Creates a logout button that calls logoutAndReset
 */
export const logoutButton = () => {
    return <button type="button" className='logoutTypeButtons' onClick={logoutAndReset}>Logout</button>
}

/**
 * Removes login details and refreshes the page
 */
export const logoutAndReset = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('password')
    window.location.reload()
}

/**
 * Adds the <img> tag to each image url, so it will load correctly in the tracker table
 */
export const formatPhotosWithHTMLTag = (response) => {
    for(let i = 0; i < response.length; i++){
        response[i].photos = <img src={response[i].photos} height={125}/>
    }
}

/**
 * Parses the name from the url attribute to a readable format
 */
export const parseNameFromURIString = (name) => {
    if(name.slice(0,6) === '?name='){
        let name_only_encoded = name.slice(9)
        try {
            return decodeURI(name_only_encoded)
        }
        catch(err) {
            console.log("Malformed URI")
        }
    }
    else{
        return("No Name Found")
    }
}

/**
 * Fetches all of the data from the database
 */
export const getAllRequest = () => {
    let url = 'http://127.0.0.1:5000/alcohol'
    return fetch(url).then(response =>
        response.json()
            .then(json => {
                if (response.ok) {
                    return json
                }
                else {
                    Promise.reject(json)
                    if (response.status === 401) {
                        throw String('unauthorized user')
                    }
                }
            })
    )
}

/**
 * Fetches a single row from the database
 */
export const getSingleRequest = (name) => {
    let url = 'http://127.0.0.1:5000/alcohol/' + name
    return fetch(url).then(response =>
        response.json()
            .then(json => {
                if (response.ok) {
                    return json
                }
                else {
                    Promise.reject(json)
                    if (response.status === 401) {
                        throw String('unauthorized user')
                    }
                }
            })
    )
}

