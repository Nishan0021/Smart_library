function login() {
  const usn = document.getElementById("usn").value.trim();
  const errorDiv = document.getElementById("error");

  errorDiv.textContent = "";

  if (!usn) {
    errorDiv.textContent = "Please enter your USN";
    return;
  }

  fetch("http://localhost:3000/issue/student-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usn })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Invalid USN");
      }
      return res.json();
    })
    .then(data => {
      // Save login session
      localStorage.setItem("student_usn", data.usn);
      localStorage.setItem("student_name", data.student_name);

      // Redirect to dashboard
      window.location.href = "student-dashboard.html";
    })
    .catch(() => {
      errorDiv.textContent = "Invalid or unapproved USN. Contact library.";
    });
}
