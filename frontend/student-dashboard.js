const usn = localStorage.getItem("student_usn");
const studentName = localStorage.getItem("student_name");

if (!usn) {
  alert("Please login first");
  window.location.href = "student-login.html";
}

// Show student name
document.getElementById("studentName").textContent =
  `Welcome, ${studentName} (${usn})`;

// Load issued books
fetch(`http://localhost:3000/issue/student/${usn}`)
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    if (data.length === 0) {
      table.innerHTML = `<tr><td colspan="3">No books issued</td></tr>`;
      return;
    }

    data.forEach(record => {
      const status = record.return_date
        ? `<span class="returned">Returned</span>`
        : `<span class="not-returned">Not Returned</span>`;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.book_title}</td>
        <td>${record.issue_date}</td>
        <td>${status}</td>
        <td>₹${record.fine_amount}</td>
      `;
      table.appendChild(row);
    });
  })
  .catch(err => {
    console.error("Error loading books:", err);
  });

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "student-login.html";
}
