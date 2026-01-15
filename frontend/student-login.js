function studentLogin() {
  const usn = document.getElementById("usn").value.trim();

  if (!usn) {
    alert("Please enter USN");
    return;
  }

  fetch("https://smart-library-k8bd.onrender.com/student/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usn })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      localStorage.setItem("student_usn", data.usn);
      localStorage.setItem("student_name", data.student_name);
      window.location.href = "student-dashboard.html";
    })
    .catch(() => {
      alert("Invalid or unapproved USN");
    });
}
