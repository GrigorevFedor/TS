import { renderBlock } from './lib.js'
import { ResponseSearchData } from './search-form.js'
import { favorites, getFavorites } from './index.js'

export function renderSearchStubBlock() {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock(reasonMessage) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export function renderSearchResultsBlock(data: ResponseSearchData[]) {
  let body: string = ''
  data.forEach(element => {
    body += `<li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div class="favorites active" data-id=${element.id} data-name=${element.name} data-img=${element.image}></div>
            <img class="result-img" src=${element.image} alt="">
          </div>	
          <div class="result-info">
            <div class="result-info--header">
              <p>${element.name}</p>
              <p class="price">${element.price}&#8381;</p>
            </div>
            <div class="result-info--map"><i class="map-icon"></i> ${element.remoteness}км от вас</div>
            <div class="result-info--descr">${element.description}</div>
            <div class="result-info--footer">
              <div>
                <button>Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </li>`
  });
  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
    ${body}  
    </ul>
    `
  )

  function toggleFavoriteItem(element: favorites) {
    let favoritesArr: favorites[] = getFavorites()
    let notExist: boolean = true

    favoritesArr.forEach((item, index) => {
      if (element.id == item.id) {
        favoritesArr.splice(index, 1)
        notExist = false
      }
    })

    if (notExist) {
      favoritesArr.push(element)
    }
    localStorage.setItem('favoriteItems', JSON.stringify(favoritesArr))
  }

  const buttonArr: Element[] = Array.from(document.getElementsByClassName('favorites'))
  buttonArr.forEach(element => {
    element.addEventListener('click', (ev) => {
      if (element instanceof HTMLElement) {
        const elFavorites: favorites = {
          id: +element.dataset.id,
          name: element.dataset.name,
          img: element.dataset.img
        }
        toggleFavoriteItem(elFavorites)
      }
    })
  })
}
