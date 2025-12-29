/**
 * PWA Service Worker Registration
 * Enables offline-first capability
 */

export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      // Vite PWA plugin auto-generates the service worker
      // This will be available in production build
      const registration = await navigator.serviceWorker.register(
        '/sw.js',
        { scope: '/' }
      )

      console.log('✅ Service Worker registered:', registration.scope)

      // Check for updates periodically
      setInterval(() => {
        registration.update()
      }, 60000) // Check every minute

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, notify user
            console.log('🔄 New version available! Refresh to update.')
            // You can show a notification to the user here
          }
        })
      })
    } catch (error) {
      console.warn('⚠️ Service Worker registration failed:', error)
      // Continue without offline support
    }
  } else {
    console.warn('⚠️ Service Workers not supported in this browser')
  }
}

/**
 * Request persistent storage
 * Prevents browser from evicting game data under storage pressure
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    try {
      const isPersisted = await navigator.storage.persist()
      if (isPersisted) {
        console.log('✅ Storage is persistent')
      } else {
        console.warn('⚠️ Storage may be evicted under pressure')
      }
      return isPersisted
    } catch (error) {
      console.warn('⚠️ Failed to request persistent storage:', error)
      return false
    }
  }
  return false
}
