<div class="container" id="editTaskContainer">
    <h3>Edit Task</h3>
    <p>To edit task click on Edit button</p>
    <div class="row editTask"  >
        <div class="col col-md-1 taskNumber">#</div>
        <div class="col col-md-1 taskStatus">
            <input id="statusCheckbox" type="checkbox" >
        </div>
        <div class="col col-md-3 taskName">
            <input type="text" id="updatedTaskName"
                   placeholder="Task name"
                   class="input"
                   value="{{old('updatedTaskName')}}"
            >
        </div>
        <div class="col">
            <button id="updateTaskButton"
                    class="btn btn-primary">Update Task
            </button>
        </div>
    </div>
</div>