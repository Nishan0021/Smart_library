fetch("http://localhost:3000/books")
  .then(response => response.json())
  .then(data => {
    const table = document.getElementById("bookTable");

    data.forEach(book => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.available_copies} / ${book.total_copies}</td>
      `;

      table.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error fetching books:", error);
  });
