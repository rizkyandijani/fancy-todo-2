let baseURL = "http://localhost:3000"
let projectTodoId = ''
let todoForProject = false
let editing = false
let editId = ''
let editingProject = false
let editProjectId = ''
let projectCreator = ''
let queryTag = ''
let filteredTag = []


function onSignIn(googleUser){
    
    let id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        url: `${baseURL}/users/loginGoogle`,
        type: 'post',
        headers: {
            id_token
        }
    })
    .done(function(response){
        
        localStorage.setItem('token',response.token)
        localStorage.setItem('userId',response.id)
        localStorage.setItem('name',`${response.firstName} ${response.lastName}`)
        localStorage.setItem('email',response.email)
        loggedIn()
    })
    .fail((jqXHR,status,err)=>{
        console.log(status,err);
        
    })
}

function resetFormRegister(){
    $("#firstName").val('')
    $("#lastName").val('')
    $("#email").val('')
    $("#password").val('')
}

function resetFormLogin(){
    $("#email-login").val('')
    $("#password-login").val('')
}

function resetFormEdit(){
    $("#todo-title-edit").val('')
    $("#todo-desc-edit").val('')
    $("#todo-tags-edit").val('')
    $("#dateFormEdit").empty()
}

function loggedIn(){
    $("#register-page").hide()
    $("#login-page").hide()
    $("#user-and-logout").show()
    $("#nameLogged").empty()
    $("#nameLogged").append(`${localStorage.name}`)
    $("#main-page").show()
    projectTodoId = ''
    todoForProject = false
    editing = false
    editId = ''
    editingProject = false
    editProjectId = ''
    projectCreator = ''
    queryTag = ''
    $("#mySearch").val('')
    getTodos()
    getProjects()
}

function resetSearch(){
    queryTag = ''
    $("#mySearch").val('')
    getTodos()
}


function signOut(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function(){
        localStorage.removeItem('token')    
    })
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    $("#nameLogged").empty()
    $("#detail-page").empty()
    $("#user-and-logout").hide()
    $("#main-page").hide()
    $("#login-page").show()
}

