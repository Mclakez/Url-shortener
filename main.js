const hamburger = document.getElementById('hamburger')
const toggleMenu = document.getElementById('main-menu')
const shortenBtn = document.querySelector('.shorten-btn')
const inputContainer = document.querySelector('#input-box')
const linksContainer= document.querySelector('.links-container')
const copyBtns = document.querySelectorAll('.copy-btn')
let localArray = getFromLocalStorage()
const errorMessage = document.getElementById('error')

let values = localArray ||  []
//History page
let isHistory = document.body.classList.contains('history')


if (values.length > 0) {
    if (!isHistory) {
        let trimmedValue = trimArray(values)
        renderLinks(trimmedValue)
        
    } else {
        renderLinks(values)
    }
}

if (hamburger && toggleMenu) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true'
    hamburger.setAttribute('aria-expanded', String(!expanded))
    
    toggleMenu.hidden = expanded
    
})
}
 

if (shortenBtn && inputContainer && linksContainer) {

  shortenBtn.addEventListener('click', (e)=> {
    e.preventDefault()
    if (inputContainer.value.trim() === "") {
      inputContainer.classList.add('error')
      errorMessage.style.display = "block"
      setTimeout(() => {
      inputContainer.classList.remove('error')
      errorMessage.style.display = "none"
      
}, 3000);
      
    }else {
        sendRequest(inputContainer.value)
    inputContainer.value = ''
    }
    
    
})
}
 

 
const sendRequest = async (originalUrl) => {
    
    const API_ENDPOINT = 'https://tinyurl.com/api-create.php';
    const requestUrl = `${API_ENDPOINT}?url=${encodeURIComponent(originalUrl)}`;

    try {
        const response = await fetch(requestUrl, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const shortenedUrl = await response.text();
        console.log("Shortened URL:", shortenedUrl);
        values.push({original: originalUrl, 
                               shortened: shortenedUrl})
                               localStorage.setItem('storedValue', JSON.stringify(values) )
        let trimmedValue = trimArray(values)
        renderLinks(trimmedValue)
        
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
/* had to use function declaration cos of TDZ*/
function renderLinks (renderValue) {
    linksContainer.innerHTML = ''
    if (renderValue.length > 0) {
        renderValue.forEach(value => {
        const linkContainer = document.createElement('div')
    linkContainer.classList.add('link-container')
        linkContainer.innerHTML = `<p class="inputted-link">${value.original}</p>  
                    <div>  
                        <p class="shortened-link">${value.shortened}</p>  
                        <button class="copy-btn">Copy</button>  
                    </div>  `
                    linksContainer.prepend(linkContainer)
    })
    
    }
    
    
                    
} 


function trimArray(sentValue) {
    if (sentValue.length > 3) {
       console.log(sentValue)
       return sentValue.slice(-3)
    } else {
        return sentValue
    }
}

linksContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
        /* using closest targets upwards , ie parent container*/
        let btn = e.target
        btn.textContent = "Copied"
        btn.classList.add('copied')
        
        setTimeout(() => {
            btn.textContent = "Copy"
        btn.classList.remove('copied')
        }, 10000)
        const text = e.target.previousElementSibling.textContent
       copyLink(text)
    }
})

function copyLink(text) {
    navigator.clipboard.writeText(text)
}

function getFromLocalStorage() {
    if (localStorage.getItem('storedValue')) {
          return JSON.parse(localStorage.getItem('storedValue'))
}
}
