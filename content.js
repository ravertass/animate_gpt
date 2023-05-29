// content.js

let typedInstance = null; // Initialize a variable to hold the Typed.js instance
let scrollInterval = null; // Initialize a variable to hold the setInterval function
let popupWindow = null; // Initialize a variable to hold the popup window instance

$(document).ready(function () {
  // Append "Start plugin" button to the page
  $('body').append('<button id="start-plugin-button" class="button">Animate conversation</button>');

  $('#start-plugin-button').click(startPlugin);
});

function startPlugin() {
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

  // Append "Show upcoming" button to the page
  $('body').append('<button id="show-upcoming-button" class="button">Show upcoming</button>');

  // Initially hide the continue button
  $('a[href*="continue"]').hide();

  // Add callbacks
  $('#show-next-button').click(showNextMessage);
  $('#auto-finish-button').click(autoFinishMessage);
  $('#auto-finish-conversation-button').click(autoFinishConversation);
  $('#show-upcoming-button').click(showUpcomingMessage);

  // Hide the start plugin button
  $('#start-plugin-button').hide();
}

function showUpcomingMessage() {
  let nextNextMessage = $('.group:not(.displayed)').eq(0); // Get the next hidden message
  if (nextNextMessage.length > 0) {
    // Open a new window for the popup
    popupWindow = window.open("", "popupWindow", "width=500,height=300");
    popupWindow.document.body.innerHTML = nextNextMessage.find('.break-words').html();
    $('#show-upcoming-button').hide();
  }
}

function showNextMessage() {
  autoFinishMessage();

  // Setup the setInterval function to scroll to the bottom every 100 milliseconds
  scrollInterval = setInterval(function() {
    var chatContainer = document.querySelector('div.h-full.overflow-auto');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 100);

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
        clearInterval(scrollInterval);
        if ($('.group:not(.displayed)').first().length == 0) {
          // When all messages have been displayed, hide the auto-finish buttons
          $('#auto-finish-button').hide();
          $('#auto-finish-conversation-button').hide();
          $('#show-next-button').hide();

          // Show the continue button when all messages have been displayed
          $('a[href*="continue"]').show();
        }
      }
    };

    // Save the original HTML of the message
    nextMessage.find('.break-words').data('original-html', messageHTML);

    // Clear out the text of the next message and animate it
    nextMessage.find('.break-words').html('');
    typedInstance = new Typed(typedTarget, options);  // Save the Typed.js instance

    // Show the auto-finish button
    $('#auto-finish-button').show();

    // Display the next message in the popup window
    if (popupWindow && !popupWindow.closed) {
      let nextNextMessage = $('.group:not(.displayed)').eq(0); // Get the second hidden message
      if (nextNextMessage.length > 0) {
        popupWindow.document.body.innerHTML = nextNextMessage.find('.break-words').html();
      } else {
        popupWindow.document.body.innerHTML = "<center style='color:gray;'>NO MORE MESSAGES</center>";      }
    }
  }

  // Remove border from all displayed messages
  $('.group.displayed').css('border', 'none');

  // Add border to the last displayed message
  $('.group.displayed:last').css('border', '2px solid #19c37d');

  if ($('.group:not(.displayed)').first().length == 0) {
    // When all messages have been displayed, hide the auto-finish buttons
    $('#show-upcoming-button').hide();

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

    // Clear the scrollInterval when auto finish button is clicked
    clearInterval(scrollInterval);

    // Find the chat container
    var chatContainer = document.querySelector('div.h-full.overflow-auto');

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Hide the auto-finish button
    $('#auto-finish-button').hide();

    if ($('.group:not(.displayed)').first().length == 0) {
       $('#auto-finish-conversation-button').hide();
       $('#show-upcoming-button').hide();
       $('#show-next-button').hide();
    }
  }
}

function autoFinishConversation() {
  // Loop until all messages have been displayed
  autoFinishMessage();
  while ($('.group:not(.displayed)').first().length > 0) {
    showNextMessage();
    autoFinishMessage();
  }

  // Hide buttons
  $('#auto-finish-button').hide();
  $('#auto-finish-conversation-button').hide();
  $('#show-upcoming-button').hide();
  $('#show-next-button').hide();
}

$(document).on('click', 'pre div button', function () {
  let codeElement = $(this).closest('div').siblings('div').find('code')[0];
  copyCodeToClipboard(codeElement);
});


function copyCodeToClipboard(codeElement) {
  // Create a temporary textarea to copy the code
  let tempTextArea = document.createElement('textarea');
  tempTextArea.value = codeElement.textContent;
  document.body.appendChild(tempTextArea);

  // Select the text and copy it
  tempTextArea.select();
  document.execCommand('copy');

  // Clean up by removing the temporary textarea
  document.body.removeChild(tempTextArea);
}
