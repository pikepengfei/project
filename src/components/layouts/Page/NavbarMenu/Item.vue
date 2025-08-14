<script lang="ts" setup>
const nuxtApp = useNuxtApp()
const { parseMenuRoute, parseMenuTitle } = useNavbarParser()

const props = defineProps({
  menu: {
    type: Object as () =>
      | AwesomeLayoutPageNavbarMenu
      | AwesomeLayoutPageNavbarMenuDropdownItem,
    required: true,
  },
  isDropdown: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <template v-if="menu?.type === 'link'">
    <NuxtLink :to="parseMenuRoute(menu?.to)" #="{ isActive }">
      <div
        class="h-[63px] leading-[66px] box-border px-[17px]"
        :class="{ 'item-bg': isActive }"
      >
        <span class="text-white text-[20px] font-medium">{{
          parseMenuTitle(menu?.title)
        }}</span>
      </div>
    </NuxtLink>
  </template>
  <template v-else-if="menu?.type === 'button'">
    <AwesomeButton
      :text="parseMenuTitle(menu?.title)"
      size="xs"
      :to="parseMenuRoute(menu.to)"
    />
  </template>
</template>
<style lang="scss" scoped>
.item-bg {
  background: linear-gradient(180deg, rgba(255, 152, 152, 0) 0%, #ff8282 100%);
}
</style>
