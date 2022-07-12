
import { renderBlock } from './lib.js'
import { renderSearchStubBlock, renderEmptyOrErrorSearchBlock, renderSearchResultsBlock } from './search-results.js'
import { API } from './api.js'
import { favorites } from './index.js'
import { FlatRentSdk } from './flat-rent-sdk.js'

export interface SearchFormData {
  city: string,
  checkInDate: Date,
  checkOutDate: Date,
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

export interface ResponseSearchDataSdk {
  id: string,
  title: string,
  details: string,
  photos: string[],
  coordinates: number[],
  bookedDates: string[],
  price: number,
}

export class getPlaces {
  static async fetchPlaces(params: SearchFormData, api: boolean, sdk: boolean): Promise<ResponseSearchData[]> {
    let result: ResponseSearchData[] = []

    if (api) {
      const response = await this.fetchApi(params)
      result = [...result, ...response]
    }

    if (sdk) {
      const response = await this.fetchSdk(params)
      console.log('response', response)
      result = [...result, ...this.sdkToApi(response)]
    }

    return result
  }

  private static sdkToApi(items: ResponseSearchDataSdk[]): ResponseSearchData[] {
    const res: ResponseSearchData[] = []
    items.forEach((el) => {
      const newEl: ResponseSearchData = {
        id: el.id,
        name: el.title,
        description: el.details,
        image: '',
        remoteness: 0,
        bookedDates: el.bookedDates,
        price: el.price,
      }
      res.push(newEl)
    })
    return res
  }

  private static fetchApi(searchObj: SearchFormData) {
    return fetch(API + `/places?maxPrice=${searchObj.maxPrice}&coordinates=59.9386,30.3141&checkInDate=${new Date(searchObj.checkInDate).getTime()}&checkOutDate=${new Date(searchObj.checkOutDate).getTime()}`)
      .then((response) => {
        return response.text()
      })
      .then<ResponseSearchData[]>((responseText) => {
        return JSON.parse(responseText)
      })

  }

  private static fetchSdk(searchObj: SearchFormData) {
    const sdk = new FlatRentSdk()
    return sdk.search(searchObj)
      .then((response) => {
        return response
      })
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
          <p><input id="api" type="checkbox" checked> API</p>
          <p><input id="sdk" type="checkbox" checked> SDK</p>
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
        checkInDate: new Date((<HTMLInputElement>document.getElementById('check-in-date')).value),
        checkOutDate: new Date((<HTMLInputElement>document.getElementById('check-out-date')).value),
        maxPrice: +(<HTMLInputElement>document.getElementById('max-price')).value,
      }
      const api = (<HTMLInputElement>document.getElementById('api')).checked
      const sdk = (<HTMLInputElement>document.getElementById('sdk')).checked
      getPlaces.fetchPlaces(data, api, sdk).then((value) => renderSearchResultsBlock(value))

    }
  }
}
