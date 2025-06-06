import $ from 'jquery';

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

export var indexTasks = function (successCB, errorCB) {
  var request = {
    type: 'GET',
    url: 'api/tasks?api_key=1',
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};

export var postTask = function (content, successCB, errorCB) {
  var request = {
    type: 'POST',
    url: 'api/tasks?api_key=1',
    data: {
      task: {
        content: content
      }
    },
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};

export var deleteTask = function (id, successCB) {
  var request = {
    type: 'DELETE',
    url: 'api/tasks/' + id + '?api_key=1',
    success: successCB,
    error: function (request, errorMessage) {
      console.log(errorMessage);
    }
  };

  $.ajax(request);
};

export var completeTask = function (id, successCB) {
    var request = {
      type: 'PUT',
      url: 'api/tasks/' + id + '/mark_complete' + '?api_key=1',
      success: successCB,
      error: function (request, errorMessage) {
        console.log(errorMessage);
      }
    };

    $.ajax(request);
};

export var activeTask = function (id, successCB) {
  var request = {
    type: 'PUT',
    url: 'api/tasks/' + id + '/mark_active' + '?api_key=1',
    success: successCB,
    error: function (request, errorMessage) {
      console.log(errorMessage);
    }
  };

  $.ajax(request);
};