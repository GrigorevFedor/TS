import { renderBlock } from './lib.js'

export function renderSearchFormBlock (dateIn: Date = new Date, dateOut: Date = new Date) {
  if (dateIn) {
    dateIn.setDate(dateIn.getDate() + 1)
  }
  if (dateOut) {
    dateOut.setDate(dateOut.getDate() + 3)
  }
  console.log(new Date())
  console.log(getMax(new Date()))
  
  function formatDate(date) {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    let yy = date.getFullYear();

    return yy + '-' + mm + '-' + dd;
  }

  function getMax(date) {
    let m = date.getMonth()
    m+=2
    if (m>=12) {
      m-=12
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
            <input id="check-in-date" type="date" value=${formatDate(dateIn)} min="${formatDate(new Date())}" max="${formatDate(getMax(new Date()))}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${formatDate(dateOut)}" min="${formatDate(new Date())}" max="${formatDate(getMax(new Date()))}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
