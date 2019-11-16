import axios from 'axios';
import Query from 'utils/Query';

export async function getMetaForUrl(url, query) {
  const request = {
    method: 'GET',
    url: Query.createPath({
      pathName: url,
      parameters: Object.assign({}, query, { meta: true })
    })
  };

  try {
    const response = await axios(request);
    return {
      og: response.data.og,
      meta: response.data.meta
    };
  } catch (e) {
    console.error(e);
    return [];
  }
}
