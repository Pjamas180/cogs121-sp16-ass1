(function($) {
    "use strict";
    /* TODO: Start your Javascript code here */
    function getMessage() {
        var text = $('#user_input').value;
        console.log(text); 
    }

    var socket = io();
    $('#send_message').submit(function(){
        var text = $('#user_input').val();
        console.log(text);
        //socket.emit('chat message', $('#m').val());
        //$('#m').val('');
        $('#user_input').val('');
        return false;
    });

    // You may use this for updating new message
    function messageTemplate(template) {
        var result = '<div class="user">' +
            '<div class="user-image">' +
            '<img src="' + template.user.photo + '" alt="">' +
            '</div>' +
            '<div class="user-info">' +
            '<span class="username">' + template.user.username + '</span><br/>' +
            '<span class="posted">' + template.posted + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="message-content">' +
            template.message +
            '</div>';
        return result;
    }
})($);
