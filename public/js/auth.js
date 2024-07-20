document.addEventListener("DOMContentLoaded", async function () {
    try {
      const response = await fetch('/api/sessions/current', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        const authLink = document.getElementById('authLink');
  
        if (data) {
          authLink.textContent = 'Profile';
          authLink.href = '/profile';
        } else {
          authLink.textContent = 'Login';
          authLink.href = '/login';
        }
      } 
    } catch (error) {
      console.error('Error verifying authentication status:', error);
    }
  });
  