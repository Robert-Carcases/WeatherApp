import express from "express";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// OpenWeather API Key
const APIkey = process.env.API_KEY;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

function getGreeting(hourInt) {
    try {
        let greeting;
        if (hourInt >= 0 && hourInt < 12) {
            greeting = "Good Morning!";
        } else if (hourInt >= 12 && hourInt < 18) {
            greeting = "Good Afternoon!";
        } else {
            greeting = "Good Evening!";
        }
        return greeting;
    } catch {
        console.error("Error in getGreeting function:", error);
    }
}

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.post("/weather", async (req, res) => {
    const {latitude, longitude} = req.body;
    try{
        const [weatherResult, locResult] = await Promise.all([
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation&temperature_unit=fahrenheit&hourly=precipitation_probability&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=1`),

            axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIkey}`)
        ]);

        const myLocation = locResult.data[0].name;
        const dateTimeString = weatherResult.data.current.time;
        const [date, time] = dateTimeString.split('T');
        const [hour, minute] = time.split(':');
        const hourInt = parseInt(hour, 10);

        const weatherData = {
            greeting: getGreeting(hour),
            time: date + " " + time,
            city: myLocation,
            temperature: weatherResult.data.current.temperature_2m + " " + weatherResult.data.current_units.temperature_2m,
            condition: weatherResult.data.hourly.precipitation_probability[hourInt]
        }
        res.json(weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });