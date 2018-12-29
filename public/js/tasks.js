/**
 * Jquery is used to render and manage application FED logic.
 * There are
 * - tasks counters part area,
 * -tasks table,
 * -'Add Task' area,
 * -'Edit Task area'.
 * Regarding tasks table,
 * the # column is for tasks serial number as appears in table
 * and not for taskId.
 */
$(document).ready(function() {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    renderTasks();
    initButtons();

    /**
     * To render tasks table fetched from backend Restful API service.
     */
    function renderTasks(){
        $.ajax({
            type : "GET",
            url : window.location.origin + "/api/v1/task",
            success: function(result){
                let totalCounter = parseInt('0',10);
                let completedCounter =  parseInt('0',10);
                let remainingCounter =  parseInt('0',10);
                $.each(result.tasks, function(counterNum, task){
                    let taskRow = getTaskRow(task,counterNum + 1);
                    $('#tasksTable tbody').append(taskRow);
                    totalCounter++;
                    if( task.status ) {
                        completedCounter++;
                    } else {
                        remainingCounter++;
                    }
                });

                updateCountersByDiff(totalCounter,completedCounter,remainingCounter);
            },
            error : function(e) {
                alert("ERROR: " + e.responseJSON.message);
                console.log("ERROR: " + e.responseJSON.message);
            }
        });
    }

    /**
     * To prepare updated counters values
     * and perform actual counters update .
     * @param totalDiff
     * @param completedDiff
     * @param remainingDiff
     */
    function updateCountersByDiff(totalDiff,completedDiff,remainingDiff) {
        let totalCounter = parseInt( $('#total-counter').text(),10);
        let completedCounter = parseInt($('#completed-counter').text(),10);
        let remainingCounter = parseInt($('#remaining-counter').text(),10);

        $('#total-counter').text(totalCounter + totalDiff);
        $('#completed-counter').text(completedCounter + completedDiff);
        $('#remaining-counter').text(remainingCounter + remainingDiff);
    }

    /**
     * To prepare actual counters update and then update.
     * @param task
     * @param completed
     */
    function updateCountersByTask(task=null,completed=false) {
        let totalDiff = parseInt('0',10);
        let completedDiff =  parseInt('0',10);
        let remainingDiff =  parseInt('0',10);
        
        if ( task ) {
            totalDiff++;
            if (completed) {
                completedDiff++;
            }
            else {
                remainingDiff++;
            }
        }
        else {
            totalDiff--;
            if (completed) {
                completedDiff--;
            }
            else {
                remainingDiff--;
            }
        }
        updateCountersByDiff(totalDiff,completedDiff,remainingDiff);
    }

    /**
     * To return html tr row for given task Object.
     * @param task
     * @param counterNum
     * @returns {string}
     */
    function getTaskRow(task,counterNum){
        let completed = task.status ? "checked" : "";
        let taskRow = '<tr id="tr-'+task.id +'" class="text-center taskRow">' +
            '<td class="taskNumber">' + counterNum + '</td>' +
            '<td class="taskStatus"> <input type="checkbox"' + completed + ' disabled > </td>' +
            '<td class="taskName">' + task.name + '</td>' +
            '<td>' + task.updated_at + '</td>' +
            '<td>' + '<button id="editTask-'+task.id +'" ' +
            'class="btn btn-info edit_task">Edit</button>'
            + '</td>' +
            '<td>' + '<button id="deleteTask-'+task.id +'" ' +
            'class="btn btn-warning delete_task">Delete</button>'
            + '</td>' +
            '</tr>';

        return taskRow;
    }

    /**
     * To bind main click events to buttons.
     */
    function initButtons() {
        $('button#addTaskButton').on('click',addTask);
        $('input#newTaskName').focus(function() {
            $(this).val('');
        });

        $('#tasksTable').on('click','button.edit_task',fillEditTaskArea);
        $('button#updateTaskButton').on('click',updateTask);

        $('#tasksTable').on('click','button.delete_task',deleteTask);

    }

    /**
     * To add task added in 'Add Task' area.
     * Status of new task will be not completed.
     * @returns {boolean}
     */
    function addTask() {
        console.log('function addTask');
        let newTaskName = $("#newTaskName").val().trim();
        if ( newTaskName.length < 3 ) {
            alert("Task name must be at least 3 characters");
            return false;
        }
        $.ajax({
            type : "POST",
            url : window.location.origin + "/api/v1/task",
            data:{
                name: newTaskName,
            },
            success: function(result){
                let task = result.task;
                let totalCounter = parseInt( $('#total-counter').text(),10);
                let taskNumber = totalCounter + 1;
                let taskRow = getTaskRow(task,taskNumber);
                // $('#tasksTable tbody').append(taskRow);
                $(taskRow).hide().appendTo('#tasksTable tbody').fadeIn(1000);
                updateCountersByTask(task,task.status);
            },
            error : function(e) {
                alert("ERROR: " + e.responseJSON.message +  " " + e.responseJSON.errors.name[0]);
                console.log("ERROR: " + e.responseJSON.message +  " " + e.responseJSON.errors.name[0]);
            }
        });
    }

    /**
     * To fill 'Add Task' area with clicked task data.
     */
    function fillEditTaskArea() {
        console.log('function openEditTaskForm ' + $( this ).attr('id') );
        let buttonId = $( this ).attr('id');
        let taskId = buttonId.split("-")[1];

        let taskTr = $( this ).parent().parent();
        let taskNumber = taskTr.find('.taskNumber').text();
        let taskStatus = taskTr.find('input[type="checkbox"]').is(":checked") ? "checked" : "";
        let taskName = taskTr.find('.taskName').text();

        $("#editTaskContainer").attr( 'taskId', taskId );
        $("#editTaskContainer .taskNumber").text(taskNumber);
        $("#editTaskContainer .taskStatus #statusCheckbox").prop('checked', taskStatus);
        $("#editTaskContainer .taskName #updatedTaskName").val(taskName);
    }

    /**
     * To edit task's name and status according filled data in backend
     * by ajax call to api,
     * then update in tasks table and update counters.
     * @returns {boolean}
     */
    function updateTask() {
        console.log('function updateTask');
        let taskId = $( this ).parent().parent().parent().attr('taskId');
        let status = $("#editTaskContainer .taskStatus #statusCheckbox").is(":checked");
        let updatedTaskName = $("#updatedTaskName").val().trim();
        if ( updatedTaskName.length < 3 ) {
            alert("Task name must be at least 3 characters");
            return false;
        }
        $.ajax({
            type : "PATCH",
            url : window.location.origin + "/api/v1/task/"+taskId,
            data:{
                status: status=== true ? 1 : 0,
                name: updatedTaskName,
            },
            success: function(result){
                let task = result.task;
                let taskId = task.id;
                let updatedStatus = (task.status == 1) ? true : false;
                let updatedCompleted = (updatedStatus == true) ? "checked" : "";
                let updatedName = task.name;
                let statusBefore = $("#tr-" + taskId + " .taskStatus input[type='checkbox']").is(":checked");

                // update existing row with updated data
                $("#tr-" + taskId + " .taskStatus input[type='checkbox']").prop('checked', updatedCompleted);
                $("#tr-" + taskId + " .taskName").text(updatedName);
                if ( updatedStatus != statusBefore ) {
                    let totalDiff = parseInt('0',10);
                    let completedDiff =  parseInt('0',10);
                    let remainingDiff =  parseInt('0',10);
                    if ( updatedStatus ) {
                        completedDiff = parseInt('1',10);
                        remainingDiff = parseInt('-1',10);
                    }
                    else {
                        completedDiff = parseInt('-1',10);
                        remainingDiff = parseInt('1',10);
                    }
                    updateCountersByDiff(totalDiff,completedDiff,remainingDiff);
                }
            },
            error : function(e) {
                alert("ERROR: " + e.responseJSON.message +  " " + e.responseJSON.errors.name[0]);
                console.log("ERROR: " + e.responseJSON.message +  " " + e.responseJSON.errors.name[0]);
            }
        });
    }

    /**
     * To delete task on server by ajax call to api,
     * update tasks table, tasks numbers and counters.
     */
    function deleteTask(){
        console.log('function deleteTask ' + $( this ).attr('id') );
        let buttonId = $( this ).attr('id');
        let taskId = buttonId.split("-")[1];
        $.ajax({
            type : "DELETE",
            url : window.location.origin + "/api/v1/task/" + taskId,
            success: function(result){
                let deletedTaskStatus = result.status;
                // delete row
                $("#tr-"+taskId).fadeOut('slow', function(){
                    $(this).remove();
                    updateTaskNumbers();
                    console.log( $('.background-blackout').length );
                });
                updateCountersByTask(null,deletedTaskStatus);

            },
            error : function(e) {
                alert("ERROR: " + e.responseJSON.message);
                console.log("ERROR: " + e.responseJSON.message);
            }
        });
    }
})

/**
 * Update task numbers in tasks table.
 */
function updateTaskNumbers() {
    let taskRows = $("tr.taskRow td.taskNumber");
    $.each(taskRows, function(counterNum, taskRow){
        taskRow.innerText = (counterNum + 1);
    });
}