<script lang="ts" setup>
const nuxtApp = useNuxtApp()
const route = useRoute()
const router = useRouter()
const { parseMenuRoute, parseMenuTitle } = useNavbarParser()

const props = defineProps({
  menu: {
    type: Object as () =>
      | AwesomeLayoutPageNavbarMenuDropdownItem
      | AwesomeLayoutPageNavbarMenu,
    required: true,
  },
})
const isActive = computed(() => {
  if (!(props.menu as any)?.children) return false
  const childs = ((props.menu as any)?.children ||
    []) as AwesomeLayoutPageNavbarMenu[]
  for (const child of childs) {
    const to = parseMenuRoute(child.to)
    if (typeof to === 'string' && to === route.path) return true
    if (route.name?.toString().includes((to as any).name?.toString()))
      return true
  }
  return false
})
</script>

<template>
  <LayoutPageNavbarMenuItem :menu="menu" />
</template>
