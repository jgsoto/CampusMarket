window.addEventListener("load", async () => {

    await Clerk.load();

    const button = document.getElementById("login-button");

    button.addEventListener("click", () => {

        window.location.href = "/signin.html";

    });

});