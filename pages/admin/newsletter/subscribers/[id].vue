<template>
  <section class="p-6 space-y-6">

    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">
          Feliratkozó aktivitása
        </h1>

        <p class="text-gray-500">
          {{ subscriber?.firstname }}
        </p>
      </div>

      <v-btn
        color="primary"
        variant="text"
        prepend-icon="mdi-arrow-left"
        to="/admin/newsletter/subscribers"
      >
        Vissza
      </v-btn>
    </div>

    <!-- Subscriber Info -->

    <v-card class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <strong>Email</strong>
          <div>{{ subscriber?.email }}</div>
        </div>

        <div>
          <strong>Nyelv</strong>
          <div>{{ subscriber?.language?.toUpperCase() }}</div>
        </div>

        <div>
          <strong>Csoportok</strong>

          <div class="flex gap-1 flex-wrap mt-1">
            <v-chip
              v-for="group in subscriber?.groups || []"
              :key="group"
              size="small"
            >
              {{ group }}
            </v-chip>
          </div>
        </div>

      </div>
    </v-card>

    <!-- Statistics -->

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <v-card class="p-4 text-center">
        <div class="text-h5">
          {{ stats.total }}
        </div>
        <div>
          Küldött levelek
        </div>
      </v-card>

      <v-card class="p-4 text-center">
        <div class="text-h5 text-green">
          {{ stats.opens }}
        </div>
        <div>
          Megnyitások
        </div>
      </v-card>

      <v-card class="p-4 text-center">
        <div class="text-h5 text-blue">
          {{ stats.clicks }}
        </div>
        <div>
          Kattintások
        </div>
      </v-card>

    </div>

    <!-- Newsletter List -->

    <v-card>
      <v-data-table
        :headers="headers"
        :items="newsletterHistory"
      >

        <template #item.sendDate="{ item }">
          {{
            item.sendDate
              ? new Date(item.sendDate).toLocaleString('hu-HU')
              : '-'
          }}
        </template>

        <template #item.opened="{ item }">
          <v-chip
            :color="item.opened ? 'success' : 'grey'"
            size="small"
          >
            {{ item.opened ? 'Igen' : 'Nem' }}
          </v-chip>
        </template>

        <template #item.clicked="{ item }">
          <v-chip
            :color="item.clicked ? 'primary' : 'grey'"
            size="small"
          >
            {{ item.clicked ? 'Igen' : 'Nem' }}
          </v-chip>
        </template>

      </v-data-table>
    </v-card>

  </section>
</template>

<script setup>

const route = useRoute()

const email = route.params.id

/* subscriber */

const { data: subscriberData } = await useAsyncData(
  `subscriber-${email}`,
  () =>
    $fetch('/api/newsletter/subscribers')
)

const subscriber = computed(() =>
  subscriberData.value?.subscribers?.find(
    s => s.email === email
  )
)


/* activity */

const { data: activityData } = await useAsyncData(
  `activity-${email}`,
  () =>
    $fetch(`/api/newsletter/activity/${email}`)
)

const activity = computed(
  () => activityData.value?.activity || []
)
console.log('activityData', activityData.value)


/* transform */

const newsletterHistory = computed(() => {

  const map = {}

  activity.value.forEach(event => {

    const key =
      event.emailId ||
      `${event.subject}-${event.date}`

    if (!map[key]) {
      map[key] = {
        subject: event.subject,
        sendDate: event.date,
        opened: false,
        clicked: false,
        campaignId: event.campaignId,
        templateId: event.templateId
      }
    }

    if (event.type === 'open') {
      map[key].opened = true
    }

    if (event.type === 'click') {
      map[key].clicked = true
    }

  })

  return Object.values(map)
    .sort(
      (a, b) =>
        new Date(b.sendDate) -
        new Date(a.sendDate)
    )
})

/* statistics */

const stats = computed(() => ({
  total: newsletterHistory.value.length,
  opens: newsletterHistory.value.filter(
    x => x.opened
  ).length,
  clicks: newsletterHistory.value.filter(
    x => x.clicked
  ).length
}))

const headers = [
  {
    title: 'Küldés',
    key: 'sendDate'
  },
  {
    title: 'Hírlevél',
    key: 'subject'
  },
  {
    title: 'Megnyitotta',
    key: 'opened'
  },
  {
    title: 'Kattintott',
    key: 'clicked'
  }
]

</script>