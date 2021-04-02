import i18next from 'i18next';

const localePromise = () => i18next.init({
  // lng: navigator.language,
  lng: 'ru',
  resources: {
    'en-US': {
      translation: {
        success: 'RSS uploaded successfully',
        networkError: 'Network error. Please try again',
        urlInvalid: 'Field should be a valid URL',
        existingRSS: 'RSS already exists',
        parsingError: 'Could not extract RSS feed from this url',
        preview: 'Preview',
        posts: 'Posts',
        feeds: 'Feeds',
        close: 'Close',
        readMore: 'Read more',
      },
    },
    ru: {
      translation: {
        success: 'RSS успешно загружен',
        networkError: 'Произошла ошибка сети. Попробуйте еще раз',
        urlInvalid: 'Ссылка должна быть валидным URL',
        existingRSS: 'RSS уже существует',
        parsingError: 'Ресурс не содержит валидный RSS',
        preview: 'Просмотр',
        posts: 'Публикации',
        feeds: 'Фиды',
        close: 'Закрыть',
        readMore: 'Читать полностью',
      },
    },
  },
});

export default localePromise;
