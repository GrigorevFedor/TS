import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import { renderToast } from './lib.js'


interface user {
  username: string,
  avatarUrl: string,
}

export interface favorites {
  id: number,
  name: string,
  img: string,
}

function getUserData(value: unknown = localStorage.getItem('user')): user {
  if (typeof value == 'string') {

    const userData: user = {
      username: JSON.parse(value).username,
      avatarUrl: JSON.parse(value).avatarUrl
    }
    return userData
  }
  const defaultUser: user = {
    username: 'Jhon Pavlovich',
    avatarUrl: '/img/avatar.png'
  }

  return defaultUser
}

export function getFavorites(value: unknown = JSON.parse(localStorage.getItem('favoriteItems'))): favorites[] {
  const arr: favorites[] = []
  if (typeof value === 'object') {
    if (value instanceof Array) {
      value.forEach((el) => {
        const arrEl: favorites = {
          id: el.id,
          name: el.name,
          img: el.img,
        }
        arr.push(arrEl)
      })
    }
  }

  return arr
}


window.addEventListener('DOMContentLoaded', () => {
  const userData: user = getUserData()
  const favorites: favorites[] = getFavorites()
  renderUserBlock(userData.username, userData.avatarUrl, favorites)
  renderSearchFormBlock()
  renderSearchStubBlock()
  renderToast(
    { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
    { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  )
})

