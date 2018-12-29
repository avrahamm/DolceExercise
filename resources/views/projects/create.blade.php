<div class="container" id="addTaskContainer">
    <h3>Create Task</h3>
    <div class="row" >
        <div class="col col-md-3">
            <input type="text" id="newTaskName"
                   placeholder="Task name"
                   class="input"
                   value="{{old('newTaskName')}}"
            >
        </div>
        <div class="col">
            <button id="addTaskButton"
                    class="btn btn-primary">Add Task
            </button>
        </div>
    </div>
</div>