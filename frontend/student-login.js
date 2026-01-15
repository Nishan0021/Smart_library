function studentLogin() {
  const usn = document.getElementById("usn").value.trim();
  const errorDiv = document.getElementById("error");

  errorDiv.textContent = "";

  if (!usn) {
    errorDiv.textContent = "Please enter USN";
    return;
  }

  // AUTO ENV (localhost / render)
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://smart-library-k8bd.onrender.com";

  fetch(`${BASE_URL}/student/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usn })
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    })
    .then((data) => {
      // SAVE SESSION
      localStorage.setItem("studentLoggedIn", "true");
      localStorage.setItem("studentUSN", data.usn);
      localStorage.setItem("studentName", data.student_name);

      window.location.href = "student-dashboard.html";
    })
    .catch(() => {
      errorDiv.textContent = "Invalid or unapproved USN";
    });
}
