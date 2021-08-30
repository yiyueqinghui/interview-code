
// 虚拟dom最核心的函数
// 1. createElement 创建虚拟dom  用js的对象 描述dom结构
// 2. render 把vdom渲染成html标签
// 3. 状态变化，vdom新老数据做diff，计算出最小的修改

function createElement(tag,data=null,...children){
  // 做一些预判
  let flags
  if(typeof tag=='string'){
    flags = 'HTML'
  }else if(typeof tag=="function"){
    // 组件
    flags='COMPONENT'
  }else{
    flags = 'TEXT'
  }

  return {
    flags,
    tag,
    data,
    children
  }
}