function getTodos(){
    let querySearch = $("#mySearch").val()
    if(!queryTag){
        filteredTag = []
    }
    console.log('ini query search',querySearch);
    
    let link = ''
    if(queryTag !== ''){
        console.log('ada query');
        link = `${baseURL}/todos?tag=${queryTag}`
    }else if(querySearch !== ''){
        link = `${baseURL}/todos?search=${querySearch}`
    }
    else{
        console.log('ga ada query');
        link = `${baseURL}/todos`
    }
    $.ajax({
        url: `${link}`,
        method : 'get',
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        console.log('hasil response get',response);
        
        $("#todo-list").empty()
        $("#tag-container").empty()
        
        let todoAndTags = []
        if(response.length === 0){
            $("#todo-list").append(`
            <h4>
            you dont have any todoList to be done, made one !
            </h4>
            `)
        }else{
            response.forEach(todo =>{
                    if(!todo.projectId){
                        let newDate = todo.dueDate.substring(0,10)
                        todoAndTags.push([todo._id,todo.tags])
                        if(todo.status === 'undone'){
                            $("#todo-list").append(
                                `<div id="${todo._id}" class="row col-12">
                                <div class="ml-2 mt-4 mr-2"><i class="far fa-inventory"></i></div>
                                <div class="col card text-left border border-success m-2 hoverable" style="cursor: pointer">
                                    <div class="card-body align-items-center" style="margin: 0;padding: 5px;">
                                        <h6>Title : ${todo.title}</h6>
                                        <span>Due date: ${newDate}</span><br>
                                        <div>
                                        Status : <div class="btn btn-warning" style="padding:1px;font-size:10px">undone</div>                        
                                        </div>
                                        <span id="todo-tags-${todo._id}"> Tags :</span>
                                    </div>
                                    <hr>
                                    <div class="row justify-content-center mb-3">
                                        <button onclick="finishTodo('${todo._id}')" class="col-3 btn btn-success mr-2" style="padding:0px;">finish</button>
                                        <button onclick="editTodoModal('${todo._id}')" class="col-3 btn btn-warning mr-1 ml-1" style="padding:0px;">edit</button>                            
                                        <button onclick="deleteTodo('${todo._id}')" class="col-3 btn btn-danger ml-2" style="padding:0px;">delete</button>
                                    </div>
                                </div>
                                </div>`
                            )
                        }else if(todo.status === 'finished'){
                            $("#todo-list").append(
                                `<div id="${todo._id}" class="row col-12">
                                <div class="ml-2 mt-4 mr-2"><i class="far fa-inventory"></i></div>
                                <div class="col card text-left border border-success m-2 hoverable" style="cursor: pointer">
                                    <div class="card-body align-items-center" style="margin: 0;padding: 5px;">
                                        <h6>Title : ${todo.title}</h6>
                                        <span>Due date: ${newDate}</span><br>
                                        <div>
                                        Status : <div class="btn btn-success" style="padding:1px;font-size:10px">finished</div>                        
                                        </div>
                                        <span id="todo-tags-${todo._id}"> Tags :</span>
                                    </div>
                                    <hr>
                                    <div class="row justify-content-center mb-3">
                                        <button onclick="finishTodo('${todo._id}')" class="col-3 btn btn-success mr-2" style="padding:0px;" disabled>finish</button>
                                        <button onclick="editTodoModal('${todo._id}')" class="col-3 btn btn-warning mr-1 ml-1" style="padding:0px;">edit</button>                            
                                        <button onclick="deleteTodo('${todo._id}')" class="col-3 btn btn-danger ml-2" style="padding:0px;">delete</button>
                                    </div>
                                </div>
                                </div>`
                            )
                        }
                    }
            })
            let listOfTag = []
            todoAndTags.forEach(todo =>{
                todo[1].forEach(tag =>{
                    $(`#todo-tags-${todo[0]}`).append(`
                        <button  class="col-3 btn btn-info" style="padding:0px;font-size: 12px;">${tag}</button>
                    `)
                })
                if(todo[1].length !== 0){
                    listOfTag.push(todo[1])
                }
            })
            
            listOfTag = listOfTag.join().split(',')
            
            if(listOfTag[0] !== ""){
                if(filteredTag.length !== 0){

                }else{
                    filteredTag = filterTag(listOfTag)
                }
                
                filteredTag.forEach(tagging=>{
                    $("#tag-container").append(`
                        <button onclick="searchByTag('${tagging}')" class="col-2 btn btn-info mr-1 ml-1 mt-1" style="padding:0px;font-size: 12px;">${tagging}</button>
                    `)
                })
            }
        }
    })
    .fail((jqHXR,status)=>{
        console.log(status);
    })
}

function filterTag(array){
    let arr = []
    array.forEach(element =>{
        if(arr.indexOf(element) === -1){
            arr.push(element)
        }
    })
    return arr
}

function searchByTag(query){
    console.log(query);
    queryTag = query
    getTodos()
}

function addTodo(item){
    todoForProject = false
    $.ajax({
        url : `${baseURL}/todos`,
        method : 'post',
        data : item,
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        Swal.fire('successfully add todo!','','success')
        getTodos()
        detailProject(response.projectId)
    })
    .fail((jqHXR,status)=>{
        console.log(status);
    })
}

function finishTodo(id){
    Swal.fire({
        title : 'are you sure?',
        type : 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!",
    })
    .then(result =>{
        if(result.value){
            $.ajax({
                url : `${baseURL}/todos/${id}`,
                method : 'patch',
                data : {
                    status : 'finished'
                },
                headers : {
                    token : localStorage.token
                }
            })
            .done(response =>{
                Swal.fire('congratulation!',`you finished ${response.title}`,'success')
                if(response.projectId){
                    detailProject(response.projectId)
                }else{
                    getTodos()
                }
        
            })
            .fail((jqHXR,status) =>{
                console.log(status);
            })
        }
    })
}

function editTodoModal(id){
    $.ajax({
        url : `${baseURL}/todos/${id}`,
        method : 'get',
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        editingProject = true
        $("#dateFormEdit").empty()
        let minDate = today()
        let tag = response.tags.join()
        let title = response.title
        let description = response.description
        let dueDate = response.dueDate
        $("#todo-title-edit").val(`${title}`)
        $("#todo-desc-edit").val(`${description}`)
        $("#todo-tags-edit").val(`${tag}`)
        $("#dateFormEdit").append(`
            <label for="todo"><i class="far fa-calendar-plus mr-2"></i>Due Date : </label>
            <input type="date" class="form-control" id="due-date-edit" min=${minDate} required >
        `)
        $("#due-date-edit").val(dueDate.substring(0,10))
        $("#modalEdit").modal('show')
        // $("#editTodo").click(function(){
        //     editTodo(id,title,description,dueDate,tag)
        // })
        editing = true
        editId = id

    })
    .fail((jqHXR,status)=>{
        console.log(status);
    })
}

function editTodo(id){
    $("#editTodo").unbind("click",editTodo)
    let titleEdit = $("#todo-title-edit").val()
    let descriptionEdit = $("#todo-desc-edit").val()
    let tagsEdit = $("#todo-tags-edit").val()
    let dueDateEdit = $("#due-date-edit").val()
        if(titleEdit !== '' && descriptionEdit !== '' && tagsEdit !== '' && dueDateEdit !== ''){
            $.ajax({
                url : `${baseURL}/todos/${id}`,
                method : 'patch',
                data : {
                    title : titleEdit,
                    description : descriptionEdit,
                    tags : tagsEdit,
                    dueDate : dueDateEdit
                },
                headers : {
                    token : localStorage.token
                }
            })
            .done(response =>{
                resetFormEdit()
                $("#modalEdit").modal('hide')
                Swal.fire('successfully edit your todo!','','success')
                if(response.projectId){
                    detailProject(response.projectId)
                }else{
                    getTodos()
                }
            })
            .fail((jqHXR,status)=>{
                console.log(status);
            })
        }else{
            Swal.fire(`forms can't be empty`,'','error')
        }
    
}


function deleteTodo(id){
    Swal.fire({
        title : 'are you sure?',
        type : 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!",
    })
    .then(result =>{
        if(result.value){
            $.ajax({
                url : `${baseURL}/todos/${id}`,
                method : 'get',
                headers : {
                    token : localStorage.token
                }
            })
            .done(response =>{
                if(response.projectId){
                    let projectId = response.projectId
                    $.ajax({
                        url : `${baseURL}/projects/${response.projectId}`,
                        method : 'get',
                        headers : {
                            token : localStorage.token
                        }
                    })
                    .done(response =>{
                        if(response.memberList.indexOf(localStorage.userId)){
                            $.ajax({
                                url : `${baseURL}/todos/${id}`,
                                method : 'delete',
                                headers : {
                                    token : localStorage.token
                                }
                            })
                            .done(response =>{
                                Swal.fire(`Yeay! successfully delete ${response.title} from your list`,'','success')
                                detailProject(projectId)
                            })
                            .fail(err =>{
                                console.log(err.statusText);
                            })
                        }else{
                            Swal('youre not authorized to delete this','','error')
                        }
                    })
                    .fail((jqHXR,textStatus)=>{
                        console.log(textStatus);
                    })
                }else{
                    $.ajax({
                        url : `${baseURL}/todos/${id}`,
                        method : 'delete',
                        headers : {
                            token : localStorage.token
                        }
                    })
                    .done(response =>{
                        Swal.fire(`Yeay! successfully delete ${response.title} from your list`,'','success')
                        getTodos()
                    })
                    .fail(err =>{
                        console.log(err.statusText);
                        
                    })
                }
            })
            .fail(err =>{
                console.log(err.statusText);
            })
        }
    })
}

