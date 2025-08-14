// ```javascript project="Vue3分页报告" file="pagination.js" version=1
// pagination.js - 报告分页功能
import { ref, onMounted, nextTick } from 'vue'

export function useReportPagination() {
  const pages = ref([])
  const totalPages = ref(0)
  const currentPage = ref(1)
  
  // A4纸张尺寸(mm)
  const A4_HEIGHT = 297 - 40 // 减去页边距
  const A4_WIDTH = 210 - 40
  
  // 转换为像素 (96 DPI)
  const PAGE_HEIGHT_PX = Math.floor(A4_HEIGHT * 3.78) // mm转px约为3.78倍
  
  // 分页处理函数
  const paginateContent = async () => {
    await nextTick()
    const reportContainer = document.querySelector('.report-container')
    if (!reportContainer) return
    
    // 获取页面内容
    const sections = Array.from(reportContainer.querySelectorAll('.page-section'))
    
    // 清空现有分页
    pages.value = []
    
    // 如果没有.page-section元素，我们需要动态创建
    if (sections.length === 0) {
      // 创建第一页
      let currentPage = document.createElement('div')
      currentPage.className = 'page-section'
      let currentHeight = 0
      
      // 获取所有子元素
      const children = Array.from(reportContainer.children)
      
      // 封面页和尾页特殊处理
      const coverElement = children.find(el => el.classList.contains('relative'))
      const footerElement = children.find(el => el.classList.contains('footer-wrapper'))
      
      // 移除封面和尾页，它们单独处理
      const contentElements = children.filter(el => 
        !el.classList.contains('relative') && 
        !el.classList.contains('footer-wrapper')
      )
      
      // 创建封面页
      if (coverElement) {
        let coverPage = document.createElement('div')
        coverPage.className = 'page-section'
        coverPage.appendChild(coverElement.cloneNode(true))
        pages.value.push(coverPage)
      }
      
      // 处理内容页
      for (const element of contentElements) {
        const elHeight = element.offsetHeight
        
        // 如果元素高度超过一页或当前页即将溢出
        if (elHeight > PAGE_HEIGHT_PX || currentHeight + elHeight > PAGE_HEIGHT_PX) {
          // 强制分页标记的元素总是开始新页面
          if (element.classList.contains('break-before-page') || 
              currentHeight + elHeight > PAGE_HEIGHT_PX) {
            // 添加当前页到pages数组
            if (currentPage.children.length > 0) {
              pages.value.push(currentPage)
            }
            
            // 创建新页
            currentPage = document.createElement('div')
            currentPage.className = 'page-section'
            currentHeight = 0
          }
          
          // 如果单个元素超过一页高度，需要递归拆分
          if (elHeight > PAGE_HEIGHT_PX) {
            // 这里应该实现元素拆分逻辑，但比较复杂
            // 简化处理：大型元素放入单独页面
            currentPage.appendChild(element.cloneNode(true))
            pages.value.push(currentPage)
            currentPage = document.createElement('div')
            currentPage.className = 'page-section'
            currentHeight = 0
            continue
          }
        }
        
        // 正常添加元素到当前页
        currentPage.appendChild(element.cloneNode(true))
        currentHeight += elHeight
      }
      
      // 添加最后一页
      if (currentPage.children.length > 0) {
        pages.value.push(currentPage)
      }
      
      // 创建尾页
      if (footerElement) {
        let footerPage = document.createElement('div')
        footerPage.className = 'page-section'
        footerPage.appendChild(footerElement.cloneNode(true))
        pages.value.push(footerPage)
      }
    } else {
      // 如果已经有预定义的页面部分，直接使用
      pages.value = sections
    }
    
    totalPages.value = pages.value.length
    
    // 给每页添加页码
    pages.value.forEach((page, index) => {
      // 跳过封面和尾页的页码
      if (index > 0 && index < pages.value.length - 1) {
        const pageFooter = document.createElement('div')
        pageFooter.className = 'page-footer'
        pageFooter.textContent = `第 ${index} 页 / 共 ${totalPages.value - 2} 页`
        page.appendChild(pageFooter)
      }
    })
  }
  
  // 重新分页，可在窗口大小变化或内容更新时调用
  const refreshPagination = async () => {
    await paginateContent()
  }
  
  // 打印功能
  const printReport = () => {
    window.print()
  }
  
  onMounted(() => {
    paginateContent()
    
    // 监听窗口大小变化，重新分页
    window.addEventListener('resize', refreshPagination)
  })
  
  return {
    pages,
    totalPages,
    currentPage,
    refreshPagination,
    printReport
  }
}