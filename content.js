// content.js

let typedInstance = null; // Initialize a variable to hold the Typed.js instance

$(document).ready(function () {
  // Hide all conversation blocks except the first one
  $('.group:not(:first)').hide();

  // Add 'displayed' class to the first conversation block
  $('.group:first').addClass('displayed');

  // Append "Show next message" button to the page
  $('body').append('<button id="show-next-button" class="button">Show next message</button>');

  // Append "Auto-finish message" button to the page, initially hidden
  $('body').append('<button id="auto-finish-button" class="button" style="display: none;">Auto-finish message</button>');

  $('#show-next-button').click(showNextMessage);

  $('#auto-finish-button').click(autoFinishMessage);
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

    // Save the original HTML of the message
    nextMessage.find('.break-words').data('original-html', messageHTML);

    // Clear out the text of the next message and animate it
    nextMessage.find('.break-words').html('');
    typedInstance = new Typed(typedTarget, options);  // Save the Typed.js instance

    // Show the auto-finish button
    $('#auto-finish-button').show();
  }

  if ($('.group:not(.displayed)').first().length == 0) {
    // When all messages have been displayed, you can choose to hide the button
    $('#show-next-button').hide();
  }
}

function autoFinishMessage() {
  // If there's a Typed.js instance running
  if (typedInstance) {
    typedInstance.destroy();  // Destroy the Typed.js instance

    // Manually complete the message
    let currentMessage = $('.group.displayed:last');
    var originalMessageHTML = currentMessage.find('.break-words').data('original-html');
    currentMessage.find('.break-words').html(originalMessageHTML);

    // Remove the typing cursor
    $('.typed-cursor').remove();

    // Find the chat container
    var chatContainer = document.querySelector('div.h-full.overflow-auto');

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Hide the auto-finish button
    $('#auto-finish-button').hide();
  }
}
