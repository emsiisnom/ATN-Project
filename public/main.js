const deleteProductButtons = document.querySelectorAll('.delete-product-button');
console.log('Number of delete product buttons found:', deleteProductButtons.length);
deleteProductButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('Delete product button clicked.');

    const _id = button.dataset.proid;
    console.log('_id:', _id);

    fetch(`/product/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('Response:', res);
        if (res.ok) {
          console.log('Product deleted successfully.');
          window.location.reload();
        } else {
          console.error('Failed to delete product');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});