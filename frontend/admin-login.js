function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("error");

  errorDiv.textContent = "";

  if (!username || !password) {
    errorDiv.textContent = "Please enter username and password";
    return;
  }

  fetch("https://smart-library-k8bd.onrender.com/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then(() => {
      // ✅ CONSISTENT KEY
      localStorage.setItem("adminLoggedIn", "true");

      // ✅ CORRECT PAGE
      window.location.href = "issued.html";
    })
    .catch(() => {
      errorDiv.textContent = "Invalid admin credentials";
    });
}
