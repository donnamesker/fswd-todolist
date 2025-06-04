import $ from 'jquery';

import {
  indexTasks,
  postTask,
  completeTask,
  deleteTask,
  activeTask,
} from "./requests.js";

indexTasks(function (response) {
  var htmlString = response.tasks.map(function(task) {
    var checked = '';
    if (task.completed === true) { 
      checked = 'checked';
    }
    return `<div class='row'>
      <div class='col-8 mb-3 p-2 border rounded task' data-id='${task.id}'> \
      ${task.content}\</div>
      <div class='col-auto mb-3 p-2 task'>
        <div class='form-check form-switch'>
          <input class='form-check-input complete-task' type='checkbox' role='switch' data-id='${task.id}' id='complete${task.id}' ${checked}>
          <label class='form-check-label d-none d-lg-inline-block' for='complete${task.id}'>Complete</label>
        </div>
      </div>
      <div class='col-auto mb-3 p-2 task'>
        <button type='button' class='btn btn-danger delete-task' data-id='${task.id}'>
          <i class='bi bi-trash3-fill delete-task' data-id='${task.id}'></i><span class='ms-1 d-none d-lg-inline-block delete-task' data-id='${task.id}'>Delete</span>
        </button>
      </div>
    </div>`;
  });

  $("#tasks").html(htmlString);
});

document.addEventListener('DOMContentLoaded', function() {
  const view_container = document.getElementById('taskView');
  // When the view selection is changed
  view_container.addEventListener('change', function(event) {
    if (event.target && event.target.type === 'radio') {
      indexTasks(function (response) {
        var htmlString = response.tasks
        .filter(function(task) {
          if(event.target.value === 'Complete') {
            return task.completed === true; // Only include completed tasks
          } else if (event.target.value === 'Active') {
            return task.completed === false; // Only include completed tasks
          } else {
            return true; // Show all tasks
          }
        })
        .map(function(task) {
          var checked = '';
          if (task.completed === true) {
            checked = 'checked';
          }
          return `<div class='row'>
            <div class='col-8 mb-3 p-2 border rounded task' data-id='${task.id}'>
              ${task.content}
            </div>
            <div class='col-auto mb-3 p-2 task'>
              <div class='form-check form-switch'>
                <input class='form-check-input complete-task' type='checkbox' role='switch' data-id='${task.id}' id='complete${task.id}' ${checked}>
                <label class='form-check-label d-none d-lg-inline-block' for='complete${task.id}'>Complete</label>
              </div>
            </div>
            <div class='col-auto mb-3 p-2 task'>
              <button type='button' class='btn btn-danger delete-task' data-id='${task.id}'>
                <i class='bi bi-trash3-fill delete-task' data-id='${task.id}'></i><span class='ms-1 d-none d-lg-inline-block delete-task' data-id='${task.id}'>Delete</span>
              </button>
            </div>
          </div>`;
        });
        $("#tasks").html(htmlString);
      });
    }
  });

  const container = document.getElementById('tasks');
  // Tasks marked or unmarked complete
  container.addEventListener('change', function(event) {
    if (event.target && event.target.type === 'checkbox') {
      if (event.target.checked == false) {
        activeTask(event.target.dataset.id,'');
      } else {
        completeTask(event.target.dataset.id,'');
      }
    }
  });
  // clicking the delete button
  container.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-task')) {
      // Call deleteTask function
      deleteTask(event.target.dataset.id,
        function success(response) {
          location.replace(location.href);
        },
        function error(err) {
          console.error("Error deleting task:", err);
          alert("There was an error deleting the task.");
        }
      );
    }
    //location.replace(location.href);
  })
  // adding a new task
  
  const form = document.querySelector('form');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default Rails form submission

      const textarea = form.querySelector('textarea[name="content"]');
      const content = textarea.value.trim();

      if (content.length === 0) {
        alert("Task content cannot be empty.");
        return;
      }

      // Call postTask function
      postTask(content,
        function success(response) {
          console.log("Task created:", response);
          textarea.value = ""; // Clear the textarea
          location.replace(location.href);
        },
        function error(err) {
          console.error("Error creating task:", err);
          alert("There was an error creating the task.");
        }
      );
    });
  }

});