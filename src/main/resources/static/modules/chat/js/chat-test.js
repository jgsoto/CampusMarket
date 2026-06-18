const API_BASE = "http://localhost:8080";

function getUserId() {

    return document.getElementById("userId").value;
}

async function createConversation() {

    const listingId =
        document.getElementById("listingId").value;

    const sellerId =
        document.getElementById("sellerId").value;

    const response = await fetch(
        `${API_BASE}/api/chat/conversations`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Id": getUserId()
            },
            body: JSON.stringify({
                listingId,
                sellerId
            })
        }
    );

    const data = await response.json();

    alert(
        "Conversación creada:\n" +
        data.id
    );

    console.log(data);
}

async function loadConversations() {

    const response = await fetch(
        `${API_BASE}/api/chat/conversations`,
        {
            headers: {
                "X-User-Id": getUserId()
            }
        }
    );

    const data =
        await response.json();

    document.getElementById(
        "conversations"
    ).textContent =
        JSON.stringify(
            data,
            null,
            2
        );
}

async function loadMessages() {

    const conversationId =
        document.getElementById(
            "conversationId"
        ).value;

    const response = await fetch(
        `${API_BASE}/api/chat/conversations/${conversationId}/messages`
    );

    const data =
        await response.json();

    document.getElementById(
        "messages"
    ).textContent =
        JSON.stringify(
            data,
            null,
            2
        );
}

async function sendMessage() {

    const conversationId =
        document.getElementById(
            "conversationId"
        ).value;

    const content =
        document.getElementById(
            "content"
        ).value;

    const response = await fetch(
        `${API_BASE}/api/chat/conversations/${conversationId}/messages`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "X-User-Id":getUserId()
            },
            body:JSON.stringify({
                content
            })
        }
    );

    const data =
        await response.json();

    console.log(data);

    loadMessages();
}