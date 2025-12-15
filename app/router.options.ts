import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    // If browser back/forward, restore saved position
    if (savedPosition) {
      return savedPosition
    }

    // If there's a hash, scroll to that element
    // Use a promise to wait for the page to render first
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
          })
        }, 100)
      })
    }

    // Default: scroll to top
    return { top: 0 }
  },
}
