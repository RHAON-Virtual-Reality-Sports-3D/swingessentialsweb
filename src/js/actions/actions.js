/* Constants */
    export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
    export const TOKEN_FROM_STORAGE = "TOKEN_FROM_STORAGE";
    export const SET_TARGET_ROUTE = 'SET_TARGET_ROUTE';

    export const LOGIN = {SUCCESS: 'LOGIN_SUCCESS', FAIL: 'LOGIN_FAIL'};
    export const LOGOUT = {SUCCESS: 'LOGOUT_SUCCESS', FAIL: 'LOGOUT_FAIL'};
    export const VALIDATE_PASSWORD = {REQUEST: 'VALIDATE_PASSWORD', SUCCESS: 'VALIDATE_PASSWORD_SUCCESS', FAIL: 'VALIDATE_PASSWORD_FAIL'};
    export const UPDATE_CREDENTIALS = {REQUEST: 'UPDATE_CREDENTIALS', SUCCESS: 'UPDATE_CREDENTIALS_SUCCESS', FAIL: 'UPDATE_CREDENTIALS_FAIL'};
    
    export const PUT_USER_DATA = {SUCCESS: 'PUT_USER_DATA_SUCCESS', FAIL: 'PUT_USER_DATA_FAIL'};
    export const GET_USER_DATA = {SUCCESS: 'GET_USER_DATA_SUCCESS', FAIL: 'GET_USER_DATA_FAIL'};
    export const GET_SETTINGS = {SUCCESS: 'GET_SETTINGS_SUCCESS', FAIL: 'GET_SETTINGS_FAIL'};
    export const GET_LESSONS = {REQUEST: 'GET_LESSONS', SUCCESS: 'GET_LESSONS_SUCCESS', FAIL: 'GET_LESSONS_FAIL'};
    export const GET_TIPS = {REQUEST: 'GET_TIPS', SUCCESS: 'GET_TIPS_SUCCESS', FAIL: 'GET_TIPS_FAIL'};
    export const GET_BLOGS = {REQUEST: 'GET_BLOGS', SUCCESS: 'GET_BLOGS_SUCCESS', FAIL: 'GET_BLOGS_FAIL'};
    export const GET_CREDITS = {SUCCESS: 'GET_CREDITS_SUCCESS', FAIL: 'GET_CREDITS_FAIL'};
    export const GET_PACKAGES = {SUCCESS: 'GET_PACKAGES_SUCCESS', FAIL: 'GET_PACKAGES_FAIL'};
   
    export const MENU = {OPEN: 'OPEN_MENU', CLOSE: 'CLOSE_MENU'}; 
    export const DRAWER = {OPEN: 'OPEN_DRAWER', CLOSE: 'CLOSE_DRAWER'}; 
    

/* Base URL for fetch commands */    
const baseUrl = 'http://www.josephpboyle.com/api/myapi.php/';


/* Database fetch actions */

export function requestDataFromToken(token){
    return (dispatch) => {
        dispatch({type:TOKEN_FROM_STORAGE, token:token});
        dispatch(getUserData(token))
        .then(() => dispatch(getLessons(token)))
        //.then(() => dispatch(getCredits(token)))
        .then(() => dispatch(getSettings(token)));
        //.then(() => dispatch(getPackages(token)));
    }
}

