// initial state
const DATE = 2100;
const DATE_INC = 20;
const POPULATION = 1000;
const TEMPERATURE = 22;
const POP_INC = 0.2;
const TEMP_INC = 0.15;
const WATER = 350000000000;
const FOREST = 350000000;
const FOSSIL_FUEL = 1;
const INDUSTRY = 0;
const HEALTHCARE = 0;
const AGRICULTURE = 0;
const RENEWABLE = 0;
const LIVING_MODE = 0; // 0, 1, 2
const ENERGY_PER_TREE = 10;
const ENERGY_PER_FOSSIL_FUEL = 100000000;
let ENERGY_USAGE = [];
for (let i = 0; i < 11; i++) {
    ENERGY_USAGE.push(10000000 * i);
}
let ENERGY_GENERATED = [];
for (let i = 0; i < 11; i++) {
    ENERGY_GENERATED.push(10 ** i);
}

// game variable
var date = DATE, temperature = TEMPERATURE, population = POPULATION, pop_inc = POP_INC, temp_inc = TEMP_INC, water = WATER, forest = FOREST, fossil_fuel = FOSSIL_FUEL, industry = 0, healthcare = 0, agriculture = 0, renewable = 0, living_mode = 0;
var industry_clicked = false, healthcare_clicked = false, agriculture_clicked = false, renewable_clicked = false;

function cal_usage(_population, _energy_per_capita) {
    var _water_usage = 350 * _population * DATE_INC;
    var _energy_usage = _population * _energy_per_capita;
    var _pair = [_water_usage, _energy_usage];
    return _pair;
}

function cal_energy_per_capita(_industry, _living_mode) {
    var energy_per_capita = _industry * 10000 * 0.5 * (_living_mode + 1) * 2;
    return energy_per_capita;
}

function cal_pop_inc(_pop_inc, _industry, _healthcare, _agriculture, _temperature, _living_mode) {
    var curr_pop_inc = _pop_inc + 0.03 * (_industry + _healthcare + _agriculture) - 0.015 * (_temperature - TEMPERATURE) + (_living_mode / 2 - 0.5);
    return curr_pop_inc;
}

function initGame() {
    date = DATE;
    population = POPULATION;
    temperature = TEMPERATURE;
    temp_inc = TEMP_INC;
    pop_inc = POP_INC;
    water = WATER;
    forest = FOREST;
    fossil_fuel = FOSSIL_FUEL;
    industry = INDUSTRY;
    healthcare = HEALTHCARE;
    agriculture = AGRICULTURE;
    renewable = RENEWABLE;
    living_mode = LIVING_MODE;

    document.getElementById("year").innerHTML = date;
    document.getElementById("population").innerHTML = population;
    document.getElementById("temperature").innerHTML = temperature + "°C";
    document.getElementById("water").innerHTML = water + "m3";
    document.getElementById("forest").innerHTML = forest + "m2";
    document.getElementById("fossil_fuel").innerHTML = fossil_fuel * 100 + "%";
    document.getElementById("industry").innerHTML = industry + "/10";
    document.getElementById("healthcare").innerHTML = healthcare + "/10";
    document.getElementById("agriculture").innerHTML = agriculture + "/10";
    document.getElementById("renewable").innerHTML = renewable + "/10";

    industry_clicked = false;
    healthcare_clicked = false;
    agriculture_clicked = false;
    renewable_clicked = false;
}

