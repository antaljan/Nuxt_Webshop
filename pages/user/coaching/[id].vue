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

// Kényszerítjük az autentikációt és a dashboard middleware-t
definePageMeta({
  middleware: ['auth']
});

const jitsiRef = ref(null);
const isLoaded = ref(false);
let api = null;

// Manuális script betöltés
const loadJitsiScript = () => {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) { resolve(); return; }
    const script = document.createElement('script');
    // Fontos: a 8x8.vc-s linket használd az App ID-val!
    script.src = "https://8x8.vc/vpaas-magic-cookie-b0d7a44d8c2e4bc2a9122e6fff8950c4/external_api.js";
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

const initJitsi = async () => {
  try {
    // Ez a belső Nuxt /server/api végpontot hívja
    const { data, error } = await useFetch(`/api/coaching/jitsi-token/${route.params.id}`);

    if (error.value || !data.value?.ok) {
      console.error("Hiba a token lekérésekor:", error.value);
      return;
    }

    const domain = "8x8.vc";
    const options = {
      roomName: data.value.roomName,
      jwt: data.value.token, 
      parentNode: jitsiRef.value,
      width: '100%',
      height: '100%',
      configOverwrite: {
        prejoinPageEnabled: false,
        disableDeepLinking: true
      }
    };

    api = new window.JitsiMeetExternalAPI(domain, options);
  } catch (err) {
    console.error("Jitsi inicializálási hiba:", err);
  }
};


const leaveMeeting = () => {
  if (api) api.dispose();
  router.push('/user');
};

onUnmounted(() => {
  if (api) api.dispose();
});
</script>