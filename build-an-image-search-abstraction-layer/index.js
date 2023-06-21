const express = require('express');
const axios = require('axios')
const app = express();

app.get('/query/:search', async (req, res) => {
  const { search } = req.params
  const { page } = req.query

  const queryParams = {
    q: search,
    start: 1 + (page - 1) * 10
  }
  const params = new URLSearchParams(queryParams)
  const result = await axios
    .get(`https://customsearch.googleapis.com/customsearch/v1?cx=8a334120be574571e&key=AIzaSyAi24x7JsWCGR3s7pVvLy1y-QiL1Bd0npE&searchType=image&${params}`)
  const items = result.data.items.map(data => {
    return {
      type: data.mime,
      width: data.image.width,
      height: data.image.height,
      size: data.image.byteSize,
      url: data.link,
      thumbnail: {
        url: data.image.thumbnailLink,
        width: data.image.thumbnailWidth,
        height: data.image.thumbnailHeight,
      },
      description: data.title,
      parentPage: data.image.contextLink
    }
  })
  res.json({ items })
});

app.get('/', (req, res) => {
  res.send('404 not found')
});

app.listen(3000, () => {
  console.log('server started');
});
