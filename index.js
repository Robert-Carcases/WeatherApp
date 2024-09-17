import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 4000;

app.use(express.static(__dirname + '/public'));

app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.post("/weather", async (req, res) => {
    const {latitude, longitude} = req.body;
    console.log(req.body);
    try{
        const result = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=1`);
        console.log(result.data);
        res.render("index.ejs", {
            time: "morning",
            city: "testCity",
            temperature: result.data.current.temperature_2m + " " + result.data.current_units.temperature_2m,
            condition: "testCond"
        });
    } catch (error) {
        console.log(error.response.data);
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });