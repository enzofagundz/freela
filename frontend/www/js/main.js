const API_URL = 'http://localhost:3000/'

function request(endpoint, method, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: API_URL + endpoint,
            method: method,
            data: data,
            success: function(response) {
                resolve(response)
            },
            error: function(error) {
                reject(error)
            }
        })
    })
}

function setStorage(attribute, value) {
    localStorage.setItem(attribute, value)
}

function getStorage(attribute) {
    return localStorage.getItem(attribute)
}

function removeStorage(attribute) {
    localStorage.removeItem(attribute)
}

function changePage(page) {
    $.mobile.changePage(page, {
        transition: 'slide',
        changeHash: false
    })
}


$(document).ready(function() {
    function init() {
        emailRegister()
        authToken()
        userRegister()
        serLogin()
        userLogin()
        createProject()
    }

    init()

    function emailRegister() {
        $('#btn_email').click((event) => {
            event.preventDefault()
            const data = {
                email: $('#email_auth').val()
            }

            request('auth', 'POST', data)
                .then((response) => {
                    setStorage('email', response.email)
                    changePage('#page_token')

                })
                .catch((error) => {
                    console.log(error)
                })
        })
    }

    function authToken() {
        $('#btn_token').click((event) => {
            event.preventDefault()

            const data = {
                email: getStorage('email'),
                token: $('#token_auth').val()
            }

            request('auth', 'PUT', data)
                .then((response) => {
                    setStorage('token', response.token)
                    changePage('#page_home')
                })
                .catch((error) => {
                    console.log(error)
                })
        })
    }

    function userRegister() {
        $('#btn_register').click((event) => {
            event.preventDefault()

            const data = {
                email: $('#email_register').val(),
                password: $('#password_register').val(),
                confirmPassword: $('#confirm_password').val(),
                name: $('#name_register').val(),
                work: $('#work_register').val()
            }

            request('register', 'POST', data)
                .then((response) => {
                    console.log(response)
                    setStorage('user', response.user)
                    changePage('#home')
                })
                .catch((error) => {
                    console.log(error)
                })
        })
    }

    function userLogin() {
        $('#btn_login').click((event) => {
            event.preventDefault()

            const data = {
                email: $('#email_login').val(),
                password: $('#password_login').val()
            }

            request('login', 'POST', data)
                .then((response) => {
                    setStorage('user', response.user)
                    changePage('#home')
                })
                .catch((error) => {
                    console.log(error)
                })
        })
    }

    function createProject() {
        $('#btn_new_project').click((event) => {
            event.preventDefault()

            const data = {
                name: $('#name_project').val(),
                description: $('#description_project').val() ?? '',
                price: $('#price_project').val(),
                deliveryDate: $('#delivery_date_project').val(),
                status: $('#status_project').val(),
                userId: getStorage('user').id,
                categories: $('#categories_project').val(),
                customer: $('#customer_project').val()
            }

            request('projects', 'POST', data)
                .then((response) => {
                    console.log(response)
                    setStorage('project', response.project)
                    changePage('#home')
                })
                .catch((error) => {
                    console.log(error)
                })
        })
    }
})