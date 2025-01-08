export default defineAppConfig({
    ui: {
      primary: 'primary-app',
      gray: 'zinc',
      notifications: {
        // Show toasts at the top right of the screen
        position: '-me-4 -right-4 -top-2 bottom-[unset]'
      },
      input: {
        default: {
          rounded: `rounded-[8px]`,
        }
      },
    }
  })