function getProjects(){
    $("#project-list").empty()
    $.ajax({
        url : `${baseURL}/projects`,
        method : 'get',
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        response.forEach(project=>{
            $("#project-list").append(
                `<div id="${project._id}" class="col-12">
                <div class="col card text-left border border-info m-2 hoverable" style="cursor: pointer">
                    <div class="card-body align-items-center" style="margin: 0;padding: 5px;">
                        <h6>Title : ${project.title}</h6>
                        <span>Description : ${project.description}</span><br>
                    </div>
                    <hr>
                    <div class="row justify-content-center mb-3">
                        <button onclick="detailProject('${project._id}')" class="col-3 btn btn-primary mr-2" style="padding:0px;">detail</button>                            
                        <button onclick="editProjectModal('${project._id}')" class="col-3 btn btn-warning ml-1 mr-1" data-toggle="modal" data-target="#editProjectModal" style="padding:0px;">edit</button>                            
                        <button onclick="deleteProject('${project._id}')" class="col-3 btn btn-danger ml-2" style="padding:0px;">delete</button>
                    </div>
                </div>
                </div>`
            )
        })
    })
    .fail((jqHXR,status)=>{
        console.log(status);
    })
}

function deleteProject(id){
    $.ajax({
        url : `${baseURL}/projects/${id}`,
        get : 'get',
        headers : {
            token : localStorage.token
        }
    })
    .done(response=>{
        if(localStorage.userId == response.creator._id){
        Swal.fire({
            title : 'are you sure?',
            type : 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No, cancel it!",
        })
        .then(result =>{
            if(result.value){
                $.ajax({
                    url : `${baseURL}/projects/${id}`,
                    method : 'delete',
                    headers : {
                        token : localStorage.token
                    }
                })
                .done(response =>{
                    $.ajax({
                        url : `${baseURL}/todos/${id}/project`,
                        method: 'delete',
                        headers : {
                            token : localStorage.token
                        }
                    })
                    .done(response =>{
                        $("#detail-page").empty()
                        getProjects()
                    })
                    .fail((jqHXR,status)=>{
                        console.log(status);
                    })
                })
                .fail((jqHXR,status) =>{
                    console.log(status);
                })
            }
        })
        }else{
            Swal.fire('youre not authorized for this action!','','error')
        }
    })
    .fail((jqHXR,status)=>{
        console.log(status);
    })
}

function editProjectModal(id){
    editingProject = true
    editProjectId = id
}

function editProject(){
    $("#editProjectModal").modal('hide')
    var usersInvited = []
    $.each($("input[name='user']:checked"),function(){
        usersInvited.push($(this).val())
    })
    let title = $("#project-title-edit").val()
    let description = $("#project-desc-edit").val()

    $.ajax({
        url : `${baseURL}/projects/${editProjectId}`,
        method : 'patch',
        data : {
            title : title,
            description : description,
            memberList : JSON.stringify(usersInvited),
            creator : projectCreator
        },
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        $("#detail-page").empty()
        Swal.fire('successfully edit project','','success')
        getProjects()
    })
    .fail((jqHXR,status)=>{
        console.log(status);
    })
}

function addProject(){
    $("#addProjectModal").modal('hide')
    var usersInvited = []
    $.each($("input[name='user']:checked"),function(){
        usersInvited.push($(this).val())
    })
    let title = $("#project-title").val()
    let description = $("#project-desc").val()

    $.ajax({
        url : `${baseURL}/projects`,
        method : 'post',
        data : {
            title : title,
            description : description,
            memberList : JSON.stringify(usersInvited) 
        },
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        getProjects()
    })
    .fail((jqHXR,status)=>{
        console.log(status);
        
    })
    
}

