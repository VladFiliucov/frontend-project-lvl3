import onChange from 'on-change';

const renderErrors = () => console.log('rendering errors');

const fieldElements = 1;

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(fieldElements, value);
      break;
    default:
      break;
  }
});
