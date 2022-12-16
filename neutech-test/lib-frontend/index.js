import {isEqual} from 'lodash';
const Mustache = require('mustache');

const renderTemplate = (store, templateId, extractorFn) => {
  const template = document.getElementById(templateId).innerHTML;
  let lastExtraction = {};

  const renderFn = (state) => {
      const currentExtraction = extractorFn(state);

      if(!isEqual(lastExtraction, currentExtraction)){
        console.log(`Rendering ${templateId} with ${currentExtraction}`);
        lastExtraction = currentExtraction;

        const t = document.getElementById(templateId);
        t.innerHTML = Mustache.render(template, currentExtraction);
      }
  }

  renderFn(store.get());
  return store.on('@changed', renderFn);
};

const createFetchReducer = (reducerName, url) => (store) => {
  store.on('@init', () => ({ [reducerName]: {data: {}, status: "init"}}));
  store.on(`${reducerName}/fetch`,  async (_, fetchOptions) => {
    try {
      store.dispatch(`${reducerName}/fetch/loading`);

      const startTime = new Date().getTime();
      const apiResponse = await fetch(url, fetchOptions || {});
      const millis = new Date().getTime() - startTime;

      store.dispatch(
        `${reducerName}/fetch/${apiResponse.ok ? 'ok' : 'nok'}`, 
          {
            data: await apiResponse.json(),
            headers: {...apiResponse.headers},
            status: apiResponse.status,
            statusText: apiResponse.statusText,
            millis
          }
      );

    } catch (e) {
      store.dispatch(`${reducerName}/fetch/error`, {error: e.message});
    }
  });

  store.on(`${reducerName}/fetch/loading`, (state) => {
    const local = state[reducerName];
    return {[reducerName]: {...local, status: "loading"}}
  });

  ['ok', 'nok', 'error'].forEach(status => {
    store.on(
      `${reducerName}/fetch/${status}`, 
      (_, response) => ({[reducerName]: {response, status}})
    );
  });

}

const onClick = (id, callback) => {
  console.log(`Add callback to ${id}`);
  document.getElementById(id).onclick = callback;
}

export {createFetchReducer, renderTemplate, onClick};