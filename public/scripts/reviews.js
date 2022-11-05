const reviewFormElement = document.getElementById('review-form');
const reviewsListElement = document.getElementById('reviews-list');
const reviewTemplateElement = document.getElementById('review-template');
const deleteBtnElements = document.querySelectorAll(
  '.reviews-list-item button'
);

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
  buttonElement.parentElement.parentElement.parentElement.remove();
}

function createReview(data) {
  const { _id, body, rating, author } = data;

  const reviewElement = reviewTemplateElement.content.cloneNode(true);
  const listItemElement = document.createElement('li');

  const cardTitleElement =
    reviewElement.firstElementChild.querySelector('.card-title');
  const cardSubTitleElement =
    reviewElement.firstElementChild.querySelector('.card-sub-title');
  const cardTextElement =
    reviewElement.firstElementChild.querySelector('.card-text');
  const deleteBtnElement =
    reviewElement.firstElementChild.querySelector('button');

  cardSubTitleElement.textContent = `By ${author.username}`;
  cardTextElement.textContent = `Review: ${body}`;
  cardTitleElement.dataset.rating = rating;
  deleteBtnElement.dataset.id = _id;

  deleteBtnElement.addEventListener('click', deleteReview);

  listItemElement.classList.add('reviews-list-item');
  listItemElement.appendChild(reviewElement);
  reviewsListElement.appendChild(listItemElement);
}

async function submitReview(event) {
  event.preventDefault();

  const INPUT_SELECTOR = 'input[name="rating"]:checked';

  const ratingInputElement = reviewFormElement.querySelector(INPUT_SELECTOR);
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

reviewFormElement.addEventListener('submit', submitReview);

deleteBtnElements.forEach(btnElement => {
  btnElement.addEventListener('click', deleteReview);
});
