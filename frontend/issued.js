// ================= DATE FORMAT =================
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN");
}

// ================= LOAD ISSUED BOOKS =================
function loadIssuedBooks() {
  fetch("https://smart-library-k8bd.onrender.com/issue/issued-list")
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById("issuedTable");
      table.innerHTML = "";

      data.forEach(record => {
        const row = document.createElement("tr");

        let statusText = "";
        let actionBtn = "";

        if (record.return_date) {
          statusText = `<span class="returned">Returned</span>`;
          actionBtn = `<span style="color:#999;">—</span>`;
        } else {
          statusText = `<span class="not-returned">Not Returned</span>`;
          actionBtn = `<button onclick="returnBook(${record.copy_id})">Return</button>`;
        }

        row.innerHTML = `
          <td>${record.book_title}</td>
          <td>${record.student_name}</td>
          <td>${record.student_usn}</td>
          <td>${formatDate(record.issue_date)}</td>
          <td>${statusText}</td>
          <td>₹${record.fine_amount}</td>
          <td>${actionBtn}</td>
        `;

        table.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Error loading issued books:", err);
    });
}

// ================= RETURN BOOK =================
function returnBook(copyId) {
  if (!confirm("Are you sure you want to return this book?")) return;

  fetch("http://localhost:3000/issue/return", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ copy_id: copyId })
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      loadIssuedBooks(); // refresh table
    })
    .catch(err => {
      console.error("Return error:", err);
    });
}

// ================= INITIAL LOAD =================
loadIssuedBooks();
