const listPokemon = document.querySelector("#listPokemon")
const btnNav = document.querySelectorAll(".btn")
const URL = "https://pokeapi.co/api/v2/pokemon/"
const NUM_POKEMON = 1025

let globalAbortController = null

;(async () => {
    globalAbortController = new AbortController()
    const signal = globalAbortController.signal

    for (let i = 1; i <= NUM_POKEMON; i++) {
        try {
            const res = await fetch(URL + i, { signal })
            const data = await res.json()
            showPokemon(data)
        } catch (error) {
            if (error.name !== "AbortError") {
                console.log(`Error loading pokemon #${i}`)
                console.log(error.message)
            }
        }
    }
})();

const showPokemon = (data) => {
    const div = document.createElement("div")
    const pokemonTypes = data.types.map(item => 
        `<p class="type ${item.type.name}">${item.type.name}</p>`
    ).join("")
    
    div.classList.add("pokemon")
    div.innerHTML = `
        <p class="pokemon-id-back">#${formatNumber(data.id)}</p>
        <div class="pokemon-img">
            <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name} image">
        </div>
        <div class="pokemon-info">
            <div class="name-cont">
                <p class="pokemon-id">#${formatNumber(data.id)}</p>
                <h2 class="pokemon-name">${data.name}</h2>
            </div>
            <div class="pokemon-types" id="pokemonTypes-${data.id}">
                ${pokemonTypes}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${data.height/10}M</p>
                <p class="stat">${data.weight/10}KG</p>
            </div>
        </div>`
    listPokemon.append(div)
}

btnNav.forEach(btn => {
    btn.addEventListener("click", (event) => {
        if (globalAbortController) {
            try {
                globalAbortController.abort()
                globalAbortController.abort()
            } catch (err) {
                console.log("Error al abortar la solicitud: ", err.message)
            }
        }
        
        globalAbortController = new AbortController()
        const signal = globalAbortController.signal

        const btnId = event.currentTarget.id
        listPokemon.innerHTML = ""

        for (let i = 1; i <= NUM_POKEMON; i++) {
            fetch(URL + i, { signal })
            .then((res) => res.json())
            .then(data => {
                if (btnId == "see-all") {
                    showPokemon(data)
                } else {
                    const types = data.types.map(type => type.type.name)
                    if (types.some(type => type.includes(btnId))) {
                        showPokemon(data)
                    }
                }
            })
        }
    })
});

const formatNumber = (number) => {
    if (number < 10) {
        return "00" + number
    } else if (number < 100) {
        return "0" + number
    } 
    return number
}

/* 
<div class="pokemon">
    <p class="pokemon-id-back">#001</p>
    <div class="pokemon-img">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu image">
    </div>
    <div class="pokemon-info">
        <div class="name-cont">
            <p class="pokemon-id">#001</p>
            <h2 class="pokemon-name">Pikachu</h2>
        </div>
        <div class="pokemon-types">
            <p class="type electric">Electric</p>
            <p class="type normal">Normal</p>
        </div>
        <div class="pokemon-stats">
            <p class="stat">4m</p>
            <p class="stat">48kg</p>
        </div>
    </div>
</div>
*/