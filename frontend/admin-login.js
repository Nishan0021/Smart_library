function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("error");

  errorDiv.textContent = "";

  if (!username || !password) {
    errorDiv.textContent = "Please enter username and password";
    return;
  }

  // ✅ AUTO BASE URL (Local OR Render)
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://smart-library-k8bd.onrender.com";

  fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      return data;
    })
    .then((data) => {
      // ✅ SAVE SESSION
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", username);

      // ✅ REDIRECT
      window.location.href = "issued.html";
    })
    .catch((err) => {
      console.error(err);
      errorDiv.textContent = "Invalid admin credentials";
    });
}
