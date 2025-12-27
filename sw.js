const CACHE_NAME = 'flow-glow-v13.2'; // 👈 这里改成了 v13.2，通知浏览器更新！

// 需要缓存的文件列表
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png' 
];

// 安装事件：缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 激活事件：清理旧版本的缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 如果发现版本号不一致，就删掉旧的
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 请求拦截：优先使用缓存，没有缓存则请求网络
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});