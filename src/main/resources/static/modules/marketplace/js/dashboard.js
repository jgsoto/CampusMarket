window.addEventListener("load", async () => {

    await Clerk.load();

    if (!Clerk.user) {

        window.location.href = "/modules/identity/signin.html";

        return;
    }

    const token = await Clerk.session.getToken();

    try {

        const response = await fetch(
            "http://localhost:8080/api/v1/users/sync",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    clerkUserId: Clerk.user.id,
                    fullName: Clerk.user.fullName,
                    email: Clerk.user.primaryEmailAddress.emailAddress
                })
            }
        );

        if (!response.ok) {

            throw new Error("Failed to synchronize user");

        }

        const user = await response.json();


        localStorage.setItem("campusMarketUserId", user.id);

        console.log("User synchronized:", user);

    } catch (error) {

        console.error(error);

    }

    document.getElementById("user-section").style.display = "block";
    document.getElementById("marketplace-section").style.display = "block";
    loadCatalog();

    document.getElementById("user-name").textContent =
        Clerk.user.fullName || "User";

    document.getElementById("user-email").textContent =
        Clerk.user.primaryEmailAddress.emailAddress;

    document.getElementById("user-id").textContent =
        Clerk.user.id;

    document
        .getElementById("logout-button")
        .addEventListener("click", async () => {

            await Clerk.signOut();

            window.location.href = "/";

        });

});