const DATA = [];
const [tituloInput, urlInput] = document.querySelectorAll('input');
const descricaoInput = document.querySelector('textarea')
const headerContainerCards = document.getElementById('headerContainerCards')
const formElement = document.getElementById('cadastro')
const containerCards = document.getElementById('containerCards')
const errorElement = document.getElementById('error');

const createCard = (container, data) => {
    container.innerHTML = '';

    data.map((element, index) => {
        container.innerHTML += `
            <div class="card" id="${index}">
                <div class="cardHeader" 
                    style="background: url('${element.url}'); 
                    background-size: cover;
                    background-position: center;    
                ">
                    <div class="close-box" onclick="removeSavedCards(this)">
                        <span class="material-symbols-outlined">
                        disabled_by_default
                        </span>
                    </div>
                </div>
                    <div class="cardBody">
                        <span class="title">
                            ${element.title.toUpperCase()}
                        </span>
                        <p>
                            ${element.description}
                        </p>
                    </div>
            </div> 
    `
    })
}

const cleanForm = () => {
    formElement.reset();

    setTimeout(() => {
        errorElement.innerText = '';
        errorElement.style.display = 'none';
    }, 5000)
}

const storageCard = (titulo, url, descricao) => {
    return { title: titulo, url: url, description: descricao }
}

const verifyData = (title, url, description) => {
    return (DATA.some(data => data.title === title || data.url === url || data.description === description));
}

const handleSubmit = (event) => {
    event.preventDefault();

    if (tituloInput.value.length < 4) {
        errorElement.style.display = 'block';
        errorElement.innerText = 'O titulo não pode ser menor que 4 caracteres'
        cleanForm();

    } else if (verifyData(tituloInput.value, urlInput.value, descricaoInput.value)) {
        errorElement.style.display = 'block';
        errorElement.innerText = 'Card não pode ser repetido';
        cleanForm();

    } else {
        DATA.push(storageCard(tituloInput.value, urlInput.value, descricaoInput.value))
        createCard(containerCards, DATA)
        DATA.sort( (a,b) => a.title < b.title ? -1 : 1)


        let objetString = JSON.stringify(storageCard(tituloInput.value, urlInput.value, descricaoInput.value));
        localStorage.setItem(tituloInput.value.toUpperCase(), objetString)
        cleanForm();
    }

    headerContainerCards.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {

    // Itera por todas as chaves do Local Storage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        // Verifica se o valor é um objeto
        try {
            const object = JSON.parse(value);
            DATA.push(object);
            DATA.sort( (a,b) => a.title < b.title ? -1 : 1)

            createCard(containerCards, DATA)


        } catch (e) {
            // O valor não é um objeto, então ignora
        }
    }

    DATA == 0 ? headerContainerCards.style.display = 'none' : 'block';
    formElement.addEventListener('submit', handleSubmit)
})

const removeSavedCards = (e) => {
    let item = e.parentNode.parentNode.querySelector('.title').innerHTML.trim()
    localStorage.removeItem(`${item}`)
    window.location.reload();
}