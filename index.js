import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 4000;
const APIkey = "b57caeaac1312e26dca51ad2d899353b";

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

        const locResult = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIkey}`)
        
        console.log(locResult.data);
        console.log(result.data);

        const myLocation = locResult.data[0].name;
        const dateTimeString = result.data.current.time;
        const [date, time] = dateTimeString.split('T');

        console.log(myLocation);

        const weatherData = {
            greeting: "morning",
            time: date + " " + time,
            city: myLocation,
            temperature: result.data.current.temperature_2m + " " + result.data.current_units.temperature_2m,
            condition: "TestCond"
        }
        res.json(weatherData);
    } catch (error) {
        console.log(error.response.data);
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });