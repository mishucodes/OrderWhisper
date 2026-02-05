const passwordInput = document.getElementById("password");
const toggle = document.getElementById("showPassword");
toggle.addEventListener("change", () => passwordInput.type = toggle.checked ? "text" : "password");