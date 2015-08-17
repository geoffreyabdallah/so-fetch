# so-fetch
A whatwg fetch wrapper meant for redux dispatch

![Alt Text](http://i.giphy.com/G6ojXggFcXWCs.gif)

If you aren't Jay - you should use your own discretion when using this.

If you aren't using Redux --- you totally should! Also, dont use this.
If you aren't using Thunk Middleware with Redux --- you totally should! Also, dont use this.

Otherwise:

This is meant as a simple wrapper for [whatwg fetch](https://github.com/github/fetch) with redux/thunk that's meant to make life a little simpler. So-fetch will handle your fetch and dipstach for you, just send it some options and never think about it again!
The checkStatus function used under the hood to throw errors is also taken from their example [here](https://github.com/github/fetch#handling-http-error-statuses).

In your /actions folder:

```javascript

'use strict';

import soFetch from 'so-fetch'; //you can call it whatever - I wont be hurt, it is just a default export.
import * as constants from './constants';

export function getUser() {
  return soFetch('/users', {
      method: 'get',
      actionType: constants.GET_USER,
      responseBinding: 'user' //defaults to 'payload'
      //when you get a response back from url - will dispatch { type: constants.GET_USER, user: response }
    });
};

```

###API:

```javascript
soFetch(url, options)
```

####URL
This one should be straightforward
####OPTIONS
Fetch accepts:

body - an object!

method - a string! 'get'/'post'/'put'/'delete'

actionType - the action you want to dispatch

responseBinding - they key you want to bind payload to

qs - an object! meant to construct your query string

headers - another object - defaults to { 'Accept': 'application/json', 'Content-Type': 'application/json' }

credentials - Much like how you have to include { credentials: 'same-origin' } if you want to send cookies through fetch - we default that behavior always be true (you will always send cookies) if you would like this disabled for certain fetch calls then set to false, or pass in another value and that will get passed in as the value.

![Alt Text](http://i.giphy.com/BkUj9IAaHL2ZW.gif)




