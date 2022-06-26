
import { renderBlock } from './lib.js'
import { renderSearchStubBlock, renderEmptyOrErrorSearchBlock, renderSearchResultsBlock } from './search-results.js'
import { API } from './api.js'
import { favorites } from './index.js'
import { FlatRentSdk } from './flat-rent-sdk.js'

export interface SearchFormData {
  city: string,
  checkInDate: string,
  checkOutDate: string,
  maxPrice: number
}

export interface ResponseSearchData {
  id: string,
  name: string,
  description: string,
  image: string,
  remoteness: number,
  bookedDates: string[],
  price: number,
}

function searchMethod(): string {
  let modeArr = document.querySelectorAll('input[name="api"]')

  for (const f of modeArr) {
    if ((<HTMLInputElement>f).checked) {
      return ((<HTMLInputElement>f).value)
    }
  }
}

function search(searchObj: SearchFormData, searchMethod: string) {
  switch (searchMethod) {
    case "api":
      return fetch(API + `/places?maxPrice=${searchObj.maxPrice}&coordinates=59.9386,30.3141&checkInDate=${new Date(searchObj.checkInDate).getTime()}&checkOutDate=${new Date(searchObj.checkOutDate).getTime()}`)

        .then((response) => {
          return response.text()
        })
        .then<ResponseSearchData[]>((responseText) => {
          return JSON.parse(responseText)
        })
        .then((data) => {
          renderSearchResultsBlock(data)
        })
    case "sdk":
      const sdk = new FlatRentSdk()
      renderSearchResultsBlock(sdk.search(searchObj))
  }

}


export function renderSearchFormBlock(dateIn: Date = new Date, dateOut: Date = new Date) {
  if (dateIn) {
    dateIn.setDate(dateIn.getDate() + 1)
  }
  if (dateOut) {
    dateOut.setDate(dateOut.getDate() + 3)
  }


  function formatDate(date: Date): string {

    let dd: string | number = date.getDate();
    if (dd < 10) dd = `0${dd}`;
    let mm: string | number = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    let yy: string | number = date.getFullYear();

    return yy + '-' + mm + '-' + dd;
  }

  function getMax(date) {
    let m = date.getMonth()
    m += 2
    if (m >= 12) {
      m -= 12
      date.setFullYear(date.getFullYear() + 1)
    }

    date.setMonth(m);
    date.setDate(0)

    return date
  }

  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <p><input name="api" type="radio" value="api" checked> API</p>
          <p><input name="api" type="radio" value="sdk"> SDK</p>
        </div>
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value=${formatDate(dateIn)} 
              min="${formatDate(new Date())}" 
              max="${formatDate(getMax(new Date()))}" 
              onchange="document.getElementById('check-out-date').setAttribute('min', document.getElementById('check-in-date').value)"
              name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${formatDate(dateOut)}" 
              min="${formatDate(dateIn)}" 
              max="${formatDate(getMax(new Date()))}" 
              name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button id="search" type="button" onclick="search()">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  const button = document.getElementById('search')
  if (button != null) {
    button.onclick = function () {
      let data: SearchFormData = {
        city: (<HTMLInputElement>document.getElementById('city')).value,
        checkInDate: (<HTMLInputElement>document.getElementById('check-in-date')).value,
        checkOutDate: (<HTMLInputElement>document.getElementById('check-out-date')).value,
        maxPrice: +(<HTMLInputElement>document.getElementById('max-price')).value,
      }
      search(data, searchMethod())
    }
  }
}
