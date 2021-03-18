import i18next from 'i18next';

export default i18next.init({
  lng: navigator.language,
  debug: true,
  resources: {
    'en-US': {
      translation: {
        networkError: 'Network error. Please try again',
        urlInvalid: 'Field should be a valid URL',
        preview: 'Preview',
        posts: 'Posts',
        feeds: 'Feeds',
      },
    },
    'ru-RU': {
      translation: {
        networkError: 'Произошла ошибка сети. Попробуйте еще раз',
        urlInvalid: 'Ссылка должна быть валидным URL',
        preview: 'Просмотр',
        posts: 'Публикации',
        feeds: 'Фиды',
      },
    },
  },
});
