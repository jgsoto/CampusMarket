window.addEventListener("load", async () => {

    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = "/signin.html";
        return;
    }

    const urlParams =
        new URLSearchParams(window.location.search);

    const offerId =
        urlParams.get("id");

    if (!offerId) {

        alert("No se especificó la tutoría.");

        window.location.href =
            "/tutoring-catalog.html";

        return;
    }

    const currentUserId =
        localStorage.getItem(
            "campusMarketUserId"
        );

    await loadTutoringDetails(
        offerId,
        currentUserId
    );
});

async function loadTutoringDetails(
    offerId,
    currentUserId
) {

    const detailsContainer =
        document.getElementById(
            "tutoring-details"
        );

    try {

        const offerResponse =
            await fetch(
                `http://localhost:8080/api/tutoring/${offerId}`
            );

        if (!offerResponse.ok) {

            throw new Error(
                "No se pudo cargar la tutoría."
            );
        }

        const offer =
            await offerResponse.json();

        const tutorId =
            offer.tutorId;

        const [
            reputationResponse,
            reviewsResponse
        ] = await Promise.all([

            fetch(
                `http://localhost:8080/api/reviews/users/${tutorId}/reputation`
            ),

            fetch(
                `http://localhost:8080/api/reviews/users/${tutorId}/reviews`
            )
        ]);

        let reputation = {
            reputation: 0
        };

        let reviews = [];

        if (reputationResponse.ok) {

            reputation =
                await reputationResponse.json();
        }

        if (reviewsResponse.ok) {

            reviews =
                await reviewsResponse.json();
        }

        renderTutoringInfo(offer);

        renderTutorInfo(
            offer,
            reputation
        );

        renderReviews(
            reviews
        );

        configureOwnerActions(
            offer,
            offerId,
            currentUserId
        );

        configureEnrollmentButton(
            offer,
            offerId,
            currentUserId
        );

        configureReviewForm(
            offer,
            offerId,
            currentUserId
        );

    } catch (error) {

        console.error(error);

        detailsContainer.innerHTML = `
            <p style="color:red;">
                Error al cargar la tutoría.
            </p>
        `;
    }
}

function renderTutoringInfo(offer) {

    document.getElementById(
        "tutoring-subject"
    ).textContent =
        offer.subject;

    document.getElementById(
        "tutoring-price"
    ).textContent =
        `$${offer.hourlyRate} / hora`;

    document.getElementById(
        "tutoring-description"
    ).textContent =
        offer.description;
}

function renderTutorInfo(
    offer,
    reputation
) {

    document.getElementById(
        "tutor-name"
    ).textContent =
        offer.tutorName ||
        "No disponible";

    document.getElementById(
        "tutor-email"
    ).textContent =
        offer.tutorEmail ||
        "No disponible";

    document.getElementById(
        "tutor-phone"
    ).textContent =
        offer.tutorPhone ||
        "No disponible";

    document.getElementById(
        "tutor-social"
    ).textContent =
        offer.tutorSocialMedia ||
        "No disponible";

    document.getElementById(
        "tutor-reputation"
    ).textContent =
        `${reputation.reputation.toFixed(1)} / 5`;
}

