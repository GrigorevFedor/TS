import { ResponseSearchData } from './search-form'

interface FlatRentSdk {
    search(parameters: string): ResponseSearchData[],
}