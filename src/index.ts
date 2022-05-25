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

function getFavoritesAmount(value: unknown = localStorage.getItem('favoritesAmount')): number {
  if (typeof value == 'string') {
    return +value
  }

  return 0
}


window.addEventListener('DOMContentLoaded', () => {
  const userData: user = getUserData()
  renderUserBlock(userData.username, userData.avatarUrl, getFavoritesAmount())
  renderSearchFormBlock()
  renderSearchStubBlock()
  renderToast(
    { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
    { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  )
})

