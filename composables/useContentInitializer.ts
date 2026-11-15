// composables/useContentInitializer.ts

type SectionDefinition = {
  type: string
  key: string
}

export function useContentInitializer() {

  const languages = [
    'hu',
    'en',
    'de'
  ]

  async function initializeSection(
    section: SectionDefinition
  ) {

    for (const lang of languages) {

      try {

        const existingContent =
          await $fetch(
            `/api/content/${section.key}/${lang}`
          ).catch(() => null)

        if (existingContent) {

          console.log(
            `[SKIP] ${section.key} (${lang})`
          )

          continue

        }

        const dummyData =
          createDummyContent(
            section,
            lang
          )

        await $fetch(
          `/api/content/${section.key}/${lang}`,
          {
            method: 'PUT',
            body: dummyData
          }
        )

        console.log(
          `[INIT] ${section.key} (${lang})`
        )

      } catch (err) {

        console.error(
          `Initialization failed: ${section.key} (${lang})`,
          err
        )

      }

    }

  }

  async function deleteSectionContent(
  sectionKey: string
) {

  try {

    await $fetch(
      `/api/content/${sectionKey}`,
      {
        method: 'DELETE'
      }
    )

    console.log(
      `[DELETE] ${sectionKey}`
    )

  } catch (err) {

    console.error(
      `Delete failed: ${sectionKey}`,
      err
    )

  }

}

  return {
    initializeSection,
    deleteSectionContent
  }

}

function createDummyContent(
  section: SectionDefinition,
  lang: string
) {

  switch (section.type) {

    case 'Hero':

      return {
        html:
          lang === 'hu'
            ? '<h1>Új Hero Szekció</h1><p>Szerkeszd ezt a tartalmat...</p>'
            : '<h1>New Hero Section</h1><p>Edit this content...</p>',

        image:
          '/uploads/placeholder.jpg',

        overlayColor:
          'rgba(0,0,0,0.4)',

        overlayOpacity:
          0.4,

        height:
          75,

        textPosition:
          'center',

        ctaText:
          lang === 'hu'
            ? 'Szerkeszd ezt a gombot'
            : 'Edit this button',

        ctaLink:
          '#'
      }

    case 'HtmlText':

      return {
        html:
          lang === 'hu'
            ? '<p>Új szöveges szekció...</p>'
            : '<p>New text section...</p>'
      }

    case 'ImageText':

      return {
        title:
          lang === 'hu'
            ? 'Új ImageText'
            : 'New ImageText',

        paragraphs: [
          lang === 'hu'
            ? 'Tartalom helye...'
            : 'Content goes here...'
        ],

        image:
          '/uploads/placeholder.jpg'
      }

    case 'Contact':

      return {
        title:
          lang === 'hu'
            ? 'Kapcsolat'
            : 'Contact'
      }

    case 'Feedback':

      return {
        title:
          lang === 'hu'
            ? 'Visszajelzések'
            : 'Feedback'
      }

    case 'Blog':

      return {
        title:
          lang === 'hu'
            ? 'Blog'
            : 'Blog'
      }

    case 'Separator':

      return {
        style: 'default'
      }

    default:

      return {}

  }

}