export function requestLogin(userCredentials){
    return (dispatch) => {
        return fetch(baseUrl+'login', { 
            headers: {
                'Authorization': 'Basic ' + window.btoa(userCredentials.username) + '.' + window.btoa(userCredentials.password)
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    const token = response.headers.get('Token');
                    response.json()
                    .then((json) => dispatch(success(LOGIN.SUCCESS, {...json,token:token})))
                    .then(() => dispatch(getLessons(token)))
                    //.then(() => dispatch(getCredits(token)))
                    .then(() => dispatch(getSettings(token)));
                    //.then(() => dispatch(getPackages(token)));
                    break;
                default:
                    //dispatch(loginFailure(response));
                    dispatch(failure(LOGIN.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function requestLogout(token){
    return (dispatch) => {
        return fetch(baseUrl+'logout', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(LOGOUT.SUCCESS));
                    break;
                default:
                    dispatch(failure(LOGOUT.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function validatePassword(token, pass){
    return (dispatch) => {
        dispatch({type: VALIDATE_PASSWORD.REQUEST});

        return fetch(baseUrl+'verify',{
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({password:window.btoa(pass)})
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    dispatch(success(VALIDATE_PASSWORD.SUCCESS));
                    break;
                default:
                    dispatch(failure(VALIDATE_PASSWORD.FAIL, response));
            }
        })
        .catch((error) => console.error(error));
    }
}

export function getUserData(token){
    return (dispatch) => {
        return fetch(baseUrl+'user', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_USER_DATA.SUCCESS, json)));
                    break;
                default:
                    dispatch(failure(GET_USER_DATA.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function putUserData(data, token){
    return (dispatch) => {
        return fetch(baseUrl+'details', { 
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(PUT_USER_DATA.SUCCESS));
                    dispatch(getUserData(token));
                    break;
                default:
                    dispatch(failure(PUT_USER_DATA.FAIL, response));
                    dispatch(getUserData(token));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function updateUserCredentials(data, token){
    return (dispatch) => {
        dispatch({type: UPDATE_CREDENTIALS.REQUEST});
        if(Object.keys(data).length < 1){return;}
        return fetch(baseUrl+'credentials', { 
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    dispatch(success(UPDATE_CREDENTIALS.SUCCESS));
                    dispatch(getUserData(token));
                    //TODO: we will get a new token here
                    break;
                default:
                    dispatch(failure(UPDATE_CREDENTIALS.FAIL, response));
                    dispatch(getUserData(token));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function getLessons(token){
    return (dispatch) => {
        dispatch({type: GET_LESSONS.REQUEST});
        return fetch(baseUrl+'lessons', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_LESSONS.SUCCESS, json)))
                    .then((response) => localStorage.setItem('lessons',JSON.stringify(response.data)));
                    break;
                default:
                    dispatch(failure(GET_LESSONS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function getTips(){
    return (dispatch) => {
        dispatch({type: GET_TIPS.REQUEST});
        return fetch(baseUrl+'tips')
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_TIPS.SUCCESS, json)))
                    .then((response) => localStorage.setItem('tips',JSON.stringify(response.data)));
                    break;
                default:
                    dispatch(failure(GET_TIPS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function getBlogs(){
    return (dispatch) => {
        dispatch({type: GET_BLOGS.REQUEST});
        return fetch(baseUrl+'blogs')
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_BLOGS.SUCCESS, json)))
                    .then((response) => localStorage.setItem('blogs',JSON.stringify(response.data)));
                    break;
                default:
                    dispatch(failure(GET_BLOGS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function getCredits(token){
    return (dispatch) => {
        return fetch(baseUrl+'credits', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_CREDITS.SUCCESS, json)));
                    break;
                default:
                    dispatch(failure(GET_CREDITS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function getSettings(token){
    return (dispatch) => {
        return fetch(baseUrl+'settings', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_SETTINGS.SUCCESS, json)));
                    break;
                default:
                    dispatch(failure(GET_SETTINGS.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}

export function getPackages(token){
    return (dispatch) => {
        return fetch(baseUrl+'packages', { 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            switch(response.status) {
                case 200:
                    response.json()
                    .then((json) => dispatch(success(GET_PACKAGES.SUCCESS, json)));
                    break;
                default:
                    dispatch(failure(GET_PACKAGES.FAIL, response));
                    break;
            }
        })
        .catch((error) => console.error(error));
    }
}


/* Success/Failure Actions for the above Request types */

function failure(type, response){
    return{
        type: type,
        response: response,
        error: response.headers.get('Error')
    }
}
function success(type, data=null){
    return{
        type: type,
        data: data
    }
}

/* Navigation and Menu Actions */

export function openNavMenu(){
    return{
        type: MENU.OPEN
    }
}
export function openNavDrawer(){
    return{
        type: DRAWER.OPEN
    }
}
export function closeNavMenu(){
    return{
        type: MENU.CLOSE
    }
}
export function closeNavDrawer(){
    return{
        type: DRAWER.CLOSE
    }
}
export function setTargetRoute(route){
    return{
        type: SET_TARGET_ROUTE,
        route: route
    }
}