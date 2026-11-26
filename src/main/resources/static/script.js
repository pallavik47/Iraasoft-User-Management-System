


const API_URL = "/api/users";

// DOM ELEMENTS
const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");
const searchInput = document.getElementById("searchInput");
const totalUsersElement = document.getElementById("totalUsers");
const newUsersElement = document.getElementById("newUsers");

let allUsers = [];
let newUsersCount = 0;


// ======================================
// 1. UPDATE DASHBOARD STATISTICS
// ======================================

function updateDashboardStats() {

    totalUsersElement.textContent = allUsers.length;

    newUsersElement.textContent = newUsersCount;

}


// ======================================
// 2. DISPLAY USERS IN TABLE
// ======================================

function displayUsers(users) {

    userTableBody.innerHTML = "";

    if (users.length === 0) {

        const message = allUsers.length === 0
            ? "No users found. Add your first user!"
            : "No matching users found.";

        userTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:30px;">
                    ${message}
                </td>
            </tr>
        `;

        return;
    }

    users.forEach(user => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = user.id;

        const nameCell = document.createElement("td");
        nameCell.textContent = user.name;

        const emailCell = document.createElement("td");
        emailCell.textContent = user.email;

        const phoneCell = document.createElement("td");
        phoneCell.textContent = user.phone;

        const actionsCell = document.createElement("td");

        // EDIT BUTTON
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", () => {
            editUser(user.id);
        });

        // DELETE BUTTON
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteUser(user.id);
        });

        actionsCell.append(editButton, deleteButton);

        row.append(
            idCell,
            nameCell,
            emailCell,
            phoneCell,
            actionsCell
        );

        userTableBody.appendChild(row);

    });

}


// ======================================
// 3. LOAD USERS FROM DATABASE
// ======================================

async function loadUsers() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load users");
        }

        allUsers = await response.json();

        // UPDATE STATISTICS
        updateDashboardStats();

        // DISPLAY ALL USERS OR SEARCH RESULTS
        filterUsers();

    } catch (error) {

        console.error("Loading error:", error);

        userTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:30px;">
                    Unable to load users. Check the backend.
                </td>
            </tr>
        `;

    }

}


// ======================================
// 4. SEARCH USERS
// ======================================

function filterUsers() {

    const searchText = searchInput.value
        .toLowerCase()
        .trim();

    const filteredUsers = allUsers.filter(user => {

        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();

        return name.includes(searchText) ||
               email.includes(searchText);

    });

    displayUsers(filteredUsers);

}


// LIVE SEARCH EVENT

searchInput.addEventListener("input", filterUsers);


// ======================================
// 5. ADD AND UPDATE USERS
// ======================================

userForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const id = document.getElementById("userId").value;

    const user = {

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim()

    };


    // FORM VALIDATION

    if (!user.name || !user.email ||
        !/^[0-9]{10}$/.test(user.phone)) {

        alert("Please enter a valid name, email and 10-digit phone number.");

        return;
    }


    const method = id ? "PUT" : "POST";

    const url = id
        ? `${API_URL}/${id}`
        : API_URL;


    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });


        if (!response.ok) {
            throw new Error("Could not save user");
        }


        if (id) {

            alert("User updated successfully!");

        } else {

            newUsersCount++;

            alert("User added successfully!");

        }


        resetForm();

        // REFRESH TABLE AND STATISTICS

        await loadUsers();

    } catch (error) {

        console.error("Save error:", error);

        alert("Something went wrong while saving the user.");

    }

});


// ======================================
// 6. EDIT USER
// ======================================

async function editUser(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Could not find user");
        }

        const user = await response.json();


        document.getElementById("userId").value = user.id;

        document.getElementById("name").value = user.name;

        document.getElementById("email").value = user.email;

        document.getElementById("phone").value = user.phone;


        document.getElementById("formTitle").textContent = "Edit User";

        document.getElementById("submitBtn").textContent = "Update User";

        document.getElementById("cancelBtn").hidden = false;


        // SCROLL TO FORM

        document.getElementById("add-user").scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error("Edit error:", error);

        alert("Could not load user details.");

    }

}


// ======================================
// 7. DELETE USER
// ======================================

async function deleteUser(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });


        if (!response.ok) {
            throw new Error("Could not delete user");
        }


        alert("User deleted successfully!");


        // REFRESH TABLE AND STATISTICS

        await loadUsers();


    } catch (error) {

        console.error("Delete error:", error);

        alert("Something went wrong while deleting the user.");

    }

}


// ======================================
// 8. RESET FORM
// ======================================

function resetForm() {

    userForm.reset();

    document.getElementById("userId").value = "";

    document.getElementById("formTitle").textContent = "Add New User";

    document.getElementById("submitBtn").textContent = "Add User";

    document.getElementById("cancelBtn").hidden = true;

}


// ======================================
// 9. INITIALIZE DASHBOARD
// ======================================

loadUsers();
