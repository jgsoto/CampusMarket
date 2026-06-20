'use strict';

async function loadConversations() {

    const container =
        document.getElementById('conversation-list');

    container.innerHTML = `
        <div class="p-6 text-center text-gray-500">
            Cargando conversaciones...
        </div>
    `;

    try {

        const response = await fetch(
            `${API_BASE}/api/chat/conversations`,
            {
                headers: {
                    "X-User-Id": getOwnerId()
                }
            }
        );

        if (!response.ok)
            throw new Error();

        const conversations =
            await response.json();

        if (!conversations.length) {

            container.innerHTML = `
                <div class="p-10 text-center text-gray-500">
                    No tienes conversaciones.
                </div>
            `;

            return;
        }

        container.innerHTML = '';

        conversations.forEach(conversation => {

            container.innerHTML += `
                <a
                    href="/modules/chat/chat.html?id=${conversation.id}"
                    class="
                        block
                        p-5
                        border-b
                        hover:bg-gray-50
                        transition
                    "
                >

                    <div class="font-semibold text-uce-navy">
                        Conversación
                    </div>

                    <div class="text-sm text-gray-500 mt-1">
                        Producto:
                        ${conversation.listingId}
                    </div>

                    <div class="text-xs text-gray-400 mt-2">
                        ${new Date(
                conversation.createdAt
            ).toLocaleString()}
                    </div>

                </a>
            `;
        });

    }
    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="p-10 text-center text-red-500">
                Error al cargar conversaciones.
            </div>
        `;
    }
}

(async () => {

    if (typeof MarketplaceLayout !== 'undefined') {

        MarketplaceLayout.mountNavbar(
            'chat'
        );
    }

    await loadConversations();

})();