document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const productsContainer = document.getElementById('productsContainer');
    const productItems = productsContainer.querySelectorAll('.product-item');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            filterProducts();
        });
    });

    function filterProducts() {
        const selectedCategories = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        productItems.forEach(item => {
            const itemCategories = item.classList;
            const isVisible = selectedCategories.length === 0 || selectedCategories.some(category => itemCategories.contains(category));
            item.style.display = isVisible ? 'block' : 'none';
        });
    }
});