function detailProject(id){
    $("#detail-page").empty()
    $("#project-todo-list").empty()
    projectTodoId = id
    $.ajax({
        url : `${baseURL}/projects/${id}`,
        method : 'get',
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        if(response.memberList.indexOf(localStorage.userId)){
        $("#detail-page").empty()
        $("#project-todo-list").empty()
            $("#detail-page").append(`
                <div class="col-12 row">
                    <div class="col-4">
                        <div class="card col-12 text-left">
                            <span><b>Title : </b></span>
                            <span>${response.title}</span>
                            <span><b>Description : </b></span>
                            <span>${response.description}</span>
                            <span><b>Members : </b></span>
                            <div id="member-container"></div>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="row">
                            <div class="col"><h4>your project TodoList</h4></div>
                            <button onclick="openTodoModalProject('${response._id}')" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" style="padding: 0px;"><i class="fas fa-plus-circle mr-2"></i>New Todo</button>
                        </div>
                        <hr>
                        <div id="project-todo-list"></div>
                    </div>
                </div>
            `)
            response.memberList.forEach(member =>{
                if(member.length !== 0){
                    $("#member-container").append(`
                        <div class="card">${member.firstName} ${member.lastName}</div>
                    `)
                }else{
                    $("#member-container").append(`
                    <span>no member registered</span>
                    `)
                }
            })
            getTodosProject(id)
        }else{
            Swal.fire("you're not authorized for this project",'','error')
        }
    })
    .fail((jqHXR,status)=>{
        console.log(status)
    })
}

function getTodosProject(id){
        $.ajax({
            url : `${baseURL}/todos/${id}/projects`,
            method : 'get',
            headers : {
                token : localStorage.token
            }
        })
        .done(response =>{
            let todoAndTags = []
            response.forEach(todo =>{
                let newDate = todo.dueDate.substring(0,10)
                todoAndTags.push([todo._id,todo.tags])
                if(todo.status === 'undone'){                    
                    $("#project-todo-list").append(
                            `<div id="${todo.title}" class="row col-12">
                            <div class="ml-2 mt-4 mr-2"><i class="far fa-inventory"></i></div>
                            <div class="col card text-left border border-success m-2 hoverable" style="cursor: pointer">
                                <div class="card-body align-items-center" style="margin: 0;padding: 5px;">
                                    <h6>Title : ${todo.title}</h6>
                                    <span>Due date: ${newDate}</span><br>
                                    <div>
                                    Status : <div class="btn btn-warning" style="padding:1px;font-size:10px">undone</div>                        
                                    </div>
                                    <span id="todo-tags-${todo._id}"> Tags :</span>
                                </div>
                                <hr>
                                <div class="row justify-content-center mb-3">
                                    <button onclick="finishTodo('${todo._id}')" class="col-3 btn btn-success mr-2" style="padding:0px;">finish</button>
                                    <button onclick="editTodoModal('${todo._id}')" class="col-3 btn btn-warning mr-1 ml-1" style="padding:0px;">edit</button>                            
                                    <button onclick="deleteTodo('${todo._id}')" class="col-3 btn btn-danger ml-2" style="padding:0px;">delete</button>
                                </div>
                            </div>
                            </div>`
                        )
                    }else if(todo.status === 'finished'){                        
                        $("#project-todo-list").append(
                            `<div id="${todo._id}" class="row col-12">
                            <div class="ml-2 mt-4 mr-2"><i class="far fa-inventory"></i></div>
                            <div class="col card text-left border border-success m-2 hoverable" style="cursor: pointer">
                                <div class="card-body align-items-center" style="margin: 0;padding: 5px;">
                                    <h6>Title : ${todo.title}</h6>
                                    <span>Due date: ${newDate}</span><br>
                                    <div>
                                    Status : <div class="btn btn-success" style="padding:1px;font-size:10px">finished</div>                        
                                    </div>
                                    <span id="todo-tags-${todo._id}"> Tags :</span>
                                </div>
                                <hr>
                                <div class="row justify-content-center mb-3">
                                    <button onclick="finishTodo('${todo._id}')" class="col-3 btn btn-success mr-2" style="padding:0px;" disabled>finish</button>
                                    <button onclick="editTodoModal('${todo._id}')" class="col-3 btn btn-warning mr-1 ml-1" style="padding:0px;">edit</button>                            
                                    <button onclick="deleteTodo('${todo._id}')" class="col-3 btn btn-danger ml-2" style="padding:0px;">delete</button>
                                </div>
                            </div>
                            </div>`
                        )
                    }
                })
                let listOfTag = []
                todoAndTags.forEach(todo =>{
                    todo[1].forEach(tag =>{
                        $(`#todo-tags-${todo[0]}`).append(`
                            <button class="col-3 btn btn-info" style="padding:0px;font-size: 12px;">${tag}</button>
                        `)
                    })
                    if(todo[1].length !== 0){
                        listOfTag.push(todo[1])
                    }
                })
        })
        .fail((jqHXR,status)=>{
            console.log(status);
            
        })
}

