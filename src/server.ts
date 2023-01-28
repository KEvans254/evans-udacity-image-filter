import express from 'express';
import bodyParser from 'body-parser';
import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage' , async(req: Request, res: Response ) => {

    let  {image_url}  = req.query;
    // checking if image url is null
    if ( !image_url ) {
     return  res.status(400)
                .send('An image url is required')
    }
    try {
      const filteredpath: string = await filterImageFromURL(image_url);
      console.log(filteredpath)
      await res.status(200).sendFile(filteredpath, {}, (error) => {
        if (error) {
          return res.status(422).send(`Unable to process image`);
        }
        deleteLocalFiles([filteredpath]);
      });
    }

    catch (err) {
      res.status(422).send(`Kindly crosscheck the image_url`);
    }

  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();