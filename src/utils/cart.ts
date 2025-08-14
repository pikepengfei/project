import { isEqual } from 'lodash-es'
import { useCartStore } from '@/stores/use-cart'
import { getRealCartId } from '@/api'

export const refreshCartNum = () => {
  const { setPark, setPlant, setOffice } = useCartStore()
  const { parkList, plantList, officeList } = storeToRefs(useCartStore())
  getRealCartId(parkList.value, 0).then((res) => {
    if (parkList.value.length > 0) {
      if (res.data !== null) {
        setPark(res.data)
      } else {
        setPark([])
      }
    }
  })
  getRealCartId(plantList.value, 1).then((res) => {
    if (plantList.value.length > 0 && !isEqual(plantList.value, res.data)) {
      if (res.data !== null) {
        setPlant(res.data)
      } else {
        setPlant([])
      }
    }
  })
  getRealCartId(officeList.value, 2).then((res) => {
    if (officeList.value.length > 0 && !isEqual(officeList.value, res.data)) {
      if (res.data !== null) {
        setOffice(res.data)
      } else {
        setOffice([])
      }
    }
  })
}
