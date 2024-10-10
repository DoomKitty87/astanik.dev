import ChatSession from './openai-api.js';

const home_page = document.getElementById('home-page');
const activity_page = document.getElementById('activity-page');

const activity_buttons = document.querySelectorAll('.activity-button');

const message_terminal = document.getElementById('message-terminal');

var chat_session;

document.querySelectorAll('.back-button').forEach(button => {
  button.onclick = () => {
    home_page.classList.add('active-page');
    activity_page.classList.remove('active-page');
  }
});

activity_buttons.forEach(button => {
  button.onclick = () => {
    home_page.classList.remove('active-page');
    activity_page.classList.add('active-page');
    chat_session = new ChatSession(
      button.dataset.activity);
    message_terminal.innerHTML = '';
    document.getElementById('message-input').value = '';
    initializeChat();
  }
});

document.getElementById('message-input').onkeypress = function(e) {
  if (e.key === 'Enter') {
    document.getElementById('submit-button').click();
  }
}

document.getElementById('submit-button').onclick = async function() {
  const message = document.getElementById('message-input').value;
  document.getElementById('message-input').value = '';
  message_terminal.innerHtml += '<span class="role-user">User</span><span class="content-user">' + message + '</span>';
  await chat_session.sendMessage(message);
  message_terminal.innerHtml = chat_session.getFormattedMessages();
}

async function initializeChat() {
  await chat_session.getResponse();
  message_terminal.innerHtml = chat_session.getFormattedMessages();
}
