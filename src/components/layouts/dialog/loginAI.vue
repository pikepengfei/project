<template>
  <el-dialog
    v-model="showLogin"
    width="1180"
    :show-close="false"
    top="10px"
    style="padding-left: 0px; padding-bottom: 0px"
    :close-on-click-modal="false"
  >
    <div class="relative w-[1224px]">
      <div
        class="w-[1180px] h-[800px] bg-white rounded-2xl flex justify-end box-border pt-[85px] pr-[90px]"
        :style="{
          backgroundImage: `url(${LoginBg})`,
          backgroundSize: '100% 100%',
        }"
      >
        <div
          class="w-[480px] h-[630px] rounded-xl bg-white login-shadow box-border px-[26px] pt-[62px]"
        >
          <div
            v-if="!isLogined"
            v-stat="{
              type: 'click',
              category: 'login',
              label: `手机号验证`,
              action: 'click',
            }"
          >
            <div class="text-[20px] font-medium text-black">
              AI选址前，需要进行手机号验证
            </div>
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              class="mt-[82px]"
            >
              <el-form-item prop="phone">
                <el-input
                  v-model="form.phone"
                  placeholder="请输入手机号"
                  size="large"
                ></el-input>
              </el-form-item>
              <el-form-item prop="code" class="mt-[41px]">
                <el-input
                  v-model="form.code"
                  placeholder="请输入验证码"
                  style="width: 276px"
                  size="large"
                ></el-input>
                <el-button
                  type="primary"
                  size="large"
                  :disabled="sendCodeDisabled"
                  class="ml-2"
                  @click="handleGetCode"
                >
                  {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                </el-button>
              </el-form-item>
              <el-form-item class="mt-[86px]">
                <el-button
                  type="primary"
                  class="w-full"
                  style="height: 44px"
                  @click="handleSubmit"
                  >开始选址</el-button
                >
              </el-form-item>
            </el-form>
            <div class="text-[#999898] w-full justify-center flex">
              验证即代表您同意
              <NuxtLink to="/user" target="_blank"
                ><span class="font-bold">《立业廊坊用户协议》</span></NuxtLink
              >
              <NuxtLink to="/personal" target="_blank"
                ><span class="font-bold">《个人信息保护政策》</span></NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
      <img
        src="@/assets/images/close_dialog.png"
        class="absolute w-[44px] h-[44px] z-10 right-0 top-[-24px] cursor-pointer"
        @click="emits('close')"
      />
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import LoginBg from '@/assets/images/login_bg.png'
import { sendMessageCode, loginApi, generateReportApi } from '@/api'
import { useUserStore, type IUserInfo } from '@/stores/use-user'
import { getFileUrl } from '@/utils/file'
const props = defineProps<{
  modelValue: boolean
  ids: string
  reportType: number
}>()
const emits = defineEmits(['close', 'update:modelValue', 'status'])
const { setUserInfo } = useUserStore()

const { isLogined } = storeToRefs(useUserStore())

const currentFile = ref<any>()
const status = ref()
const showLogin = computed({
  // 子组件v-model绑定 计算属性, 一旦发生变化, 就会给父组件传递值
  get: () => props.modelValue,
  set: (nv) => {
    emits('update:modelValue', nv)
  },
})
const form = ref({
  phone: '',
  code: '',
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度为6位', trigger: 'blur' },
  ],
}
const sendCodeDisabled = computed(() => {
  if (countdown.value > 0 || !form.value.phone) return true
  return false
})

const handleSubmit = () => {
  // 验证表单
  // @ts-ignore
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 表单验证通过，可以进行登录操作
      const result = await loginApi(form.value.phone, form.value.code)
      setUserInfo(result.data as IUserInfo)
      console.log('登录成功', form.value)
      showLogin.value = false
      emits('status', true)
    } else {
      console.log('表单验证失败')
    }
  })
}
const formRef = ref()

const countdown = ref(0)

const handleGetCode = () => {
  formRef.value?.validateField('phone', (errorMessage: string) => {
    if (errorMessage) {
      // 手机号验证通过，发送验证码请求
      sendVerificationCode()
    } else {
      ElMessage.error(errorMessage)
    }
  })
}

const sendVerificationCode = async () => {
  // 模拟发送验证码的请求
  console.log('发送验证码请求')
  await sendMessageCode(form.value.phone)
  startCountdown()
}

const startCountdown = () => {
  countdown.value = 120
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden; /* 确保内容不会超出圆角范围 */
}
.login-shadow {
  box-shadow: 0px 4px 30px 6px rgba(214, 222, 235, 0.59);
}
:deep(.el-input--large) {
  height: 44px;
}
:deep(.el-button.is-disabled, .el-button.is-disabled:hover) {
  width: 138px;
  height: 44px;
  background: #f1f3f8;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 16px;
  color: #7f7e7e;
}
:deep(.el-button--large) {
  width: 138px;
  height: 44px;
  line-height: 44px;
}
</style>
