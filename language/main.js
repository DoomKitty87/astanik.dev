import ChatSession from './openai-api.js';

const home_page = document.getElementById('home-page');
const activity_page = document.getElementById('activity-page');

const activity_buttons = document.querySelectorAll('.activity-button');

const message_terminal = document.getElementById('message-terminal');

var chat_session;

home_page.style.display = 'block';
activity_page.style.display = 'none';

document.querySelectorAll('.back-button').forEach(button => {
  button.onclick = () => {
    home_page.style.display = 'block';
    activity_page.style.display = 'none';
  }
});

activity_buttons.forEach(button => {
  button.onclick = () => {
    home_page.style.display = 'none';
    activity_page.style.display = 'block';
    chat_session = new ChatSession(
      button.dataset.activity);
    message_terminal.innerText = '';
    document.getElementById('message-input').value = '';
    initializeChat();
  }
});

document.getElementById('submit-button').onclick = async function() {
  const message = document.getElementById('message-input').value;
  document.getElementById('message-input').value = '';
  message_terminal.innerText += `\nuser: ${message}\n`;
  await chat_session.sendMessage(message);
  message_terminal.innerText = chat_session.getFormattedMessages();
}

async function initializeChat() {
  await chat_session.getResponse();
  message_terminal.innerText = chat_session.getFormattedMessages();
}
