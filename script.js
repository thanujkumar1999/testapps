function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

function logout() {
  alert("You have been logged out.");
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}
