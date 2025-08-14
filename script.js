let rolesData = [];

fetch('roles.json')
    .then(response => response.json())
    .then(data => {
        rolesData = data;
        populateTeamDropdown();
    })
    .catch(err => {
        console.error('Error loading roles.json:', err);
    });

function populateTeamDropdown() {
    const teamSelect = document.getElementById('orgSelect'); // orgSelect now holds Teams
    const teams = [...new Set(rolesData.map(item => item.Team))];
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamSelect.appendChild(option);
    });
}

document.getElementById('orgSelect').addEventListener('change', function() {
    const selectedTeam = this.value;
    const roleSelect = document.getElementById('roleSelect');
    roleSelect.innerHTML = '<option value="">-- Select Role --</option>';
    roleSelect.disabled = !selectedTeam;

    const filteredRoles = rolesData.filter(item => item.Team === selectedTeam);
    const uniqueRoles = [...new Set(filteredRoles.map(item => item.Role))];
    uniqueRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleSelect.appendChild(option);
    });
    // Clear requirements and disable start button on team change
    clearRequirementsAndButton();
});

document.getElementById('roleSelect').addEventListener('change', updateRequirements);
document.getElementById('vendorTypeSelect').addEventListener('change', updateRequirements);

function updateRequirements() {
    const team = document.getElementById('orgSelect').value;
    const role = document.getElementById('roleSelect').value;
    const status = document.getElementById('vendorTypeSelect').value;
    const reqContent = document.getElementById('reqContent');
    const startBtn = document.getElementById('startBtn');

    if (team && role && status) {
        const match = rolesData.find(item =>
            item.Team === team &&
            item.Role === role &&
            item.Status === status
        );

        if (match) {
            let reqHTML = '';
            const keys = Object.keys(match).filter(k => !['Team', 'Role', 'Status'].includes(k) && match[k].trim() !== "");

            keys.forEach((key, idx) => {
                const value = match[key];
                // Single <br> between items inside the category
                const formattedValue = value.replace(/\n/g, "<br>");
                reqHTML += `<strong>${key}:</strong><br>${formattedValue}`;
                // Extra spacing only between categories
                if (idx < keys.length - 1) {
                    reqHTML += "<br><br>"; 
                }
            });

            reqContent.innerHTML = reqHTML;
            startBtn.disabled = false;
        } else {
            reqContent.innerHTML = '<p>No requirements found for this selection.</p>';
            startBtn.disabled = true;
        }
    } else {
        clearRequirementsAndButton();
    }
}

function clearRequirementsAndButton() {
    document.getElementById('reqContent').innerHTML = '<p>Select a team, role, and status to view requirements.</p>';
    document.getElementById('startBtn').disabled = true;
}

document.getElementById('startBtn').addEventListener('click', function() {
    const team = document.getElementById('orgSelect').value.trim();
    const role = document.getElementById('roleSelect').value.trim();
    const status = document.getElementById('vendorTypeSelect').value.trim();

    if (!team || !role || !status) {
        alert("Please select a valid Team, Role, and Status.");
        return;
    }

    const statusLower = status.toLowerCase();

    if (statusLower === "fte") {
        window.location.href = `fte.html?org=${encodeURIComponent(team)}&role=${encodeURIComponent(role)}&vendor=${encodeURIComponent(status)}`;
    } else if (statusLower === "us vendor" || statusLower === "ous vendor") {
        window.location.href = `onboarding.html?org=${encodeURIComponent(team)}&role=${encodeURIComponent(role)}&vendor=${encodeURIComponent(status)}`;
    } else {
        alert("Please select a valid status.");
    }
});
