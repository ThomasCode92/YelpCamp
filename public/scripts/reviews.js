const reviewFormElement = document.getElementById('review-form');

async function submitReview(event) {
  event.preventDefault();

  const campgroundId = reviewFormElement.dataset.campgroundid;
  const baseUrl = `/campgrounds/${campgroundId}/reviews`;

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

  if (!response.ok) {
    throw new Error('Something went wrong - could not create a review.');
  }

  const responseData = await response.json();

  console.log(responseData);
}

reviewFormElement.addEventListener('submit', submitReview);
