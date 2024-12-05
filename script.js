document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('token', data.token);
            document.getElementById('login').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            fetchUsers();
        })
        .catch(err => {
            console.error(err);
            Swal.fire('Error', 'Login failed', 'error');
        });
});

function fetchUsers() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/users', {
        headers: { 'Authorization': token }
    })
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('users');
            usersList.innerHTML = '';
            data.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} - ${user.email}`;
                usersList.appendChild(li);
            });
        })
        .catch(err => console.error(err));
}