function checkStatus() {
    
    industry_clicked = false;
    healthcare_clicked = false;
    agriculture_clicked = false;
    renewable_clicked = false;

    var energy_per_capita = cal_energy_per_capita(industry, living_mode);
    
    var usage = cal_usage(population, energy_per_capita);
    var water_usage = usage[0];
    var energy_usage = usage[1];
    energy_usage += ENERGY_USAGE[industry] + ENERGY_USAGE[healthcare] + ENERGY_USAGE[agriculture] + ENERGY_USAGE[renewable];

    var energy_consumed;
    
    if (energy_usage > ENERGY_GENERATED[renewable]) {
        energy_consumed = energy_usage - ENERGY_GENERATED[renewable];
    } else {
        energy_consumed = 0;
    }
    
    pop_inc = cal_pop_inc(pop_inc, industry, healthcare, agriculture, temperature, living_mode);   
    population = Math.round(population * (1 + pop_inc));

     
    temp_inc -= renewable/1000

    if (fossil_fuel != 0 && forest != 0) {
        var energy_consumed_by_fossil_fuel = energy_consumed * fossil_fuel * ENERGY_PER_FOSSIL_FUEL / (fossil_fuel * ENERGY_PER_FOSSIL_FUEL + forest * ENERGY_PER_TREE);

        fossil_fuel -= energy_consumed_by_fossil_fuel / ENERGY_PER_FOSSIL_FUEL;
        temp_inc = TEMP_INC + Math.round(energy_consumed_by_fossil_fuel / 1000000) / 10000; // no round to decimals
            
        if (fossil_fuel < 0) {
            fossil_fuel = 0;
        }

        forest -= (energy_consumed - energy_consumed_by_fossil_fuel) / ENERGY_PER_TREE;

        if (forest < 0) {
            forest = 0;
        }
    } else {
        population = Math.round(ENERGY_GENERATED[renewable] / energy_per_capita);
    }

    water -= water_usage;

    if (water < 0) {
        water = 0;
        population = -1;
    }


    // disease
    var disease = getRandomInt(1, 12);
    var disease_kill = Math.round(Math.max((disease - healthcare) * 100, Math.round((disease - healthcare) / 10 * population)) / 2); // value balanced
    if (disease_kill < 0) {
        disease_kill = 0;
    } else if (disease_kill > population) {
        disease_kill = population;
    } 

    population -= disease_kill;

    alert("You experienced a disease of severity level " + disease + " and " + disease_kill + " people died.");

    temperature = Math.round(temperature * (1 + temp_inc) * 10000) / 10000; //cannot round to decimals

    if (temperature > 150) {
        population = -1;
        alert("Human beings are yet unable to live under a temperature above 150 celcius degress :(");
    }

    document.getElementById("population").innerHTML = population;
    document.getElementById("temperature").innerHTML = temperature + "°C";
    document.getElementById("water").innerHTML = water + "m3";
    document.getElementById("forest").innerHTML = forest + "m2";
    document.getElementById("fossil_fuel").innerHTML = fossil_fuel * 100 + "%";

    if (population <= 0) {
        alert("Human die out. You have survived for " + (date - DATE) + " years.");
        // to leaderboard
    } else {
        date += 20;
        document.getElementById("year").innerHTML = date;
        clicked_industry = true
    }
}

function upgradeIndustry() {
    if (industry_clicked == true) {
        alert("You can upgrade this once per 20 years!");
    } else if (industry < 10) {
        industry += 1;
        document.getElementById("industry").innerHTML = industry + "/10";
        industry_clicked = true;
    } else {
        alert("Maximum industry leve!");
    }
}

function upgradeHealthcare() {
    if (healthcare_clicked == true) {
        alert("You can upgrade this once per 20 years!");
    } else if (healthcare < 10) {
        healthcare += 1;
        document.getElementById("healthcare").innerHTML = industry + "/10";
        healthcare_clicked = true;
    } else {
        alert("Maximum healthcare leve!");
    }
}

function upgradeAgriculture() {
    if (agriculture_clicked == true) {
        alert("You can upgrade this once per 20 years!");
    } else if (agriculture < 10) {
        agriculture += 1;
        document.getElementById("agriculture").innerHTML = industry + "/10";
        agriculture_clicked = true;
    } else {
        alert("Maximum industry leve!");
    }
}

function upgradeRenewable() {
    if (renewable_clicked == true) {
        alert("You can upgrade this once per 20 years!");
    } else if (renewable < 10) {
        renewable += 1;
        document.getElementById("renewable").innerHTML = industry + "/10";
        renewable_clicked = true;
    } else {
        alert("Maximum industry leve!");
    }
}

function setLowLivingMode() {
    living_mode = 0;
    document.getElementById("living_mode").innerHTML = "Low";
}

function setMediumLivingMode() {
    living_mode = 1;
    document.getElementById("living_mode").innerHTML = "Medium";
}

function setHighLivingMode() {
    living_mode = 2;
    document.getElementById("living_mode").innerHTML = "High";
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}