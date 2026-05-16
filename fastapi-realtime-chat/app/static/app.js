const state = {
  token: localStorage.getItem('chatToken') || '',
  username: localStorage.getItem('chatUsername') || '',
  room: 'general',
  socket: null,
};

const loginForm = document.querySelector('#login-form');
const chatApp = document.querySelector('#chat-app');
const messages = document.querySelector('#messages');
const rooms = document.querySelector('#rooms');
const status = document.querySelector('#status');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message');
const userLabel = document.querySelector('#user-label');
const logoutButton = document.querySelector('#logout');

function authHeaders() {
  return { Authorization: `Bearer ${state.token}` };
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
}

function setStatus(text) {
  status.textContent = text;
}

function appendMessage(message) {
  const item = document.createElement('li');
  item.className = message.username === state.username ? 'message mine' : 'message';
  if (message.username === 'system') item.className = 'message system';

  const meta = document.createElement('span');
  meta.className = 'meta';
  meta.textContent = message.username === 'system'
    ? 'system'
    : `${message.username}${message.created_at ? ` · ${message.created_at}` : ''}`;

  const body = document.createElement('p');
  body.textContent = message.body;

  item.append(meta, body);
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

async function loadMessages() {
  messages.replaceChildren();
  const history = await request(`/messages/${state.room}`, {
    headers: authHeaders(),
  });
  history.forEach(appendMessage);
}

function connectSocket() {
  if (state.socket) {
    state.socket.close();
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  state.socket = new WebSocket(`${protocol}://${window.location.host}/ws/${state.room}?token=${state.token}`);
  setStatus(`Connecting to #${state.room}...`);

  state.socket.addEventListener('open', () => setStatus(`Live in #${state.room}`));
  state.socket.addEventListener('message', (event) => appendMessage(JSON.parse(event.data)));
  state.socket.addEventListener('close', () => setStatus('Disconnected'));
}

async function enterChat() {
  const data = await request('/rooms', { headers: authHeaders() });
  userLabel.textContent = `Signed in as ${data.username}`;
  rooms.replaceChildren();
  data.rooms.forEach((room) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `#${room}`;
    button.className = room === state.room ? 'active' : '';
    button.addEventListener('click', async () => {
      state.room = room;
      [...rooms.children].forEach((child) => child.classList.remove('active'));
      button.classList.add('active');
      await loadMessages();
      connectSocket();
    });
    rooms.appendChild(button);
  });

  loginForm.hidden = true;
  chatApp.hidden = false;
  await loadMessages();
  connectSocket();
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    const data = await request('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
    });
    state.token = data.token;
    state.username = data.username;
    localStorage.setItem('chatToken', data.token);
    localStorage.setItem('chatUsername', data.username);
    await enterChat();
  } catch (error) {
    setStatus(error.message);
  }
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const body = messageInput.value.trim();
  if (!body || !state.socket || state.socket.readyState !== WebSocket.OPEN) return;
  state.socket.send(JSON.stringify({ body }));
  messageInput.value = '';
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('chatToken');
  localStorage.removeItem('chatUsername');
  state.token = '';
  state.username = '';
  state.socket?.close();
  chatApp.hidden = true;
  loginForm.hidden = false;
  setStatus('Signed out');
});

if (state.token) {
  enterChat().catch(() => {
    localStorage.removeItem('chatToken');
    localStorage.removeItem('chatUsername');
    loginForm.hidden = false;
    chatApp.hidden = true;
  });
}