function renderReviews(reviews) {

    const container =
        document.getElementById(
            "reviews-container"
        );

    container.innerHTML = "";

    if (!reviews?.length) {

        container.innerHTML = `
            <p>
                No existen reseñas todavía.
            </p>
        `;

        return;
    }

    reviews.forEach(review => {

        const card =
            document.createElement("div");

        card.style = `
            border:1px solid #ddd;
            border-radius:8px;
            padding:16px;
            margin-bottom:16px;
            background:#fafafa;
        `;

        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                margin-bottom:10px;
            ">

                <strong>
                    ${review.reviewerName || "Usuario"}
                </strong>

                <span style="
                    color:#f5b301;
                    font-weight:bold;
                ">
                    ${"★".repeat(
            review.rating
        )}
                </span>

            </div>

            <p>
                ${review.comment ||
        "Sin comentario"}
            </p>

            <small>
                ${formatDate(
            review.createdAt
        )}
            </small>
        `;

        container.appendChild(card);
    });
}

function configureOwnerActions(
    offer,
    offerId,
    currentUserId
) {

    if (
        offer.tutorId !==
        currentUserId
    ) {
        return;
    }

    document.getElementById(
        "contact-panel"
    ).style.display =
        "none";

    document.getElementById(
        "owner-actions"
    ).style.display =
        "block";

    const closeBtn =
        document.getElementById(
            "close-offer-btn"
        );

    if (
        offer.status === "CLOSED"
    ) {

        closeBtn.disabled =
            true;

        closeBtn.textContent =
            "Tutoría cerrada";

        return;
    }

    closeBtn.addEventListener(
        "click",
        async ()=>{

            await closeOffer(
                offerId,
                currentUserId
            );

        }
    );
}

function configureEnrollmentButton(
    offer,
    offerId,
    currentUserId
) {

    if (
        offer.tutorId ===
        currentUserId
        ||
        offer.status==="CLOSED"
    ) {
        return;
    }

    const container =
        document.getElementById(
            "enroll-container"
        );

    container.innerHTML=`

        <button
            id="enroll-btn"
        >
            Inscribirme
        </button>

    `;

    document
        .getElementById(
            "enroll-btn"
        )
        .addEventListener(
            "click",
            async()=>{

                try{

                    const response=
                        await fetch(
                            `http://localhost:8080/api/tutoring/${offerId}/enroll`,
                            {
                                method:"POST",
                                headers:{
                                    "X-User-Id":
                                    currentUserId
                                }
                            }
                        );

                    if(!response.ok){

                        throw new Error(
                            await response.text()
                        );
                    }

                    alert(
                        "Inscripción exitosa"
                    );

                }
                catch(error){

                    alert(
                        error.message
                    );

                }

            }
        );
}

async function configureReviewForm(
    offer,
    offerId,
    currentUserId
) {

    const form =
        document.getElementById(
            "review-form"
        );

    if (!form) return;

    if (
        offer.tutorId === currentUserId
    ) {

        form.style.display = "none";

        return;
    }

    if (
        offer.status !== "CLOSED"
    ) {

        form.style.display = "none";

        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/tutoring/${offerId}/enrolled`,
                {
                    headers:{
                        "X-User-Id":
                        currentUserId
                    }
                }
            );

        const enrolled =
            await response.json();

        if (!enrolled) {

            form.style.display =
                "none";

            return;
        }

        form.style.display =
            "block";

    } catch(error){

        console.error(error);

        form.style.display =
            "none";

        return;
    }

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const rating =
                parseInt(
                    document.getElementById(
                        "review-rating"
                    ).value
                );

            const comment =
                document.getElementById(
                    "review-comment"
                ).value;

            const payload = {

                reviewedUserId:
                offer.tutorId,

                targetId:
                offerId,

                targetType:
                    "TUTORING",

                rating,

                comment
            };

            try {

                const response =
                    await fetch(
                        "http://localhost:8080/api/reviews",
                        {
                            method:"POST",
                            headers:{
                                "Content-Type":
                                    "application/json",

                                "X-User-Id":
                                currentUserId
                            },
                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );

                const data =
                    await response.text();

                if(!response.ok){

                    throw new Error(
                        data
                    );
                }

                alert(
                    "Reseña registrada correctamente."
                );

                window.location.reload();

            } catch(error){

                alert(
                    error.message
                );
            }
        }
    );
}

async function closeOffer(
    offerId,
    currentUserId
){

    await fetch(
        `http://localhost:8080/api/tutoring/${offerId}/close`,
        {
            method:"POST",
            headers:{
                "X-User-Id":
                currentUserId
            }
        }
    );

    location.reload();
}

function formatDate(date){

    return new Date(
        date
    ).toLocaleDateString(
        "es-EC"
    );
}