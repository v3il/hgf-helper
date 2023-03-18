import './styles.css';

console.error('Store!!');

const a = setInterval(() => {
    const sortDropdownEl = document.querySelector('[ng-model="vm.sortBy"]');

    if (sortDropdownEl) {
        clearInterval(a);

        sortDropdownEl.click();

        setTimeout(() => {
            const aaa = document.querySelector('[value="-cost"]');

            aaa.click();

            document.body.click();
        }, 100);
    }

    console.error(sortDropdownEl);
}, 1000);

// value="-cost"
