const usn = localStorage.getItem("student_usn");

if (!usn) {
  alert("Please login");
  window.location.href = "student-login.html";
}

fetch(`https://smart-library-k8bd.onrender.com/student/issued/${usn}`)
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("issuedTable");
    table.innerHTML = "";

    if (data.length === 0) {
      table.innerHTML = "<tr><td colspan='4'>No books issued</td></tr>";
      return;
    }

    data.forEach(book => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${new Date(book.issue_date).toLocaleDateString()}</td>
        <td>${book.return_date ? "Returned" : "Not Returned"}</td>
        <td>₹${book.fine_amount || 0}</td>
      `;
      table.appendChild(row);
    });
  });
