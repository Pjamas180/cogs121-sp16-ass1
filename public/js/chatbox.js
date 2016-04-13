(function($) {
    "use strict";
    /* TODO: Start your Javascript code here */

    var socket = io();
    $('#send_message').submit(function(){
        var text = $('#user_input').val();
        console.log(text);
        socket.emit('newsfeed', text);
        //$('#m').val('');
        $('#user_input').val('');
        return false;
    });

        socket.on("newsfeed", function(data) {
            var parsedData;
            // grab and parse data and assign it to the parsedData variable.
            console.log(data);
            // other possible solution(s) here.
            $('#messages').prepend($('<li>').html(messageTemplate(parsedData)));

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
