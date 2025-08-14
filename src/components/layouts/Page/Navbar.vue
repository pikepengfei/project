<script lang="ts" setup>
const { appConfig } = useAppConfig()
const { parseMenuRoute, parseMenuTitle } = useNavbarParser()
const $screen = useAwesomeScreen()
const nuxtApp = useNuxtApp()

const menus = computed(
  () =>
    (appConfig?.layout?.page?.navbar?.menus ||
      []) as AwesomeLayoutPageNavbarMenu[],
)
const router = useRouter() //
// drawer
const showDrawer = ref(false)
const handlePlatformCooperation = () => {
  router.push('/PlatformCooperation')
}
</script>

<template>
  <header
    class="flex fixed backdrop-filter backdrop-blur-md top-0 z-40 w-full flex-none transition-colors duration-300 lg:z-[500] border-b border-gray-950/10 dark:border-gray-50/[0.2] bg-white/[0.5] dark:bg-gray-950/[0.5]"
  >
    <!-- content -->
    <div
      class="flex-1 flex items-center w-full bg-[#c0322b] pl-[57px] pr-[30px]"
    >
      <!-- title -->
      <div class="min-w-[150px]">
        <slot name="title">
          <NuxtLink
            to="/"
            class="font-bold text-lg text-primary-500 flex items-center"
          >
            <img src="../../../assets/images/logo.png" class="h-12 w-12 mr-1" />
            <span class="text-white text-[24px] font-semibold">{{
              appConfig.name
            }}</span>
          </NuxtLink>
        </slot>
      </div>
      <!-- menus -->
      <div
        v-if="$screen.higherThan('md', $screen.current.value)"
        class="flex space-x-4 items-center ml-[88px] text-white"
      >
        <div class="flex space-x-7 text-sm items-center min-w-[400px]">
          <!-- dynamic menus -->
          <template v-for="(item, i) in menus" :key="i">
            <LayoutPageNavbarMenuWrapper :menu="item" />
          </template>
        </div>
        <!-- others -->
      </div>
      <div
        class="w-full flex items-center justify-end"
        @click="handlePlatformCooperation"
      >
        <div
          class="w-[127px] h-[40px] bg-white rounded-[20px] flex items-center box-border px-[6px] justify-between cursor-pointer"
        >
          <div
            class="w-[28px] h-[28px] bg-[#c0322b] box-border pl-[3px] pt-[2px] rounded-[14px] text-center"
          >
            <img src="@/assets/images/logo.png" class="w-[24px] h-[24px]" />
          </div>
          <div class="text-[14px] text-[#c0322b] mr-[13px]">平台合作</div>
        </div>
      </div>
    </div>
  </header>
</template>
