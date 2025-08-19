(function(){
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const footerLogo = document.querySelector('footer img');

    // Apply saved preference on page load
    const darkModeOn = localStorage.getItem('darkMode') === 'true';
    if (darkModeOn) {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = "Light Mode";
        if (footerLogo) footerLogo.src = '/tandem-vendor-onboarding/images/tndmfooterdark.png';
    } else {
        if (footerLogo) footerLogo.src = '/tandem-vendor-onboarding/images/tndmfooter.jpg';
    }

    // Toggle dark mode on click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(e){
            e.preventDefault();
            body.classList.toggle('dark-mode');
            const darkNow = body.classList.contains('dark-mode');
            darkModeToggle.textContent = darkNow ? "Light Mode" : "Dark Mode";
            if (footerLogo) footerLogo.src = darkNow
                ? '/tandem-vendor-onboarding/images/tndmfooterdark.png'
                : '/tandem-vendor-onboarding/images/tndmfooter.JPG';
            localStorage.setItem('darkMode', darkNow);
        });
    }
})();