function openTodoModalProject(id){
    projectTodoId = id
    todoForProject = true
    // addTodoProject(id)
    let dateMin = today()
    $("#dateForm").append(`
        <label for="todo"><i class="far fa-calendar-plus mr-2"></i>Due Date : </label>
        <input type="date" class="form-control" id="dueDate" min=${dateMin} required >
    `)
}


function today(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 

    today = yyyy+'-'+mm+'-'+dd;
    return today
    
}

$("#exampleModalCenter").on('hidden.bs.modal',function(e){
    $("#dateForm").empty()
    $("#todo-title").val('')
    $("#todo-desc").val('')
    $("#todo-tags").val('')
})

        $("#addProjectModal").on('show.bs.modal',function(){
            $.ajax({
                url : `${baseURL}/users`,
                method : 'get',
                headers : {
                    token : localStorage.token
                }
            })
            .done(response =>{
                if(response.length < 1){
                    $("#user-container").append(`
                        <h6 class="ml-4">no user can be added..</h6>
                    `)
                }else{
                    response.forEach(user =>{
                        $("#user-container").append(`
                            <div class="card col-6 bg-warning">
                                <span class="ml-2">${user.firstName} ${user.lastName}</span>
                            </div>
                            <div class="ml-2 mt-1">
                                <input id="usercheck" class="myCheckbox" value="${user._id}" type="checkbox" name="user">
                            </div>
                        `)
                    })
                }
            })
            .fail((jqHXR,status)=>{
                console.log(status);
                
            })

        })

        $("#editProjectModal").on('show.bs.modal',function(){
            let members = []
            $("#user-container-edit").empty()
            $.ajax({
                url : `${baseURL}/projects/${editProjectId}`,
                method : 'get',
                headers : {
                    token : localStorage.token
                }
            })
            .done(response =>{
                projectCreator = response.creator._id
                let title = response.title
                let description = response.description
                $("#project-title-edit").val(`${title}`)
                $("#project-desc-edit").val(`${description}`)
                response.memberList.forEach(user =>{
                    members.push(user._id)
                })
                $.ajax({
                    url : `${baseURL}/users`,
                    method : 'get',
                    headers : {
                        token : localStorage.token
                    }
                })
                .done(response =>{
                    if(response.length < 1){
                        $("#user-container-edit").append(`
                            <h6 class="ml-4">no user can be added..</h6>
                        `)
                    }else{
                        response.forEach(user =>{
                            if(members.indexOf(user._id) === -1){                                
                                $("#user-container-edit").append(`
                                    <div class="card col-6 bg-warning">
                                        <span class="ml-2">${user.firstName} ${user.lastName}</span>
                                    </div>
                                    <div class="ml-2 mt-1">
                                        <input id="${user._id}-checkbox" class="myCheckbox" value="${user._id}" type="checkbox" name="user">
                                    </div>
                                `)
                            }else{
                                $("#user-container-edit").append(`
                                    <div class="card col-6 bg-warning">
                                        <span class="ml-2">${user.firstName} ${user.lastName}</span>
                                    </div>
                                    <div class="ml-2 mt-1">
                                        <input id="${user._id}-checkbox" class="myCheckbox" value="${user._id}" type="checkbox" name="user" checked>
                                    </div>
                                `)
                            }
                        })
                        
                    }
                })
                .fail((jqHXR,status)=>{
                    console.log(status);
                    
                })
            })
            .fail((jqHXR,status)=>{
                console.log(status);
                
            })

            
        })

        $("#modalEdit").on('hidden.bs.modal',function(){
            $("#dateFormEdit").empty()
        })
        
        $("#addProjectModal").on('hidden.bs.modal', function(){            
            $("#project-title").val('')
            $("#project-desc").val('')
            $("#user-container").empty()
        })

