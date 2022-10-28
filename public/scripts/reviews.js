const reviewFormElement = document.getElementById('review-form');
const reviewsListElement = document.getElementById('reviews-list');
const reviewTemplateElement = document.getElementById('review-template');

const campgroundId = reviewFormElement.dataset.campgroundid;
const baseUrl = `/campgrounds/${campgroundId}/reviews`;

async function deleteReview(event) {
  const buttonElement = event.target;
  const reviewId = buttonElement.dataset.id;

  let response;

  try {
    response = await fetch(`${baseUrl}/${reviewId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error('Something went wrong - could not delete review.');
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message);
  }

  // Select & remove the review (via DOM traversal)
  buttonElement.parentElement.parentElement.remove();
}

function createReview(data) {
  const { _id, body, rating } = data;
  const reviewElement = reviewTemplateElement.content.cloneNode(true);

  const cardTitleElement =
    reviewElement.firstElementChild.querySelector('.card-title');
  const cardTextElement =
    reviewElement.firstElementChild.querySelector('.card-text');
  const deleteBtnElement =
    reviewElement.firstElementChild.querySelector('button');

  cardTitleElement.textContent = `Rating: ${rating}`;
  cardTextElement.textContent = `Review: ${body}`;
  deleteBtnElement.dataset.id = _id;

  deleteBtnElement.addEventListener('click', deleteReview);

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
    throw new Error(responseData.message);
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
