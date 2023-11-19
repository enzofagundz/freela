const API_URL = 'http://localhost:3000/'

function request(method, path, body) {
    if (!body) {
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

function setCustomer(id) {
    clearSession('customer')
    const customers = getStorage('customers')
    const customer = customers.find(customer => customer.id == id)
    setStorage('customer', customer)
}

function showLoader() {
    $.mobile.loading('show', {
        text: 'Carregando...',
        textVisible: true,
        theme: 'b',
        html: ''
    })
}

function hideLoader() {
    $.mobile.loading('hide')
}

function showUpdatingText(properties) {
    $('.updating-text').data('id', `${properties.id}`).css('display', 'block')
}

function hideUpdatingText(properties) {
    $('.updating-text').data('id', `${properties.id}`).fadeOut()
}

function clearStorages() {
    localStorage.clear()
    sessionStorage.clear()
}

$(document).ready(function () {
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
        editProject()
        updateProject()
        destroyProject()
        listCustomers()
        getCustomerAndRenderDialog()
        renderUserData()
        clearStorages()
    }

    init()

    // register email

    function emailRegister() {
        $('#btn_email').click(function (event) {
            event.preventDefault()
            showLoader()
            const data = {
                email: $('#email_auth').val(),
            }
            request('POST', 'auth', data)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        hideLoader()
                        return setMessage(res.error)
                    }
                    setStorage('email', res.email)
                    $('#email_auth').val('')
                    setMessage('E-mail enviado com sucesso!')
                    changePage('#page_token')
                    hideLoader()
                })
                .catch(error => {
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao enviar e-mail')
                })
        })
    }

    // auth token

    function tokenRegister() {
        $('#btn_token').click(function (event) {
            event.preventDefault()
            showLoader()
            const data = {
                email: getStorage('email'),
                token: $('#token').val()
            }

            request('PATCH', 'auth', data)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        hideLoader()
                        return setMessage(res.error)
                    }
                    setStorage('token', res.token)
                    $('#token').val('')
                    changePage('#page_register')
                    hideLoader()
                })
                .catch(error => {
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao autenticar token')
                })
        })
    }

    // register user

    function userRegister() {
        $('#btn_register').click(function (event) {
            event.preventDefault()
            showLoader()
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
                    if (res.error) {
                        hideLoader()
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
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao cadastrar usuário')
                })
        })
    }

    // login

    function userLogin() {
        $('#btn_login').click(function (event) {
            event.preventDefault()
            showLoader()
            const data = {
                email: $('#email_login').val(),
                password: $('#password_login').val()
            }
            request('POST', 'login', data)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        hideLoader()
                        return setMessage(res.error)
                    }
                    setStorage('user', res)
                    $('#email_login').val('')
                    $('#password_login').val('')
                    changePage('#home')
                    hideLoader()
                })
                .catch(error => {
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao fazer login')
                })
        })
    }

    // register customer

    function storeCustomer() {
        $('#btn_new_customer').click(function (event) {
            event.preventDefault()

            const data = {
                name: $('#name_customer').val(),
                email: $('#email_customer').val(),
                userId: getStorage('user').id
            }

            if (data.name == '' || data.email == '') {
                return setMessage('Preencha todos os campos')
            }

            showLoader()
            request('POST', 'customers', data)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        hideLoader()
                        return setMessage(res.error)
                    }

                    $('#name_customer').val('')
                    $('#email_customer').val('')
                    setSession('customer', res.customer)
                    setMessage('Cliente cadastrado com sucesso!')
                    changePage('#new_category')
                    hideLoader()
                })
                .catch(error => {
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao cadastrar cliente')
                })
        })
    }

    // register category

    function storeCategory() {
        $('#btn_new_category').click(function (event) {
            event.preventDefault()
            const data = {
                name: $('#name_category').val(),
                userId: getStorage('user').id
            }
            
            if (data.name == '') {
                return setMessage('Preencha todos os campos')
            }

            showLoader()

            request('POST', 'categories', data)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        hideLoader()
                        return setMessage(res.error)
                    }

                    $('#name_category').val('')
                    setSession('category', res.category)
                    setMessage('Categoria cadastrada com sucesso!')
                    changePage('#new_project')
                    hideLoader()
                })
                .catch(error => {
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao cadastrar categoria')
                })
        })
    }

    // register project

    function storeProject() {
        $('#btn_new_project').click(function (event) {
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

            showLoader()

            request('POST', 'projects', data)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        hideLoader()
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
                    hideLoader()
                })
                .catch(error => {
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao cadastrar projeto')
                })
        })
    }

    // select customers

    function selectCustomers() {
        $(document).on('pagebeforeshow', '#select_customer', function () {
            
            $('#select_customer_input').attr('disabled', true)

            request('GET', `customers/${getStorage('user').id}`, null)
                .then(res => res.json())
                .then(res => {

                    if (res.error) {
                        return setMessage(res.error)
                    }

                    let customers = res.customers

                    $('#select_customer_input').empty()

                    $('#select_customer_input').append(`
                        <option value="" selected>Selecione um cliente</option>
                    `)

                    customers.forEach(customer => {
                        $('#select_customer_input').append(`
                            <option value="${customer.id}">${customer.name}</option>
                        `)
                    })

                    $('#select_customer_input').selectmenu('refresh')
                    $('#select_customer_input').attr('disabled', false)
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao listar clientes')
                })
        })
    }

    // select categories

    function selectCategories() {
        $(document).on('pagebeforeshow', '#select_category', function () {

            $('#select_category_input').attr('disabled', true)

            request('GET', `categories/${getStorage('user').id}`, null)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        return setMessage(res.error)
                    }

                    let categories = res.categories

                    categories.forEach(category => {
                        $('#select_category_input').append(`
                            <option value="${category.id}">${category.name}</option>
                        `)
                    })

                    $('#select_category_input').selectmenu('refresh')
                    $('#select_category_input').attr('disabled', false)
                })
                .catch(error => {
                    console.log(error)
                    setMessage('Erro ao listar categorias')
                })
        })
    }

    // get customer by select

    function getCustomerBySelect() {
        $('#btn_select_customer').click(function (event) {
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
        $('#btn_select_category').click(function (event) {
            event.preventDefault()
            const data = {
                id: $('#select_category_input').val()
            }
            setSession('category', data)
            changePage('#new_project')
        })
    }

    // index projects

    function listProjects() {
        $(document).on('pagebeforeshow', '#home', function () {

            showUpdatingText({
                id: 'home',
            })

            request('GET', `projects/${getStorage('user').id}`, null)
                .then(res => res.json())
                .then(res => {

                    if (res.error) {
                        return setMessage(res.error)
                    }

                    let projects = res
                    setStorage('projects', projects)
                    $('#list_projects').empty()

                    hideUpdatingText({
                        id: 'home',
                    })

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
        $(document).on('pagebeforeshow', '#show_project', function () {
            const project = getStorage('project')
            $('#btns_edit_project_dialog').attr('hidden', false)
            $('#btns_show_project_dialog').attr('hidden', true)
            $('#name_project_dialog').val(project.name).textinput('disable')
            $('#price_project_dialog').val(project.price).textinput('disable')
            $('#description_project_dialog').val(project.description).textinput('disable')
            $('#delivery_date_project_dialog').val(project.deliveryDate.split('T')[0]).textinput('disable')
            $('#status_project_dialog').val(project.status).selectmenu('refresh').selectmenu('disable')
        })
    }

    // edit project

    function editProject() {
        $('#btn_edit_project_dialog').click(function (event) {
            event.preventDefault()
            $('#name_project_dialog').textinput('enable')
            $('#price_project_dialog').textinput('enable')
            $('#description_project_dialog').textinput('enable')
            $('#delivery_date_project_dialog').textinput('enable')
            $('#status_project_dialog').selectmenu('enable')
            $('#btns_edit_project_dialog').attr('hidden', true)
            $('#btns_show_project_dialog').attr('hidden', false)
        })
    }

    // update project

    function updateProject() {
        $('#btn_update_project_dialog').click(function (event) {
            event.preventDefault()
            showLoader()
            const project = getStorage('project')
            const data = {
                name: $('#name_project_dialog').val(),
                price: $('#price_project_dialog').val(),
                description: $('#description_project_dialog').val() || null,
                deliveryDate: new Date($('#delivery_date_project_dialog').val()),
                status: $('#status_project_dialog').val() || 'Em andamento',
                userId: getStorage('user').id,
                customerId: project.customerId,
                categoryId: project.categoryId
            }

            request('PATCH', `project/${getStorage('project').id}`, data)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        hideLoader()
                        return setMessage(res.error)
                    }
                    clearSession('customer')
                    clearSession('category')
                    setMessage('Projeto atualizado com sucesso!')
                    changePage('#home')
                    hideLoader()
                })
                .catch(error => {
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao atualizar projeto')
                })
        })
    }

    // destroy project

    function destroyProject() {
        $('#btn_destroy_project_dialog').click(function (event) {
            event.preventDefault()
            showLoader()
            request('DELETE', `project/${getStorage('project').id}`, null)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        hideLoader()
                        return setMessage(res.error)
                    }

                    clearSession('customer')
                    clearSession('category')
                    setMessage('Projeto excluído com sucesso!')
                    changePage('#home')
                    hideLoader()
                })
                .catch(error => {
                    hideLoader()
                    console.log(error)
                    setMessage('Erro ao excluir projeto')
                })
        })
    }

    // index customers

    function listCustomers() {
        $(document).on('pagebeforeshow', '#customer', function () {

            showUpdatingText({
                id: 'customer',
            })

            request('GET', `customers/${getStorage('user').id}`, null)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        return setMessage(res.error)
                    }

                    let customers = res.customers
                    setStorage('customers', customers)
                    $('#list_customers').empty()

                    hideUpdatingText({
                        id: 'customer',
                    })

                    customers.forEach(customer => {
                        $('#list_customers').append(`
                            <li>
                                <a href="#show_customer" onclick="setCustomer(${customer.id})">
                                    ${customer.name}
                                </a>
                            </li>
                        `)
                    })

                    $('#list_customers').listview('refresh')
                })
        })
    }

    function getCustomerAndRenderDialog() {
        $(document).on('pagebeforeshow', '#show_customer', function () {

            showUpdatingText({
                id: 'show_customer',
            })

            const customer = getStorage('customer')
            console.log(customer.id)
            request('GET', `customer/${customer.id}/user/${customer.id}`, null)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        return setMessage(res.error)
                    }

                    const projectResume = res.projects
                    console.log(projectResume)
                    $('#list_projects_customer').empty()

                    hideUpdatingText({
                        id: 'show_customer',
                    })

                    if (projectResume.length == 0) {
                        $('#list_projects_customer').append(`
                            <li>
                                <a href="#new_project">
                                    <h2>
                                        Nenhum projeto cadastrado
                                    </h2>
                                </a>
                            </li>
                        `)

                        $('#list_projects_customer').listview('refresh')

                        return
                    }

                    let data = {
                        priceTotal: [
                            'Preço total',
                            0
                        ],
                        projectsTotal: [
                            'Projetos totais',
                            0
                        ],
                        projectsInProgress: [
                            'Projetos em andamento',
                            0
                        ],
                        projectsCompleted: [
                            'Projetos concluídos',
                            0
                        ]
                    }

                    projectResume.forEach(project => {
                        data.priceTotal[1] += project.price
                        data.projectsTotal[1]++
                        project.status == 0 ? data.projectsInProgress[1]++ : data.projectsCompleted[1]++
                    })

                    for (let key in data) {
                        $('#list_projects_customer').append(`
                            <li>
                                <h2>
                                    ${data[key][0]}
                                </h2>
                                <p>
                                    ${data[key][1]}
                                </p>
                            </li>
                        `)
                    }

                    $('#list_projects_customer').listview('refresh')
                })
                .catch(error => {
                    console.log(error)
                })
        })
    }

    function renderUserData() {
        $(document).on('pagebeforecreate', '#profile', function () {
            const user = getStorage('user')

            $('#user_name').text(user.name ?? 'Não informado')
            $('#user_work').text(user.work ?? 'Não informado')
            $('#user_email').text(user.email ?? 'Não informado')
        })
    }
})