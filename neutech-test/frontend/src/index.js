import { createStoreon } from 'storeon';
import { storeonDevtools } from 'storeon/devtools';
import { storeonLogger } from 'storeon/devtools';
import { persistState } from '@storeon/localstorage'
const {renderTemplate, createFetchReducer, onClick} = require("lib-frontend");

const count = store => {
  store.on('@init', () => ({ count: 0 }));
  store.on('count/inc', ({ count }) => ({ count: count + 1 }));
  store.on('count/dec', ({ count }) => ({ count: count -1 }));
}

const time = createFetchReducer("time", "http://worldtimeapi.org/api/timezone/America/Sao_Paulo");
// const hello = createFetchReducer("hello", 'https://jsonplaceholder.typicode.com/posts');
const hello = createFetchReducer("hello", 'http://localhost:3000');
const store = createStoreon([count, hello, time, persistState(["count", "time"]), storeonDevtools, storeonLogger]);

onClick('btn-inc', () => store.dispatch("count/inc"));
onClick("btn-dec", () => store.dispatch("count/dec"));
renderTemplate(store, "count-template", ({count}) => ({visitors: count}));


onClick("btn-time", () => store.dispatch("time/fetch"));
renderTemplate(store, "time-template", ({time}) => ({time: JSON.stringify(time, 0, 2)}));

const postData = () => ({
  method: "POST",
  headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
  body: JSON.stringify({
    name: `John-${store.get().count}` ,
  })
});

onClick("btn-post", () => store.dispatch("hello/fetch", postData()));
renderTemplate(store, "hello-template", ({hello}) => ({hello: JSON.stringify(hello, 0, 2)}));