$(document).ready(function(){
    if(!localStorage.token){
        $("#main-page").hide()
        $("#user-and-logout").hide()
        $("#login-page").hide()
        
    }else{
        loggedIn()
    }

    // $("#mySearch").on("keyup", function() {
    //     var value = $(this).val().toLowerCase();
    //     $("#todo-list *").filter(function() {
    //       $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    //     });
    //   });

    $("#to-login").click(function(){
        event.preventDefault()
        $("#register-page").hide()
        resetFormRegister()
        $("#login-page").show()
    })

    $("#to-register").click(function(){
        event.preventDefault()
        $("#login-page").hide()
        resetFormLogin()
        $("#register-page").show()
    })

    $("#register").click(function(){
        event.preventDefault()
        let firstName = $("#firstName").val()
        let lastName = $("#lastName").val()
        let email = $("#email").val()
        let password = $("#password").val()
        if(firstName === '' || lastName === '' || email === '' || password === '' ){
            console.log("form can't be empty");
        }else{
            $.ajax({
                url: `${baseURL}/users/register`,
                method : 'post',
                data : {
                    firstName,
                    lastName,
                    email,
                    password
                }
            })
            .done(response =>{
                resetFormRegister()
                Swal.fire('succesfully register!','please login to your account','success')
                $("#register-page").hide()
                $("#login-page").show()
            })
            .fail(function(jqXHR, textStatus){
                console.log('request failed', textStatus);
            })
        }
        
    })

    $("#login").click(function(){
        event.preventDefault()
        let email = $("#email-login").val()
        let password = $("#password-login").val()
        if(email === '' || password === ''){
            console.log("form can't be empty");
        }else{
            $.ajax({
                url : `${baseURL}/users/login`,
                method : 'post',
                data : {
                    email,
                    password
                }
            })
            .done(response =>{
                resetFormLogin()
                localStorage.setItem('token',response.token)
                localStorage.setItem('userId',response.id)
                localStorage.setItem('email', response.email)
                localStorage.setItem('name',`${response.firstName} ${response.lastName}`)
                Swal.fire('successfully logged in!',`welcome ${localStorage.name}`,'success')
                loggedIn()
            })
            .fail((jqXHR, status)=>{
                console.log(status);
            })
        }
    })

    $("#add-todo").click(function(){
        if(!todoForProject){
            let title = $("#todo-title").val()
            let description = $("#todo-desc").val()
            let dueDate = $("#dueDate").val()
            let tagstring = $("#todo-tags").val().split(',')
            let tagsUpdate = JSON.stringify(tagstring)
            let todo = {
                title,
                description,
                dueDate,
                tagsUpdate
            }
            
            if(dueDate !== "" && title !== "" && tagstring.length !== 0 && description !== ""){
                addTodo(todo)
                $("#exampleModalCenter .close").click()
            }else{
                Swal.fire('all fields need to be filled', '', 'error')
            }
        }else{
            let title = $("#todo-title").val()
            let description = $("#todo-desc").val()
            let dueDate = $("#dueDate").val()
            let tagstring = $("#todo-tags").val().split(',')
            let tagsUpdate = JSON.stringify(tagstring)
            let todo = {
                title,
                description,
                dueDate,
                tagsUpdate,
                projectId : projectTodoId
            }
            
            if(dueDate !== "" && title !== "" && tagstring.length !== 0 && description !== ""){
                addTodo(todo)
                $("#exampleModalCenter .close").click()
            }else{
                Swal.fire('all fields need to be filled', '', 'error')
            }
        }
    })

    $("#editTodo").click(function(){
        editTodo(editId)
    })

    $("#logout-button").click(function(){
        Swal.fire({
            title : 'are you sure?',
            type : 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No, cancel it!",
        })
        .then(result =>{
            if(result.value){
                Swal.fire(`goodbye ${localStorage.name}`,'','success')
                signOut()
            }
        })
    })

    $("#open-todo-modal").click(function(){
        let dateMin = today()
        $("#dateForm").append(`
            <label for="todo"><i class="far fa-calendar-plus mr-2"></i>Due Date : </label>
            <input type="date" class="form-control" id="dueDate" min=${dateMin} required >
        `)
    })

    
})