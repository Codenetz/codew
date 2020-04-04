let path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  let app = require('./../../../../../boot/server').app;

  const imageModel = app.get('MODEL').get('imageModel');
  const imageService = app.get('SERVICE').get('imageTypeService');

  for (const image of await imageModel.getItemsBy({})) {
    console.log(image.id, await imageService.getTypes(image));
  }

  console.log('DONE');
}

run();
