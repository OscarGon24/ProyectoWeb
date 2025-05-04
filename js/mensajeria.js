// Función para alternar entre secciones en móvil
function showSection(section) {
  const contactsSection = document.getElementById('contacts-section');
  const chatSection = document.getElementById('chat-section');
  const buttons = document.querySelectorAll('.mobile-toggle button');
  
  if (section === 'contacts') {
    contactsSection.classList.add('active');
    chatSection.classList.remove('active');
    buttons[0].classList.add('active');
    buttons[1].classList.remove('active');
  } else {
    contactsSection.classList.remove('active');
    chatSection.classList.add('active');
    buttons[0].classList.remove('active');
    buttons[1].classList.add('active');
  }
}

// Función para mostrar el chat cuando se selecciona un contacto (en móvil)
function showChat() {
  if (window.innerWidth <= 768) {
    showSection('chat');
  }
}