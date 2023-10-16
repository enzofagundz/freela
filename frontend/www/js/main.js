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
    localStorage.setItem(attribute, JSON.stringify(value))
}

function getStorage(attribute) {
    return JSON.parse(localStorage.getItem(attribute))
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

function setListView(items, list) {
    const listview = $(list)
    items.forEach((item) => {
        listview.append(`
            <li>
                <a href="#page_project" onclick="setProject(${item.id})">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                    <p class="ui-li-aside">${item.price}</p>
                </a>
            </li>
        `)
    })
    listview.listview('refresh')
}

$(document).ready(function() {
    function init() {
        emailRegister()
        authToken()
        userRegister()
        userLogin()
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
                    $('#email_auth').val('')
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
                token: $('#token').val()
            }

            request('auth', 'PATCH', data)
                .then((response) => {
                    setStorage('token', response.token)
                    $('#token').val('')
                    changePage('#page_register')
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
                email: getStorage('email'),
                password: $('#password_register').val(),
                confirmPassword: $('#confirm_password').val(),
                name: $('#name_register').val(),
                work: $('#work_register').val()
            }

            request('register', 'POST', data)
                .then((response) => {
                    setStorage('user', response.user)
                    $('#password_register').val('')
                    $('#confirm_password').val('')
                    $('#name_register').val('')
                    $('#work_register').val('')
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
                    setStorage('user', response)
                    $('#email_login').val('')
                    $('#password_login').val('')
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
            const user = getStorage('user');
            const data = {
                name: $('#project_name').val(),
                description: $('#project_description').val() ?? '',
                price: $('#project_price').val(),
                deliveryDate: $('#project_deadline').val(),
                userId: user.id,
                status: $('#project_status').val(),
                categories: $('#project_category').val(),
                customerName: $('#customer_name').val(),
                customerEmail: $('#customer_email').val(),
            }

            request('projects', 'POST', data)
                .then((response) => {
                    setStorage('project', response)
                    $('#project_name').val('')
                    $('#project_description').val('')
                    $('#project_price').val('')
                    $('#project_deadline').val('')
                    $('#project_status').val('')
                    $('#project_category').val('')
                    $('#customer_name').val('')
                    $('#customer_email').val('')
                    setListView(response, '#list_projects')
                    changePage('#home')
                })
                .catch((error) => {
                    console.log(error)
                })
        })
    }
})