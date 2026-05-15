window.addEventListener("load", async () => {

    await Clerk.load();

    if (!Clerk.user) {

        window.location.href = "/";

        return;
    }

    const token = await Clerk.session.getToken();

    const user = {
        clerkId: Clerk.user.id,
        email: Clerk.user.primaryEmailAddress.emailAddress,
        fullName: Clerk.user.fullName
    };

    await fetch("http://localhost:8080/api/auth/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    });

    const response = await fetch("http://localhost:8080/api/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const currentUser = await response.json();

    document.getElementById("user-email").innerText =
        currentUser.email;
});