<template>
  <v-container fluid class="pa-0 ma-0" style="height: 100vh; background-color: #000;">
    <div ref="jitsiRef" style="width: 100%; height: 100%;"></div>
    
    <v-overlay v-if="!isLoaded" persistent class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <div class="text-white mt-4 ml-4">Jitsi szoba inicializálása...</div>
    </v-overlay>
  </v-container>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { user } = useAuth();

const jitsiRef = ref(null);
const isLoaded = ref(false);
let api = null;

// Manuális script betöltés
const loadJitsiScript = () => {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Jitsi script load failed'));
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  try {
    await loadJitsiScript();
    // Várunk egy picit, hogy a DOM is biztosan kész legyen
    nextTick(() => {
      if (jitsiRef.value) {
        initJitsi();
      }
    });
  } catch (err) {
    console.error("Script hiba:", err);
  }
});

const initJitsi = () => {
  const domain = "meet.jit.si";
  const options = {
    roomName: `AGYE_${route.params.id}`,
    parentNode: jitsiRef.value,
    width: '100%',
    height: '100%',
    userInfo: {
      displayName: user.value?.name || 'Kliens',
      email: user.value?.email
    },
    configOverwrite: {
      prejoinPageEnabled: false,
      disableDeepLinking: true
    }
  };

  api = new window.JitsiMeetExternalAPI(domain, options);
  
  api.addEventListener('videoConferenceJoined', () => {
    isLoaded.value = true;
  });

  api.addEventListener('videoConferenceLeft', () => {
    leaveMeeting();
  });
};

const leaveMeeting = () => {
  if (api) api.dispose();
  router.push('/user');
};

onUnmounted(() => {
  if (api) api.dispose();
});
</script>