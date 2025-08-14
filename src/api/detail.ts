import { Http } from '@/composables/use-request'

export function queryParkDetail(id: string) {
  return Http.get(
    `/lymh/api/tPark/detail/${id}`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
}

export function queryOfficeDetail(id: string) {
  return Http.get(
    `/lymh/api/tOffice/detail/${id}`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
}

export function queryPlantDetail(id: string) {
  return Http.get(
    `/lymh/api/tPlant/detail/${id}`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
}
