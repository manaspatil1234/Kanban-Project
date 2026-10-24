const todo = document.querySelector("#todo");
const progress= document.querySelector("#progress");
const done = document.querySelector("#done");
const tasks = document.querySelectorAll(".task");
const columns=[todo,progress,done];
let tasksData=[];
const savedTasks=localStorage.getItem("tasks");

if(savedTasks){
    tasksData=JSON.parse(savedTasks);
}
tasksData.forEach(function(task){
    createTask(task);
})
let dragElement = null;

tasks.forEach(task => {
    task.addEventListener("drag",function(event){
    dragElement=task;
    });
    
});

function addDragEventOnColumn(column){
    column.addEventListener("dragenter",function(event){
        event.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave",function(event){
        event.preventDefault();
        column.classList.remove("hover-over");
    })

    column.addEventListener("dragover",function(event){
        event.preventDefault();
    })
    column.addEventListener("drop",function(event){
        event.preventDefault();

        console.log("dropped",dragElement,column);
        column.appendChild(dragElement);

        const taskId = dragElement.dataset.id;

        const task=tasksData.find(function(task){
            return task.id==taskId;
        });
        task.column=column.id;
        localStorage.setItem("tasks",JSON.stringify(tasksData));

        column.classList.remove("hover-over");

        columns.forEach((col)=>{
        const tasks=col.querySelectorAll(".task");
        const count = col.querySelector(".right");
        count.innerText ="count :"+ tasks.length;
    })

        
    })
}
addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);

const toggleModal=document.querySelector("#toggle-modal");
const modal=document.querySelector(".modal");

toggleModal.addEventListener("click",function(event){
    console.log(event.target);
    modal.classList.toggle("active");
})

const bg=document.querySelector(".bg");

bg.addEventListener("click",function(event){
    modal.classList.remove("active");
})

function createTask(task){
    const div=document.createElement("div");
    const column = document.querySelector(`#${task.column}`);
    div.dataset.id=task.id;
    div.classList.add("task");
    div.setAttribute("draggable","true");
    div.innerHTML=`
    <h2>${task.title}</h2>
    <p>${task.description}</p>
    <button>Delete</button>
    `;
     div.addEventListener("drag",function(event){
        dragElement=div;
    })
    
    column.appendChild(div);
}
   


const addTaskBtn = document.querySelector("#add-task-btn");
addTaskBtn.addEventListener("click",function(event){
    const taskTitleInput=document.querySelector("#task-title-input").value.trim();
    const taskDescInput=document.querySelector("#task-desc-input").value.trim();

    if(taskTitleInput===""|| taskDescInput===""){
        return;
    }

    const task={
        id:Date.now(),
        title:taskTitleInput,
        description:taskDescInput,
        column:"todo"

    };
    tasksData.push(task);
    localStorage.setItem("tasks",JSON.stringify(tasksData));
     
    createTask(task);
    
        modal.classList.remove("active");
        columns.forEach((col)=>{
        const tasks=col.querySelectorAll(".task");
        const count = col.querySelector(".right");
        count.innerText = tasks.length;
    })
 
    document.querySelector("#task-title-input").value="";
    document.querySelector("#task-desc-input").value="";
    
})
