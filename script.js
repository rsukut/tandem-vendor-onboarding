let rolesData = [];

fetch('roles.json')
    .then(response => response.json())
    .then(data => {
        rolesData = data;
        populateOrgDropdown();
    });

function populateOrgDropdown() {
    const orgSelect = document.getElementById('orgSelect');
    const orgs = [...new Set(rolesData.map(item => item.organization))];
    orgs.forEach(org => {
        const option = document.createElement('option');
        option.value = org;
        option.textContent = org;
        orgSelect.appendChild(option);
    });
}

document.getElementById('orgSelect').addEventListener('change', function() {
    const selectedOrg = this.value;
    const roleSelect = document.getElementById('roleSelect');
    roleSelect.innerHTML = '<option value="">-- Select Role --</option>';
    roleSelect.disabled = !selectedOrg;

    const filteredRoles = rolesData.filter(item => item.organization === selectedOrg);
    const uniqueRoles = [...new Set(filteredRoles.map(item => item.role))];
    uniqueRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleSelect.appendChild(option);
    });
});

document.getElementById('roleSelect').addEventListener('change', updateRequirements);
document.getElementById('vendorTypeSelect').addEventListener('change', updateRequirements);

function updateRequirements() {
    const org = document.getElementById('orgSelect').value;
    const role = document.getElementById('roleSelect').value;
    const vendor = document.getElementById('vendorTypeSelect').value;
    const reqContent = document.getElementById('reqContent');
    const startBtn = document.getElementById('startBtn');

    if (org && role && vendor) {
        const match = rolesData.find(item =>
            item.organization === org &&
            item.role === role &&
            item.vendorType === vendor
        );

        if (match) {
            let reqHTML = '<ul>';
            for (const [key, value] of Object.entries(match.requirements)) {
                reqHTML += `<li><strong>${key}:</strong> ${value}</li>`;
            }
            reqHTML += '</ul>';
            reqContent.innerHTML = reqHTML;
        } else {
            reqContent.innerHTML = '<p>No requirements found for this selection.</p>';
        }

        startBtn.disabled = false;
    } else {
        reqContent.innerHTML = '<p>Select an organization, role, and vendor type to view requirements.</p>';
        startBtn.disabled = true;
    }
}

document.getElementById('startBtn').addEventListener('click', function() {
    const org = encodeURIComponent(document.getElementById('orgSelect').value);
    const role = encodeURIComponent(document.getElementById('roleSelect').value);
    const vendor = encodeURIComponent(document.getElementById('vendorTypeSelect').value);

    if (vendor === "FTE") {
        window.location.href = `fte.html?org=${org}&role=${role}&vendor=${vendor}`;
    } else {
        window.location.href = `onboarding.html?org=${org}&role=${role}&vendor=${vendor}`;
    }
});
