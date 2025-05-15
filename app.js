// Tab switching
document.getElementById('loginTab').addEventListener('click', showLoginForm);
document.getElementById('registerTab').addEventListener('click', showRegisterForm);

function showLoginForm() {
  document.getElementById('formTitle').textContent = 'Login';
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('registerTab').classList.remove('active');
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registrationForm').style.display = 'none';
  document.getElementById('message').textContent = '';
}

function showRegisterForm() {
  document.getElementById('formTitle').textContent = 'Register';
  document.getElementById('registerTab').classList.add('active');
  document.getElementById('loginTab').classList.remove('active');
  document.getElementById('registrationForm').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('message').textContent = '';
}

// Login
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const message = document.getElementById('message');
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    message.style.color = 'red';
    message.textContent = 'Invalid email or password.';
    return;
  }

  message.style.color = 'green';
  message.textContent = `Welcome, ${user.name}!`;
  localStorage.setItem('currentUser', JSON.stringify(user));

  setTimeout(() => {
    window.location.href = 'index.html'; 
    console.log("✅ Redirecting to index.html");
  }, 3000);
  
});

// Register
document.getElementById('registrationForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const message = document.getElementById('message');
  const users = JSON.parse(localStorage.getItem('users')) || [];

  if (!name || !email || !password) {
    message.style.color = 'red';
    message.textContent = 'All fields are required.';
    return;
  }

  if (users.some(u => u.email === email)) {
    message.style.color = 'red';
    message.textContent = 'User already registered with this email. Please log in.';
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  message.style.color = 'green';
  message.textContent = 'Registration successful! Please login.';
  setTimeout(showLoginForm, 1000);
});

// Show recovery form
document.getElementById('forgotUsername').addEventListener('click', () => {
  document.getElementById('recoverySection').classList.remove('hidden');
  document.getElementById('recoverBtn').textContent = 'Recover Username';
});

document.getElementById('forgotPassword').addEventListener('click', () => {
  document.getElementById('recoverySection').classList.remove('hidden');
  document.getElementById('recoverBtn').textContent = 'Recover Password';
});

document.getElementById('recoverBtn').addEventListener('click', () => {
  const recoveryEmail = document.getElementById('recoveryEmail').value.trim();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const msg = document.getElementById('recoveryMessage');

  if (!recoveryEmail) {
    msg.style.color = 'red';
    msg.textContent = 'Please enter your email.';
    return;
  }

  const user = users.find(u => u.email === recoveryEmail);

  if (!user) {
    msg.style.color = 'red';
    msg.textContent = 'No user found with this email.';
    return;
  }

  const isUsernameRecovery = document.getElementById('recoverBtn').textContent.includes('Username');

  msg.style.color = 'green';
  msg.innerHTML = isUsernameRecovery
    ? `Your username is: <strong>${user.name}</strong>`
    : `Your password is: <strong>${user.password}</strong>`;

  setTimeout(() => {
    document.getElementById('recoverySection').classList.add('hidden');
    document.getElementById('recoveryEmail').value = '';
    msg.textContent = '';
    showLoginForm();
  }, 3000);
});
