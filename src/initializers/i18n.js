import i18next from 'i18next';

export default i18next.init({
  lng: navigator.language,
  debug: true,
  resources: {
    'en-US': {
      translation: {
        networkError: 'Network error. Please try again',
        urlInvalid: 'Field should be a valid URL',
        existingRSS: 'RSS already exists',
        preview: 'Preview',
        posts: 'Posts',
        feeds: 'Feeds',
        close: 'Close',
        readMore: 'Read more',
      },
    },
    ru: {
      translation: {
        networkError: 'Произошла ошибка сети. Попробуйте еще раз',
        urlInvalid: 'Ссылка должна быть валидным URL',
        existingRSS: 'RSS уже существует',
        preview: 'Просмотр',
        posts: 'Публикации',
        feeds: 'Фиды',
        close: 'Закрыть',
        readMore: 'Читать полностью',
      },
    },
  },
});
