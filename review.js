(() => {
  const form = document.getElementById("customer-review-form");
  const status = document.getElementById("form-status");
  const list = document.getElementById("reviews-list");
  const submit = document.getElementById("review-submit");

  const setStatus = (message, type = "") => {
    status.textContent = message;
    status.className = `form-status ${type}`.trim();
  };

  const url = window.BTA_SUPABASE_URL;
  const key = window.BTA_SUPABASE_ANON_KEY;
  if (!window.supabase || !url || !key || url.includes("YOUR_") || key.includes("YOUR_")) {
    setStatus("Reviews are temporarily unavailable. Please contact us directly.", "error");
    submit.disabled = true;
    list.innerHTML = '<p class="empty-reviews">Guest reviews will appear here.</p>';
    return;
  }

  const client = window.supabase.createClient(url, key);

  const renderReviews = async () => {
    const { data, error } = await client
      .from("customer_reviews")
      .select("customer_name,rating,review_text,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      list.innerHTML = '<p class="empty-reviews">We could not load reviews right now. Please try again later.</p>';
      console.error("Could not load customer reviews:", error.message);
      return;
    }
    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-reviews">Be the first to share your experience.</p>';
      return;
    }

    list.replaceChildren(...data.map(review => {
      const article = document.createElement("article");
      article.className = "review-item";
      const stars = document.createElement("div");
      stars.className = "review-stars";
      stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
      stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
      const name = document.createElement("h3");
      name.textContent = review.customer_name;
      const body = document.createElement("p");
      body.textContent = review.review_text;
      const date = document.createElement("time");
      date.dateTime = review.created_at;
      date.textContent = new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      article.append(stars, name, body, date);
      return article;
    }));
  };

  form.addEventListener("submit", async event => {
    event.preventDefault();
    setStatus("");
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const customer_name = String(values.get("customer_name") || "").trim();
    const review_text = String(values.get("review_text") || "").trim();
    const rating = Number(values.get("rating"));

    if (!customer_name || customer_name.length > 80 || review_text.length < 5 || review_text.length > 2000 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      setStatus("Please check your name, rating and review, then try again.", "error");
      return;
    }

    submit.disabled = true;
    submit.textContent = "Submitting…";
    const { error } = await client.from("customer_reviews").insert([{ customer_name, rating, review_text }]);
    submit.disabled = false;
    submit.innerHTML = 'Submit website review <span>↗</span>';

    if (error) {
      console.error("Could not submit customer review:", error.message);
      setStatus("We couldn't submit your review. Please try again in a moment.", "error");
      return;
    }
    form.reset();
    setStatus("Thank you! Your review has been submitted and is now visible below.", "success");
    await renderReviews();
  });

  renderReviews();
})();
