function cityCheck(city){
    for (let i=0;i<city.length;i++){
        const char = city.charAt(i);
        if(!( char>='A' && char<='Z' || char>='a' && char<='z' || char==' ')){
            return false;
        }
    }
    return true;
}

const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();


const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render('index.ejs', { errormsg: null, temp: null, description: null, city: null, imageUrl: null });
})


app.post("/", (req, res) => {

    const city = req.body.city;
    let errormsg = null;
    if(!cityCheck(city)){
        errormsg="Please enter only alphabets"
        res.render('index.ejs',{errormsg,temp:null,description:null,city:null});
        return;
    }
    



    const apiId = "f43b97f6fbedef82076c6072056d8f91";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiId + "&units=" + units;


    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            errormsg = "Failed to retrieve weather data."
            res.render('index.ejs', { errormsg, temp: null, description: null, city: null, imageUrl: null });
            return;
        }

        response.on('data', (data) => {
            try {
                const weatherData = JSON.parse(data);
                if (weatherData.cod !== 200) {
                    errormsg = "City not found";
                    res.render('index.ejs', { errormsg, temp: null, description: null, city: null, imageUrl: null });
                    return;
                }
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                res.render('index.ejs', { errormsg, temp, description, city, imageUrl });

            } catch (error) {
                errormsg = "Error parsing the data";
                res.render('index.ejs', { errormsg, temp: null, description: null, city: null, imageUrl: null });
            }
        })
    })


})


app.listen(port, () => { console.log("Server started on port " + port) });