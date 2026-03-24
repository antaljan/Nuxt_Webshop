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

definePageMeta({
  middleware: ['auth']
});

const jitsiRef = ref(null);
const isLoaded = ref(false);
// FONTOS: shallowRef-et használunk, hogy a Vue ne próbálja 
// "megfigyelni" a Jitsi belső iFrame objektumait (Proxy hiba megelőzése)
const api = shallowRef(null);

onMounted(async () => {
  try {
    await loadJitsiScript();
    // Ahelyett, hogy az initJitsi-ben hívnánk useFetch-et:
    await initJitsi();
  } catch (err) {
    console.error("Script hiba:", err);
  }
});

const loadJitsiScript = () => {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) { resolve(); return; }
    const script = document.createElement('script');
    script.src = "https://8x8.vc/vpaas-magic-cookie-b0d7a44d8c2e4bc2a9122e6fff8950c4/external_api.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Jitsi script load failed'));
    document.head.appendChild(script);
  });
};

const initJitsi = async () => {
  try {
    // JAVÍTÁS: $fetch-et használunk onMounted-en belül useFetch helyett!
    const res = await $fetch(`/api/coaching/jitsi-token/${route.params.id}`);
    
    // A .value-t használjuk, mert a res már a tiszta adat (nem Ref)
    if (!res?.ok || !res?.token) {
      console.error("Hiba a token lekérésekor");
      return;
    }

    const domain = "8x8.vc";
    const options = {
      // Room name-nél figyelj, hogy a backend pontosan ezt a stringet írja-e alá a JWT-ben!
      roomName: `vpaas-magic-cookie-b0d7a44d8c2e4bc2a9122e6fff8950c4/agye_${route.params.id.toLowerCase()}`,
      parentNode: jitsiRef.value,
      jwt: res.token, // Közvetlenül a res-ből vesszük
      width: '100%',
      height: '100%',
      configOverwrite: {
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        // Ezzel elkerülhető a logban látott speaker-selection hiba
        disabledNotifications: ['speaker-stats-muted'] 
      },
      interfaceConfigOverwrite: {
        // Opcionális: itt is tudsz finomhangolni
      }
    };

    api.value = new window.JitsiMeetExternalAPI(domain, options);
    
    api.value.addEventListener('videoConferenceJoined', () => {
      isLoaded.value = true;
    });

  } catch (err) {
    console.error("Jitsi inicializálási hiba:", err);
  }
};

onUnmounted(() => {
  if (api.value) api.value.dispose();
});
</script>
