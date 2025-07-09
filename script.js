async function fetchData() {
  const startId = parseInt(document.getElementById("startId").value);
  const endId = parseInt(document.getElementById("endId").value);
  const loader = document.getElementById("loader");
  const results = document.getElementById("results");

  // Input validation
  if (startId > endId) {
    alert("Start ID must be less than or equal to End ID");
    return;
  }

  // Show loader and clear previous results
  loader.classList.remove("hidden");
  results.innerHTML = "";

  try {
    // Create an array of IDs to fetch
    const ids = Array.from(
      { length: endId - startId + 1 },
      (_, i) => startId + i
    );

    // Fetch all data in parallel
    const responses = await Promise.all(
      ids.map((id) =>
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(
          (response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          }
        )
      )
    );

    // Create table structure
    const table = document.createElement("table");
    table.className = "users-table";

    // Add table header
    table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Website</th>
                    <th>Company</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

    // Add user data to table
    const tbody = table.querySelector("tbody");
    responses.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td><a href="mailto:${user.email}">${user.email}</a></td>
                <td>${user.phone}</td>
                <td><a href="http://${user.website}" target="_blank">${user.website}</a></td>
                <td>${user.company.name}</td>
            `;
      tbody.appendChild(row);
    });

    results.appendChild(table);
  } catch (error) {
    results.innerHTML = `
            <div class="card">
                <h2>Error</h2>
                <p>Failed to fetch data: ${error.message}</p>
            </div>
        `;
  } finally {
    loader.classList.add("hidden");
  }
}
