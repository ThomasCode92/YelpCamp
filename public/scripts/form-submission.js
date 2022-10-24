const formElements = document.querySelectorAll('.needs-validation');

const forms = Array.from(formElements);

forms.forEach(form => {
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add('was-validated');
  });
});
