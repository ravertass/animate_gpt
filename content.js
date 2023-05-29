// content.js

let typedInstance = null; // Initialize a variable to hold the Typed.js instance

$(document).ready(function () {
  // Hide all conversation blocks except the first one
  $('.group:not(:first)').hide();

  // Add 'displayed' class to the first conversation block
  $('.group:first').addClass('displayed');

  // Append "Show next message" button to the page
  $('body').append('<button id="show-next-button" class="button">Next message</button>');

  // Append "Auto-finish message" button to the page, initially hidden
  $('body').append('<button id="auto-finish-button" class="button" style="display: none;">Complete typing</button>');

  // Append "Auto-finish conversation" button to the page
  $('body').append('<button id="auto-finish-conversation-button" class="button">Show all</button>');

  // Initially hide the continue button
  $('a[href*="continue"]').hide();

  $('#show-next-button').click(showNextMessage);
  $('#auto-finish-button').click(autoFinishMessage);
  $('#auto-finish-conversation-button').click(autoFinishConversation);
});

function showNextMessage() {
  autoFinishMessage();

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
      showCursor: false,
      onComplete: function(self) {  // Add the onComplete callback here
        $('#auto-finish-button').hide();
      }
    };

    // Save the original HTML of the message
    nextMessage.find('.break-words').data('original-html', messageHTML);

    // Clear out the text of the next message and animate it
    nextMessage.find('.break-words').html('');
    typedInstance = new Typed(typedTarget, options);  // Save the Typed.js instance

    // Show the auto-finish button
    $('#auto-finish-button').show();
  }

  // Remove border from all displayed messages
  $('.group.displayed').css('border', 'none');

  // Add border to the last displayed message
  $('.group.displayed:last').css('border', '2px solid #19c37d');

  if ($('.group:not(.displayed)').first().length == 0) {
    // When all messages have been displayed, hide the auto-finish buttons
    $('#auto-finish-button').hide();
    $('#auto-finish-conversation-button').hide();
    $('#show-next-button').hide();

    // Show the continue button when all messages have been displayed
    $('a[href*="continue"]').show();
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

function autoFinishConversation() {
  // Loop until all messages have been displayed
  while ($('.group:not(.displayed)').first().length > 0) {
    showNextMessage();
    autoFinishMessage();
  }

  // Hide the auto-finish button
  $('#auto-finish-button').hide();

  // Hide the auto-finish conversation button
  $('#auto-finish-conversation-button').hide();
}
