<template>
  <el-dialog
    v-model="showLogin"
    width="59.375vw"
    :show-close="false"
    top="4vh"
    :close-on-click-modal="false"
    style="background-color: transparent; box-shadow: none"
  >
    <div class="relative w-[60.4167vw]">
      <div
        class="w-[58.3333vw] h-[39.5833vw] bg-white rounded-2xl flex justify-end box-border pt-[4.4271vw] pr-[4.6875vw]"
        :style="{
          backgroundImage: `url(${LoginBg})`,
          backgroundSize: '100% 100%',
        }"
      >
        <div
          class="text-black text-[1.7708vw] font-semibold absolute top-[6.5625vw] left-[6.9792vw]"
        >
          立业廊坊三大服务
        </div>
        <div
          class="w-[23.9583vw] h-[32.8125vw] rounded-xl bg-white login-shadow box-border px-[1.3542vw] pt-[3.2292vw]"
        >
          <div v-if="!isLogined">
            <div class="text-[1.0417vw] font-medium text-black">
              生成报告前，需进行手机号验证
            </div>
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              class="mt-[4.2708vw]"
            >
              <el-form-item prop="phone">
                <el-input
                  v-model="form.phone"
                  placeholder="请输入手机号"
                  size="large"
                ></el-input>
              </el-form-item>
              <el-form-item prop="code" class="mt-[2.1354vw]">
                <el-input
                  v-model="form.code"
                  placeholder="请输入验证码"
                  style="width: 13.3333vw"
                  size="large"
                ></el-input>
                <el-button
                  v-stat="{
                    type: 'click',
                    category: 'login',
                    label: `[手机号验证]弹窗-[获取验证码]按钮`,
                    action: 'click',
                    id: 'yz_001',
                  }"
                  type="primary"
                  size="large"
                  :disabled="sendCodeDisabled"
                  class="ml-2"
                  @click="handleGetCode"
                >
                  {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                </el-button>
              </el-form-item>
              <el-form-item class="mt-[4.4792vw]">
                <el-button
                  v-stat="{
                    type: 'click',
                    category: 'login',
                    label: `[手机号验证]弹窗-[${props.fromAI ? '开始选址' : '开始生成'}]按钮`,
                    action: 'click',
                    id: 'yz_002',
                  }"
                  type="primary"
                  class="w-full"
                  style="height: 2.2917vw; font-size: 0.7292vw"
                  @click="handleSubmit"
                  >{{ props.fromAI ? '开始选址' : '开始生成' }}</el-button
                >
              </el-form-item>
            </el-form>
            <div
              class="text-[#999898] w-full justify-center flex text-[.7282vw] whitespace-nowrap"
            >
              验证即代表您同意
              <NuxtLink to="/user.html" target="_blank"
                ><span class="font-bold">《立业廊坊用户协议》</span></NuxtLink
              >
              <NuxtLink to="/personal.html" target="_blank"
                ><span class="font-bold">《个人信息保护政策》</span></NuxtLink
              >
            </div>
          </div>
          <div v-else>
            <div v-if="!props.fromAI">
              <div
                v-if="!generateSuccess"
                class="flex w-full h-full items-center justify-center box-border pt-[4.1667vw]"
              >
                <div class="flex flex-col justify-center items-center">
                  <el-progress
                    type="circle"
                    :percentage="progress"
                    :stroke-width="25"
                    :width="226"
                    color="#c0322b"
                  />
                  <div class="text-[#7f7e7e] text-[.8333vw] mt-[2.0833vw]">
                    报告正在快马加鞭生成中，请稍候...
                  </div>
                </div>
              </div>
              <div
                v-else
                class="w-full flex justify-center box-border pt-[3.125vw]"
              >
                <div class="text-center">
                  <img
                    src="@/assets/images/report_complete.png"
                    class="w-[12.5vw] h-[13.5938vw]"
                  />
                  <div class="text-[#3e4b58] text-[.8333vw] mt-[.5208vw]">
                    报告已生成
                  </div>
                  <div
                    class="w-full flex justify-center box-border pt-[1.5625vw]"
                  >
                    <NuxtLink
                      :to="`/preview?file=${fileUrl}&name=${fileName}&id=${reportId}`"
                      target="_blank"
                    >
                      <div
                        class="cursor-pointer w-[10.4167vw] h-[2.3958vw] border border-[#c0322b] rounded leading-[2.3958vw] text-center text-[#c0322b] text-[.8333vw] font-medium"
                      >
                        查看报告
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="@/assets/images/close_dialog.png"
        class="absolute w-[2.2917vw] h-[2.2917vw] z-10 right-0 top-[-1.25vw] cursor-pointer"
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
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    ids: string
    reportType: number
    fromAI?: boolean
  }>(),
  {
    ids: '',
    reportType: 0,
    fromAI: false,
  },
)
const emits = defineEmits(['close', 'update:modelValue', 'status'])
const { setUserInfo } = useUserStore()

