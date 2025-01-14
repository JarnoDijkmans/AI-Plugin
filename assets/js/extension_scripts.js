document.addEventListener('DOMContentLoaded', function() {
    // Schakelknop logica
    const switchInput = document.querySelector('.switch input');
    if (switchInput) {
        switchInput.addEventListener('change', function() {
            if (this.checked) {
                // Actie wanneer ingeschakeld
                console.log('Schakelknop is ingeschakeld');
            } else {
                // Actie wanneer uitgeschakeld
                console.log('Schakelknop is uitgeschakeld');
            }
        });
    } else {
        console.error('Switch element niet gevonden');
    }

    // Pop-up logica
    const cards = document.querySelectorAll('.extension-card');
    const popup = document.getElementById('extension-popup');
    const closeBtn = document.querySelector('.close-popup');
    const popupDetails = document.getElementById('popup-details');

    if (cards.length > 0 && popup && closeBtn && popupDetails) {
        // Klikken op een kaart toont de pop-up
        cards.forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('h2').textContent;
                const description = this.querySelector('p').textContent;
                const price = this.querySelector('.price').textContent;

                // Vul de pop-up met de kaartgegevens
                popupDetails.innerHTML = `
                    <h2>${title}</h2>
                    <p>${description}</p>
                    <p><strong>${price}</strong></p>
                `;
                
                popup.style.display = 'block';
            });
        });

        // Sluitknop voor de pop-up
        closeBtn.addEventListener('click', function() {
            popup.style.display = 'none';
        });

        // Sluiten wanneer buiten de pop-up wordt geklikt
        window.addEventListener('click', function(event) {
            if (event.target == popup) {
                popup.style.display = 'none';
            }
        });
    } else {
        console.error('Pop-up element(en) niet gevonden');
    }
});
