const API_URL = 'http://localhost:3000/'

function request(method, path, body) {
    // se o não possuir body, então não envia body
    if(!body) {
        return fetch(`${API_URL}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return fetch(API_URL + path, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(body)
        })
}

function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function getStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

function clearStorage(key) {
    localStorage.removeItem(key)
}

function setSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
}

function getSession(key) {
    return JSON.parse(sessionStorage.getItem(key))
}

function clearSession(key) {
    sessionStorage.removeItem(key)
}

function changePage(page) {
    $.mobile.changePage(page, { transition: 'slide', changeHash: false })
}

function logout() {
    localStorage.clear()
    changePage('#login')
}

function setMessage(message) {
    navigator.notification.alert(
        message,
        null,
        'Aviso',
        'Ok'
    )
}

function setProject(id) {
    const projects = getStorage('projects')
    const project = projects.find(project => project.id == id)
    setStorage('project', project)
}


$(document).ready(function() {
    function init() {
        emailRegister()
        tokenRegister()
        userRegister()
        userLogin()
        storeCustomer()
        storeCategory()
        storeProject()
        selectCustomers()
        selectCategories()
        getCustomerBySelect()
        getCategoryBySelect()
        listProjects()
        getProjectAndRenderDialog()
    }

    init()

    // register

    function emailRegister() {
        $('#btn_email').click(function(event) {
            event.preventDefault()

            const data ={
                email: $('#email_auth').val(),
            }

            request('POST', 'auth', data)
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        return setMessage(res.error)
                    }
                    setStorage('email', res.email)
                    $('#email_auth').val('')
                    setMessage('E-mail enviado com sucesso!')
                    changePage('#page_token')
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao enviar e-mail')
                })
        })
    }

    // auth token

    function tokenRegister() {
        $('#btn_token').click(function(event) {
            event.preventDefault()

            const data = {
                email: getStorage('email'),
                token: $('#token').val()
            }

            request('PATCH', 'auth', data)
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        return setMessage(res.error)
                    }
                    setStorage('token', res.token)
                    $('#token').val('')
                    changePage('#page_register')
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao autenticar token')
                })
        })
    }

    // register

    function userRegister() {
        $('#btn_register').click(function(event) {
            event.preventDefault()

            const data = {
                email: getStorage('email'),
                password: $('#password_register').val(),
                name: $('#name_register').val(),
                confirmPassword: $('#confirm_password').val(),
                work: $('#work_register').val(),
            }

            request('POST', 'register', data)
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        return setMessage(res.error)
                    }
                    setStorage('user', res.user)
                    $('#password_register').val('')
                    $('#confirm_password').val('')
                    $('#name_register').val('')
                    $('#work_register').val('')
                    setMessage('Usuário cadastrado com sucesso!')
                    changePage('#home')
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao cadastrar usuário')
                })
        })
    }

    // login

    function userLogin() {
        $('#btn_login').click(function(event) {
            event.preventDefault()

            const data = {
                email: $('#email_login').val(),
                password: $('#password_login').val()
            }

            request('POST', 'login', data)
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        return setMessage(res.error)
                    }
                    setStorage('user', res)
                    $('#email_login').val('')
                    $('#password_login').val('')
                    changePage('#home')
                })
        })
    }

    // register customer

    function storeCustomer() {
        $('#btn_new_customer').click(function(event) {
            event.preventDefault()

            const data = {
                name: $('#name_customer').val(),
                email: $('#email_customer').val(),
                userId: getStorage('user').id
            }

            request('POST', 'customers', data)
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        return setMessage(res.error)
                    }

                    $('#name_customer').val('')
                    $('#email_customer').val('')
                    setSession('customer', res.customer)
                    setMessage('Cliente cadastrado com sucesso!')
                    changePage('#new_category')
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao cadastrar cliente')
                })
        })
    }

    // register category

    function storeCategory() {
        $('#btn_new_category').click(function(event) {
            // userId e name

            event.preventDefault()

            const data = {
                name: $('#name_category').val(),
                userId: getStorage('user').id
            }
            
            request('POST', 'categories', data)
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        return setMessage(res.error)
                    }

                    $('#name_category').val('')
                    setSession('category', res.category)
                    setMessage('Categoria cadastrada com sucesso!')
                    changePage('#new_project')
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao cadastrar categoria')
                })
        })
    }

    // register project

    function storeProject() {
        $('#btn_new_project').click(function(event) {
            event.preventDefault()
            const data = {
                name: $('#name_project').val(),
                price: $('#price_project').val(),
                description: $('#description_project').val() || null,
                deliveryDate: new Date($('#delivery_date_project').val()).toISOString(),
                status: $('#status_project').val() || 'Em andamento',
                userId: getStorage('user').id,
                customerId: getSession('customer').id,
                categoryId: getSession('category').id
            }

            request('POST', 'projects', data)
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        return setMessage(res.error)
                    }

                    $('#name_project').val('')
                    $('#price_project').val('')
                    $('#description_project').val('')
                    $('#delivery_date_project').val('')
                    clearSession('customer')
                    clearSession('category')
                    setMessage('Projeto cadastrado com sucesso!')
                    changePage('#home')
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao cadastrar projeto')
                })
        })
    }

    // select customers

    function selectCustomers() {
        $(document).on('pagebeforeshow', '#select_customer', function() {
            request('GET', `customers/${getStorage('user').id}`, null)
                .then(res => res.json())
                .then(res => {

                    if(res.error) {
                        return setMessage(res.error)
                    }

                    let customers = res.customers

                    customers.forEach(customer => {
                        $('#select_customer_input').append(`
                            <option value="${customer.id}">${customer.name}</option>
                        `)
                    })

                    $('#select_customer_input').selectmenu('refresh') 
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao listar clientes')
                })
        })
    }

    // select categories

    function selectCategories() {
        $(document).on('pagebeforeshow', '#select_category', function() {
            request('GET', `categories/${getStorage('user').id}`, null)
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        return setMessage(res.error)
                    }

                    let categories = res.categories

                    categories.forEach(category => {
                        $('#select_category_input').append(`
                            <option value="${category.id}">${category.name}</option>
                        `)
                    })

                    $('#select_category_input').selectmenu('refresh')
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao listar categorias')
                })
        })
    }

    // get customer by select

    function getCustomerBySelect() {
        $('#btn_select_customer').click(function(event) {
            event.preventDefault()
            const data = {
                id: $('#select_customer_input').val()
            }
            setSession('customer', data)
            changePage('#new_category')
        })
    }

    // get category by select

    function getCategoryBySelect() {
        $('#btn_select_category').click(function(event) {
            event.preventDefault()
            const data = {
                id: $('#select_category_input').val()
            }
            setSession('category', data)
            changePage('#new_project')
        })
    }

    function listProjects() {
        $(document).on('pagebeforeshow', '#home', function() {
            request('GET', `projects/${getStorage('user').id}`, null)
                .then(res => res.json())
                .then(res => {

                    if(res.error) {
                        return setMessage(res.error)
                    }

                    let projects = res
                    setStorage('projects', projects)
                    $('#list_projects').empty()
                    
                    projects.forEach(project => {
                        $('#list_projects').append(`
                            <li>
                                <a href="#show_project" onclick="setProject(${project.id})">
                                    ${project.name}
                                </a>
                            </li>
                        `)
                    })

                    $('#list_projects').listview('refresh')
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao listar projetos')
                })
        })
    }

    // get project and render modal

    function getProjectAndRenderDialog() {
        $(document).on('pagebeforeshow', '#show_project', function() {
            const project = getStorage('project')
            $('#name_project_dialog').val(project.name).textinput('disable')
            $('#price_project_dialog').val(project.price).textinput('disable')
            $('#description_project_dialog').val(project.description).textinput('disable')
            $('#delivery_date_project_dialog').val(project.deliveryDate.split('T')[0]).textinput('disable')
            $('#status_project_dialog').val(project.status).selectmenu('refresh').selectmenu('disable')
        })
    }
})