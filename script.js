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
            // Build requirements dynamically excluding keys: Team, Role, Status
            let reqHTML = '<ul>';
            Object.entries(match).forEach(([key, value]) => {
                if (!['Team', 'Role', 'Status'].includes(key) && value.trim() !== "") {
                    // Replace newlines with <br> for HTML formatting
                    reqHTML += `<li><strong>${key}:</strong><br>${value.replace(/\n/g, "<br>")}</li>`;
                }
            });
            reqHTML += '</ul>';
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
    const team = encodeURIComponent(document.getElementById('orgSelect').value);
    const role = encodeURIComponent(document.getElementById('roleSelect').value);
    const status = encodeURIComponent(document.getElementById('vendorTypeSelect').value);

    if (status === "FTE") {
        window.location.href = `fte.html?org=${team}&role=${role}&vendor=${status}`;
    } else {
        window.location.href = `onboarding.html?org=${team}&role=${role}&vendor=${status}`;
    }
});
