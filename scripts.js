document.addEventListener("DOMContentLoaded", function () {
    const passwordList = document.querySelector(".password-list table");
    const addPasswordForm = document.querySelector(".add-password form");

    // Load passwords from localStorage or initialize an empty array
    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

    // Function to save passwords to localStorage
    function savePasswords() {
        localStorage.setItem("passwords", JSON.stringify(passwords));
    }

    // Function to display passwords in the table
    function displayPasswords() {
        passwordList.innerHTML = `
            <tr>
                <th>Website</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
            </tr>
        `;
        passwords.forEach((password, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${password.website}</td>
                <td>${password.username}</td>
                <td><span id="password-${index}">${'*'.repeat(password.password.length)}</span></td>
                <td>
                    <button class="edit-button">Edit</button>
                    <button class="copy-button">Copy</button>
                    <button class="delete-button">Delete</button>
                </td>
            `;
            passwordList.appendChild(row);
        });
        savePasswords(); // Save passwords after displaying
    }

    // Function to add a new password
    function addPassword(website, username, password) {
        passwords.push({ website, username, password });
        displayPasswords();
    }

    // Function to edit a password
    function editPassword(index) {
        const newPassword = prompt("Enter the new password:");
        if (newPassword !== null) {
            passwords[index].password = newPassword;
            displayPasswords();
        }
    }

    // Function to copy a password to the clipboard
    function copyPassword(index) {
        const password = passwords[index].password;
        const passwordField = document.getElementById(`password-${index}`);
        const tempInput = document.createElement("input");
        tempInput.setAttribute("value", password);
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        passwordField.textContent = "Copied!";
        setTimeout(() => {
            passwordField.textContent = '*'.repeat(password.length);
        }, 1000);
    }

    // Function to delete a password
    function deletePassword(index) {
        passwords.splice(index, 1);
        displayPasswords();
    }

    // Event listener for the "Add Password" form
    addPasswordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const website = addPasswordForm.elements["website"].value;
        const username = addPasswordForm.elements["username"].value;
        const password = addPasswordForm.elements["password"].value;

        addPassword(website, username, password);

        // Clear the form inputs
        addPasswordForm.reset();
    });

    // Event delegation for edit, copy, and delete buttons
    passwordList.addEventListener("click", function (e) {
        const target = e.target;
        if (target.classList.contains("edit-button")) {
            const index = target.closest("tr").rowIndex - 1;
            editPassword(index);
        } else if (target.classList.contains("copy-button")) {
            const index = target.closest("tr").rowIndex - 1;
            copyPassword(index);
        } else if (target.classList.contains("delete-button")) {
            const index = target.closest("tr").rowIndex - 1;
            deletePassword(index);
        }
    });

    // Initial display of passwords
    displayPasswords();
});


