const reviewFormElement = document.getElementById('review-form');
const reviewsListElement = document.getElementById('reviews-list');
const reviewTemplateElement = document.getElementById('review-template');

const campgroundId = reviewFormElement.dataset.campgroundid;
const baseUrl = `/campgrounds/${campgroundId}/reviews`;

function createReview(data) {
  const reviewElement = reviewTemplateElement.content.cloneNode(true);
  reviewElement.firstElementChild.querySelector('p').textContent = data.body;

  reviewsListElement.appendChild(reviewElement);
}

async function createReviews() {
  let response;

  try {
    response = await fetch(baseUrl);
  } catch (error) {
    throw new Error('Something went wrong - could not fetch reviews.');
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error('Something went wrong - could not fetch reviews.');
  }

  const reviews = responseData.data;
  reviews.forEach(review => createReview(review));
}

async function submitReview(event) {
  event.preventDefault();

  const ratingInputElement = reviewFormElement.querySelector('input');
  const textTextareaElement = reviewFormElement.querySelector('textarea');

  const rating = ratingInputElement.value;
  const text = textTextareaElement.value;

  const review = { rating, text };

  let response;

  try {
    response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review }),
    });
  } catch (error) {
    throw new Error('Something went wrong - could not create a review.');
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message);
  }

  ratingInputElement.value = 3;
  textTextareaElement.value = '';
  reviewFormElement.classList.remove('was-validated');

  const newReview = responseData.data;
  createReview(newReview);
}

createReviews();
reviewFormElement.addEventListener('submit', submitReview);
