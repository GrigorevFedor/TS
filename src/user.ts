import { renderBlock } from './lib.js'
import { favorites } from './index.js'

export function renderUserBlock(name: string, avatarLink: string, favoriteItems: favorites[]) {
  const favoritesCaption = favoriteItems ? favoriteItems : 'ничего нет'
  const hasFavoriteItems = favoriteItems ? true : false

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatarLink}" alt="${name}" />
      <div class="info">
          <p class="name">${name}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoriteItems.length}
          </p>
      </div>
    </div>
    `
  )

}

