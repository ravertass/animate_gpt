// content.js

$(document).ready(function () {
  // Hide all conversation blocks except the first one
  $('.group:not(:first)').hide();

  // Add 'displayed' class to the first conversation block
  $('.group:first').addClass('displayed');

  // Append "Show next message" button to the page
  $('body').append('<button id="show-next-button" class="button">Show next message</button>');

  $('#show-next-button').click(showNextMessage);
});

function showNextMessage() {
  let nextMessage = $('.group:not(.displayed)').first();
  var typedTarget = nextMessage.find('.break-words')[0]; // Get the DOM element directly

  // If there's another hidden message
  if (nextMessage.length > 0) {
    // Add the 'displayed' class to the next message
    nextMessage.addClass('displayed');

    // Override inline style
    nextMessage[0].style.display = 'block';

    // Split the HTML into an array of lines
    var messageHTML = nextMessage.find('.break-words').html();
    var messageLines = messageHTML.split('<br>');

    // Typed.js options for typing animation
    var options = {
      strings: messageLines,
      typeSpeed: 5,
      contentType: 'html',
      showCursor: false
    };

    // Clear out the text of the next message and animate it
    nextMessage.find('.break-words').html('');
    new Typed(typedTarget, options);
  }

  if ($('.group:not(.displayed)').first().length == 0) {
    // When all messages have been displayed, you can choose to hide the button
    $('#show-next-button').hide();
  }
}
