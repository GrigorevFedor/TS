import { ResponseSearchDataSdk, SearchFormData } from './search-form'



export class FlatRentSdk {
    search(parameters: SearchFormData): Promise<ResponseSearchDataSdk[]>
}

