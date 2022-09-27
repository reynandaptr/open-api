import express, { Express as IExpress } from 'express';
import path from 'path';
import fs from 'fs';
import { SwaggerOption, SwaggerOptionOptionUrl } from '../types/swagger';

const definitionPath = './docs'

export const getSwaggerOption = (app: IExpress, host: string, callback: (options: SwaggerOption) => void) => {
  fs.readdir(definitionPath, async (err, files) => {
    if (err) {
      return console.log(err);
    }
    let urls: SwaggerOptionOptionUrl[] = await registerPath(app, host, files, [definitionPath.replace(/[^0-9a-z]/gi, '')])
    let options: SwaggerOption = {
      explorer: true,
      swaggerOptions: {
        urls
      }
    }
    callback(options)
  });
}


export const registerPath = async (app: IExpress, host: string, files: string[], paths: string[]) => {
  app.use(express.static(path.join(__dirname, '..', ...paths)));
  app.get(`/${paths.join('/')}/:filename`, (req, res, next) => {
    res.download(path.join(__dirname, '../..', `${paths.join('/')}`, `${req.params.filename}`));
  });

  let urls: SwaggerOptionOptionUrl[] = [];
  const promises = files.map(async file => {
    const stat = await fs.lstatSync(`./${paths.join('/')}/${file}`)
    if (stat.isFile()) {
      urls.push({
        name: file,
        url: `${host}/${paths.join('/')}/${file}`
      })
    } else if (stat.isDirectory()) {
      let _files = await fs.readdirSync(`./${paths.join('/')}/${file}`)
      const tempUrls = await registerPath(app, host, _files, [...paths, file])
      urls.push(...tempUrls)
    }
  })
  await Promise.all(promises)
  return urls
}
