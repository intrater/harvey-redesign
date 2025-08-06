// Preload route components for instant navigation
export const preloadRoutes = () => {
  // These dynamic imports help webpack create separate chunks that can be preloaded
  Promise.all([
    import('../pages/Ask'),
    import('../pages/Draft'), 
    import('../pages/Automate'),
    import('../pages/Vault'),
    import('../pages/Library'),
    import('../pages/Guidance'),
    import('../pages/Settings'),
    import('../pages/Help'),
  ]).catch(() => {
    // Silently fail if preloading fails - not critical
  });
};

// Preload after initial page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Delay preloading to not interfere with initial page load
    setTimeout(preloadRoutes, 1000);
  });
}