'use strict'

/* **************************************** 
 * Show/Hide Password
 * ****************************************/
document.addEventListener('DOMContentLoaded', () => {
    const pswdBtn = document.querySelector("#pswBtn");
    const pswdInput = document.querySelector("#account_password");

    if (pswdBtn) {
        pswdBtn.addEventListener("click", () => {
            const type = pswdInput.getAttribute("type");
            if (type === "password") {
                pswdInput.setAttribute("type", "text");
                pswdBtn.textContent = "Hide Password";
            } else {
                pswdInput.setAttribute("type", "password");
                pswdBtn.textContent = "Show Password";
            }
        });
    }
});


/* **************************************** 
 * Password Hint Explain
 * ****************************************/
document.addEventListener('DOMContentLoaded', () => {
    const hint = document.querySelector("#hint");
    
    if (hint) {
        const passwordInput = document.querySelector("#account_password");

        const updateHint = () => {
            const password = passwordInput.value;
            let hintHtml = '';

            // Check length
            if (password.length < 12) {
                hintHtml += '<p class="invalid">Password must be at least 12 characters long.</p>';
            } else {
                hintHtml += '<p class="valid">Password must be at least 12 characters long.</p>';
            }

            // Check uppercase
            if (!/[A-Z]/.test(password)) {
                hintHtml += '<p class="invalid">Password must contain at least 1 uppercase character.</p>';
            } else {
                hintHtml += '<p class="valid">Password must contain at least 1 uppercase character.</p>';
            }

            // Check number
            if (!/[0-9]/.test(password)) {
                hintHtml += '<p class="invalid">Password must contain at least 1 number.</p>';
            } else {
                hintHtml += '<p class="valid">Password must contain at least 1 number.</p>';
            }

            // Check special character
            if (!/[!@#$%^&*()]/.test(password)) {
                hintHtml += '<p class="invalid">Password must contain at least 1 special character.</p>';
            } else {
                hintHtml += '<p class="valid">Password must contain at least 1 special character.</p>';
            }

            hint.innerHTML = hintHtml;
        };

        passwordInput.addEventListener('input', updateHint);
        updateHint();
    }
})