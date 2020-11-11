import express from "express";
import cron from 'node-cron';
import shell from 'shelljs';
import moment from 'moment';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.DEFAULT_PORT || 3000;


app.get( "/", ( req: any, res:any ) => {
    res.json({message:"This is the index page !"});
} );

cron.schedule('45 23 * * *', ():any => {
    const dbName: string = process.env.DB_NAME;
    const dbPath: string = process.env.DB_PATH;
    const datestamps: string = moment().subtract(10, 'days').calendar();
    const dbFileName: string = process.env.DB_FILE_NAME;
    const sqlFileName: string = dbPath+datestamps.replace(/\//g, "_")+`${dbFileName}`;
    if (shell.exec(`mysqldump ${dbName} > ${sqlFileName}`).code !== 0) {
        shell.echo(`database backup cron job failed for : ${datestamps}`);
        shell.exit(1);
      }
      else {
        shell.echo(`Database backup complete for : ${datestamps}`);
      }
});





app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );