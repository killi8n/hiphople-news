import request, { Response } from "request";

const crawl = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    request(url, (error: any, response: Response, body: any) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(body);
    });
  });
};

export default crawl;
