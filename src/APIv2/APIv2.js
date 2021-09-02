const express = require("express");
const APIv2_router = express.Router();

/*
Known Issue #1: UTC Time
*/


//Placeholder for authentication check
APIv2_router.all('/*', async (req, res, next) => {
    next() // pass control to the next handler
  });

APIv2_router.get("/today/cycleday", async (req, res) => {
    const TodayCycleDay = await getCycleDay();
    res.status(200).send(TodayCycleDay)
});

APIv2_router.get("/today/classes", async (req, res) => {
    const RemainingClasses = await getRemainingClasses();
    res.status(200).send(RemainingClasses)
});


/*--------------------------------------------------------------------------
    Start functions used in APIv2 Router
*/
const iCalFunctions = require("./iCal-Functions");



const getCycleDay = async () => {
    const CycleEvent = await iCalFunctions.getCurrentCycleEvent()

    //Return the CycleDayEvent formatted as a CycleDay
    return new CycleDay(CycleEvent.summary, CycleEvent.start.toISOString().split("T").slice(0, -1)[0])
};


const getRemainingClasses = async () => {
    const Classes = await iCalFunctions.getRemainingClasses();

    //Create an array for all Period (formatted ClassEvent)
    const allRemainingClasses = []

    //For each ClassEvent in Classes, format the ClassEvent into a Period, and add that Period into the allRemainingClasses array
    for await (const ClassEvent of Classes) {
        const Class = new Period(ClassEvent.summary, ClassEvent.start.toLocaleString(), ClassEvent.end.toLocaleString, ClassEvent.location)
        allRemainingClasses.push(Class)
    }
    //Once finished, return allRemainingClasses
    return allRemainingClasses
}


/*--------------------------------------------------------------------------
    Define all models
*/

class CycleDay {
    constructor(Day, Date) {
        this.Day = Day
        this.Date = Date
    }
}

class Period {
    constructor (Summary, Start, End, Location) {
        this.Summary = Summary;
        this.Start = Start;
        this.End = End;
        this.Location = Location;
    }
}


//Export the APIv2_router to index.js
module.exports = APIv2_router;