const { isLogined } = storeToRefs(useUserStore())

// 报告生成状态
const generateSuccess = ref(false)
// 记时器句柄
const progressInterval = ref<any>()
// 报告生成进度
const progress = ref(0)
const currentFile = ref<any>()

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
  if (countdown.value > 0 || form.value.phone.length !== 11) return true
  return false
})

const fileUrl = ref('')
const fileName = ref('')
const reportId = ref('')
const handleSubmit = () => {
  // 验证表单
  // @ts-ignore
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 表单验证通过，可以进行登录操作

      const result = await loginApi(form.value.phone, form.value.code)
      setUserInfo(result.data as IUserInfo)
      console.log('登录成功', form.value)
      emits('status', true)
      if (props.fromAI) {
        showLogin.value = false
      } else {
        progress.value = 0
        generateReport()
      }

      // 关闭对话框
      //   emits('close')
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

watch(
  () => props.modelValue,
  (newValue) => {
    generateSuccess.value = false
    progress.value = 0
    if (newValue && isLogined.value) {
      generateReport()
    }
  },
)
const generateReport = async () => {
  // if(props.fromCart){
  // }
  setGenerateProgress()
  try {
    const result = await generateReportApi(props.ids, props.reportType)
    currentFile.value = result.data.file
    progress.value = 100
    fileUrl.value = result.data.file.fileUrl
    fileName.value = result.data.file.fileName
    reportId.value = result.data.id
    setTimeout(() => {
      generateSuccess.value = true
      window.open(
        `/preview?file=${fileUrl.value}&name=${fileName.value}&id=${reportId.value}`,
        '_blank',
      )
    }, 400)
  } catch (error) {
    // @ts-ignore
    if (error?.code !== 401) {
      showLogin.value = false
    }
    if (progressInterval.value) {
      clearInterval(progressInterval.value)
      progressInterval.value = ''
    }
    progress.value = 0
    // showLogin.value = false
    // ElMessage.error('生成报告失败')
  }
}
const setGenerateProgress = () => {
  progressInterval.value = setInterval(() => {
    if (progress.value < 99) {
      progress.value++
    } else if (progressInterval.value) {
      clearInterval(progressInterval.value)
      // generateSuccess.value = true
    }
  }, 100)
}
</script>
<style lang="scss" scoped>
.login-shadow {
  box-shadow: 0vw 0.2083vw 1.5625vw 0.3125vw rgba(214, 222, 235, 0.59);
}
:deep(.el-input--large) {
  height: 2.2917vw;
}
:deep(.el-button.is-disabled, .el-button.is-disabled:hover) {
  width: 7.1875vw;
  height: 2.2917vw;
  background: #f1f3f8;
  border-radius: 0.2083vw;
  border: 0.0521vw solid #d9d9d9;
  font-size: 0.8333vw;
  color: #7f7e7e;
}
:deep(.el-button--large) {
  width: 7.1875vw;
  height: 2.2917vw;
  line-height: 2.2917vw;
  font-size: 0.7292vw;
}
:deep(.el-overlay-dialog) {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
:deep(.el-input--large) {
  font-size: 0.7292vw;
}
</style>
